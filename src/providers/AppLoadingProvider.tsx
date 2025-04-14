import { AnimatedBox, Box } from '@components';
import { useSharedValues } from '@hooks';
import {
  Canvas,
  Fill,
  Group,
  Paragraph,
  Skia,
  TextAlign,
  Transforms3d,
  useFonts,
} from '@shopify/react-native-skia';
import { IS_WEB } from '@utils';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  Easing,
  FadeOut,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { add } from 'react-native-worklet-functions';
import { useDidMount, useDidUpdate } from 'rooks';
import { useLayout } from './LayoutProvider';

interface IAppLoadingContext {
  progress: SharedValue<number>;
  addProgress: (value: number) => void;
}

const AppLoadingContext = createContext<IAppLoadingContext | null>(null);

export const AppLoadingProvider: FC<PropsWithChildren> = ({ children }) => {
  const { progress, input } = useSharedValues({
    progress: 0,
    input: [] as number[],
  });

  const actions = useMemo<IAppLoadingContext>(() => {
    return {
      progress,
      addProgress: (value) => {
        'worklet';

        input.value = [...input.value, value];
        progress.value = withTiming(input.value.reduce(add, 0), {
          duration: 2500,
          easing: Easing.out(Easing.exp),
        });
      },
    };
  }, []);

  return (
    <AppLoadingContext.Provider value={actions}>
      {children}
    </AppLoadingContext.Provider>
  );
};

export const useAppLoading = () => {
  const context = useContext(AppLoadingContext);
  if (!context) {
    throw new Error('useAppLoading must be used within a AppLoadingProvider');
  }

  return context;
};

const LoadingProgress: FC = () => {
  const { progress } = useAppLoading();
  const { layout } = useLayout();

  const progressText = useDerivedValue(
    () => progress.value.toFixed(0),
    [progress.value]
  );

  const fontSize = useDerivedValue(
    () =>
      Math.min(layout.value.windowHeight / 7, layout.value.windowWidth - 20),
    []
  );

  const paraWidth = useDerivedValue(() => layout.value.windowWidth, []);

  const transform = useDerivedValue<Transforms3d>(() => {
    return [{ translateY: (layout.value.windowHeight - fontSize.value) / 2 }];
  }, []);

  const canvasUas = useAnimatedStyle(() => {
    return {
      width: layout.value.windowWidth,
      height: layout.value.windowHeight,
    };
  }, []);

  const customFontMgr = useFonts({
    OrbitronBold: [
      IS_WEB
        ? { default: require('../../assets/fonts/Orbitron-Bold.ttf') }
        : require('../../assets/fonts/Orbitron-Bold.ttf'),
    ],
  });

  const paragraph = useDerivedValue(() => {
    if (!customFontMgr) {
      return null;
    }

    const paragraphStyle = {
      textAlign: TextAlign.Center,
    };
    const textStyle = {
      color: Skia.Color('white'),
      fontFamilies: ['OrbitronBold'],
      fontSize: fontSize.value,
    };

    const para = Skia.ParagraphBuilder.Make(paragraphStyle, customFontMgr)
      .pushStyle(textStyle)
      .addText(progressText.value)
      .build();
    return para;
  }, [fontSize, customFontMgr]);

  return (
    <AnimatedBox
      exiting={FadeOut}
      style={[
        {
          position: 'absolute',
        },
        canvasUas,
      ]}>
      <Canvas className='w-full h-full'>
        <Fill color='black' />
        <Group layer='text' transform={transform}>
          <Paragraph paragraph={paragraph} x={0} y={0} width={paraWidth} />
        </Group>
      </Canvas>
    </AnimatedBox>
  );
};

type ILoadingMaskingTransitionProps = {
  onFinished: () => void;
};

const LoadingMaskingTransition: FC<ILoadingMaskingTransitionProps> = ({
  onFinished,
}) => {
  const { layout } = useLayout();

  const canvasUas = useAnimatedStyle(() => {
    return {
      width: layout.value.windowWidth,
      height: layout.value.windowHeight,
    };
  }, []);

  const radius = useSharedValue(0);
  const circle = useDerivedValue(() => {
    const centerX = layout.value.windowWidth / 2;
    const centerY = layout.value.windowHeight / 2;
    return Skia.Path.Make().addCircle(centerX, centerY, radius.value);
  }, []);

  useDidMount(function transition() {
    radius.value = withDelay(
      500,
      withTiming(
        Math.max(layout.value.windowWidth, layout.value.windowHeight),
        { duration: 1500, easing: Easing.inOut(Easing.ease) },
        (finished) => {
          if (finished) {
            runOnJS(onFinished)();
          }
        }
      )
    );
  });

  return (
    <AnimatedBox
      style={[
        {
          position: 'absolute',
        },
        canvasUas,
      ]}>
      <Canvas className='w-full h-full'>
        <Fill color='black' clip={circle} invertClip />
      </Canvas>
    </AnimatedBox>
  );
};

export enum AppLoadingState {
  LOADING,
  READY_VIEW,
  SCREEN_TRANSITION,
  FINISHED,
}

export const Loading: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<AppLoadingState>(AppLoadingState.LOADING);
  const { progress } = useAppLoading();

  const updateState = (state: AppLoadingState) => {
    setState(state);
  };

  useAnimatedReaction(
    () => progress.value,
    (progres) => {
      if (progres === 100) {
        runOnJS(updateState)(AppLoadingState.READY_VIEW);
      }
    },
    []
  );

  useDidUpdate(() => {
    if (state === AppLoadingState.READY_VIEW) {
      setTimeout(() => {
        updateState(AppLoadingState.SCREEN_TRANSITION);
      }, 300);
    }
  }, [state]);

  if (state === AppLoadingState.LOADING) {
    return <LoadingProgress />;
  }

  return (
    <Box className='flex-1'>
      {children}
      {state !== AppLoadingState.FINISHED && (
        <LoadingMaskingTransition
          onFinished={() => updateState(AppLoadingState.FINISHED)}
        />
      )}
    </Box>
  );
};
