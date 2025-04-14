const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Find the rules for asset handling
  const fileLoaderRule = config.module.rules.find(rule => rule.loader && rule.loader.includes('file-loader'));
  
  if (fileLoaderRule) {
    // Add audio files to file-loader test
    fileLoaderRule.test = /\.(gif|jpe?g|png|svg|ttf|otf|woff|woff2|eot|wav|mp3|mp4|avi|ogg|webm|riv)$/;
  }

  // Add a rule to resolve Rive files from assets/rives
  config.resolve.alias = {
    ...config.resolve.alias,
    'assets/audios': path.resolve(__dirname, 'assets/audios'),
    'assets/rives': path.resolve(__dirname, 'assets/rives'),
  };

  return config;
};
