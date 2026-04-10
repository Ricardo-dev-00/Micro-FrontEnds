/**
 * Bootstrap do Container App.
 * Separado de index.js para viabilizar o carregamento assíncrono
 * necessário pelo Webpack Module Federation.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
