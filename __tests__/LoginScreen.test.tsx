import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../src/screens/LoginScreen';
import { AuthFailure } from '../src/auth/types';

const createAccount = jest.fn();
function renderLogin(login = jest.fn().mockResolvedValue(undefined)) {
  render(<LoginScreen onLogin={login} onCreateAccount={createAccount} />);
  return login;
}
function enter(email = 'pessoa@exemplo.com', password = 'Senha de teste 123') {
  fireEvent.changeText(screen.getByLabelText('E-mail'), email);
  fireEvent.changeText(screen.getByLabelText('Senha'), password);
}
test('começa com a senha oculta e alterna sem apagar o valor', () => {
  renderLogin(); enter();
  expect(screen.getByLabelText('Senha').props.secureTextEntry).toBe(true);
  fireEvent.press(screen.getByRole('button', { name: 'Mostrar senha' }));
  expect(screen.getByLabelText('Senha').props.secureTextEntry).toBe(false);
  expect(screen.getByLabelText('Senha').props.value).toBe('Senha de teste 123');
  fireEvent.press(screen.getByRole('button', { name: 'Ocultar senha' }));
  expect(screen.getByLabelText('Senha').props.secureTextEntry).toBe(true);
});
test('impede envio sem e-mail válido e sem senha', () => {
  const login = renderLogin();
  fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));
  expect(screen.getByText('Digite um e-mail válido.')).toBeTruthy();
  expect(screen.getByText('Digite sua senha.')).toBeTruthy();
  expect(login).not.toHaveBeenCalled();
});
test('normaliza o e-mail e preserva espaços da senha', async () => {
  const login = renderLogin(); enter('  Pessoa@Exemplo.COM  ', '  senha com espaços  ');
  fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));
  await waitFor(() => expect(login).toHaveBeenCalledWith({ email: 'pessoa@exemplo.com', password: '  senha com espaços  ' }));
});
test('navega para criar conta', () => {
  createAccount.mockClear(); renderLogin();
  fireEvent.press(screen.getByRole('button', { name: 'Criar uma conta' }));
  expect(createAccount).toHaveBeenCalledTimes(1);
});
test('impede envios duplicados, exibe falha e permite tentar novamente', async () => {
  let rejectLogin!: (error: Error) => void;
  const login = jest.fn(() => new Promise<void>((_resolve, reject) => { rejectLogin = reject; }));
  renderLogin(login); enter();
  fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));
  fireEvent(screen.getByLabelText('Senha'), 'submitEditing');
  expect(login).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button', { name: 'Entrar' }).props.accessibilityState.disabled).toBe(true);
  await act(async () => rejectLogin(new AuthFailure('E-mail ou senha incorretos.')));
  expect(screen.getByText('E-mail ou senha incorretos.')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Entrar' }).props.accessibilityState.disabled).toBe(false);
});
