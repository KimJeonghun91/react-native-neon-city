import { cssInterop } from 'nativewind';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';

const Button = Pressable;

Button.displayName = 'Button';

cssInterop(Button, {
  className: {
    target: 'style',
  },
});

const AnimatedButton = Animated.createAnimatedComponent(Button);

export { Button, AnimatedButton };
