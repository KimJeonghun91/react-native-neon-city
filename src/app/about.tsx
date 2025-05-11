import { MAIN_MENU_IMAGE } from '@assets';
import {
  AnimatedBox,
  Box,
  Button,
  Image,
  NeonButton,
  Text,
  VStack,
} from '@components';
import { useRouter } from 'expo-router';
import { Linking } from 'react-native';
import { Easing, FadeInDown } from 'react-native-reanimated';

export default function AboutScreen() {
  const router = useRouter();

  const credits: {
    role: string;
    name: string;
    link: string;
  }[] = [
    {
      role: 'Developer',
      name: 'Daehyeon Mun',
      link: 'x.com/DaehyeonMun',
    },
    {
      role: 'Designer',
      name: 'Woojae Lee',
      link: 'www.woojaelee.net',
    },
    {
      role: 'Special Thanks',
      name: 'Jamon holmgren',
      link: 'x.com/jamonholmgren',
    },
  ];

  return (
    <Box className='flex-1 justify-center items-center'>
      <VStack space={60}>
        {credits.map((credit, i) => (
          <AnimatedBox
            key={credit.role}
            entering={FadeInDown.delay(200 + i * 50)
              .duration(250)
              .easing(Easing.out(Easing.ease))
              .withInitialValues({
                transform: [
                  {
                    translateY: 16,
                  },
                ],
              })}>
            <VStack key={credit.role} justify='center' space={16}>
              <Text className='text-3xl font-orbitron-bold'>{credit.role}</Text>
              <Button onPress={() => Linking.openURL(`https://${credit.link}`)}>
                <VStack space={8}>
                  <Text className='text-lg'>{credit.name}</Text>
                  <Text className='text-lg'>{credit.link}</Text>
                </VStack>
              </Button>
            </VStack>
          </AnimatedBox>
        ))}
      </VStack>
      <NeonButton
        type='large'
        delay={350}
        style={{
          position: 'absolute',
          bottom: 90,
        }}
        onPress={() => router.dismissAll()}>
        <Image
          source={MAIN_MENU_IMAGE}
          style={{
            width: 160,
            height: '100%',
          }}
        />
      </NeonButton>
    </Box>
  );
}
