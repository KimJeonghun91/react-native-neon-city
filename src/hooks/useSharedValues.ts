import { useEffect, useState } from 'react';
import {
  SharedValue,
  cancelAnimation,
  makeMutable,
} from 'react-native-reanimated';

type AnimationValues<S> = {
  [K in keyof S]: SharedValue<S[K]>;
};

type AnimationState = Record<string, unknown>;

export const useSharedValues = <S extends AnimationState>(state: S) => {
  const [mutable] = useState<AnimationValues<S>>(() => {
    const values = {} as AnimationValues<S>;
    for (const key in state) {
      values[key] = makeMutable(state[key]);
    }
    return values;
  });
  useEffect(() => {
    return () => {
      Object.values(mutable).forEach(cancelAnimation);
    };
  }, [mutable]);
  return mutable;
};
