import { AnimatedBox } from '@components';
import { useAnimation, useRive } from '@hooks';
import { useLayout } from '@providers';
import { memo } from 'react';
import {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export const Logo = memo(() => {
  const { layout } = useLayout();
  const { animation } = useAnimation();

  const {
    RiveComponent: MainLogoRive, //
    play: playMainLogoRive,
  } = useRive({
    resourceName: 'mainlogo',
    fit: 'fitWidth',
  });

  const opacity = useSharedValue(0);
  const uas = useAnimatedStyle(() => {
    const { logoWidth, logoHeight } = layout.value;
    return {
      width: logoWidth,
      height: logoHeight,
      opacity: opacity.value,
    };
  }, []);

  const fadeIn = () => {
    'worklet';

    opacity.value = withTiming(1, {
      duration: 300,
      easing: Easing.inOut(Easing.linear),
    });
  };

  const fadeOut = () => {
    'worklet';

    opacity.value = withTiming(0, {
      duration: 300,
      easing: Easing.inOut(Easing.linear),
    });
  };

  useAnimatedReaction(
    () => animation.value,
    (animation) => {
      if (animation === 'show-logo') {
        fadeIn();
        runOnJS(playMainLogoRive)();
        return;
      }
      if (
        animation === 'press-play-button' ||
        animation === 'show-cube-effect'
      ) {
        fadeOut();
        return;
      }
    },
    [fadeIn, playMainLogoRive, fadeOut]
  );

  return (
    <AnimatedBox style={uas}>
      <MainLogoRive
        style={{
          position: 'absolute',
        }}
      />
    </AnimatedBox>
  );
});
