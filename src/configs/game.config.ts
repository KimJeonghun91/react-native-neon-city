import { Directions } from 'react-native-gesture-handler';
import { zipObject } from 'react-native-worklet-functions';

export const CONSECUTIVE_MAX_COMBO = 25;
export const POINT_CORRECT = 150;
export const POINT_BONUS = 250;
export const TOTAL_ARROWS = 7;
export const ITEM_PROBABILITY = 0.1;
export const PLAY_TIME_MS = 1000 * 60;
export const KEYBOARD_ARROW_KEYS = [
  'ArrowRight',
  'ArrowLeft',
  'ArrowUp',
  'ArrowDown',
];
export const KEYBOARD_KEYS_MAPPER = zipObject(
  KEYBOARD_ARROW_KEYS,
  Object.values(Directions)
);
export const TABLET_MAX_WIDTH = 768;
