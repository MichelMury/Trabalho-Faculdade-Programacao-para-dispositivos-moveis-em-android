import { emptyDelivery, validateDelivery } from '../src/services/delivery';
import { buildOrderUrl } from '../src/services/whatsapp';
import { products } from '../src/data/products';

test('CT08 pedido rejeita endereço incompleto, CEP incorreto e UF inexistente', () => {
  const delivery = { ...emptyDelivery, postalCode: '123', state: 'XX' };
  const { errors } = validateDelivery(delivery);
  expect(Object.keys(errors)).toHaveLength(7);
  expect(errors.postalCode).toBeTruthy();
  expect(errors.state).toBeTruthy();
  expect(() => buildOrderUrl(products[0], 'M', 1, delivery)).toThrow('Preencha o endereço');
});

test('CT09 complemento é opcional, aceita s/n e preserva endereço acentuado na mensagem', () => {
  const delivery = { ...emptyDelivery, recipient: 'Maria de Teste', postalCode: '20000000', street: 'Rua São João', number: 's/n', neighborhood: 'Centro', city: 'Rio de Janeiro', state: 'rj' };
  const { address, errors } = validateDelivery(delivery);
  expect(errors).toEqual({});
  expect(address.postalCode).toBe('20000-000');
  const message = decodeURIComponent(buildOrderUrl(products[0], 'M', 2, delivery).split('?text=')[1]);
  expect(message).toContain('Rua: Rua São João, s/n');
  expect(message).toContain('Total das peças: R$ 79,80');
  expect(message).not.toContain('Complemento:');
});
