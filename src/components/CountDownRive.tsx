import { useCountDown, useGameState } from '@hooks';
import { useLayout } from '@providers';
import { useAnimatedStyle } from 'react-native-reanimated';
import { AnimatedBox } from './common';
import { memo } from 'react';
import { Game } from '@types';

export const CountDownRive = memo(() => {
  const { gameStatus } = useGameState();
  const { Countdown } = useCountDown();
  const { layout } = useLayout();

  const style = useAnimatedStyle(() => {
    const available: Game.Stage[] = ['idle', 'ready'];
    return {
      opacity: available.includes(gameStatus.value) ? 1 : 0,
      pointerEvents: available.includes(gameStatus.value) ? 'auto' : 'none',
    };
  }, []);

  const riveStyle = useAnimatedStyle(() => {
    const { countDownRiveWidth, countDownRiveHeight } = layout.value;
    return {
      width: countDownRiveWidth,
      height: countDownRiveHeight,
    };
  }, []);

  return (
    <AnimatedBox
      className='absolute w-full h-full justify-center items-center'
      style={style}>
      <AnimatedBox style={riveStyle}>
        <Countdown />
      </AnimatedBox>
    </AnimatedBox>
  );
});
