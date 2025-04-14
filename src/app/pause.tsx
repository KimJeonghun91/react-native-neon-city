import {
  MENU_EXIT_IMAGE,
  MENU_RESTART_IMAGE,
  MENU_RESUME_IMAGE,
  PAUSE_TEXT,
} from '@assets';
import {
  AnimatedImage,
  BlurView,
  Box,
  Image,
  NeonButton,
  VStack,
} from '@components';
import { useGameStage } from '@hooks';
import { useLayout } from '@providers';
import { useAnimatedStyle } from 'react-native-reanimated';

export default function PauseScreen() {
  const { layout } = useLayout();
  const { replay, resume, stop } = useGameStage();

  const pauseTextUas = useAnimatedStyle(() => {
    const { windowHeight, pauseModalTitleHeight, pauseModalTitleWidth } =
      layout.value;
    return {
      width: pauseModalTitleWidth,
      height: pauseModalTitleHeight,
      marginTop: windowHeight * (80 / 740),
      marginBottom: windowHeight * (66 / 740),
    };
  }, []);

  const menu: {
    id: string;
    children: React.ReactNode;
    onPress: () => void;
  }[] = [
    {
      id: 'resume',
      children: <Image source={MENU_RESUME_IMAGE} />,
      onPress: resume,
    },
    {
      id: 'restart',
      children: <Image source={MENU_RESTART_IMAGE} />,
      onPress: replay,
    },
    {
      id: 'exit',
      children: <Image source={MENU_EXIT_IMAGE} />,
      onPress: stop,
    },
  ];

  return (
    <BlurView tint='dark' intensity={50} className='w-full h-full items-center'>
      <AnimatedImage source={PAUSE_TEXT} style={pauseTextUas} />
      <VStack space={60}>
        {menu.map((item) => {
          return (
            <NeonButton key={item.id} type='medium' onPress={item.onPress}>
              <Box
                style={{
                  width: 160,
                  height: '100%',
                }}>
                {item.children}
              </Box>
            </NeonButton>
          );
        })}
      </VStack>
    </BlurView>
  );
}
