//@ts-check

'use strict';

const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

/**@type {import('webpack').Configuration}*/
const config = {
  target: 'node',

  entry: './src/provider.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'provider.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]'
  },
  devtool: 'source-map',
  externals: {
    atom: 'atom',
    electron: 'electron'
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  },
  node: {
    __dirname: false
  },
  plugins: [
    new CopyPlugin([
      {
        from: './src/makensis-wine.sh',
        to: 'makensis-wine.sh'
      }
    ]),
  ],
};
module.exports = config;
