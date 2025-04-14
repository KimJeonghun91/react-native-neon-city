import { Game } from '@types';
import { getBestScore } from '@utils';
import { atom } from 'jotai';
import { makeMutable } from 'react-native-reanimated';

// * Game Status
export const $gameStatus = atom(makeMutable<Game.Stage>('idle'));

// * Game Control
export const $isGamePaused = atom(makeMutable<boolean>(false));

// * Metrics
export const $gameMetrics = atom(
  makeMutable<Game.Metrics>({
    score: 0,
    bestScore: getBestScore(),
    numCorrect: 0,
    numConsecutiveCorrect: 0,
    numIncorrect: 0,
  })
);

// * Item Control
export const $isFeverItemActive = atom(makeMutable<boolean>(false));
export const $isFeverItemRunning = atom(makeMutable<boolean>(false));
export const $isSameArrowDirectionActive = atom(makeMutable<boolean>(false));
export const $isSameArrowDirectionRunning = atom(makeMutable<boolean>(false));

// * Ranking
export const $gameRankings = atom<Game.Rank[]>([]);
