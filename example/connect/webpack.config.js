const path = require('node:path')
const TerserPlugin = require('terser-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const JavaScriptObfuscator = require('webpack-obfuscator')

module.exports = {
  target: 'node',
  entry: ['babel-polyfill', path.resolve(__dirname, '', 'src/main.js')],
  output: {
    path: path.resolve(__dirname, ''),
    filename: 'bundle.js',
  },
  stats: {
    errorDetails: false,
  },
  node: {
    __dirname: false,
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts', '.json', '.html'],
    modules: [path.resolve('.'), path.resolve('node_modules')],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.node$/,
        use: [
          {
            loader: 'node-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },
  externals: [nodeExternals()],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
  plugins: [
    ...(process.env.NODE_ENV === 'production'
      ? [
          new JavaScriptObfuscator(
            {
              rotateStringArray: true,
            },
            [],
          ),
        ]
      : []),
  ],
}
