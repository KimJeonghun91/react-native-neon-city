const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
// eslint-disable-next-line no-undef
const config = getDefaultConfig(__dirname);

/**
 * Set up for improving launch time by Shopify
 * https://shopify.engineering/improving-shopify-app-s-performance
 */
config.transformer = {
  ...config.transformer,
  getTransformOptions: () => ({
    transform: {
      // Set to true
      inlineRequires: true,
    },
  }),
};

module.exports = withNativeWind(config, { input: './global.css' });
