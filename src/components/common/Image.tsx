import { Image as ExpoImage, ImageProps as ExpoImageProps } from 'expo-image';
import { FC } from 'react';
import Animated from 'react-native-reanimated';

export const Image: FC<ExpoImageProps> = ({ style, ...props }) => {
  return (
    <ExpoImage style={[{ width: '100%', height: '100%' }, style]} {...props} />
  );
};

export const AnimatedImage = Animated.createAnimatedComponent(ExpoImage);
