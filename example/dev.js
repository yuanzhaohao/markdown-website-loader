'use strict';

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HOST = 'localhost';
const PORT = '8787';
const URI = `http://${HOST}:${PORT}/`;

const app = express();

const createHappypackPlugin = () => {
  const os = require('os');
  const HappyPack = require('happypack');
  const threadPool = HappyPack.ThreadPool({ size: os.cpus().length });
  const createHappypack = (id, loaders) => {
    return new HappyPack({ id, loaders, threadPool });
  };

  return [
    createHappypack('js', [
      {
        path: 'babel-loader',
        query: {
          cacheDirectory: '.happypack_cache',
        },
      },
    ]),
    createHappypack('ts', [
      {
        path: 'ts-loader',
        query: {
          happyPackMode: true,
        },
      },
    ]),
    createHappypack('sass', [
      {
        loader: 'sass-loader',
        options: {
          data: "$icon-base-url: '//yuanzhaohao.github.io/dashkit-fonts';",
        },
      },
    ]),
    createHappypack('css', ['css-loader']),
  ];
};

const compiler = webpack({
  entry: path.resolve(__dirname, './src/entry.tsx'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json', '.css', '.scss', '.svg', '.md'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'happypack/loader?id=js',
        exclude: /node_modules/,
      },
      {
        test: /\.(ts|tsx)$/,
        loader: 'happypack/loader?id=ts',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        loader: ['style-loader', 'happypack/loader?id=css', 'happypack/loader?id=sass'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'happypack/loader?id=css'],
      },
      {
        test: /\.md$/,
        // test: /(en\-US)|(zh\-CN)\.md(\?.*)?$/,
        loader: [path.resolve(__dirname, '../index.js')],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, './index.html'),
      inject: 'body',
      chunksSortMode: 'dependency',
      minify: {
        removeComments: true,
        collapseWhitespace: false,
      },
    }),
    ...createHappypackPlugin(),
  ],
});
const devMiddleware = require('webpack-dev-middleware')(compiler, {
  quiet: true,
  heartbeat: 2000,
  log: false,
});

app.use('/static', express.static(path.resolve(__dirname, './static')));
app.use(require('connect-history-api-fallback')());
app.use(devMiddleware);

app.listen(PORT);

console.log(`Uri: ${URI}`);
