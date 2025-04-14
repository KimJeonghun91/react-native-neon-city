import { Box, Button, Cube, Rankings, Stat, VStack } from '@components';
import { AudioTracks, useAudio } from '@providers';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getBestScore } from '@utils';

export default function RankingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { play } = useAudio();

  const renderHeader = () => {
    return (
      <Box
        className='w-full'
        style={{
          paddingTop: insets.top,
          paddingLeft: 16,
        }}>
        <Button
          onPressIn={() => play(AudioTracks.CLICK)}
          onPress={() => router.back()}>
          <Ionicons name='chevron-back' size={32} color='white' />
        </Button>
      </Box>
    );
  };

  return (
    <Box className='w-full h-full items-center'>
      <Cube />
      <VStack className='w-full h-full' space={24}>
        {renderHeader()}
        <VStack className='w-full h-full' space={54}>
          <VStack space={40}>
            <Stat label='Best Score' value={getBestScore()} />
            {/* Since we don't have a user, just show rank 1 */}
            <Stat label='Your Ranking' value={1} />
          </VStack>
          <Rankings />
        </VStack>
      </VStack>
    </Box>
  );
}
