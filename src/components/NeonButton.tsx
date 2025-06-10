import { memo, PropsWithChildren, useRef } from 'react';
import { AnimatedBox, AnimatedButton, AnimatedImage, Box } from './common';
import {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { StyleProp, ViewStyle } from 'react-native';
import { AudioTracks, useAudio, useLayout } from '@providers';
import { MENU_FRAME_1_IMAGE, MENU_FRAME_2_IMAGE } from '@assets';
import { useDidMount } from 'rooks';
import { useSharedValues } from '@hooks';
import { haptic } from '@utils';

type ButtonType = 'small' | 'medium' | 'large';

type Props = PropsWithChildren<{
  type?: ButtonType;
  style?: StyleProp<ViewStyle>;
  delay?: number;
  onPress: () => void;
}>;

export const NeonButton = memo<Props>(function NeonButton({
  type = 'medium',
  style,
  children,
  delay = 0,
  onPress,
}) {
  const { layout } = useLayout();
  const { play } = useAudio();
  const disabled = useRef(false);

  const { progress, rectTranslateX, contentContainerOpacity } = useSharedValues(
    {
      progress: 0,
      rectTranslateX: 0,
      contentContainerOpacity: 0,
    }
  );

  const containerStyle = useAnimatedStyle<ViewStyle>(() => {
    const {
      neonButtonHeightFull,
      neonButtonWidthFull,
      neonButtonHeightSmall,
      neonButtonWidthSmall,
      neonButtonHeightMedium,
      neonButtonWidthMedium,
    } = layout.value;
    const borderColor = `rgba(233, 255, 255, ${interpolate(
      progress.value,
      [0, 0.85, 1],
      [0, 0, 1]
    )})`;
    if (type === 'small') {
      return {
        width: neonButtonWidthSmall,
        height: neonButtonHeightSmall,
        borderColor,
      };
    }
    if (type === 'medium') {
      return {
        width: neonButtonWidthMedium,
        height: neonButtonHeightMedium,
        borderColor,
      };
    }
    return {
      width: neonButtonWidthFull,
      height: neonButtonHeightFull,
      borderColor,
    };
  }, []);

  const contentContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: contentContainerOpacity.value,
    };
  }, []);

  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        progress.value,
        [0, 0.7, 0.8, 0.9, 1],
        [0, 0.3, 1.0, 0.3, 1]
      ),
    };
  }, []);

  const bottomHolderStyle = useAnimatedStyle(() => {
    const {
      menuBtnHolderWidth,
      menuBtnHolderHeight,
      neonButtonWidthFull,
      neonButtonHeightFull,
      neonButtonWidthSmall,
      neonButtonHeightSmall,
      neonButtonHeightMedium,
      neonButtonWidthMedium,
    } = layout.value;
    if (type === 'small') {
      return {
        width: menuBtnHolderWidth,
        height: menuBtnHolderHeight,
        transform: [
          {
            translateX: interpolate(
              progress.value,
              [0, 1],
              [0, -(neonButtonWidthSmall - menuBtnHolderWidth) / 2 - 1]
            ),
          },
          {
            translateY: interpolate(
              progress.value,
              [0, 1],
              [0, (neonButtonHeightSmall - menuBtnHolderHeight) / 2 + 6]
            ),
          },
        ],
      };
    }
    if (type === 'medium') {
      return {
        width: menuBtnHolderWidth,
        height: menuBtnHolderHeight,
        transform: [
          {
            translateX: interpolate(
              progress.value,
              [0, 1],
              [0, -(neonButtonWidthMedium - menuBtnHolderWidth + 2) / 2]
            ),
          },
          {
            translateY: interpolate(
              progress.value,
              [0, 1],
              [0, (neonButtonHeightMedium - menuBtnHolderHeight) / 2 + 6]
            ),
          },
        ],
      };
    }
    return {
      width: menuBtnHolderWidth,
      height: menuBtnHolderHeight,
      transform: [
        {
          translateX: interpolate(
            progress.value,
            [0, 1],
            [0, -(neonButtonWidthFull - menuBtnHolderWidth + 2) / 2]
          ),
        },
        {
          translateY: interpolate(
            progress.value,
            [0, 1],
            [0, (neonButtonHeightFull - menuBtnHolderHeight) / 2 + 6]
          ),
        },
      ],
    };
  }, []);

  const topHolderStyle = useAnimatedStyle(() => {
    const {
      menuBtnHolderWidth,
      menuBtnHolderHeight,
      neonButtonWidthFull,
      neonButtonHeightFull,
      neonButtonWidthSmall,
      neonButtonHeightSmall,
      neonButtonWidthMedium,
      neonButtonHeightMedium,
    } = layout.value;
    if (type === 'small') {
      return {
        width: menuBtnHolderWidth,
        height: menuBtnHolderHeight,
        transform: [
          {
            translateX: interpolate(
              progress.value,
              [0, 1],
              [0, (neonButtonWidthSmall - menuBtnHolderWidth) / 2 + 1]
            ),
          },
          {
            translateY: interpolate(
              progress.value,
              [0, 1],
              [-5, -(neonButtonHeightSmall - menuBtnHolderHeight) / 2 - 6]
            ),
          },
        ],
      };
    }
    if (type === 'medium') {
      return {
        width: menuBtnHolderWidth,
        height: menuBtnHolderHeight,
        transform: [
          {
            translateX: interpolate(
              progress.value,
              [0, 1],
              [0, (neonButtonWidthMedium - menuBtnHolderWidth) / 2 + 1]
            ),
          },
          {
            translateY: interpolate(
              progress.value,
              [0, 1],
              [-5, -(neonButtonHeightMedium - menuBtnHolderHeight) / 2 - 6]
            ),
          },
        ],
      };
    }
    return {
      width: menuBtnHolderWidth,
      height: menuBtnHolderHeight,
      transform: [
        {
          translateX: interpolate(
            progress.value,
            [0, 1],
            [0, (neonButtonWidthFull - menuBtnHolderWidth) / 2 + 1]
          ),
        },
        {
          translateY: interpolate(
            progress.value,
            [0, 1],
            [-5, -(neonButtonHeightFull - menuBtnHolderHeight) / 2 - 6]
          ),
        },
      ],
    };
  }, []);

  const boxStyle = useAnimatedStyle(() => {
    const { effectRectWidth, effectRectHeight } = layout.value;
    return {
      width: effectRectWidth,
      height: effectRectHeight,
      transform: [
        { translateX: -effectRectWidth * 1.5 + rectTranslateX.value },
        { skewX: `${-45}deg` },
        { scaleX: type === 'small' ? 0.8 : 1 },
      ],
    };
  }, []);

  const reset = () => {
    progress.value = 1;
    contentContainerOpacity.value = 1;
    disabled.current = false;
  };

  const handlePress = () => {
    setTimeout(onPress, 300);
    setTimeout(reset, 600);
  };

  const close = () => {
    if (disabled.current) {
      return;
    }

    disabled.current = true;
    progress.value = withTiming(
      0,
      {
        duration: type === 'large' ? 300 : 200,
        easing: Easing.in(Easing.ease),
      },
      (finished) => {
        if (finished) {
          runOnJS(handlePress)();
        }
      }
    );
  };

  useDidMount(() => {
    const open = () => {
      const runEffect = () => {
        'worklet';

        const { neonButtonWidthFull, neonButtonWidthSmall, effectRectWidth } =
          layout.value;
        if (type === 'small') {
          rectTranslateX.value = withDelay(
            100,
            withRepeat(
              withTiming(neonButtonWidthSmall + effectRectWidth * 3, {
                duration: 400,
                easing: Easing.inOut(Easing.ease),
              }),
              2,
              false
            )
          );
          return;
        }
        rectTranslateX.value = withDelay(
          100,
          withRepeat(
            withTiming(neonButtonWidthFull + effectRectWidth * 3, {
              duration: 350,
              easing: Easing.inOut(Easing.ease),
            }),
            2,
            false
          )
        );
      };

      contentContainerOpacity.value = withTiming(1, {
        duration: 200,
        easing: Easing.in(Easing.quad),
      });
      progress.value = withTiming(
        1,
        {
          duration: 400,
        },
        (finished) => {
          if (finished) {
            runEffect();
          }
        }
      );
    };

    setTimeout(open, delay);
  });

  return (
    <AnimatedButton
      style={[style, { borderWidth: 1 }, containerStyle]}
      onPressIn={() => {
        haptic();
        play(AudioTracks.CLOSE_BUTTON)
      }}
      onPress={close}>
      <AnimatedBox
        className='flex-1 justify-center items-center'
        style={contentContainerStyle}>
        <AnimatedImage source={MENU_FRAME_1_IMAGE} style={bottomHolderStyle} />
        <AnimatedImage
          source={MENU_FRAME_2_IMAGE}
          style={[
            {
              position: 'absolute',
            },
            topHolderStyle,
          ]}
        />
        <AnimatedBox
          className='absolute w-full h-full justify-center items-center'
          style={contentStyle}>
          {children}
        </AnimatedBox>
        <Box className='absolute left-0 w-full h-full overflow-hidden pointer-events-none'>
          <AnimatedBox
            style={[
              {
                position: 'absolute',
                left: -28,
                backgroundColor: '#E9FFFF',
              },
              boxStyle,
            ]}
          />
        </Box>
      </AnimatedBox>
    </AnimatedButton>
  );
});
