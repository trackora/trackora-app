const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
 
module.exports = {
  entry: path.resolve(__dirname, '../index.web.tsx'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
    },
    extensions: ['.web.js', '.web.tsx', '.js', '.jsx', '.tsx', '.ts', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        include: [
          path.resolve(__dirname, '../'),
          // Add any RN packages that need transpiling:
          // path.resolve(__dirname, '../node_modules/your-rn-package'),
        ],
        use: 'babel-loader',
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ttf|otf)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
    }),
  ],
  devServer: {
    static: path.resolve(__dirname, '../dist'),
    historyApiFallback: true,
    port: 3000,
  },
};