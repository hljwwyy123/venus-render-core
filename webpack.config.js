const path = require('path');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 获取entry
const dir = './demo';
const files = fs.readdirSync(dir);

const filesArr = files.map(d => ({[d]: `${dir}/${d}`}));

let entries = { }

filesArr.forEach(d => {
  entries = {...entries, ...d}
});

module.exports = {
  entry: entries,
  devServer: {
    inline: true,
    host: '0.0.0.0',
  },
  module: {
    rules: [
      {
        test: /\.ts|\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
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
      '@': path.resolve(__dirname, 'src'),
      'aseat-core':path.resolve(__dirname, 'src/index'),
      'aseat-canvas-grid-layer':path.resolve(__dirname, 'src/layer/grid/CanvasGridLayer'),
      'aseat-canvas-layer':path.resolve(__dirname, 'src/layer/CanvasLayer'),
      'aseat-svg-layer':path.resolve(__dirname, 'src/layer/SvgLayer'),
      'aseat-html-layer':path.resolve(__dirname, 'src/layer/HtmlLayer'),
    }
  },
  output: {
    publicPath: '/dist/',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
  mode: 'development'
};
