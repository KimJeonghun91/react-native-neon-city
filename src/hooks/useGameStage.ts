import { useRouter } from 'expo-router';
import { useAnimation } from './useAnimation';
import { useGameState } from './useGameState';
import { useCallback } from 'react';
import { useGameRankingActions } from './useGameRanking';

export const useGameStage = () => {
  const router = useRouter();
  const {
    gameStatus, //
    gameMetrics,
    setStatus,
    saveBestScore,
    resetMetrics,
  } = useGameState();

  const ranking = useGameRankingActions();

  const { setAnimation } = useAnimation();

  const play = useCallback(() => {
    resetMetrics();
    setAnimation('press-play-button');
    setTimeout(() => router.push('./play'), 1800);
  }, []);

  const replay = useCallback(() => {
    resetMetrics();
    setStatus('ready');
    router.back();
  }, []);

  const pause = useCallback(() => {
    setStatus('paused');
    router.push('./pause');
  }, []);

  const resume = useCallback(() => {
    setStatus('playing');
    router.back();
  }, []);

  const stop = useCallback(() => {
    setStatus('idle');
    setAnimation('idle');
    resetMetrics();
    router.dismissAll();
  }, []);

  const finish = useCallback(() => {
    if (gameStatus.value === 'time-over') {
      return;
    }

    setStatus('time-over');
    saveBestScore();
    setTimeout(() => {
      setStatus('finished');
      ranking.save(gameMetrics.value);
      router.push('./result');
    }, 1200);
  }, []);

  return {
    play,
    replay,
    stop,
    resume,
    pause,
    finish,
  };
};
