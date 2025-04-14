import { Game } from '@types';
import { Directions } from 'react-native-gesture-handler';
import { makeMutable } from 'react-native-reanimated';
import {
  floor,
  isEqual,
  min,
  sample,
  values,
} from 'react-native-worklet-functions';
import { EnumKeystoreNumber, keystore } from './mmkv.util';
import { ITEM_PROBABILITY } from '@configs';

export const makeArrow = (sequence: number) => {
  const type = makeMutable<Game.ArrowType>(sample(values(Game.ArrowType))!);
  const direction = makeMutable<Directions>(sample(values(Directions))!);
  const hasItem = makeMutable<boolean>(false);

  const setRandomArrow = () => {
    'worklet';
    direction.value = sample(values(Directions))!;
    type.value = sample(values(Game.ArrowType))!;
    if (isEqual(type.value, Game.ArrowType.Reverse)) {
      hasItem.value = Math.random() < ITEM_PROBABILITY;
    } else {
      hasItem.value = false;
    }
  };

  const setNormalArrow = () => {
    'worklet';
    direction.value = sample(values(Directions))!;
    type.value = Game.ArrowType.Normal;
    hasItem.value = false;
  };

  return {
    sequence,
    type,
    direction,
    hasItem,
    setRandomArrow,
    setNormalArrow,
  };
};

export const getPoint = ({
  combo,
  shouldGiveBonus,
  point,
  bonusPoint,
}: {
  combo: number;
  shouldGiveBonus: boolean;
  point: number;
  bonusPoint: number;
}) => {
  'worklet';

  const comboBonus = floor(combo / 5) * 10;
  const result = point + min(comboBonus, bonusPoint);
  return shouldGiveBonus ? result * 2 : result;
};

export const getTargetArrow = (arrows: Game.Arrow[], progress: number) => {
  'worklet';
  return arrows.find((arrow) => {
    const arrowIndex = ((-arrow.sequence + progress) % arrows.length) - 1;
    const isCenterArrow = isEqual(arrowIndex, 2); // middle arrow index is always 2
    return isCenterArrow;
  })!;
};

export const getBestScore = () => {
  return keystore.getNumber(EnumKeystoreNumber.BEST_SCORE) || 0;
};

export const setBestScore = (score: number) => {
  keystore.set(EnumKeystoreNumber.BEST_SCORE, score);
};
