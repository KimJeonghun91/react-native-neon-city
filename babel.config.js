module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    env: {},
    plugins: [
      'react-native-reanimated/plugin', // NOTE: this plugin MUST be last
    ],
  };
};
