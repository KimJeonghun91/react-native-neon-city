import { cssInterop } from 'nativewind';
import { forwardRef } from 'react';
import type { ComponentType } from 'react';
import type { ViewProps } from 'react-native';
import Animated from 'react-native-reanimated';
// @ts-ignore
import NativeView from 'react-native/Libraries/Components/View/ViewNativeComponent';

const Box = forwardRef((props, ref) => {
  return <NativeView {...props} ref={ref} />;
}) as ComponentType<ViewProps>;

Box.displayName = 'RCTView';

cssInterop(Box, {
  className: {
    target: 'style',
  },
});

const AnimatedBox = Animated.createAnimatedComponent(Box);

export { Box, AnimatedBox };
