export type DeliveryAddress = {
  recipient: string;
  postalCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
};
export type DeliveryErrors = Partial<Record<keyof DeliveryAddress, string>>;
export const emptyDelivery: DeliveryAddress = {
  recipient: '', postalCode: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '',
};
const states = new Set('AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' '));
const clean = (value: string) => value.trim().replace(/\s+/g, ' ');

export function formatPostalCode(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

export function validateDelivery(delivery: DeliveryAddress) {
  const address: DeliveryAddress = {
    recipient: clean(delivery.recipient), postalCode: delivery.postalCode.trim(), street: clean(delivery.street),
    number: clean(delivery.number), complement: clean(delivery.complement), neighborhood: clean(delivery.neighborhood),
    city: clean(delivery.city), state: clean(delivery.state).toUpperCase(),
  };
  const errors: DeliveryErrors = {};
  if (address.recipient.length < 2) errors.recipient = 'Informe o nome de quem vai receber.';
  if (!/^\d{5}-?\d{3}$/.test(address.postalCode)) errors.postalCode = 'Informe um CEP com 8 números.';
  if (address.street.length < 2) errors.street = 'Informe a rua ou avenida.';
  if (!address.number) errors.number = 'Informe o número ou escreva s/n.';
  if (address.neighborhood.length < 2) errors.neighborhood = 'Informe o bairro.';
  if (address.city.length < 2) errors.city = 'Informe a cidade.';
  if (!states.has(address.state)) errors.state = 'Informe uma UF válida, como RJ.';
  address.postalCode = formatPostalCode(address.postalCode);
  return { address, errors };
}
