import { useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import { Easing, SharedValue, withTiming } from 'react-native-reanimated';
import { isNull, min } from 'react-native-worklet-functions';
import { useSharedValues } from './useSharedValues';

type Input = {
  durationMS: number;
  onFinished: () => void;
};

type Output = {
  progress: SharedValue<number>;
  isPaused: SharedValue<boolean>;
  init: () => void;
  fillGauge: () => void;
  pause: () => void;
  start: () => void;
  stop: () => void;
};

const FPS = Platform.select({
  android: 10,
  ios: 30,
  web: 30,
  default: 30,
});
const UPDATE_INTERVAL = 1000 / FPS;

export const useTimer: Func<Input, Output> = ({ durationMS, onFinished }) => {
  const timeStart = useRef<number | null>(null);
  const timeEnd = useRef<number | null>(null);
  const timeRemaining = useRef<number | null>(null);
  const timerID = useRef<NodeJS.Timeout | null>(null);

  const { isFinished, progress, isPaused } = useSharedValues({
    progress: 0,
    isFinished: false,
    isPaused: false,
  });

  const stop = useCallback(() => {
    if (!isNull(timerID.current)) {
      clearTimeout(timerID.current!);
      timerID.current = null;
    }
  }, []);

  const init = () => {
    timeStart.current = null;
    timeEnd.current = null;
    timeRemaining.current = null;
    timerID.current = null;
  };

  const fillGauge = () => {
    'worklet';

    progress.value = 0;
    progress.value = withTiming(1, {
      duration: 1200,
      easing: Easing.inOut(Easing.quad),
    });
  };

  const start = useCallback(() => {
    isPaused.value = false;
    const t = performance.now();
    if (isNull(timeStart.current)) {
      timeStart.current = t;
      timeEnd.current = timeStart.current + durationMS;
    } else if (!isNull(timeRemaining.current)) {
      timeEnd.current = t + timeRemaining.current!;
    }

    isFinished.value = false;

    const tick = () => {
      timeRemaining.current = timeEnd.current! - performance.now();
      progress.value = timeRemaining.current! / durationMS;

      if (timeRemaining.current <= 0) {
        if (!isFinished.value) {
          isFinished.value = true;
          stop();
          onFinished();
        }
      } else {
        timerID.current = setTimeout(
          tick,
          min(timeRemaining.current, UPDATE_INTERVAL)
        );
      }
    };

    tick();
  }, [durationMS, progress, onFinished, stop]);

  const pause = useCallback(() => {
    if (!isNull(timerID.current)) {
      clearTimeout(timerID.current!);
      timerID.current = null;
      isPaused.value = true;
    }
  }, []);

  return {
    progress,
    init,
    fillGauge,
    pause,
    start,
    stop,
    isPaused,
  };
};
