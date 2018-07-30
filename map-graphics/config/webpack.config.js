const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './main.js',
  watch: false,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 5000
  },
  output: {
    path: path.resolve(__dirname, '../build/'),
    filename: 'app.js',
    publicPath: '../build/'
  },
  module: {
    loaders: [
        {
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
                presets: ['react', 'es2015']
            }
        }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  stats: {
    colors: true
  }
};