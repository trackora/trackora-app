module.exports = function (api) {
  const isWeb = api.env('web');
  api.cache(true);

  return {
    presets: [
      isWeb
        ? 'module:@react-native/babel-preset'
        : 'module:metro-react-native-babel-preset',
    ],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};
