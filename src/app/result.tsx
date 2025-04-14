import {
  MAIN_MENU_IMAGE,
  RESULT_RANKING_IMAGE,
  RESULT_RETRY_IMAGE,
} from '@assets';
import {
  AnimatedBox,
  AnimatedText,
  Box,
  HStack,
  Image,
  NeonButton,
  Stat,
  VStack,
} from '@components';
import { useGameStage, useGameState, useSharedValues } from '@hooks';
import { useLayout } from '@providers';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import {
  Easing,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ResultScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { stop, replay } = useGameStage();
  const { gameMetrics } = useGameState();
  const score = useDerivedValue(() => gameMetrics.value.score, []);
  const bestScore = useDerivedValue(() => gameMetrics.value.bestScore, []);
  const isBestScore = useDerivedValue(
    () => gameMetrics.value.score >= gameMetrics.value.bestScore,
    []
  );

  const renderScoreSection = () => {
    return (
      <VStack space={40}>
        <Stat label='Score' value={score} />
        <Stat label='Best Score' value={bestScore} isNew={isBestScore} />
      </VStack>
    );
  };

  const renderButtonGroup = () => {
    return (
      <VStack className='px-3' space={32} justify='center'>
        <HStack justify='space-between'>
          <Box className='flex-1 justify-center items-center'>
            <NeonButton type='small' onPress={replay}>
              <Image
                source={RESULT_RETRY_IMAGE}
                style={{ width: 140, height: '100%' }}
              />
            </NeonButton>
          </Box>
          <Box className='flex-1 justify-center items-center'>
            <NeonButton
              type='small'
              onPress={() => router.navigate('/ranking')}>
              <Image
                source={RESULT_RANKING_IMAGE}
                style={{ width: 140, height: '100%' }}
              />
            </NeonButton>
          </Box>
        </HStack>
        <NeonButton type='large' onPress={stop}>
          <Image
            source={MAIN_MENU_IMAGE}
            style={{ width: 160, height: '100%' }}
          />
        </NeonButton>
      </VStack>
    );
  };

  return (
    <Box className='flex-1' style={{ paddingTop: insets.top }}>
      <VStack className='flex-1' space={148}>
        <Header />
        <VStack className='flex-1 ' space={65}>
          {renderScoreSection()}
          {renderButtonGroup()}
        </VStack>
      </VStack>
    </Box>
  );
}

const Header = () => {
  const { layout } = useLayout();
  const { progress, titleOpacity } = useSharedValues({
    progress: 0,
    titleOpacity: 0,
  });

  const containerUas = useAnimatedStyle(() => {
    return {
      width: interpolate(
        progress.value,
        [0, 1],
        [0, layout.value.resultHeaderWidth]
      ),
      opacity: interpolate(progress.value, [0, 1], [0, 1]),
    };
  }, []);

  const titleStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
    };
  }, []);

  useEffect(function enterAnimation() {
    progress.value = withTiming(1, { easing: Easing.inOut(Easing.quad) });
    titleOpacity.value = withDelay(
      300,
      withTiming(1, { easing: Easing.in(Easing.quad) })
    );
  }, []);

  return (
    <AnimatedBox
      className={'px-6 py-2'}
      style={[styles.container, containerUas]}>
      <AnimatedText
        className='text-2xl text-black font-orbitron-semibold'
        style={titleStyle}>
        Final Result
      </AnimatedText>
    </AnimatedBox>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(232, 255, 254, 0.7)',
  },
});
