import { useCallback, useMemo } from 'react';
import { useSharedValues } from './useSharedValues';
import { AnimatedBox, AnimatedImage } from '@components';
import { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { ImageProps } from 'expo-image';
import { ViewProps } from 'react-native';

type Props = {
  source: ImageProps['source'];
  cellWidth: SharedValue<number>;
  cellHeight: SharedValue<number>;
  initialColIndex?: number;
  initialRowIndex?: number;
  maxColumnIndex?: number;
  maxRowIndex?: number;
};

export const useSpriteImage = ({
  source,
  cellWidth,
  cellHeight,
  initialColIndex = 0,
  initialRowIndex = 0,
  maxColumnIndex = 0,
  maxRowIndex = 0,
}: Props) => {
  const { colIndex, rowIndex } = useSharedValues({
    colIndex: initialColIndex,
    rowIndex: initialRowIndex,
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      width: cellWidth.value,
      height: cellHeight.value,
    };
  }, []);

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: cellWidth.value * (maxColumnIndex + 1),
      height: cellHeight.value * (maxRowIndex + 1),
      transform: [
        {
          translateX: -colIndex.value * cellWidth.value,
        },
        {
          translateY: -rowIndex.value * cellHeight.value,
        },
      ],
    };
  }, []);

  const update = useCallback((col: number, row: number) => {
    'worklet';
    colIndex.value = col;
    rowIndex.value = row;
  }, []);

  const Component = useMemo(() => {
    return ({ style, ...rest }: ViewProps) => (
      <AnimatedBox
        style={[
          style,
          containerStyle,
          {
            overflow: 'hidden',
          },
        ]}
        {...rest}>
        <AnimatedImage
          source={source}
          style={[
            {
              position: 'absolute',
              width: '100%',
              height: '100%',
            },
            imageStyle,
          ]}
        />
      </AnimatedBox>
    );
  }, [source, containerStyle, imageStyle]);

  return { Component, update };
};
