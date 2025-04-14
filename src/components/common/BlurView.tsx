import { BlurView as ExpoBlurView } from 'expo-blur';
import { ComponentProps } from 'react';
import { Box } from './Box';
import { IS_ANDROID } from '@utils';

/**
 * NOTE !1. BlurView support is experimental on Android and may cause
 * performance and graphical issues. It can be enabled by setting this property.
 * !2. When using BlurView on AOS and iOS, the borderRadius property is not
 * applied when provided explicitly.
 */

type IBlurViewProps = ComponentProps<typeof ExpoBlurView>;

export const BlurView = ({ ...props }: IBlurViewProps) => {
  if (IS_ANDROID) {
    return <Box {...props} />;
  }
  return <ExpoBlurView experimentalBlurMethod='dimezisBlurView' {...props} />;
};
