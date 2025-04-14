import { DependencyList } from 'react';
import { AppStateStatus } from 'react-native';

export const useAppState = (
  listener: (state: AppStateStatus) => void,
  deps?: DependencyList | undefined
) => {};
