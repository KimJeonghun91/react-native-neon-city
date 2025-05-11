import { useGameState, useRive } from '@hooks';
import { AudioTracks, useAudio } from '@providers';
import { useCallback } from 'react';
import {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { withPause } from 'react-native-redash';

export const useCountDown = () => {
  const { gameStatus, isGamePaused, setStatus } = useGameState();
  const { play: playAudio } = useAudio();

  const countdownDuration = useSharedValue<number>(4000);

  const {
    RiveComponent: Countdown,
    play: playCountdownRive,
    pause: pauseCountdownRive,
    resume: resumeCountdownRive,
  } = useRive({
    resourceName: 'countdown',
    fit: 'fitWidth',
    autoplay: true,
  });

  const startCountDown = useCallback(() => {
    'worklet';

    const config = { duration: 1000, easing: Easing.linear };

    countdownDuration.value = withDelay(
      300,
      withPause(
        withSequence(
          withTiming(4000, { duration: 0 }, (finished) => {
            if (finished) {
              runOnJS(playAudio)(AudioTracks.COUNTDOWN);
            }
          }),
          withTiming(3000, config, (finished) => {
            if (finished) {
              runOnJS(playAudio)(AudioTracks.COUNTDOWN);
            }
          }),
          withTiming(2000, config, (finished) => {
            if (finished) {
              runOnJS(playAudio)(AudioTracks.COUNTDOWN);
            }
          }),
          withTiming(1000, config, (finished) => {
            if (finished) {
              runOnJS(playAudio)(AudioTracks.START);
            }
          }),
          withTiming(0, config, (finished) => {
            if (finished) {
              setStatus('playing');
            }
          })
        ),
        isGamePaused
      )
    );
  }, []);

  useAnimatedReaction(
    () => gameStatus.value,
    (status, prev) => {
      if (status === 'ready') {
        runOnJS(playCountdownRive)();
        startCountDown();
        return;
      }

      if (status === 'paused') {
        runOnJS(pauseCountdownRive)();
        return;
      }

      if (status === 'playing' && prev === 'paused') {
        runOnJS(resumeCountdownRive)();
      }
    },
    [gameStatus, playCountdownRive, startCountDown]
  );

  return { Countdown };
};
