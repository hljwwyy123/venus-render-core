const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'lib'),
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.ts|\.js$/,
        // exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          fix: true,
          emitError: true,
          emitWarning: true,
          failOnError: true,
          failOnWarning: true
        },
      },
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    alias: {
      'aseat-core':path.resolve(__dirname, 'src/index'),
      'aseat-canvas-grid-layer':path.resolve(__dirname, 'src/layer/grid/CanvasGridLayer'),
      'aseat-canvas-layer':path.resolve(__dirname, 'src/layer/CanvasLayer'),
      'aseat-svg-layer':path.resolve(__dirname, 'src/layer/SvgLayer'),
      'aseat-html-layer':path.resolve(__dirname, 'src/layer/HtmlLayer'),
      '@': path.resolve(__dirname, 'src'),
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
  // mode: 'development'
  mode: 'production'
};
