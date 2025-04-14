import { FC } from 'react';
import {
  ImageBackground as ExpoImageBackground,
  ImageBackgroundProps as ExpoImageBackgroundProps,
} from 'expo-image';

export const ImageBackground: FC<ExpoImageBackgroundProps> = ({ ...props }) => {
  return <ExpoImageBackground className='w-full h-full' {...props} />;
};
