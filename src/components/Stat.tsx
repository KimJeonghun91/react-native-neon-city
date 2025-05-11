import { FC } from 'react';
import {
  Easing,
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { AnimatedBox, Text, VStack } from './common';
import { useDidMount } from 'rooks';
import { ReText } from 'react-native-redash';

type Props = {
  label: string;
  value: number | SharedValue<number>;
  isNew?: SharedValue<boolean>;
  animate?: boolean;
};

export const Stat: FC<Props> = ({ label, value, isNew, animate = true }) => {
  const progress = useSharedValue(0);
  const animatedText = useDerivedValue(() => {
    if (animate) {
      if (typeof value === 'number') {
        return Math.floor(interpolate(progress.value, [0, 1], [0, value])) + '';
      }
      return (
        Math.floor(interpolate(progress.value, [0, 1], [0, value.value])) + ''
      );
    }
    return value + '';
  }, []);

  useDidMount(() => {
    if (animate) {
      progress.value = withDelay(300, withTiming(1));
    }
  });

  return (
    <VStack space={8}>
      <VStack justify='center'>
        <Text className='text-xl font-orbitron-semibold'>{label}</Text>
        <ReText
          className='font-orbitron-extrabold'
          style={{
            fontSize: 40,
            lineHeight: 52,
            color: '#E8FFFE',
          }}
          text={animatedText}
        />
      </VStack>
      {isNew && <New shouldShow={isNew} />}
    </VStack>
  );
};

const New: FC<{ shouldShow: SharedValue<boolean> }> = ({ shouldShow }) => {
  const opacity = useSharedValue(0);
  const style = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  }, []);

  useAnimatedReaction(
    () => shouldShow.value,
    (shouldShow) => {
      if (shouldShow) {
        opacity.value = withDelay(
          300,
          withRepeat(
            withTiming(1, { easing: Easing.inOut(Easing.ease) }),
            5,
            true
          )
        );
      }
    },
    []
  );

  return (
    <AnimatedBox className='bg-[#FFC0EF] px-4 py-1 rounded-md' style={style}>
      <Text className='text-xl font-orbitron-extrabold'>new!!</Text>
    </AnimatedBox>
  );
};
