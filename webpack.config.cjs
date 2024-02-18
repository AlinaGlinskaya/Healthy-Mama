const path = require('path');
const {DuplicatesPlugin} = require('inspectpack/plugin');

module.exports = {
  context: path.resolve(__dirname, 'assets/src'),
  mode: 'development',
  entry: {
    main: './js/main.js',
    vendor: './js/vendor.js',
  },
  devtool: 'source-map',
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'build/js'),
  },
  optimization: {
    minimize: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    ],
  },
  plugins: [
    new DuplicatesPlugin(),
  ],
};