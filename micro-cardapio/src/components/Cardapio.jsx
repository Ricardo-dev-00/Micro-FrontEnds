import React from 'react';
import PratoItem from './PratoItem';
import pratos from '../data/pratos';
import '../styles/cardapio.css';

/**
 * Cardapio
 * Componente principal do Micro Cardápio.
 *
 * Renderiza a lista de pratos e, ao clicar em "Adicionar",
 * dispara um CustomEvent global para comunicação com o Micro Pedido.
 *
 * Comunicação entre micros via window.dispatchEvent:
 *   - Evento: "adicionarAoPedido"
 *   - Detalhe: objeto com os dados do prato selecionado
 */
const Cardapio = () => {
  /**
   * Dispara um evento customizado no objeto window.
   * O Micro Pedido escuta esse evento e atualiza seu estado interno.
   */
  const handleAdicionar = (prato) => {
    const evento = new CustomEvent('adicionarAoPedido', {
      detail: prato,
      bubbles: true,
    });
    window.dispatchEvent(evento);
  };

  return (
    <section className="cardapio">
      <header className="cardapio__cabecalho">
        <h2 className="cardapio__titulo">🍽️ Cardápio</h2>
        <p className="cardapio__subtitulo">
          {pratos.length} pratos disponíveis — escolha seus favoritos
        </p>
      </header>

      {/* Grade de pratos — 2 colunas no desktop, 1 no mobile (via CSS) */}
      <div className="cardapio__lista" role="list">
        {pratos.map((prato) => (
          <PratoItem
            key={prato.id}
            prato={prato}
            onAdicionar={handleAdicionar}
          />
        ))}
      </div>
    </section>
  );
};

export default Cardapio;
