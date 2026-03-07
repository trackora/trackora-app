// module.exports = {
//   presets: ['module:metro-react-native-babel-preset','module:@react-native/babel-preset'],
//   plugins: [
//     'react-native-reanimated/plugin',
//   ],
// };

module.exports = function (api) {
  api.cache(true);

  const isWeb = process.env.PLATFORM === 'web';

  return {
    presets: isWeb
      ? [
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/preset-typescript',
        ]
      : ['module:metro-react-native-babel-preset'],

    plugins: [
      // RN-only plugin
      !isWeb && 'react-native-reanimated/plugin',
    ].filter(Boolean),
  };
};
