import { Game } from '@types';
import { useAtomValue } from 'jotai';
import { $animation } from 'state';

export const useAnimation = () => {
  const animation = useAtomValue($animation);

  const setAnimation = (v: Game.Animations) => {
    'worklet';
    animation.value = v;
  };

  return { animation, setAnimation };
};
