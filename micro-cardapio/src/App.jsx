import React from 'react';
import Cardapio from './components/Cardapio';

/**
 * App standalone do Micro Cardápio.
 * Usado apenas para testar o micro de forma isolada (npm start dentro da pasta).
 * No ambiente integrado, o container importa <Cardapio /> diretamente.
 */
const App = () => {
  return (
    <div style={styles.wrapper}>
      <h1 style={styles.titulo}>Micro Cardápio — Standalone</h1>
      <Cardapio />
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: '800px',
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
