import {
  AnimatedBox,
  Arrow,
  Box,
  CountDownRive,
  FeedbackRive,
  FiverRive,
  HStack,
  ItemRive,
  Score,
  TargetArea,
  TimeOverRive,
  Timer,
} from '@components';
import {
  CONSECUTIVE_MAX_COMBO,
  PLAY_TIME_MS,
  POINT_BONUS,
  POINT_CORRECT,
  TOTAL_ARROWS,
} from '@configs';
import {
  useFlingGesture,
  useGameStage,
  useGameState,
  useSharedValues,
} from '@hooks';
import { AudioTracks, useAudio } from '@providers';
import { getPoint, getTargetArrow, makeArrow } from '@utils';
import { memo, useCallback, useMemo } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Directions, GestureDetector } from 'react-native-gesture-handler';
import {
  Easing,
  FadeIn,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { withPause } from 'react-native-redash';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { array1d } from 'react-native-worklet-functions';
import { useDidMount } from 'rooks';

function PlayScreen() {
  const insets = useSafeAreaInsets();

  const {
    isGamePaused,
    isActiveFeverItem,
    isActiveSameArrowDirection,
    isFeverItemRunning,
    isSameArrowDirectionRunning,
    gameStatus,
    gameMetrics,
    setStatus,
    setCorrect,
    setIncorrect,
    checkAnswer,
    setFeverItemStatus,
    setSameArrowDirectionStatus,
    runFeverItem,
    resetFeverItem,
    runSameArrowDirection,
    resetSameArrowDirection,
  } = useGameState();
  const { finish } = useGameStage();
  const { play } = useAudio();

  const { containerOpacity, progress } = useSharedValues({
    containerOpacity: 1,
    progress: 0,
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: containerOpacity.value,
    };
  }, []);

  const arrows = useMemo(
    () => array1d(TOTAL_ARROWS).map((_, i) => makeArrow(i)),
    []
  );

  const onTimeOver = () => {
    setTimeout(() => {
      containerOpacity.value = withTiming(
        0,
        { duration: 200, easing: Easing.in(Easing.quad) },
        (finished) => {
          'worklet';
          if (finished) {
            runOnJS(finish)();
          }
        }
      );
    }, 500);
  };

  const moveArrows = (nextProgress: number, duration: number) => {
    'worklet';
    progress.value = withPause(
      withTiming(nextProgress, { duration }),
      isGamePaused
    );
  };

  const init = () => {
    'worklet';

    containerOpacity.value = 1;
    progress.value = 0;
    arrows.forEach((arrow) => arrow.setNormalArrow());
  };

  const gesture = useFlingGesture({
    onEnd: useCallback((userInput: Directions) => {
      'worklet';

      if (gameStatus.value !== 'playing') {
        return;
      }

      const curProgress = Math.round(progress.value);
      const target = getTargetArrow(arrows, curProgress);
      if (checkAnswer(userInput, target)) {
        setCorrect(
          getPoint({
            combo: gameMetrics.value.numConsecutiveCorrect,
            point: POINT_CORRECT,
            bonusPoint: POINT_BONUS,
            shouldGiveBonus: isFeverItemRunning.value,
          })
        );
        // * Activate Fever Item
        if (
          gameMetrics.value.numConsecutiveCorrect === CONSECUTIVE_MAX_COMBO &&
          !isActiveFeverItem.value
        ) {
          setFeverItemStatus(true);
        }
        // * Activate Arrow Direction Item
        if (target.hasItem.value && !isActiveSameArrowDirection.value) {
          setSameArrowDirectionStatus(true);
        }
      } else {
        setIncorrect();
      }
      moveArrows(curProgress + 1, 100);
    }, []),
  });

  useAnimatedReaction(
    () => gameStatus.value,
    (gameStatus, prevGameStatus) => {
      if (gameStatus === 'ready') {
        init();
        runOnJS(play)(AudioTracks.READY);
        return;
      }

      if (prevGameStatus === 'ready' && gameStatus === 'playing') {
        moveArrows(3, 300);
      }
    },
    [gameStatus]
  );

  useDidMount(() => setStatus('ready'));

  return (
    <AnimatedBox
      className='flex-1'
      entering={FadeIn.duration(500).easing(Easing.out(Easing.ease))}>
      <AnimatedBox style={containerStyle}>
        {/* Header */}
        <Box
          style={{
            position: 'absolute',
            width: '100%',
            paddingTop: insets.top,
            zIndex: 1,
          }}>
          <Timer duration={PLAY_TIME_MS} />
        </Box>

        {/* Body */}
        <Box className='w-full h-full items-center' collapsable={false}>
          {/* Effect */}
          <FeedbackRive />
          <TargetArea />
          <CountDownRive />
          <TimeOverRive onTimeOver={onTimeOver} />
          <FiverRive />

          {/* Arrow */}
          <GestureDetector gesture={gesture}>
            <Box className='w-full h-full items-center' collapsable={false}>
              {arrows.map((arrow, i, { length }) => {
                return (
                  <Arrow
                    key={i}
                    progress={progress}
                    arrow={arrow}
                    totalArrows={length}
                  />
                );
              })}
            </Box>
          </GestureDetector>
        </Box>

        {/* Footer */}
        <Box className='absolute bottom-0 items-center'>
          <HStack>
            <ItemRive
              resourceName='feveritem'
              stageMachineName='directionItem'
              style={styles.item}
              isRunning={isFeverItemRunning}
              onFire={() => runFeverItem()}
              onNoFire={() => resetFeverItem()}
              shouldActive={() => {
                'worklet';
                return isActiveFeverItem.value;
              }}
            />
            <ItemRive
              resourceName='directionitem'
              stageMachineName='directionItem'
              style={styles.item}
              isRunning={isSameArrowDirectionRunning}
              onFire={() => runSameArrowDirection()}
              onNoFire={() => resetSameArrowDirection()}
              shouldActive={() => {
                'worklet';
                return isActiveSameArrowDirection.value;
              }}
            />
            <Score />
          </HStack>
        </Box>
      </AnimatedBox>
    </AnimatedBox>
  );
}

const styles = StyleSheet.create({
  item: {
    height: 180,
    width: 120,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
});

export default memo(PlayScreen);
