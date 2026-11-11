import { authService } from '../src/auth/authService';
import { getSupabase, isSupabaseConfigured } from '../src/auth/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
jest.mock('../src/auth/supabase', () => ({ getSupabase: jest.fn(), isSupabaseConfigured: jest.fn(() => true) }));
const user = { id: 'user-1', email: 'ana@exemplo.com', user_metadata: { display_name: 'Ana Souza' } };
let api: Record<string, jest.Mock>;
beforeEach(() => {
  api = { getSession: jest.fn().mockResolvedValue({ data: { session: { user } }, error: null }), getUser: jest.fn().mockResolvedValue({ data: { user }, error: null }), signInWithPassword: jest.fn().mockResolvedValue({ data: { user, session: { user } }, error: null }), signUp: jest.fn().mockResolvedValue({ data: { user, session: null }, error: null }), signOut: jest.fn().mockResolvedValue({ error: null }), resend: jest.fn().mockResolvedValue({ error: null }) };
  jest.mocked(getSupabase).mockReturnValue({ auth: api } as unknown as SupabaseClient);
  jest.mocked(isSupabaseConfigured).mockReturnValue(true);
});
test('login chama autenticação do servidor sem alterar a senha', async () => {
  const result = await authService.signIn({ email: ' ANA@EXEMPLO.COM ', password: ' senha 123 ' });
  expect(api.signInWithPassword).toHaveBeenCalledWith({ email: user.email, password: ' senha 123 ' });
  expect(result).toEqual({ id: user.id, email: user.email, name: 'Ana Souza' });
});
test.each([['invalid_credentials', 'E-mail ou senha incorretos.'], ['email_not_confirmed', 'Confirme seu e-mail antes de entrar.']])('não autentica quando o servidor retorna %s', async (code, message) => {
  api.signInWithPassword.mockResolvedValue({ data: {}, error: { code, status: 400 } });
  await expect(authService.signIn({ email: user.email, password: 'errada123' })).rejects.toThrow(message);
});
test('cadastro usa o servidor e não autentica sem confirmação', async () => {
  const result = await authService.signUp({ name: ' Ana Souza ', email: ' ANA@EXEMPLO.COM ', password: 'Carinho123' });
  expect(api.signUp).toHaveBeenCalledWith({ email: user.email, password: 'Carinho123', options: { data: { display_name: 'Ana Souza' } } });
  expect(result).toEqual({ user: null, confirmationRequired: true });
});
test('restauração confere a sessão com o servidor', async () => {
  await authService.restore(); expect(api.getUser).toHaveBeenCalledTimes(1);
});
test('sessão recusada pelo servidor é removida e não abre a conta', async () => {
  api.getUser.mockResolvedValue({ data: {}, error: { status: 401 } });
  await expect(authService.restore()).resolves.toBeNull();
  expect(api.signOut).toHaveBeenCalledWith({ scope: 'local' });
});
test('sem sessão, não consulta uma conta inexistente', async () => {
  api.getSession.mockResolvedValue({ data: { session: null }, error: null });
  await expect(authService.restore()).resolves.toBeNull(); expect(api.getUser).not.toHaveBeenCalled();
});
test('reenvia confirmação pelo servidor', async () => {
  await authService.resendConfirmation(user.email);
  expect(api.resend).toHaveBeenCalledWith({ type: 'signup', email: user.email });
});
