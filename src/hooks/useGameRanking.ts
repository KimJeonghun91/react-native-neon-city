import { Game } from '@types';
import { useAtomValue, useSetAtom } from 'jotai';
import { $gameRankings } from 'state';

export const useGameRankingValues = () => {
  const rankings = useAtomValue($gameRankings);

  return {
    rankings,
  };
};

export const useGameRankingActions = () => {
  const setRanking = useSetAtom($gameRankings);

  const save = (result: Game.Metrics) => {
    const rank: Game.Rank = {
      userId: 'User_1',
      score: result.score,
      rank: 0,
    };
    setRanking((prev) => {
      return [...prev, rank]
        .sort((a, b) => b.score - a.score)
        .map((r, i) => ({ ...r, rank: i + 1 }));
    });
  };

  return { save };
};
