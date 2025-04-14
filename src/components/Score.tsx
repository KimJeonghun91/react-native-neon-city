import { SCORE_SECTION_IMAGE } from '@assets';
import { ImageBackground } from './common';
import { ReText } from 'react-native-redash';
import { useGameState } from '@hooks';
import { useDerivedValue } from 'react-native-reanimated';
import { memo } from 'react';

export const Score = memo(() => {
  const { gameMetrics } = useGameState();
  const scoreText = useDerivedValue<string>(
    () => `${gameMetrics.value.score}`,
    [gameMetrics]
  );

  return (
    <ImageBackground
      source={SCORE_SECTION_IMAGE}
      priority='high'
      cachePolicy='memory-disk'
      style={{
        width: 182,
        height: 52,
        transform: [
          {
            translateY: 52 / 2,
          },
          {
            translateX: -12,
          },
        ],
      }}>
      <ReText
        text={scoreText}
        style={{
          color: '#E9FFFF',
          fontFamily: 'Orbitron-Bold',
          textAlign: 'center',
          fontSize: 23,
          transform: [{ translateY: 23 / 2 }],
        }}
      />
    </ImageBackground>
  );
});
