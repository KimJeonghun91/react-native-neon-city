import { Game } from '@types';
import { atom } from 'jotai';
import { makeMutable } from 'react-native-reanimated';

export const $animation = atom(makeMutable<Game.Animations>('idle'));
