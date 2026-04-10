const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

const { dependencies } = require('./package.json');

module.exports = {
  entry: './src/index.js',

  mode: 'development',

  output: {
    // URL pública onde este micro será servido (porta 3001)
    publicPath: 'http://localhost:3001/',
  },

  devServer: {
    port: 3001,
    historyApiFallback: true,
    hot: true,
    // Permite que o container (porta 3000) consuma este micro via CORS
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        // Processa arquivos CSS — permite importar .css nos componentes React
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
      // Nome único deste micro — deve coincidir com o prefixo usado no container
      name: 'cardapio',

      // Arquivo de manifesto que o container baixará para descobrir os módulos
      filename: 'remoteEntry.js',

      // Componentes expostos para consumo externo
      exposes: {
        './Cardapio': './src/components/Cardapio',
      },

      // Compartilha React com o container para evitar instâncias duplicadas
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
