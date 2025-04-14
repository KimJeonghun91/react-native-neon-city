import { PAUSE_BUTTON_IMAGE, TIMER_IMAGE } from '@assets';
import { AnimatedBox, Button, HStack, Image } from './common';
import {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useGameStage, useGameState, useTimer } from '@hooks';
import { memo } from 'react';
import { AudioTracks, useAudio } from '@providers';

type Props = {
  duration: number;
};

export const Timer = memo(({ duration }: Props) => {
  const { gameStatus } = useGameState();
  const { play } = useAudio();
  const { pause, finish } = useGameStage();

  const {
    progress: timerProgress,
    start: startTimer,
    stop: stopTimer,
    pause: pauseTimer,
    init: initTimer,
    fillGauge,
  } = useTimer({
    durationMS: duration,
    onFinished: finish,
  });

  const progressFill = useAnimatedStyle(() => {
    return {
      width: `${timerProgress.value * 100}%`,
    };
  }, []);

  useAnimatedReaction(
    () => gameStatus.value,
    (status) => {
      if (status === 'ready') {
        runOnJS(initTimer)();
        fillGauge();
        return;
      }

      if (status === 'playing') {
        runOnJS(startTimer)();
        return;
      }

      if (status === 'paused') {
        runOnJS(pauseTimer)();
        return;
      }

      if (status === 'time-over') {
        runOnJS(stopTimer)();
        return;
      }
    },
    [gameStatus, fillGauge, startTimer, stopTimer, pauseTimer]
  );

  return (
    <HStack>
      <Image
        source={TIMER_IMAGE}
        style={{
          width: 280,
          height: 60,
        }}
        pointerEvents={'none'}
      />
      <AnimatedBox
        style={{
          position: 'absolute',
          top: 25,
          left: 24,
          width: 232,
          height: 10,
        }}
        pointerEvents={'none'}>
        <AnimatedBox className={`h-full bg-[#E8FFFE]`} style={progressFill} />
      </AnimatedBox>
      <Button onPressIn={() => play(AudioTracks.CLICK)} onPress={pause}>
        <Image
          source={PAUSE_BUTTON_IMAGE}
          style={{
            width: 80,
            height: 60,
          }}
          contentFit='contain'
        />
      </Button>
    </HStack>
  );
});
