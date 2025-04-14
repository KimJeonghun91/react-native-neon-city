import { ASSETS_IMAGES } from '@assets';
import { Asset } from 'expo-asset';
import { FC, PropsWithChildren } from 'react';
import { useDidMount } from 'rooks';

export const AssetProvider: FC<PropsWithChildren> = ({ children }) => {
  useDidMount(function load() {
    Promise.allSettled(ASSETS_IMAGES.map(Asset.loadAsync));
  });

  return children;
};
