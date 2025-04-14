import { AudioTracks, useAudio } from '@providers';
import { Game } from '@types';
import { setBestScore } from '@utils';
import { useAtomValue } from 'jotai';
import { Directions } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { isEqual } from 'react-native-worklet-functions';
import {
  $gameStatus,
  $gameMetrics,
  $isFeverItemActive,
  $isSameArrowDirectionActive,
  $isGamePaused,
  $isFeverItemRunning,
  $isSameArrowDirectionRunning,
} from 'state';

export const useGameState = () => {
  const { play } = useAudio();

  const isGamePaused = useAtomValue($isGamePaused);
  const gameStatus = useAtomValue($gameStatus);
  const gameMetrics = useAtomValue($gameMetrics);
  const isActiveFeverItem = useAtomValue($isFeverItemActive);
  const isActiveSameArrowDirection = useAtomValue($isSameArrowDirectionActive);
  const isFeverItemRunning = useAtomValue($isFeverItemRunning);
  const isSameArrowDirectionRunning = useAtomValue(
    $isSameArrowDirectionRunning
  );

  const setStatus = (v: Game.Stage) => {
    'worklet';

    gameStatus.value = v;
    isGamePaused.value = v === 'paused';
  };

  const setCorrect = (point: number) => {
    'worklet';

    runOnJS(play)(AudioTracks.CORRECT);

    const prev = gameMetrics.value;
    gameMetrics.value = {
      ...prev,
      score: prev.score + point,
      bestScore: Math.max(prev.bestScore, prev.score + point),
      numCorrect: prev.numCorrect + 1,
      numConsecutiveCorrect: prev.numConsecutiveCorrect + 1,
    };
  };

  const saveBestScore = () => {
    setBestScore(gameMetrics.value.bestScore);
  };

  const resetMetrics = () => {
    'worklet';

    gameMetrics.value = {
      score: 0,
      bestScore: gameMetrics.value.bestScore,
      numCorrect: 0,
      numConsecutiveCorrect: 0,
      numIncorrect: 0,
    };
  };

  const setIncorrect = () => {
    'worklet';

    runOnJS(play)(AudioTracks.INCORRECT);

    const prev = gameMetrics.value;
    gameMetrics.value = {
      ...prev,
      numIncorrect: prev.numIncorrect + 1,
      numConsecutiveCorrect: 0,
    };
  };

  const checkAnswer = (inputDirection: Directions, arrow: Game.Arrow) => {
    'worklet';
    const reverseArrowMapper = {
      [Directions.RIGHT]: Directions.LEFT,
      [Directions.LEFT]: Directions.RIGHT,
      [Directions.UP]: Directions.DOWN,
      [Directions.DOWN]: Directions.UP,
    };
    const answerDirection = isEqual(arrow.type.value, Game.ArrowType.Normal)
      ? arrow.direction.value
      : reverseArrowMapper[arrow.direction.value];
    return isEqual(inputDirection, answerDirection);
  };

  // * Fever Item
  const setFeverItemStatus = (v: boolean) => {
    'worklet';
    isActiveFeverItem.value = v;
  };

  const runFeverItem = () => {
    'worklet';
    isFeverItemRunning.value = true;
  };

  const resetFeverItem = () => {
    'worklet';
    isFeverItemRunning.value = false;
    isActiveFeverItem.value = false;
  };

  // * Same Arrow Direction Item
  const setSameArrowDirectionStatus = (v: boolean) => {
    'worklet';
    isActiveSameArrowDirection.value = v;
  };

  const runSameArrowDirection = () => {
    'worklet';
    isSameArrowDirectionRunning.value = true;
  };

  const resetSameArrowDirection = () => {
    'worklet';
    isSameArrowDirectionRunning.value = false;
    isActiveSameArrowDirection.value = false;
  };

  return {
    gameStatus,
    gameMetrics,
    isActiveFeverItem,
    isActiveSameArrowDirection,
    isGamePaused,
    isFeverItemRunning,
    isSameArrowDirectionRunning,
    setStatus,
    setCorrect,
    setIncorrect,
    setFeverItemStatus,
    setSameArrowDirectionStatus,
    checkAnswer,
    resetMetrics,
    saveBestScore,
    runFeverItem,
    resetFeverItem,
    runSameArrowDirection,
    resetSameArrowDirection,
  };
};
