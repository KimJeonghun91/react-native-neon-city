import { AnimatedBox, AnimatedButton, Image, VStack } from '@components';
import { useAnimation } from '@hooks';
import { AudioTracks, useAudio, useLayout } from '@providers';
import { ImageProps } from 'expo-image';
import { memo } from 'react';
import {
  Easing,
  FadeInDown,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type MenuProps = {
  items: {
    id: string;
    image: ImageProps['source'];
    onPress: () => void;
  }[];
};

export const Menu = memo<MenuProps>(({ items }) => {
  const { play } = useAudio();
  const { animation } = useAnimation();
  const { layout } = useLayout();

  const containerOpacity = useSharedValue(1);
  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: containerOpacity.value,
    };
  }, []);

  const buttonStyle = useAnimatedStyle(() => {
    const { homeNavigationBtnHeight, homeNavigationBtnWidth } = layout.value;
    return {
      width: homeNavigationBtnWidth,
      height: homeNavigationBtnHeight,
    };
  }, []);

  useAnimatedReaction(
    () => animation.value,
    (animation) => {
      if (animation === 'press-play-button') {
        containerOpacity.value = withTiming(0);
        return;
      }
    },
    []
  );

  return (
    <AnimatedBox style={containerStyle}>
      <VStack className='flex-1 items-center' space={4}>
        {items.map((item, i) => {
          return (
            <AnimatedButton
              key={item.id}
              entering={FadeInDown.delay(500 + i * 150)
                .springify()
                .easing(Easing.inOut(Easing.ease))}
              style={buttonStyle}
              onPressIn={() => play(AudioTracks.CLICK)}
              onPress={item.onPress}>
              <Image source={item.image} contentFit='contain' />
            </AnimatedButton>
          );
        })}
      </VStack>
    </AnimatedBox>
  );
});
