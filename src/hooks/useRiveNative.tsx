import { useMemo, useRef } from 'react';
import { ViewStyle } from 'react-native';
import { isNil } from 'react-native-worklet-functions';
import Rive, {
  Direction,
  Fit,
  LoopMode,
  RNRiveError,
  RiveGeneralEvent,
  RiveOpenUrlEvent,
  RiveRef,
} from 'rive-react-native';

type Input = {
  resourceName: string;
  stateMachineName?: string;
  fit?:
    | 'cover'
    | 'contain'
    | 'fill'
    | 'fitWidth'
    | 'fitHeight'
    | 'none'
    | 'scaleDown';
  autoplay?: boolean;
  onPlay?: (animationName: string, isStateMachine: boolean) => void;
  onPause?: (animationName: string, isStateMachine: boolean) => void;
  onStop?: (animationName: string, isStateMachine: boolean) => void;
  onLoopEnd?: (animationName: string, loopMode: LoopMode) => void;
  onStateChanged?: (stateMachineName: string, stateName: string) => void;
  onRiveEventReceived?: (event: RiveGeneralEvent | RiveOpenUrlEvent) => void;
  onError?: (riveError: RNRiveError) => void;
};

type Output = {
  RiveComponent: (props: { style?: ViewStyle }) => JSX.Element;
  play: (
    animationName?: string,
    loop?: LoopMode,
    direction?: Direction,
    isStateMachine?: boolean
  ) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  fireState: (stateMachineName: string, inputName: string) => void;
  setInputState: (
    stateMachineName: string,
    inputName: string,
    value: number | boolean
  ) => void;
};

export const useRiveNative: Func<Input, Output> = ({
  fit = 'cover',
  autoplay = false,
  ...rest
}) => {
  const riveRef = useRef<RiveRef>(null);

  const RiveComponent = useMemo(() => {
    return (props: { style?: ViewStyle }) => {
      return (
        <Rive
          ref={riveRef}
          fit={fit as Fit}
          style={{
            width: '100%',
            height: '100%',
            ...props.style,
          }}
          autoplay={autoplay}
          {...rest}
        />
      );
    };
  }, [riveRef, fit, autoplay, rest]);

  const isRefConnectedToComponent = () => {
    return !isNil(riveRef.current);
  };

  const play = (
    animationName?: string,
    loop?: LoopMode,
    direction?: Direction,
    isStateMachine?: boolean
  ) => {
    if (isRefConnectedToComponent()) {
      riveRef.current!.stop();
      riveRef.current!.play(animationName, loop, direction, isStateMachine);
    }
  };

  const stop = () => {
    if (isRefConnectedToComponent()) {
      riveRef.current!.stop();
    }
  };

  const pause = () => {
    if (isRefConnectedToComponent()) {
      riveRef.current!.pause();
    }
  };

  const resume = () => {
    if (isRefConnectedToComponent()) {
      riveRef.current!.play();
    }
  };

  const reset = () => {
    if (isRefConnectedToComponent()) {
      riveRef.current!.reset();
    }
  };

  const fireState = (stateMachineName: string, inputName: string) => {
    if (isRefConnectedToComponent()) {
      riveRef.current!.fireState(stateMachineName, inputName);
    }
  };

  const setInputState = (
    stateMachineName: string,
    inputName: string,
    value: boolean | number
  ) => {
    if (isRefConnectedToComponent()) {
      riveRef.current!.setInputState(stateMachineName, inputName, value);
    }
  };

  return {
    RiveComponent,
    play,
    stop,
    pause,
    resume,
    reset,
    fireState,
    setInputState,
  };
};
