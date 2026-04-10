import React from 'react';

/**
 * ItemPedido
 * Componente reutilizável que representa um único item dentro do pedido.
 *
 * Props:
 *   item      {object} — dados do item (id, nome, preco, emoji, quantidade)
 *   onRemover {func}   — callback chamado ao clicar no botão de remover
 *
 * Os estilos responsivos estão em styles/pedido.css (importado pelo Pedido.jsx).
 */
const ItemPedido = ({ item, onRemover }) => {
  // Calcula o subtotal deste item (preço × quantidade)
  const subtotal = (item.preco * item.quantidade).toFixed(2);

  return (
    <div className="item-pedido" role="listitem">
      {/* Emoji do prato */}
      <span className="item-pedido__emoji" aria-hidden="true">
        {item.emoji}
      </span>

      {/* Nome e subtotal */}
      <div className="item-pedido__info">
        <span className="item-pedido__nome">{item.nome}</span>
        <span className="item-pedido__subtotal">R$ {subtotal}</span>
      </div>

      {/* Quantidade e botão de remoção */}
      <div className="item-pedido__controles">
        <span className="item-pedido__quantidade">×{item.quantidade}</span>

        <button
          className="item-pedido__btn-remover"
          onClick={() => onRemover(item.id)}
          aria-label={`Remover ${item.nome} do pedido`}
          title="Remover item"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ItemPedido;
