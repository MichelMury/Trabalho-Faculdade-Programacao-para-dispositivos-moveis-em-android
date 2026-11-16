import { fireEvent, render, screen } from '@testing-library/react-native';
import App from '../App';
import { login } from '../src/services/auth';

jest.mock('../src/services/auth', () => ({
  login: jest.fn().mockResolvedValue({ email: 'michel@exemplo.com' }),
  register: jest.fn(),
  AuthError: class AuthError extends Error {},
}));

test('CT02 login leva à home com FlatList, filtra roupas, abre detalhes e permite sair', async () => {
  render(<App />);
  fireEvent.changeText(screen.getByLabelText('E-mail'), 'michel@exemplo.com');
  fireEvent.changeText(screen.getByLabelText('Senha'), 'Senha de teste 123');
  fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));
  await screen.findByText('Encontre seu carinho favorito');
  expect(login).toHaveBeenCalledWith('michel@exemplo.com', 'Senha de teste 123');
  expect(screen.getByTestId('catalog-list')).toBeTruthy();
  fireEvent.press(screen.getByRole('button', { name: 'Filtrar Vestidos' }));
  expect(screen.queryByRole('button', { name: 'Ver Body carinho rosa' })).toBeNull();
  fireEvent.press(screen.getByRole('button', { name: 'Ver Vestido jardim lilás' }));
  expect(screen.getByText('Escolha o tamanho')).toBeTruthy();
  fireEvent.press(screen.getByRole('button', { name: 'Voltar para a home' }));
  await screen.findByText('Encontre seu carinho favorito');
  fireEvent.press(screen.getByRole('button', { name: 'Sair' }));
  expect(screen.getByText('Entre na sua conta')).toBeTruthy();
  expect(screen.getByLabelText('Senha').props.value).toBe('');
});
