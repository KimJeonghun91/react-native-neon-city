import { ARROW_IMAGE, ITEM_BUBBLE_IMAGE } from '@assets';
import { AnimatedBox } from '@components';
import { useGameState, useSpriteImage } from '@hooks';
import { useLayout } from '@providers';
import { Game } from '@types';
import { FC } from 'react';
import { Directions } from 'react-native-gesture-handler';
import {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { isEqual } from 'react-native-worklet-functions';

type Props = {
  progress: SharedValue<number>;
  arrow: Game.Arrow;
  totalArrows: number;
};

export const Arrow: FC<Props> = ({ progress, arrow, totalArrows }) => {
  const { isSameArrowDirectionRunning } = useGameState();
  const { layout } = useLayout();

  const {
    sequence, //
    type,
    direction,
    hasItem,
    setRandomArrow,
    setNormalArrow,
  } = arrow;

  const positionIndex = useDerivedValue(() => {
    return ((-sequence + progress.value) % totalArrows) - 1;
  }, [sequence, progress, totalArrows]);

  const arrowSize = useDerivedValue(() => layout.value.windowHeight / 5, []);
  const style = useAnimatedStyle(() => {
    const top = positionIndex.value * arrowSize.value;
    const opacity = Math.max(0.3, 1 - Math.abs(positionIndex.value - 2) * 0.3);
    const scale = Math.max(0.4, 1 - Math.abs(positionIndex.value - 2) * 0.4);
    return {
      top,
      opacity,
      width: arrowSize.value,
      height: arrowSize.value,
      transform: [{ scale }],
    };
  }, [positionIndex]);

  const { Component: Arrow, update } = useSpriteImage({
    source: ARROW_IMAGE,
    cellWidth: arrowSize,
    cellHeight: arrowSize,
    maxColumnIndex: 3,
    maxRowIndex: 1,
  });

  const itemStyle = useAnimatedStyle(() => {
    return {
      opacity: hasItem.value ? 1 : 0,
    };
  }, [hasItem]);

  const { Component: ItemBubble } = useSpriteImage({
    source: ITEM_BUBBLE_IMAGE,
    cellWidth: arrowSize,
    cellHeight: arrowSize,
  });

  useAnimatedReaction(
    () => positionIndex.value,
    function updateArrow(index) {
      const isOutOfScreen = isEqual(index, 5); // center index is 2
      if (isOutOfScreen) {
        if (isSameArrowDirectionRunning.value) {
          setNormalArrow();
        } else {
          setRandomArrow();
        }
      }
    },
    [positionIndex, isSameArrowDirectionRunning, setNormalArrow, setRandomArrow]
  );

  useAnimatedReaction(
    () => {
      const columnsMapper = {
        [Directions.RIGHT]: 0,
        [Directions.UP]: 1,
        [Directions.LEFT]: 2,
        [Directions.DOWN]: 3,
      };
      return {
        col: columnsMapper[direction.value],
        row: type.value === Game.ArrowType.Normal ? 0 : 1,
      };
    },
    ({ col, row }) => update(col, row),
    [update]
  );

  return (
    <AnimatedBox
      style={[
        {
          position: 'absolute',
          zIndex: 1,
          justifyContent: 'center',
        },
        style,
      ]}>
      <Arrow />
      <AnimatedBox
        style={[
          {
            position: 'absolute',
            zIndex: 2,
          },
          itemStyle,
        ]}>
        <ItemBubble />
      </AnimatedBox>
    </AnimatedBox>
  );
};
