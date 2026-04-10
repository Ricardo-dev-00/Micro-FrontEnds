import React, { useState, useEffect } from 'react';
import ItemPedido from './ItemPedido';
import '../styles/pedido.css';

/**
 * Pedido
 * Componente principal do Micro Pedido.
 *
 * Escuta o evento customizado "adicionarAoPedido" disparado pelo Micro Cardápio
 * e mantém o estado local dos itens selecionados.
 *
 * Comunicação via window events:
 *   - RECEBE "adicionarAoPedido"  → adiciona/incrementa item
 *   - EMITE  "pedidoAtualizado"   → informa o container da contagem atual
 *                                   (usado para atualizar o badge do FAB mobile)
 */
const Pedido = () => {
  // Estado da lista de itens do pedido (inclui quantidade por item)
  const [itensPedido, setItensPedido] = useState([]);

  useEffect(() => {
    /**
     * Ao receber o evento, verifica se o prato já está no pedido:
     * - Se sim: incrementa a quantidade
     * - Se não: adiciona o item com quantidade = 1
     */
    const handleAdicionarItem = (evento) => {
      const prato = evento.detail;

      setItensPedido((itensAtuais) => {
        const itemExistente = itensAtuais.find((item) => item.id === prato.id);

        if (itemExistente) {
          return itensAtuais.map((item) =>
            item.id === prato.id
              ? { ...item, quantidade: item.quantidade + 1 }
              : item
          );
        }

        return [...itensAtuais, { ...prato, quantidade: 1 }];
      });
    };

    window.addEventListener('adicionarAoPedido', handleAdicionarItem);

    return () => {
      window.removeEventListener('adicionarAoPedido', handleAdicionarItem);
    };
  }, []);

  /**
   * Emite o evento "pedidoAtualizado" sempre que a lista de itens muda.
   * O container escuta este evento para atualizar o badge do botão FAB (mobile).
   */
  useEffect(() => {
    const total = itensPedido.reduce((acc, item) => acc + item.quantidade, 0);

    window.dispatchEvent(
      new CustomEvent('pedidoAtualizado', { detail: { total } })
    );
  }, [itensPedido]);

  // Remove um item completamente do pedido pelo id
  const handleRemoverItem = (id) => {
    setItensPedido((itensAtuais) =>
      itensAtuais.filter((item) => item.id !== id)
    );
  };

  // Zera o pedido inteiro
  const handleLimparPedido = () => {
    setItensPedido([]);
  };

  // Quantidade total de itens (soma das quantidades)
  const quantidadeTotal = itensPedido.reduce(
    (acc, item) => acc + item.quantidade,
    0
  );

  // Valor total do pedido
  const total = itensPedido.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );

  return (
    <div className="pedido">
      {/* Cabeçalho com título e badge de contagem */}
      <header className="pedido__cabecalho">
        <h2 className="pedido__titulo">
          🛒 Meu Pedido
          {quantidadeTotal > 0 && (
            <span className="pedido__badge" aria-label={`${quantidadeTotal} itens`}>
              {quantidadeTotal}
            </span>
          )}
        </h2>
      </header>

      {/* Estado vazio */}
      {itensPedido.length === 0 ? (
        <div className="pedido__vazio" role="status">
          <p className="pedido__vazio-mensagem">Nenhum item no pedido ainda.</p>
          <p className="pedido__vazio-dica">Escolha um prato no cardápio 👈</p>
        </div>
      ) : (
        <>
          {/* Lista de itens selecionados */}
          <div className="pedido__lista" role="list">
            {itensPedido.map((item) => (
              <ItemPedido
                key={item.id}
                item={item}
                onRemover={handleRemoverItem}
              />
            ))}
          </div>

          {/* Rodapé: total e ações */}
          <div className="pedido__rodape">
            <div className="pedido__total">
              <span className="pedido__total-label">Total</span>
              <span className="pedido__total-valor">R$ {total.toFixed(2)}</span>
            </div>

            <button className="pedido__btn-finalizar">
              ✅ Finalizar Pedido
            </button>

            <button className="pedido__btn-limpar" onClick={handleLimparPedido}>
              Limpar pedido
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Pedido;
