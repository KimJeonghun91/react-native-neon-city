import { MENU_ABOUT_IMAGE, MENU_PLAY_IMAGE, MENU_RANKING_IMAGE } from '@assets';
import { AnimatedBox, Cube, CubeEffect, Logo, Menu } from '@components';
import { useForceUpdate, useGameStage } from '@hooks';
import { haptic } from '@utils';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Easing, FadeIn } from 'react-native-reanimated';

export default function HomeScreen() {
  const router = useRouter();
  const { play } = useGameStage();
  const { updateId, forceUpdate } = useForceUpdate();

  useFocusEffect(
    useCallback(() => {
      forceUpdate();
    }, [])
  );

  return (
    <AnimatedBox
      key={updateId}
      entering={FadeIn.duration(500).easing(Easing.out(Easing.ease))}
      className='w-full h-full items-center'
      collapsable={false}>
      <Cube />
      <CubeEffect />
      <Logo />
      <Menu
        items={[
          {
            id: 'Play',
            image: MENU_PLAY_IMAGE,
            onPress: () => {
              haptic();
              play();
            },
          },
          {
            id: 'Ranking',
            image: MENU_RANKING_IMAGE,
            onPress: () => {
              haptic();
              router.push('./ranking');
            },
          },
          {
            id: 'About',
            image: MENU_ABOUT_IMAGE,
            onPress: () => {
              haptic();
              router.push('./about');
            },
          },
        ]}
      />
    </AnimatedBox>
  );
}
