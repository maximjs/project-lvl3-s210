// import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default () => ({
  entry: './src/index.js',
  output: {
    library: 'WebpackPackage',
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              ['env', {
                modules: false,
                targets: {
                  browsers: '> 0%',
                  uglify: true,
                },
                useBuiltIns: true,
              }],
            ],

            plugins: [
              'syntax-dynamic-import',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.ejs',
      template: './src/index.html',
    }),
  ],
  // plugins: [
  //   new webpack.EnvironmentPlugin(['NODE_ENV']),
  // ],
});
