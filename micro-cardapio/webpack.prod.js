/**
 * webpack.prod.js — Micro Cardápio
 *
 * Configuração de produção para deploy no GitHub Pages.
 *
 * Variável de ambiente obrigatória:
 *   DEPLOY_URL  URL base do GitHub Pages, ex:
 *               https://seu-usuario.github.io/nome-do-repo
 *
 * O Webpack substitui process.env.DEPLOY_URL em tempo de build.
 * O publicPath aponta para a subpasta /cardapio/ dentro do site GH Pages.
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { dependencies } = require('./package.json');

const DEPLOY_URL = process.env.DEPLOY_URL || '';

module.exports = {
  entry: './src/index.js',
  mode: 'production',

  output: {
    // Este micro ficará em: <DEPLOY_URL>/cardapio/
    publicPath: `${DEPLOY_URL}/cardapio/`,
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
      name: 'cardapio',
      filename: 'remoteEntry.js',
      exposes: {
        './Cardapio': './src/components/Cardapio',
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
