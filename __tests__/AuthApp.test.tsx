import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { AuthApp } from '../src/AuthApp';
import { AuthFailure, type AuthGateway, type AuthUser } from '../src/auth/types';
jest.mock('../src/auth/authService', () => ({ authService: {} }));
const user: AuthUser = { id: 'user-1', name: 'Ana Souza', email: 'ana@exemplo.com' };
function gateway(overrides: Partial<AuthGateway> = {}): AuthGateway {
  return { restore: jest.fn().mockResolvedValue(null), signIn: jest.fn().mockResolvedValue(user), signUp: jest.fn().mockResolvedValue({ user: null, confirmationRequired: true }), signOut: jest.fn().mockResolvedValue(undefined), resendConfirmation: jest.fn().mockResolvedValue(undefined), subscribe: jest.fn(() => () => {}), startAutoRefresh: jest.fn(), stopAutoRefresh: jest.fn(), ...overrides };
}
async function openApp(service: AuthGateway) {
  render(<AuthApp gateway={service} />);
  await waitFor(() => expect(screen.queryByLabelText('Carregando sua conta')).toBeNull());
}
test('entra com senha e sai sem manter a área autenticada aberta', async () => {
  const service = gateway(); await openApp(service);
  fireEvent.changeText(screen.getByLabelText('E-mail'), user.email);
  fireEvent.changeText(screen.getByLabelText('Senha'), 'Carinho123');
  fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));
  await waitFor(() => expect(screen.getByText('Minha conta')).toBeTruthy());
  expect(screen.getByText(user.email)).toBeTruthy();
  fireEvent.press(screen.getByRole('button', { name: 'Sair da conta' }));
  await waitFor(() => expect(screen.getByText('Entre na sua conta')).toBeTruthy());
  expect(service.signOut).toHaveBeenCalledTimes(1);
  expect(screen.getByLabelText('Senha').props.value).toBe('');
});
test('cadastro exige confirmação e devolve o e-mail preenchido ao login', async () => {
  const service = gateway(); await openApp(service);
  fireEvent.press(screen.getByRole('button', { name: 'Criar uma conta' }));
  fireEvent.changeText(screen.getByLabelText('Nome'), user.name);
  fireEvent.changeText(screen.getByLabelText('E-mail'), user.email);
  fireEvent.changeText(screen.getByLabelText('Senha'), 'Carinho123');
  fireEvent.changeText(screen.getByLabelText('Confirmar senha'), 'Carinho123');
  fireEvent.press(screen.getByRole('button', { name: 'Criar conta' }));
  await waitFor(() => expect(screen.getByText('Confira sua caixa de entrada')).toBeTruthy());
  expect(screen.queryByText('Minha conta')).toBeNull();
  fireEvent.press(screen.getByRole('button', { name: 'Voltar para entrar' }));
  expect(screen.getByLabelText('E-mail').props.value).toBe(user.email);
});
test('restaura sessão validada com o servidor', async () => {
  await openApp(gateway({ restore: jest.fn().mockResolvedValue(user) }));
  expect(screen.getByText('Minha conta')).toBeTruthy();
});
test('falha na restauração oferece nova tentativa, sem abrir a conta', async () => {
  const restore = jest.fn().mockRejectedValueOnce(new AuthFailure('Sem conexão.')).mockResolvedValueOnce(null);
  await openApp(gateway({ restore }));
  expect(screen.queryByText('Minha conta')).toBeNull();
  fireEvent.press(screen.getByRole('button', { name: 'Tentar novamente' }));
  await waitFor(() => expect(screen.getByText('Entre na sua conta')).toBeTruthy());
});
test('sessão revogada por evento fecha a área autenticada', async () => {
  let listener!: (user: AuthUser | null) => void;
  await openApp(gateway({ restore: jest.fn().mockResolvedValue(user), subscribe: callback => { listener = callback; return () => {}; } }));
  act(() => listener(null));
  expect(screen.queryByText('Minha conta')).toBeNull();
  expect(screen.getByText('Entre na sua conta')).toBeTruthy();
});
