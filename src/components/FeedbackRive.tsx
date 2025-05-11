import { useGameState, useRive } from '@hooks';
import { useLayout } from '@providers';
import {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { isEqual, isNull } from 'react-native-worklet-functions';
import { AnimatedBox, Box } from './common';
import { memo } from 'react';

export const FeedbackRive = memo(() => {
  const { gameMetrics } = useGameState();
  const { layout } = useLayout();

  const style = useAnimatedStyle(() => {
    const { feedbackRiveWidth, feedbackRiveHeight } = layout.value;
    return {
      width: feedbackRiveWidth,
      height: feedbackRiveHeight,
    };
  }, []);

  const { RiveComponent: CorrectRive, play: playCorrectRive } = useRive({
    resourceName: 'correct',
    fit: 'fitHeight',
  });

  const { RiveComponent: IncorrectRive, play: playIncorrectRive } = useRive({
    resourceName: 'wrong',
    fit: 'fitHeight',
  });

  useAnimatedReaction(
    () => gameMetrics.value,
    (currResult, prevResult) => {
      const shouldIgnore =
        isNull(prevResult) ||
        (isEqual(currResult.numCorrect, prevResult!.numCorrect) &&
          isEqual(currResult.numIncorrect, prevResult!.numIncorrect));
      if (shouldIgnore) {
        return;
      }

      const isCorrect = currResult.numCorrect > prevResult!.numCorrect;
      if (isCorrect) {
        runOnJS(playCorrectRive)();
        return;
      }

      const isIncorrect = currResult.numIncorrect > prevResult!.numIncorrect;
      if (isIncorrect) {
        runOnJS(playIncorrectRive)();
      }
    },
    [playCorrectRive, playIncorrectRive]
  );

  return (
    <Box className='absolute w-full h-full items-center justify-center'>
      <AnimatedBox className='absolute' style={style}>
        <CorrectRive />
      </AnimatedBox>
      <AnimatedBox className='absolute' style={style}>
        <IncorrectRive />
      </AnimatedBox>
    </Box>
  );
});
