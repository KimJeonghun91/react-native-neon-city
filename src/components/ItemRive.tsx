import { useGameState, useRive } from '@hooks';
import { AudioTracks, useAudio } from '@providers';
import { memo } from 'react';
import { ViewStyle } from 'react-native';
import {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
} from 'react-native-reanimated';

type Props = {
  resourceName: string;
  stageMachineName: string;
  isRunning: SharedValue<boolean>;
  style?: ViewStyle;

  onFire: () => void;
  onNoFire: () => void;
  shouldActive: () => boolean;
};

export const ItemRive = memo<Props>(
  ({
    resourceName,
    stageMachineName,
    isRunning,
    style,
    onFire,
    onNoFire,
    shouldActive,
  }) => {
    const { play } = useAudio();
    const { gameStatus, isGamePaused } = useGameState();

    const { RiveComponent, reset, setInputState, resume, pause } = useRive({
      resourceName,
      fit: 'contain',
      onStateChanged(_, stateName) {
        if (stateName === 'noFire') {
          onNoFire();
        }
        if (stateName === 'fire') {
          play(AudioTracks.ITEM_BUTTON);
          onFire();
          setInputState(stageMachineName, 'active', false);
          return;
        }
      },
    });

    useAnimatedReaction(
      () => gameStatus.value === 'ready',
      function init(isReady) {
        if (isReady) {
          runOnJS(reset)();
        }
      },
      [gameStatus]
    );

    useAnimatedReaction(
      () => isGamePaused.value,
      function pauseResume(isPaused) {
        if (isPaused) {
          if (isRunning.value) {
            runOnJS(pause)();
          }
          return;
        } else {
          if (isRunning.value) {
            runOnJS(resume)();
          }
        }
      },
      []
    );

    useAnimatedReaction(
      shouldActive,
      (shouldReact) => {
        if (shouldReact) {
          runOnJS(setInputState)(stageMachineName, 'active', true);
        }
      },
      [setInputState]
    );

    return <RiveComponent style={style} />;
  }
);
