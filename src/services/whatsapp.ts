import { Linking } from 'react-native';
import { formatMoney, type Product } from '../data/products';

export const STORE_WHATSAPP = '5521989670373';

export function buildOrderUrl(product: Product, size: string, quantity: number) {
  if (!product.sizes.includes(size)) throw new Error('Escolha um tamanho disponível.');
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) throw new Error('Escolha de 1 a 10 unidades.');
  const message = [
    'Olá, Ana’s Baby! Gostaria de pedir:',
    `Peça: ${product.name}`,
    `Tamanho: ${size}`,
    `Quantidade: ${quantity}`,
    `Valor unitário: ${formatMoney(product.priceCents)}`,
    `Total das peças: ${formatMoney(product.priceCents * quantity)}`,
    '',
    'Pedido de demonstração do aplicativo acadêmico.',
    'Frete não incluído. Confirmar disponibilidade, entrega e pagamento com a loja.',
  ].join('\n');
  return `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export async function openOrder(product: Product, size: string, quantity: number) {
  // Apenas abre a conversa; o cliente confirma o envio no WhatsApp.
  await Linking.openURL(buildOrderUrl(product, size, quantity));
}
