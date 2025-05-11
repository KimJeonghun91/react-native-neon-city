import { MENU_ABOUT_IMAGE, MENU_PLAY_IMAGE, MENU_RANKING_IMAGE } from '@assets';
import { AnimatedBox, Cube, CubeEffect, Logo, Menu } from '@components';
import { useForceUpdate, useGameStage } from '@hooks';
import { haptic } from '@utils';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export default function HomeScreen() {
  const router = useRouter();
  const { play } = useGameStage();
  const { updateId, forceUpdate } = useForceUpdate();

  const opacity = useSharedValue(1);
  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  }, []);

  const fadeIn = () => {
    opacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.ease),
    });
  };

  const hide = () => {
    opacity.value = 0;
  };

  useFocusEffect(
    useCallback(() => {
      forceUpdate();
      setTimeout(fadeIn, 500);
    }, [])
  );

  return (
    <AnimatedBox
      key={updateId}
      style={containerStyle}
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
              hide();
              router.push('./ranking');
            },
          },
          {
            id: 'About',
            image: MENU_ABOUT_IMAGE,
            onPress: () => {
              haptic();
              hide();
              router.push('./about');
            },
          },
        ]}
      />
    </AnimatedBox>
  );
}
