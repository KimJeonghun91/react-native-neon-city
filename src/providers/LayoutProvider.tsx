import { BACKGROUND_IMAGE, SCRIM_MAIN_IMAGE } from '@assets';
import { AnimatedBox, Box, Image, ImageBackground } from '@components';
import { TABLET_MAX_WIDTH } from '@configs';
import { useAnimation, useGameState } from '@hooks';
import { StatusBar } from 'expo-status-bar';
import React, {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import {
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { debounce } from 'react-native-worklet-functions';

type Layouts = {
  windowWidth: number;
  windowHeight: number;
  stageWidth: number;
  stageHeight: number;
  cubeWidth: number;
  cubeHeight: number;
  logoWidth: number;
  logoHeight: number;
  playPauseBtnWidth: number;
  playPauseBtnHeight: number;
  timerWidth: number;
  timerHeight: number;
  timerGaugeWidth: number;
  timerGaugeHeight: number;
  homeNavigationBtnHeight: number;
  homeNavigationBtnWidth: number;
  comingSoonGuideWidth: number;
  comingSoonGuideHeight: number;
  countDownRiveWidth: number;
  countDownRiveHeight: number;
  menuBtnWidth: number;
  menuBtnHeight: number;
  menuBtnHolderWidth: number;
  menuBtnHolderHeight: number;
  effectRectWidth: number;
  effectRectHeight: number;
  pauseModalTitleWidth: number;
  pauseModalTitleHeight: number;
  resultHeaderWidth: number;
  resultHeaderHeight: number;
  resultInfoSectionWidth: number;
  resultInfoSectionHeight: number;
  resultAboveNavBtnWidth: number;
  resultAboveNavBtnHeight: number;
  neonButtonWidthFull: number;
  neonButtonHeightFull: number;
  neonButtonHeightMedium: number;
  neonButtonWidthMedium: number;
  neonButtonHeightSmall: number;
  neonButtonWidthSmall: number;
  rankingBackBtnWidth: number;
  rankingBackBtnHeight: number;
  rankingInfoSectionWidth: number;
  rankingInfoSectionHeight: number;
  feedbackRiveWidth: number;
  feedbackRiveHeight: number;
  targetRiveWidth: number;
  targetRiveHeight: number;
  itemRiveWidth: number;
  itemRiveHeight: number;
  playScreenFooterWidth: number;
  playScreenFooterHeight: number;
  gameOverWidth: number;
  gameOverHeight: number;
};

export type ILayoutContext = {
  layout: SharedValue<Layouts>;
};

export const LayoutContext = createContext<ILayoutContext | null>(null);

export const LayoutProvider: FC<PropsWithChildren> = ({ children }) => {
  const { animation } = useAnimation();
  const { gameStatus } = useGameState();

  // * Layout
  const window_ = useSharedValue<ScaledSize>(Dimensions.get('window'));
  const layout = useDerivedValue<Layouts>(() => {
    const windowWidth = window_.value.width;
    const windowHeight = window_.value.height;
    const stageWidth = Math.min(windowWidth, TABLET_MAX_WIDTH);
    const stageHeight = windowHeight;
    const cubeHeight = windowHeight * (360 / 740);
    const cubeWidth = cubeHeight;
    const gameOverHeight = windowHeight * (360 / 740);
    const gameOverWidth = gameOverHeight;
    const logoHeight = windowHeight * (360 / 740);
    const logoWidth = logoHeight;
    const targetRiveHeight = windowHeight * (360 / 740);
    const targetRiveWidth = targetRiveHeight;
    const timerHeight = windowHeight * (60 / 740);
    const timerWidth = timerHeight * (280 / 60);
    const timerGaugeHeight = windowHeight * (10 / 740);
    const timerGaugeWidth = timerGaugeHeight * (232 / 10);
    const playPauseBtnHeight = timerHeight;
    const playPauseBtnWidth = playPauseBtnHeight * (60 / 60);
    const homeNavigationBtnHeight = windowHeight * (80 / 740);
    const homeNavigationBtnWidth = homeNavigationBtnHeight * (280 / 80);
    const comingSoonGuideHeight = windowHeight * (19.01 / 740);
    const comingSoonGuideWidth = comingSoonGuideHeight * (220 / 19.01);
    const countDownRiveHeight = windowHeight * (360 / 740);
    const countDownRiveWidth = countDownRiveHeight;
    const menuBtnHeight = windowHeight * (48.5 / 740);
    const menuBtnWidth = menuBtnHeight * (220.5 / 48.5);
    const menuBtnHolderHeight = windowHeight * (19.49 / 740);
    const menuBtnHolderWidth = menuBtnHolderHeight * (69.21 / 19.49);
    const effectRectWidth = menuBtnWidth / 7;
    const effectRectHeight = menuBtnHeight * 1.4;
    const pauseModalTitleHeight = windowHeight * (80 / 740);
    const pauseModalTitleWidth = pauseModalTitleHeight * (360 / 80);
    const resultHeaderHeight = windowHeight * (40 / 740);
    const resultHeaderWidth = resultHeaderHeight * (278 / 40);
    const resultInfoSectionHeight = windowHeight * (220 / 740);
    const resultInfoSectionWidth = resultInfoSectionHeight * (196 / 220);
    const resultAboveNavBtnHeight = windowHeight * (40 / 740);
    const resultAboveNavBtnWidth = resultAboveNavBtnHeight * (132 / 40);

    const neonButtonHeightFull = windowHeight * (40 / 740);
    const neonButtonWidthFull = neonButtonHeightFull * (294 / 40);
    const neonButtonHeightMedium = windowHeight * (40 / 740);
    const neonButtonWidthMedium =
      neonButtonHeightMedium * ((294 + 132) / 2 / 40);
    const neonButtonHeightSmall = windowHeight * (40 / 740);
    const neonButtonWidthSmall = neonButtonHeightSmall * (132 / 40);

    const rankingBackBtnHeight = windowHeight * (60 / 740);
    const rankingBackBtnWidth = rankingBackBtnHeight * (80 / 60);
    const rankingInfoSectionHeight = windowHeight * (192 / 740);
    const rankingInfoSectionWidth = rankingInfoSectionHeight * (196 / 192);
    const feedbackRiveWidth = windowHeight * (360 / 740);
    const feedbackRiveHeight = feedbackRiveWidth;
    const playScreenFooterHeight = windowHeight * (180 / 740);
    const playScreenFooterWidth = stageWidth;
    const itemRiveWidth = playScreenFooterHeight * ((120 - 20) / 180);
    const itemRiveHeight = itemRiveWidth * (180 / (120 - 20));
    return {
      windowWidth,
      windowHeight,
      stageWidth,
      stageHeight,
      cubeWidth,
      cubeHeight,
      logoWidth,
      logoHeight,
      homeNavigationBtnHeight,
      homeNavigationBtnWidth,
      comingSoonGuideHeight,
      comingSoonGuideWidth,
      countDownRiveHeight,
      countDownRiveWidth,
      menuBtnWidth,
      menuBtnHeight,
      menuBtnHolderWidth,
      menuBtnHolderHeight,
      effectRectWidth,
      effectRectHeight,
      pauseModalTitleHeight,
      pauseModalTitleWidth,
      resultHeaderHeight,
      resultHeaderWidth,
      resultInfoSectionHeight,
      resultInfoSectionWidth,
      resultAboveNavBtnHeight,
      resultAboveNavBtnWidth,
      playPauseBtnHeight,
      playPauseBtnWidth,
      timerGaugeHeight,
      timerGaugeWidth,
      timerHeight,
      timerWidth,
      rankingBackBtnHeight,
      rankingBackBtnWidth,
      rankingInfoSectionHeight,
      rankingInfoSectionWidth,
      feedbackRiveWidth,
      feedbackRiveHeight,
      targetRiveWidth,
      targetRiveHeight,
      playScreenFooterHeight,
      playScreenFooterWidth,
      itemRiveWidth,
      itemRiveHeight,
      gameOverWidth,
      gameOverHeight,
      neonButtonHeightFull,
      neonButtonWidthFull,
      neonButtonHeightMedium,
      neonButtonWidthMedium,
      neonButtonHeightSmall,
      neonButtonWidthSmall,
    };
  }, []);

  const values = useMemo<ILayoutContext>(() => {
    return {
      layout,
    };
  }, []);

  useEffect(
    function onChangeLayout() {
      const subs = Dimensions.addEventListener('change', ({ window }) => {
        debounce(() => {
          window_.value = window;
        }, 50);
      });
      return () => {
        subs.remove();
      };
    },
    [window]
  );

  // * Visual
  const visualProgress = useSharedValue(0);

  const scrimStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(visualProgress.value, [0, 1], [1, 0]),
    };
  }, []);

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(visualProgress.value, [0, 1], [0, 0.35]),
    };
  }, []);

  const showVisual = () => {
    'worklet';
    visualProgress.value = withTiming(1);
  };

  const hideVisual = () => {
    'worklet';
    visualProgress.value = withTiming(0);
  };

  const renderScrim = () => {
    return (
      <AnimatedBox
        className='absolute w-full h-full pointer-events-none z-10'
        style={scrimStyle}>
        <Image source={SCRIM_MAIN_IMAGE} />
      </AnimatedBox>
    );
  };

  const renderOverlay = () => {
    return (
      <AnimatedBox
        className='absolute w-full h-full pointer-events-none z-20'
        style={[
          {
            backgroundColor: '#0f1319',
          },
          overlayStyle,
        ]}
      />
    );
  };

  useAnimatedReaction(
    () => animation.value,
    (animation) => {
      if (animation === 'press-play-button') {
        showVisual();
        return;
      }
    },
    []
  );

  useAnimatedReaction(
    () => gameStatus.value,
    (status) => {
      if (status === 'idle' || status === 'finished') {
        hideVisual();
        return;
      }
      if (status === 'ready') {
        showVisual();
      }
    },
    [hideVisual]
  );

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <LayoutContext.Provider value={values}>
        <ImageBackground
          source={BACKGROUND_IMAGE}
          contentFit='cover'
          style={{
            width: '100%',
            height: '100%',
          }}
          cachePolicy={'memory-disk'}
          priority={'high'}>
          {renderScrim()}
          {renderOverlay()}
          <Box className='w-full h-full overflow-hidden z-30'>
            <StatusBar style='auto' hidden />
            {children}
          </Box>
        </ImageBackground>
      </LayoutContext.Provider>
    </SafeAreaProvider>
  );
};

export const useLayout = () => {
  const ctx = useContext(LayoutContext);
  if (!ctx) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return ctx;
};
