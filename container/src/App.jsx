import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';
import './styles/App.css';

/**
 * Importa os Micro Frontends via Module Federation.
 * React.lazy + Suspense permitem carregamento assíncrono e lazy loading
 * dos componentes remotos, exibindo um fallback enquanto carregam.
 */
const Cardapio = lazy(() => import('cardapio/Cardapio'));
const Pedido = lazy(() => import('pedido/Pedido'));

// ---------------------------------------------------------------------------
// Componente de fallback exibido enquanto um micro está sendo carregado
// ---------------------------------------------------------------------------
const Carregando = ({ nome }) => (
  <div className="app__loading">⏳ Carregando {nome}…</div>
);

// ---------------------------------------------------------------------------
// Error Boundary — captura erros de carregamento dos micros e exibe mensagem
// amigável, evitando que uma falha em um micro derrube o container inteiro.
// ---------------------------------------------------------------------------
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app__error">
          <p>❌ Erro ao carregar "{this.props.nome}".</p>
          <small>Verifique se o serviço está rodando na porta correta.</small>
        </div>
      );
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// Componente raiz da aplicação Container
// ---------------------------------------------------------------------------
const App = () => {
  /**
   * Contagem de itens no carrinho — atualizada via evento "pedidoAtualizado"
   * disparado pelo Micro Pedido sempre que seu estado muda.
   * Serve apenas para exibir o badge no botão flutuante (mobile).
   */
  const [carrinhoItens, setCarrinhoItens] = useState(0);

  // Ref para rolar suavemente até o painel do pedido ao clicar no FAB
  const pedidoRef = useRef(null);

  useEffect(() => {
    const handlePedidoAtualizado = (evento) => {
      setCarrinhoItens(evento.detail.total);
    };

    // Escuta o evento emitido pelo Micro Pedido com a contagem atualizada
    window.addEventListener('pedidoAtualizado', handlePedidoAtualizado);

    return () => {
      window.removeEventListener('pedidoAtualizado', handlePedidoAtualizado);
    };
  }, []);

  // Ao clicar no FAB, rola suavemente até a seção do pedido (mobile)
  const handleVerPedido = () => {
    pedidoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="app">
      {/* Cabeçalho global da aplicação */}
      <header className="app__header">
        <div className="app__header-brand">
          <h1 className="app__header-title">🍴 RestaurantApp</h1>
          <p className="app__header-subtitle">
            Sistema de pedidos · Micro Frontends com Webpack Module Federation
          </p>
        </div>
      </header>

      <main className="app__content">
        {/* Coluna principal: Micro Cardápio */}
        <section className="app__cardapio">
          <ErrorBoundary nome="Cardápio">
            <Suspense fallback={<Carregando nome="Cardápio" />}>
              <Cardapio />
            </Suspense>
          </ErrorBoundary>
        </section>

        {/* Coluna lateral: Micro Pedido (sticky no desktop; estático no mobile) */}
        <aside className="app__sidebar" ref={pedidoRef}>
          <ErrorBoundary nome="Pedido">
            <Suspense fallback={<Carregando nome="Pedido" />}>
              <Pedido />
            </Suspense>
          </ErrorBoundary>
        </aside>
      </main>

      {/*
        Botão flutuante do carrinho — exibido via CSS apenas no mobile.
        Ao clicar, rola a página até o painel do pedido.
      */}
      <button
        className="cart-fab"
        onClick={handleVerPedido}
        aria-label={`Ver pedido${carrinhoItens > 0 ? ` — ${carrinhoItens} itens` : ''}`}
      >
        🛒 Ver Pedido
        {carrinhoItens > 0 && (
          <span className="cart-fab__badge">{carrinhoItens}</span>
        )}
      </button>

      <footer className="app__footer">
        <p>Módulo 33 · EBAC — Micro Frontends com Webpack Module Federation</p>
      </footer>
    </div>
  );
};

export default App;
