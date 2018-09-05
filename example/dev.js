'use strict';

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HOST = 'localhost';
const PORT = '8787';
const URI = `http://${HOST}:${PORT}/`;

const app = express();
const compiler = webpack({
  entry: path.resolve(__dirname, './src/entry.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js'
  },
  resolve: {
    extensions: ['.js', 'css', 'md'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['es2015', 'react', 'stage-0']
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.md$/,
        loader: [
          'babel-loader',
          path.resolve(__dirname, '../index.js'),
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, './index.html'),
      inject: 'body',
      chunksSortMode: 'dependency',
      minify: {
        removeComments: true,
        collapseWhitespace: false
      },
    }),
  ]
});
const devMiddleware = require('webpack-dev-middleware')(compiler, {
  quiet: true,
  heartbeat: 2000,
  log: false
});

app.use('/static', express.static(path.resolve(__dirname, './static')));
app.use(require('connect-history-api-fallback')());
app.use(devMiddleware);

app.listen(PORT);

console.log(`Uri: ${URI}`);
