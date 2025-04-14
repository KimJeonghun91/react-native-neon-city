import { DependencyList, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export const useAppState = (
  listener: (state: AppStateStatus) => void,
  deps?: DependencyList | undefined
) => {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', listener);

    return () => {
      subscription.remove();
    };
  }, deps);
};
