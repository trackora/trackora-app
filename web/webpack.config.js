const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appRoot = path.resolve(__dirname, '..');

module.exports = {
  entry: path.join(appRoot, 'index.web.tsx'),
  output: {
    path: path.join(appRoot, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
    clean: true,
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
    },
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.js',
      '.tsx',
      '.ts',
      '.js',
      '.jsx',
      '.json',
    ],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            envName: 'web',
          },
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ttf|otf|woff|woff2)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
    }),
  ],
  devServer: {
    static: path.join(appRoot, 'dist'),
    historyApiFallback: true,
    port: 3000,
    hot: true,
  },
};
