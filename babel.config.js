/* eslint-disable no-undef */
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['@babel/preset-env', 'module:metro-react-native-babel-preset'],
  };
};
