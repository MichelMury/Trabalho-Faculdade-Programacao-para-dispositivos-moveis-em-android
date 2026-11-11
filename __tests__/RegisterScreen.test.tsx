import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { RegisterScreen } from '../src/screens/RegisterScreen';
import { AuthFailure } from '../src/auth/types';

function fill(password = 'Carinho123', confirmation = password) {
  fireEvent.changeText(screen.getByLabelText('Nome'), '  Ana Souza  ');
  fireEvent.changeText(screen.getByLabelText('E-mail'), ' ANA@EXEMPLO.COM ');
  fireEvent.changeText(screen.getByLabelText('Senha'), password);
  fireEvent.changeText(screen.getByLabelText('Confirmar senha'), confirmation);
}
test('valida nome, e-mail e senha antes de chamar o servidor', () => {
  const register = jest.fn(); render(<RegisterScreen onRegister={register} onBack={jest.fn()} />);
  fireEvent.press(screen.getByRole('button', { name: 'Criar conta' }));
  expect(screen.getByText('Informe seu nome, entre 2 e 80 caracteres.')).toBeTruthy();
  expect(screen.getByText('Digite um e-mail válido.')).toBeTruthy();
  expect(register).not.toHaveBeenCalled();
});
test.each([['curta1', 'curta1'], ['semanumeros', 'semanumeros'], ['Carinho123', 'OutraSenha123']])('rejeita senha fraca ou confirmação diferente: %s', (password, confirmation) => {
  const register = jest.fn(); render(<RegisterScreen onRegister={register} onBack={jest.fn()} />); fill(password, confirmation);
  fireEvent.press(screen.getByRole('button', { name: 'Criar conta' }));
  expect(register).not.toHaveBeenCalled();
});
test('envia nome, e-mail normalizado e senha ao cadastro', async () => {
  const register = jest.fn().mockResolvedValue(undefined); render(<RegisterScreen onRegister={register} onBack={jest.fn()} />); fill();
  fireEvent.press(screen.getByRole('button', { name: 'Criar conta' }));
  await waitFor(() => expect(register).toHaveBeenCalledWith({ name: 'Ana Souza', email: 'ana@exemplo.com', password: 'Carinho123' }));
});
test('mostra erro recebido e mantém o formulário para correção', async () => {
  const register = jest.fn().mockRejectedValue(new AuthFailure('Muitas tentativas. Aguarde.'));
  render(<RegisterScreen onRegister={register} onBack={jest.fn()} />); fill();
  fireEvent.press(screen.getByRole('button', { name: 'Criar conta' }));
  await waitFor(() => expect(screen.getByText('Muitas tentativas. Aguarde.')).toBeTruthy());
  expect(screen.getByLabelText('Nome').props.value).toBe('  Ana Souza  ');
});
