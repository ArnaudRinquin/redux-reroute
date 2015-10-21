module.exports = {
  entry: {
    bundle: [
      './index.js',
    ],
  },
  output: {
    path: 'dist',
    filename: '[name].js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel'],
      },
    ],
  },
};
