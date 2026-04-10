import React from 'react';

/**
 * PratoItem
 * Componente reutilizável que representa um único prato no cardápio.
 *
 * Props:
 *   prato       {object} — dados do prato (id, nome, descricao, preco, emoji)
 *   onAdicionar {func}   — callback chamado ao clicar em "Adicionar ao pedido"
 *
 * Os estilos responsivos estão em styles/cardapio.css (importado pelo Cardapio.jsx).
 */
const PratoItem = ({ prato, onAdicionar }) => {
  return (
    <article className="prato-item" role="listitem">
      {/* Ícone visual do prato */}
      <div className="prato-item__emoji" aria-hidden="true">
        {prato.emoji}
      </div>

      <div className="prato-item__info">
        <h3 className="prato-item__nome">{prato.nome}</h3>
        <p className="prato-item__descricao">{prato.descricao}</p>

        <div className="prato-item__rodape">
          <span className="prato-item__preco">R$ {prato.preco.toFixed(2)}</span>

          <button
            className="prato-item__botao"
            onClick={() => onAdicionar(prato)}
            aria-label={`Adicionar ${prato.nome} ao pedido`}
          >
            + Adicionar ao pedido
          </button>
        </div>
      </div>
    </article>
  );
};

export default PratoItem;
