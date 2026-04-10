/**
 * Lista estática de pratos disponíveis no cardápio.
 * Em produção, esses dados viriam de uma API REST.
 */
const pratos = [
  {
    id: 1,
    nome: 'Frango Grelhado',
    descricao:
      'Peito de frango grelhado com ervas finas, acompanha salada verde e arroz integral.',
    preco: 32.9,
    emoji: '🍗',
  },
  {
    id: 2,
    nome: 'Massa ao Molho Bolonhesa',
    descricao:
      'Espaguete al dente com molho bolonhesa caseiro feito com carne moída e tomates frescos.',
    preco: 28.5,
    emoji: '🍝',
  },
  {
    id: 3,
    nome: 'Salada Caesar',
    descricao:
      'Alface romana, croutons, parmesão ralado e molho caesar especial da casa.',
    preco: 22.0,
    emoji: '🥗',
  },
  {
    id: 4,
    nome: 'Pizza Margherita',
    descricao:
      'Molho de tomate artesanal, mussarela fresca e folhas de manjericão. Massa fina.',
    preco: 45.0,
    emoji: '🍕',
  },
  {
    id: 5,
    nome: 'Hambúrguer Artesanal',
    descricao:
      'Blend de carnes nobres, queijo cheddar, alface crocante, tomate e maionese especial.',
    preco: 39.9,
    emoji: '🍔',
  },
  {
    id: 6,
    nome: 'Salmão ao Limão Siciliano',
    descricao:
      'Filé de salmão grelhado com molho de limão siciliano, alcaparras e ervas frescas.',
    preco: 58.0,
    emoji: '🐟',
  },
];

export default pratos;
