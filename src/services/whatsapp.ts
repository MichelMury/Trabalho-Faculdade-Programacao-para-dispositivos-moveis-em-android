import { Linking } from 'react-native';
import { formatMoney, type Product } from '../data/products';
import { validateDelivery, type DeliveryAddress } from './delivery';

export const STORE_WHATSAPP = '5521989670373';

export function buildOrderUrl(product: Product, size: string, quantity: number, delivery: DeliveryAddress) {
  if (!product.sizes.includes(size)) throw new Error('Escolha um tamanho disponível.');
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) throw new Error('Escolha de 1 a 10 unidades.');
  const { address, errors } = validateDelivery(delivery);
  if (Object.keys(errors).length) throw new Error('Preencha o endereço de entrega antes de comprar.');
  const message = [
    'Olá, Ana’s Baby! Gostaria de pedir:',
    `Peça: ${product.name}`,
    `Tamanho: ${size}`,
    `Quantidade: ${quantity}`,
    `Valor unitário: ${formatMoney(product.priceCents)}`,
    `Total das peças: ${formatMoney(product.priceCents * quantity)}`,
    '',
    'Endereço de entrega:',
    `Recebedor: ${address.recipient}`,
    `Rua: ${address.street}, ${address.number}`,
    ...(address.complement ? [`Complemento: ${address.complement}`] : []),
    `Bairro: ${address.neighborhood}`,
    `Cidade: ${address.city} - ${address.state}`,
    `CEP: ${address.postalCode}`,
    '',
    'Pedido de demonstração do aplicativo acadêmico.',
    'Frete não incluído. Confirmar disponibilidade, entrega e pagamento com a loja.',
  ].join('\n');
  return `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export async function openOrder(product: Product, size: string, quantity: number, delivery: DeliveryAddress) {
  // Apenas abre a conversa; o cliente confirma o envio no WhatsApp.
  await Linking.openURL(buildOrderUrl(product, size, quantity, delivery));
}
