import 'react-native';
import '../../global.css';
import { Stack } from 'expo-router/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ReducedMotionConfig, ReduceMotion } from 'react-native-reanimated';
import { AssetProvider, AudioProvider, LayoutProvider } from '@providers';
import { SCREEN_TRANSITION } from '@configs';

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <ReducedMotionConfig mode={ReduceMotion.Never} />
      <AssetProvider>
        <AudioProvider>
          <LayoutProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'fade',
                animationDuration: SCREEN_TRANSITION,
                gestureEnabled: false,
                contentStyle: { backgroundColor: 'transparent' },
              }}>
              <Stack.Screen name='index' />
              <Stack.Screen name='play' />
              <Stack.Screen name='ranking' options={{ animation: 'none' }} />
              <Stack.Screen name='about' options={{ animation: 'none' }} />
              <Stack.Screen name='result' />
              <Stack.Screen
                name='pause'
                options={{ presentation: 'containedModal' }}
              />
            </Stack>
          </LayoutProvider>
        </AudioProvider>
      </AssetProvider>
    </GestureHandlerRootView>
  );
}
