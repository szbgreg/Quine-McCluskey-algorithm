const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
  const isProduction = env.production ? 'production' : 'development';

  const CSSExtract = new MiniCssExtractPlugin({
    filename: 'dist/css/[name].css',
    chunkFilename: 'dist/css/[contenthash].css',
  });

  return {
    mode: isProduction,
    entry: ['./src/index.js'],
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'dist/js/main.js',
      clean: false,
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimize: isProduction === 'production' ? true : false,
    },
    plugins: [CSSExtract],
    devtool: isProduction === 'production' ? false : 'inline-source-map',
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 8080,
      historyApiFallback: true,
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  };
};
