import { FC, memo, useState } from 'react';
import { AnimatedText, Box, HStack, Image, Text, VStack } from './common';
import {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { TextStyle } from 'react-native';
import { useDidUpdate } from 'rooks';
import { useGameRankingValues } from '@hooks';
import { Game } from '@types';
import { FlashList } from '@shopify/flash-list';
import { PROFILE_IMAGE } from '@assets';

type ITab = 'Today' | 'Week' | 'All Time';

const TABS: { tab: ITab }[] = [
  {
    tab: 'Today',
  },
  {
    tab: 'Week',
  },
  {
    tab: 'All Time',
  },
];

export const Rankings = memo(() => {
  const [selectedTab, setSelectedTab] = useState<ITab>('Today');
  const { rankings } = useGameRankingValues();

  // NOTE: Ranking UI is just showing rankings without filtering. You can add filtering logic if needed.

  return (
    <VStack className='w-full h-full' space={28}>
      <Box className='w-full h-6'>
        <HStack>
          {TABS.map((tab) => (
            <Tab
              key={tab.tab}
              tab={tab.tab}
              isActive={tab.tab === selectedTab}
              onPress={() => setSelectedTab(tab.tab)}
            />
          ))}
        </HStack>
      </Box>
      <Box className='w-full h-full pr-6'>
        <FlashList
          data={rankings}
          estimatedItemSize={56}
          renderItem={({ item, index }) => <Rank rank={item} />}
          keyExtractor={(item) => item.userId + item.rank.toString()}
          ItemSeparatorComponent={() => <Box className='h-3' />}
          showsVerticalScrollIndicator={false}
        />
      </Box>
    </VStack>
  );
});

const Rank: FC<{
  rank: Game.Rank;
}> = ({ rank }) => {
  return (
    <Box
      className='px-4 py-2'
      style={{
        backgroundColor: 'rgba(232, 255, 254, 0.7)',
      }}>
      <HStack justify='space-between' align='center'>
        <HStack space={8} align='center'>
          <Box className='w-4 items-center'>
            <Text className='text-lg text-black/70 font-orbitron-medium'>
              {rank.rank}
            </Text>
          </Box>
          <HStack space={8}>
            <Box className='w-10 h-10 bg-[#D9D9D9] rounded-full overflow-hidden' >
              <Image source={PROFILE_IMAGE} className='w-full h-full' />
            </Box>
            <Text className='text-lg text-black/70 font-orbitron-medium'>
              {rank.userId}
            </Text>
          </HStack>
        </HStack>
        <Text className='text-xl text-black font-orbitron-semibold'>
          {rank.score}
        </Text>
      </HStack>
    </Box>
  );
};

type TabProps = {
  tab: string;
  isActive: boolean;
  onPress: (tab: string) => void;
};

const Tab: FC<TabProps> = ({ tab, isActive, onPress }) => {
  const progress = useSharedValue(isActive ? 1 : 0);
  const style = useAnimatedStyle<TextStyle>(() => {
    return {
      opacity: interpolate(progress.value, [0, 1], [0.5, 1]),
      fontSize: interpolate(progress.value, [0, 1], [12, 20]),
      lineHeight: interpolate(progress.value, [0, 1], [20, 24]),
    };
  }, []);

  useDidUpdate(() => {
    progress.value = withTiming(isActive ? 1 : 0, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
  }, [isActive]);

  return (
    <AnimatedText
      className='flex-1 font-semibold text-center'
      style={style}
      onPress={() => onPress(tab)}>
      {tab}
    </AnimatedText>
  );
};
