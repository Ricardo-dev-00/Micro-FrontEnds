# 🍴 RestaurantApp — Micro Frontends

Aplicação de pedidos de restaurante construída com **Micro Frontends** usando **Webpack Module Federation** e **React**.

> 🌐 **Deploy:** [https://ricardo-dev-00.github.io/Micro-FrontEnds](https://ricardo-dev-00.github.io/Micro-FrontEnds)

---

## Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Rodar Localmente](#como-rodar-localmente)
- [Como Funciona a Comunicação entre os Micros](#como-funciona-a-comunicação-entre-os-micros)
- [Como Funciona o Module Federation](#como-funciona-o-module-federation)
- [Deploy no GitHub Pages](#deploy-no-github-pages)

---

## Visão Geral

O sistema é dividido em **três aplicações independentes**:

| Aplicação | Porta (dev) | Responsabilidade |
|---|---|---|
| `container` | 3000 | Aplicação principal — importa e exibe os micros |
| `micro-cardapio` | 3001 | Lista os pratos disponíveis para pedido |
| `micro-pedido` | 3002 | Exibe e gerencia os itens selecionados |

Cada micro pode ser desenvolvido, testado e buildado de forma **completamente independente**. O container os integra em tempo de execução via Module Federation — sem precisar recompilar nada quando um micro é atualizado.

---

## Tecnologias

- **React 18** — UI dos micros e do container
- **Webpack 5** — bundler com suporte nativo a Module Federation
- **Webpack Module Federation** — integração dos micros em runtime
- **Babel** — transpilação de JSX e ESNext
- **CSS puro** — layout responsivo com media queries (sem dependências externas)
- **GitHub Pages** — deploy estático da aplicação

---

## Estrutura do Projeto

```
modulo-33/
│
├── container/                  # App principal (porta 3000)
│   ├── src/
│   │   ├── index.js            # Ponto de entrada (async import)
│   │   ├── bootstrap.jsx       # Inicialização do React
│   │   ├── App.jsx             # Layout + lazy load dos micros
│   │   └── styles/App.css      # Estilos responsivos do container
│   ├── public/index.html
│   ├── webpack.config.js       # Config de desenvolvimento
│   └── webpack.prod.js         # Config de produção (GitHub Pages)
│
├── micro-cardapio/             # Micro do Cardápio (porta 3001)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Cardapio.jsx    # Lista de pratos + dispara eventos
│   │   │   └── PratoItem.jsx   # Card reutilizável de cada prato
│   │   ├── data/pratos.js      # Lista estática de pratos
│   │   └── styles/cardapio.css
│   ├── webpack.config.js
│   └── webpack.prod.js
│
├── micro-pedido/               # Micro do Pedido (porta 3002)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Pedido.jsx      # Painel do pedido + escuta eventos
│   │   │   └── ItemPedido.jsx  # Item reutilizável do pedido
│   │   └── styles/pedido.css
│   ├── webpack.config.js
│   └── webpack.prod.js
│
├── docs/                       # Build de produção (servido pelo GitHub Pages)
├── build-gh-pages.js           # Script de build para deploy
└── package.json                # Scripts raiz
```

---

## Como Rodar Localmente

### Pré-requisitos

- Node.js 18+
- npm 9+

### 1. Instale as dependências dos três projetos

```bash
npm run install:all
```

Ou manualmente:

```bash
npm install --prefix micro-cardapio
npm install --prefix micro-pedido
npm install --prefix container
```

### 2. Inicie cada micro em um terminal separado

**Terminal 1 — Micro Cardápio (porta 3001):**
```bash
cd micro-cardapio
npm start
```

**Terminal 2 — Micro Pedido (porta 3002):**
```bash
cd micro-pedido
npm start
```

**Terminal 3 — Container (porta 3000):**
```bash
cd container
npm start
```

> ⚠️ Os micros (`3001` e `3002`) devem ser iniciados **antes** do container (`3000`), pois ele tenta buscar os `remoteEntry.js` ao iniciar.

### 3. Acesse

```
http://localhost:3000
```

### Testando um micro de forma isolada

Cada micro possui seu próprio `App.jsx` standalone.  
Acesse `http://localhost:3001` para o Cardápio ou `http://localhost:3002` para o Pedido.

Para simular a adição de um item no Micro Pedido standalone, abra o console do navegador e execute:

```js
window.dispatchEvent(new CustomEvent('adicionarAoPedido', {
  detail: { id: 1, nome: 'Teste', preco: 10.0, emoji: '🍕' }
}));
```

---

## Como Funciona a Comunicação entre os Micros

Os micros são **completamente desacoplados** — não compartilham store, contexto React nem props. A comunicação é feita via **CustomEvents nativos do browser** disparados no objeto `window`.

### Fluxo completo

```
Usuário clica em "Adicionar ao pedido"
         │
         ▼
[Micro Cardápio] — Cardapio.jsx
  window.dispatchEvent(
    new CustomEvent('adicionarAoPedido', { detail: prato })
  )
         │
         │   (evento viaja pelo window — sem dependência direta)
         │
         ▼
[Micro Pedido] — Pedido.jsx
  window.addEventListener('adicionarAoPedido', (e) => {
    // adiciona ou incrementa o item no estado local
    setItensPedido(...)
  })
         │
         ▼
  window.dispatchEvent(
    new CustomEvent('pedidoAtualizado', { detail: { total } })
  )
         │
         ▼
[Container] — App.jsx
  window.addEventListener('pedidoAtualizado', (e) => {
    // atualiza o badge do botão flutuante no mobile
    setCarrinhoItens(e.detail.total)
  })
```

### Por que CustomEvents?

- São **nativos do browser** — sem bibliotecas externas
- Funcionam entre micros em **origens/bundles diferentes**
- São **fáceis de testar** via console
- Mantêm o **desacoplamento real** entre as aplicações

---

## Como Funciona o Module Federation

O **Webpack Module Federation** permite que um bundle JavaScript carregue código de outro bundle **em tempo de execução**, sem rebuild.

### Papéis

| Conceito | Quem é | O que faz |
|---|---|---|
| **Host** | `container` | Consome módulos remotos |
| **Remote** | `micro-cardapio`, `micro-pedido` | Expõe módulos para consumo |

### Como o container importa os micros

```js
// container/webpack.config.js
remotes: {
  cardapio: 'cardapio@http://localhost:3001/remoteEntry.js',
  pedido:   'pedido@http://localhost:3002/remoteEntry.js',
}
```

```js
// container/src/App.jsx
const Cardapio = lazy(() => import('cardapio/Cardapio'));
const Pedido   = lazy(() => import('pedido/Pedido'));
```

O arquivo `remoteEntry.js` gerado por cada micro é o **manifesto** — informa ao container quais módulos estão disponíveis e onde estão os chunks.

### React compartilhado (singleton)

React é configurado como `singleton: true` nos três projetos, garantindo que apenas **uma instância do React** seja carregada, mesmo com múltiplos bundles. Isso evita erros de hooks e renderização.

```js
shared: {
  react:     { singleton: true, requiredVersion: '^18.2.0' },
  'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
}
```

---

## Deploy no GitHub Pages

### Como funciona

O GitHub Pages serve arquivos **estáticos**. O script `build-gh-pages.js` da raiz:

1. Recebe a URL do GitHub Pages como argumento
2. Builda os 3 projetos com `webpack.prod.js`, injetando a URL real nos `remotes` e no `publicPath`
3. Copia os artefatos para a pasta `docs/` com a estrutura:

```
docs/
├── index.html        ← container
├── main.js
├── cardapio/
│   └── remoteEntry.js  ← buscado pelo container em runtime
└── pedido/
    └── remoteEntry.js
```

### Como fazer um novo deploy

```bash
# 1. Gere o build de produção
node build-gh-pages.js https://Ricardo-dev-00.github.io/Micro-FrontEnds

# 2. Commite e envie
git add docs/
git commit -m "build: atualiza deploy"
git push
```

O GitHub Pages atualiza automaticamente em instantes após o push.

### Configuração no GitHub

> Repositório → **Settings** → **Pages**  
> Source: `Deploy from a branch` | Branch: `main` | Folder: `/docs`

---

## Módulo 33 — EBAC

Projeto desenvolvido como exercício prático do Módulo 33 do curso **Engenheiro Front-End** da EBAC, com foco em **Micro Frontends** e **Webpack Module Federation**.
