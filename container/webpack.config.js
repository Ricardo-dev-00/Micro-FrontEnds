const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

const { dependencies } = require('./package.json');

module.exports = {
  // Ponto de entrada da aplicação container
  entry: './src/index.js',

  mode: 'development',

  output: {
    // URL pública onde este app será servido (porta 3000)
    publicPath: 'http://localhost:3000/',
  },

  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
  },

  module: {
    rules: [
      {
        // Processa arquivos JS e JSX com Babel (suporte a JSX e ESNext)
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        // Processa arquivos CSS — style-loader injeta <style> no DOM;
        // css-loader resolve imports e url() dentro dos arquivos CSS
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

      // Registra os micros remotos e onde encontrar seus manifestos
      remotes: {
        cardapio: 'cardapio@http://localhost:3001/remoteEntry.js',
        pedido: 'pedido@http://localhost:3002/remoteEntry.js',
      },

      // Compartilhar React entre os micros evita instâncias duplicadas
      shared: {
        react: {
          singleton: true,
          requiredVersion: dependencies.react,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: dependencies['react-dom'],
        },
      },
    }),

    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
