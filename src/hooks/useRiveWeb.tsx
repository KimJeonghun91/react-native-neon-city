import {
  Fit,
  Layout,
  StateMachineInputType,
  UseRiveOptions,
  UseRiveParameters,
  useRive,
} from '@rive-app/react-canvas';
import { useCallback } from 'react';

export const useRiveWeb = (
  riveParams: UseRiveParameters & {
    fit?:
      | 'cover'
      | 'contain'
      | 'fill'
      | 'fitWidth'
      | 'fitHeight'
      | 'none'
      | 'scaleDown';
  },
  opts?: Partial<UseRiveOptions> | undefined
) => {
  const { RiveComponent, rive } = useRive(
    {
      layout: new Layout({ fit: (riveParams.fit || 'contain') as Fit }),
      ...riveParams,
    },
    {
      customDevicePixelRatio: window.devicePixelRatio,
      useOffscreenRenderer: true,
      ...opts,
    }
  );

  const play = useCallback(
    (
      animationNames?: string | string[] | undefined,
      autoplay?: true | undefined
    ) => {
      if (rive) {
        if (rive.isStopped) {
          rive.reset({
            artboard: rive.activeArtboard,
            animations: rive.animationNames,
            stateMachines: rive.stateMachineNames,
            autoplay: false,
          });
          rive.play(rive.animationNames);
          return;
        }

        if (rive.isPlaying) {
          rive.reset({
            artboard: rive.activeArtboard,
            animations: rive.playingAnimationNames,
            stateMachines: rive.stateMachineNames,
            autoplay: true,
          });
          return;
        }

        rive.play(animationNames, autoplay);
      }
    },
    [rive]
  );

  const stop = useCallback(
    (animationNames?: string | string[] | undefined) => {
      rive?.stop(animationNames);
    },
    [rive]
  );

  const pause = useCallback(() => {
    if (rive && rive.isPlaying) {
      rive.pause(rive.playingAnimationNames);
    }
  }, [rive]);

  const resume = useCallback(() => {
    if (rive && rive.isPaused) {
      rive.play(rive.pausedAnimationNames, true);
    }
  }, [rive]);

  const fireState = useCallback(
    (stateMachineName: string, inputName: string) => {
      if (rive) {
        const inputs = rive.stateMachineInputs(stateMachineName);
        if (!inputs) {
          console.error(`
          [useRiveWeb] fireState: There is no input.
          stateMachineName: ${stateMachineName} inputName: ${inputName}
          `);
          return;
        }

        const targetInput = inputs.find((input) => input.name === inputName);
        if (targetInput) {
          if (targetInput.type === StateMachineInputType.Trigger) {
            targetInput.fire();
          } else {
            console.error(`
            [useRiveWeb] fireState: ${inputName} can't be triggered. 
            stateMachineName: ${stateMachineName} 
            inputName: ${inputName} 
            type: ${targetInput.type}
            `);
          }
        } else {
          console.error(`
          [useRiveWeb] fireState: Couldn't find input
          stateMachineName: ${stateMachineName} 
          inputName: ${inputName}           
          `);
        }
      }
    },
    [rive]
  );

  const setInputState = useCallback(
    (stateMachineName: string, inputName: string, value: boolean | number) => {
      if (rive) {
        const inputs = rive.stateMachineInputs(stateMachineName);
        if (!inputs) {
          console.error(`
          [useRiveWeb] setInputState: There is no input.
          stateMachineName: ${stateMachineName} inputName: ${inputName}
          `);
          return;
        }
        const targetInput = inputs.find((input) => input.name === inputName);
        if (targetInput) {
          if (
            targetInput.type === StateMachineInputType.Boolean ||
            targetInput.type === StateMachineInputType.Number
          ) {
            targetInput.value = value;
          } else {
            console.error(`
            [useRiveWeb] StateMachineInput: ${inputName} can't take value.
            stateMachineName: ${stateMachineName} 
            inputName: ${inputName} 
            type: ${targetInput.type}
            `);
          }
        } else {
          console.error(`
          [useRiveWeb] StateMachineInput: Couldn't find input
          stateMachineName: ${stateMachineName} 
          inputName: ${inputName}           
          `);
        }
      }
    },
    [rive]
  );

  return {
    RiveComponent,
    play,
    stop,
    pause,
    resume,
    rive,
    fireState,
    setInputState,
  };
};
