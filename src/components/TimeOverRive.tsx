import {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { AnimatedBox, Image } from './common';
import { useLayout } from '@providers';
import { useGameState } from '@hooks';
import { memo, useCallback } from 'react';
import { TIME_OVER_IMAGE } from '@assets';

type Props = {
  onTimeOver: () => void;
};

export const TimeOverRive = memo<Props>(({ onTimeOver }) => {
  const { layout } = useLayout();
  const { gameStatus } = useGameState();

  const containerUas = useAnimatedStyle(() => {
    return {
      pointerEvents: gameStatus.value === 'time-over' ? 'auto' : 'none',
    };
  }, []);

  const scale = useSharedValue(0.1);
  const uas = useAnimatedStyle(() => {
    const { gameOverWidth, gameOverHeight } = layout.value;
    const isVisible = gameStatus.value === 'time-over';
    return {
      width: gameOverWidth,
      height: gameOverHeight,
      opacity: isVisible ? 1 : 0,
      transform: [{ scale: scale.value }],
    };
  }, []);

  const bounceIn = useCallback(() => {
    'worklet';

    scale.value = 0.1;
    scale.value = withTiming(
      0.9,
      { duration: 500, easing: Easing.elastic(1.2) },
      (finished) => {
        if (finished) {
          runOnJS(onTimeOver)();
        }
      }
    );
  }, []);

  useAnimatedReaction(
    () => gameStatus.value === 'time-over',
    (isFinished) => {
      if (isFinished) {
        bounceIn();
      }
    },
    [bounceIn]
  );

  return (
    <AnimatedBox
      className='absolute w-full h-full justify-center items-center z-50'
      style={containerUas}>
      <AnimatedBox style={uas}>
        <Image source={TIME_OVER_IMAGE} contentFit='contain' />
      </AnimatedBox>
    </AnimatedBox>
  );
});
