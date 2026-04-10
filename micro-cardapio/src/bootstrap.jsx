/**
 * Bootstrap do Micro Cardápio.
 * Renderiza o App de forma standalone para testes independentes.
 * Separado de index.js para viabilizar o carregamento assíncrono.
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
