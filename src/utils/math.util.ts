import { toDeg, Vector } from 'react-native-worklet-functions';

export const degBetween = (v1: Vector, v2: Vector) => {
  'worklet';

  return toDeg(Math.atan2(v2.y - v1.y, v2.x - v1.x));
};
