import { useAnimation, useRive, useSharedValues } from '@hooks';
import { AudioTracks, useAudio, useLayout } from '@providers';
import {
  Easing,
  FadeInDown,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { AnimatedBox, Image } from './common';
import { CUBE_IMAGE } from '@assets';
import { memo } from 'react';

export const Cube = memo(() => {
  const { layout } = useLayout();
  const { play } = useAudio();
  const { animation, setAnimation } = useAnimation();

  const {
    opacity, //
    scaleDownProgress,
    shouldRunCubeEffect,
  } = useSharedValues({
    opacity: 1,
    scaleDownProgress: 0,
    shouldRunCubeEffect: true,
  });

  const cubeStyle = useAnimatedStyle(() => {
    const { windowHeight, cubeWidth, cubeHeight } = layout.value;
    const centerY = (windowHeight - cubeHeight) / 2;
    const translateY = interpolate(
      scaleDownProgress.value,
      [0, 0.5, 0.6, 0.7, 0.8, 1],
      [0, centerY, centerY, centerY - 5, centerY + 5, centerY]
    );
    const scale = interpolate(
      scaleDownProgress.value,
      [0, 0.5, 0.8, 0.9, 1],
      [1, 0.3, 0.3, 0.5, 0]
    );
    const rotate = interpolate(
      scaleDownProgress.value,
      [0, 0.5, 0.7, 1],
      [0, 0, 180, 720]
    );
    return {
      width: cubeWidth,
      height: cubeHeight,
      opacity: opacity.value,
      transform: [{ translateY }, { scale }, { rotate: `${rotate}deg` }],
    };
  }, []);

  const scaleDownCube = () => {
    'worklet';

    scaleDownProgress.value = withDelay(
      300,
      withTiming(1, { duration: 1500, easing: Easing.out(Easing.ease) })
    );
  };

  useAnimatedReaction(
    () => animation.value,
    (animation) => {
      if (animation === 'press-play-button') {
        scaleDownCube();
        return;
      }
    },
    []
  );

  useAnimatedReaction(
    () => scaleDownProgress.value,
    (scaleDownProgress) => {
      if (scaleDownProgress > 0.52 && shouldRunCubeEffect.value) {
        shouldRunCubeEffect.value = false;
        setAnimation('show-cube-effect');
        runOnJS(play)(AudioTracks.HIDE_CUBE);
      }
    },
    [scaleDownProgress]
  );

  return (
    <AnimatedBox
      key={Math.random()}
      entering={FadeInDown.springify()
        .easing(Easing.inOut(Easing.linear))
        .withCallback((finished) => {
          if (finished) {
            setAnimation('show-logo');
          }
        })}
      className='absolute'>
      <AnimatedBox style={cubeStyle}>
        <Image source={CUBE_IMAGE} contentFit='cover' />
      </AnimatedBox>
    </AnimatedBox>
  );
});

export const CubeEffect = memo(() => {
  const { layout } = useLayout();
  const { animation } = useAnimation();

  const style = useAnimatedStyle(() => {
    const { cubeWidth, cubeHeight, windowHeight } = layout.value;
    const effectWidth = cubeWidth * 1.5;
    const effectHeight = cubeHeight * 1.5;
    return {
      width: effectWidth,
      height: effectHeight,
      transform: [
        {
          translateY: (windowHeight - effectHeight) / 2,
        },
      ],
    };
  }, []);

  const {
    RiveComponent: VanishingRive, //
    play: playVanishing,
  } = useRive({
    resourceName: 'vanishing',
    fit: 'fitHeight',
    autoplay: false,
  });

  useAnimatedReaction(
    () => animation.value,
    (animation) => {
      if (animation === 'show-cube-effect') {
        runOnJS(playVanishing)();
      }
    },
    [playVanishing]
  );

  return (
    <AnimatedBox className='absolute' style={style}>
      <VanishingRive />
    </AnimatedBox>
  );
});
