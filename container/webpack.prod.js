/**
 * webpack.prod.js — Container App
 *
 * Configuração de produção para deploy no GitHub Pages.
 *
 * Variável de ambiente obrigatória:
 *   DEPLOY_URL  ex: https://seu-usuario.github.io/nome-do-repo
 *
 * O container ficará na raiz: <DEPLOY_URL>/
 * Os micros serão buscados em:
 *   <DEPLOY_URL>/cardapio/remoteEntry.js
 *   <DEPLOY_URL>/pedido/remoteEntry.js
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { dependencies } = require('./package.json');

const DEPLOY_URL = process.env.DEPLOY_URL || '';

module.exports = {
  entry: './src/index.js',
  mode: 'production',

  output: {
    publicPath: `${DEPLOY_URL}/`,
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
      name: 'container',

      // Aponta para os micros já buildados na mesma origem GH Pages
      remotes: {
        cardapio: `cardapio@${DEPLOY_URL}/cardapio/remoteEntry.js`,
        pedido: `pedido@${DEPLOY_URL}/pedido/remoteEntry.js`,
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
