import { useMemo } from 'react';
import { Directions, Gesture, PanGesture } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { between, vec, Vector } from 'react-native-worklet-functions';
import { degBetween } from 'utils/math.util';

export const useFlingGesture = ({
  onEnd,
}: {
  onEnd?: (direction: Directions) => void;
}) => {
  const startPos = useSharedValue<Vector>(vec(0, 0));
  return useMemo<PanGesture>(() => {
    return Gesture.Pan()
      .onStart((e) => {
        startPos.value = vec(e.x, e.y);
      })
      .onEnd((e) => {
        let result: Directions = Directions.RIGHT;

        let angle = degBetween(startPos.value, e);
        if (angle < 0) {
          angle += 360;
        }

        if (between(angle, 45.000001, 135)) {
          result = Directions.DOWN;
        } else if (between(angle, 135.000001, 225)) {
          result = Directions.LEFT;
        } else if (between(angle, 225.000001, 315)) {
          result = Directions.UP;
        }

        onEnd?.(result);
      });
  }, [onEnd]);
};
