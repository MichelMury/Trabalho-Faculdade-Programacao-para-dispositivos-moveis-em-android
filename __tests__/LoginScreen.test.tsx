import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../src/screens/LoginScreen';

function enterCredentials(email = 'pessoa@exemplo.com', password = 'Senha de teste 123') {
  fireEvent.changeText(screen.getByLabelText('E-mail'), email);
  fireEvent.changeText(screen.getByLabelText('Senha'), password);
}

test('mostra a tela de login com a senha oculta', () => {
  render(<LoginScreen />);
  expect(screen.getByText('Entre na sua conta')).toBeTruthy();
  expect(screen.getByLabelText('Senha').props.secureTextEntry).toBe(true);
});

test('impede envio de campos vazios e de e-mail inválido', () => {
  const login = jest.fn();
  render(<LoginScreen onLogin={login} />);
  fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));
  expect(screen.getByText('Digite um e-mail válido.')).toBeTruthy();
  expect(screen.getByText('Digite sua senha.')).toBeTruthy();
  enterCredentials('email-incorreto');
  fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));
  expect(screen.getByText('Digite um e-mail válido.')).toBeTruthy();
  expect(login).not.toHaveBeenCalled();
});

test('alterna a visibilidade sem apagar a senha', () => {
  render(<LoginScreen />);
  enterCredentials();
  fireEvent.press(screen.getByRole('button', { name: 'Mostrar senha' }));
  expect(screen.getByLabelText('Senha').props.secureTextEntry).toBe(false);
  expect(screen.getByLabelText('Senha').props.value).toBe('Senha de teste 123');
  fireEvent.press(screen.getByRole('button', { name: 'Ocultar senha' }));
  expect(screen.getByLabelText('Senha').props.secureTextEntry).toBe(true);
});

test('normaliza o e-mail e preserva a senha ao chamar a integração futura', async () => {
  const login = jest.fn().mockResolvedValue(undefined);
  render(<LoginScreen onLogin={login} />);
  enterCredentials('  Pessoa@Exemplo.COM  ', '  senha com espaços  ');
  fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));
  await waitFor(() => expect(login).toHaveBeenCalledWith({ email: 'pessoa@exemplo.com', password: '  senha com espaços  ' }));
});

test('não simula autenticação quando não há integração', () => {
  render(<LoginScreen />);
  enterCredentials();
  fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));
  expect(screen.getByText('O acesso à conta estará disponível em breve.')).toBeTruthy();
});

test('explica que cadastro e recuperação serão feitos em etapas futuras', () => {
  render(<LoginScreen />);
  fireEvent.press(screen.getByRole('button', { name: 'Esqueceu a senha?' }));
  expect(screen.getByText('A recuperação de senha estará disponível em breve.')).toBeTruthy();
  fireEvent.press(screen.getByRole('button', { name: 'Fechar aviso' }));
  fireEvent.press(screen.getByRole('button', { name: 'Criar uma conta' }));
  expect(screen.getByText('O cadastro estará disponível em breve.')).toBeTruthy();
});

test('impede envios duplicados e permite tentar novamente após falha', async () => {
  let rejectLogin!: (error: Error) => void;
  const login = jest.fn(() => new Promise<void>((_resolve, reject) => { rejectLogin = reject; }));
  render(<LoginScreen onLogin={login} />);
  enterCredentials();
  fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));
  fireEvent(screen.getByLabelText('Senha'), 'submitEditing');
  expect(login).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button', { name: 'Entrar' }).props.accessibilityState.disabled).toBe(true);
  await act(async () => rejectLogin(new Error('falha de rede')));
  expect(screen.getByText('Não foi possível entrar. Confira seus dados e tente novamente.')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Entrar' }).props.accessibilityState.disabled).toBe(false);
});
