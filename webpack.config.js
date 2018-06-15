module.exports = {
  entry: './src/main.js',
  mode: 'production',
  output: {
    filename: 'wirelang.js',
    path: __dirname
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              require.resolve('babel-preset-env')
            ]
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              minimize: { preset: 'default' }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'compressed',
              sourceMap: false
            }
          }
        ]
      }
    ]
  }
}
