import { CONSECUTIVE_MAX_COMBO } from '@configs';
import { useGameState, useRive } from '@hooks';
import { useLayout } from '@providers';
import {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { isEqual, isNull, min } from 'react-native-worklet-functions';
import { AnimatedBox, Box } from './common';
import { memo } from 'react';

export const TargetArea = memo(() => {
  const { layout } = useLayout();
  const { gameStatus, gameMetrics } = useGameState();

  const style = useAnimatedStyle(() => {
    const { targetRiveWidth, targetRiveHeight } = layout.value;
    return {
      width: targetRiveWidth,
      height: targetRiveHeight,
    };
  }, []);

  const {
    RiveComponent: TargetRive,
    play: playTargetRive,
    stop: stopTargetRive,
    fireState: fireStateTargetRive,
    setInputState: setInputStateTargetRive,
  } = useRive({
    resourceName: 'target',
    fit: 'fitHeight',
  });

  useAnimatedReaction(
    () => gameStatus.value,
    (gameStatus) => {
      if (gameStatus === 'ready') {
        runOnJS(stopTargetRive)();
        runOnJS(playTargetRive)();
      }
    },
    [gameStatus, stopTargetRive, playTargetRive]
  );

  useAnimatedReaction(
    () => gameMetrics.value,
    (currMetrics, prevMetrics) => {
      const shouldIgnore =
        gameStatus.value === 'ready' ||
        isNull(prevMetrics) ||
        (isEqual(currMetrics.numCorrect, prevMetrics!.numCorrect) &&
          isEqual(currMetrics.numIncorrect, prevMetrics!.numIncorrect));
      if (shouldIgnore) {
        return;
      }

      if (isEqual(currMetrics.numConsecutiveCorrect, 0)) {
        runOnJS(setInputStateTargetRive)('target', 'combo', 0);
        runOnJS(fireStateTargetRive)('target', 'reset');
        return;
      }

      runOnJS(setInputStateTargetRive)(
        'target',
        'combo',
        min(currMetrics.numConsecutiveCorrect, CONSECUTIVE_MAX_COMBO)
      );
    },
    [gameMetrics, setInputStateTargetRive]
  );

  return (
    <Box className='absolute w-full h-full items-center justify-center'>
      <AnimatedBox className='absolute' style={style}>
        <TargetRive />
      </AnimatedBox>
    </Box>
  );
});
