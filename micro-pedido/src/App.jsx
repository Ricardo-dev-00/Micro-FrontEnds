import React from 'react';
import Pedido from './components/Pedido';

/**
 * App standalone do Micro Pedido.
 * Usado para testar o micro de forma isolada (npm start dentro da pasta).
 * Para testar, dispatche manualmente eventos no console do navegador:
 *   window.dispatchEvent(new CustomEvent('adicionarAoPedido', {
 *     detail: { id: 1, nome: 'Teste', preco: 10.0, emoji: '🍕' }
 *   }));
 */
const App = () => {
  return (
    <div style={styles.wrapper}>
      <h1 style={styles.titulo}>Micro Pedido — Standalone</h1>
      <Pedido />
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: '480px',
    margin: '0 auto',
    padding: '24px',
  },
  titulo: {
    fontSize: '20px',
    color: '#555',
    marginBottom: '24px',
    paddingBottom: '12px',
    borderBottom: '2px dashed #ddd',
  },
};

export default App;
