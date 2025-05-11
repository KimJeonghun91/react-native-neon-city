import { useGameState, useRive } from '@hooks';
import { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';

export const FiverRive = memo(() => {
  const { isFeverItemRunning, gameStatus, isGamePaused } = useGameState();

  const {
    RiveComponent: FeverLeftRive,
    fireState: fireStateFeverLeft,
    pause: pauseFeverLeft,
    resume: resumeFeverLeft,
    stop: stopFeverLeft,
    play: playFeverLeft,
  } = useRive({
    resourceName: 'feverleft',
    autoplay: true,
  });

  const {
    RiveComponent: FeverRightRive,
    fireState: fireStateFeverRight,
    pause: pauseFeverRight,
    resume: resumeFeverRight,
    stop: stopFeverRight,
    play: playFeverRight,
  } = useRive({
    resourceName: 'feverright',
    autoplay: true,
  });

  const {
    RiveComponent: FeverBottomRive,
    fireState: fireStateFeverBottom,
    pause: pauseFeverBottom,
    resume: resumeFeverBottom,
    stop: stopFeverBottom,
    play: playFeverBottom,
  } = useRive({
    resourceName: 'feverbottom',
    autoplay: true,
    fit: 'fitHeight',
  });

  const resetFeverEffect = useCallback(() => {
    stopFeverLeft();
    stopFeverRight();
    stopFeverBottom();
    playFeverLeft();
    playFeverRight();
    playFeverBottom();
  }, [
    stopFeverLeft,
    stopFeverRight,
    stopFeverBottom,
    playFeverLeft,
    playFeverRight,
    playFeverBottom,
  ]);

  const runFeverEffect = useCallback(() => {
    fireStateFeverLeft('feverSide', 'fever');
    fireStateFeverRight('feverSide', 'fever');
    fireStateFeverBottom('feverBottom', 'fever');
  }, [fireStateFeverBottom, fireStateFeverLeft, fireStateFeverRight]);

  useAnimatedReaction(
    () => gameStatus.value,
    (status) => {
      if (status === 'ready') {
        runOnJS(resetFeverEffect)();
      }
    },
    [resetFeverEffect]
  );

  useAnimatedReaction(
    () => isFeverItemRunning.value,
    (isFeverItemRunning) => {
      if (isFeverItemRunning) {
        runOnJS(runFeverEffect)();
      }
    },
    [isFeverItemRunning, runFeverEffect]
  );

  const pauseFeverRives = useCallback(() => {
    pauseFeverLeft();
    pauseFeverRight();
    pauseFeverBottom();
  }, [pauseFeverLeft, pauseFeverRight, pauseFeverBottom]);

  const resumeFeverRives = useCallback(() => {
    resumeFeverLeft();
    resumeFeverRight();
    resumeFeverBottom();
  }, [resumeFeverLeft, resumeFeverRight, resumeFeverBottom]);

  useAnimatedReaction(
    () => isGamePaused.value,
    (isPaused) => {
      if (isPaused) {
        if (isFeverItemRunning.value) {
          runOnJS(pauseFeverRives)();
        }
      } else {
        if (isFeverItemRunning.value) {
          runOnJS(resumeFeverRives)();
        }
      }
    },
    [isGamePaused, isFeverItemRunning, pauseFeverRives, resumeFeverRives]
  );

  return (
    <>
      <FeverLeftRive
        style={{
          position: 'absolute',
          left: 0,
          width: '50%',
          height: '100%',
        }}
      />
      <FeverRightRive
        style={{
          position: 'absolute',
          right: 0,
          width: '50%',
          height: '100%',
        }}
      />
      <FeverBottomRive style={StyleSheet.absoluteFillObject} />
    </>
  );
});
