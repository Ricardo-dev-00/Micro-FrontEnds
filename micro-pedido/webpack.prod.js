/**
 * webpack.prod.js — Micro Pedido
 *
 * Configuração de produção para deploy no GitHub Pages.
 *
 * Variável de ambiente obrigatória:
 *   DEPLOY_URL  ex: https://seu-usuario.github.io/nome-do-repo
 *
 * O micro ficará servido em: <DEPLOY_URL>/pedido/
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { dependencies } = require('./package.json');

const DEPLOY_URL = process.env.DEPLOY_URL || '';

module.exports = {
  entry: './src/index.js',
  mode: 'production',

  output: {
    publicPath: `${DEPLOY_URL}/pedido/`,
    path: require('path').resolve(__dirname, 'dist'),
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'pedido',
      filename: 'remoteEntry.js',
      exposes: {
        './Pedido': './src/components/Pedido',
      },
      shared: {
        react: { singleton: true, requiredVersion: dependencies.react },
        'react-dom': { singleton: true, requiredVersion: dependencies['react-dom'] },
      },
    }),

    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
