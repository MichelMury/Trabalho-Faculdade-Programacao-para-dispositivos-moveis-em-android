export type Product = {
  id: string;
  name: string;
  category: 'Bodies' | 'Conjuntos' | 'Vestidos';
  priceCents: number;
  color: string;
  sizes: string[];
  description: string;
};

// Dados de demonstração. Substituir pelas peças, tamanhos e preços reais da loja.
export const products: Product[] = [
  { id: 'body-rosa', name: 'Body carinho rosa', category: 'Bodies', priceCents: 3990, color: '#E9B5C5', sizes: ['P', 'M', 'G'], description: 'Body infantil em uma proposta delicada para o dia a dia.' },
  { id: 'conjunto-menta', name: 'Conjunto doce menta', category: 'Conjuntos', priceCents: 7990, color: '#B8DAD0', sizes: ['P', 'M', 'G'], description: 'Conjunto infantil com blusa e short.' },
  { id: 'vestido-lilas', name: 'Vestido jardim lilás', category: 'Vestidos', priceCents: 8990, color: '#D6C2E5', sizes: ['1', '2', '3'], description: 'Vestido infantil com saia rodada.' },
  { id: 'body-pessego', name: 'Body abraço pêssego', category: 'Bodies', priceCents: 4290, color: '#E8BC96', sizes: ['P', 'M', 'G'], description: 'Body infantil em tom pêssego.' },
];

export function formatMoney(cents: number) {
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
}
