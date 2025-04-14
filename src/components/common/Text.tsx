import { cssInterop } from 'nativewind';
import { forwardRef } from 'react';
import type { ComponentType } from 'react';
import { Text as RNText, TextProps } from 'react-native';
import Animated from 'react-native-reanimated';

const Text = forwardRef<RNText, TextProps>((props, ref) => {
  // Apply Orbitron as default font family using Tailwind family name, can be overridden by className/style
  return (
    <RNText
      ref={ref}
      className='font-orbitron-medium text-primary'
      style={props.style}
      {...props}
    />
  );
}) as ComponentType<TextProps>;

Text.displayName = 'Text';

cssInterop(Text, {
  className: {
    target: 'style',
  },
});

const AnimatedText = Animated.createAnimatedComponent(Text);

export { Text, AnimatedText };
