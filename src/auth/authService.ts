import type { AuthError, User } from '@supabase/supabase-js';
import { getSupabase, isSupabaseConfigured } from './supabase';
import { AuthFailure, normalizeEmail, type AuthGateway, type AuthUser } from './types';

function toUser(user: User): AuthUser {
  return { id: user.id, email: user.email ?? '', name: String(user.user_metadata?.display_name || 'Cliente') };
}

function failure(error: AuthError): AuthFailure {
  const code = error.code;
  if (code === 'invalid_credentials') return new AuthFailure('E-mail ou senha incorretos. Confira e tente novamente.');
  if (code === 'email_not_confirmed') return new AuthFailure('Confirme seu e-mail antes de entrar. Confira também a pasta de spam.');
  if (code === 'user_already_exists' || code === 'email_exists') return new AuthFailure('Não foi possível criar a conta com esse e-mail. Tente entrar na sua conta.');
  if (code === 'weak_password') return new AuthFailure('Escolha uma senha mais forte, com pelo menos 8 caracteres, letras e números.');
  if (error.status === 429 || code === 'over_email_send_rate_limit') return new AuthFailure('Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.');
  if (code === 'signup_disabled') return new AuthFailure('Novos cadastros estão temporariamente indisponíveis.');
  if (code === 'email_address_not_authorized' || code === 'email_address_not_authorized_for_project') return new AuthFailure('Não foi possível enviar a confirmação para esse endereço. Entre em contato com o responsável pelo aplicativo.');
  return new AuthFailure('Não foi possível concluir. Confira sua conexão e tente novamente.');
}

export const authService: AuthGateway = {
  async restore() {
    if (!isSupabaseConfigured()) return null;
    const client = getSupabase();
    const { data: { session }, error: sessionError } = await client.auth.getSession();
    if (sessionError) throw failure(sessionError);
    if (!session) return null;
    // Confere a sessão com o servidor antes de mostrar a área da conta.
    const { data, error } = await client.auth.getUser();
    if (error) {
      if (error.status === 401 || error.status === 403 || error.code === 'refresh_token_not_found') {
        await client.auth.signOut({ scope: 'local' });
        return null;
      }
      throw failure(error);
    }
    return data.user ? toUser(data.user) : null;
  },
  async signIn({ email, password }) {
    const { data, error } = await getSupabase().auth.signInWithPassword({ email: normalizeEmail(email), password });
    if (error) throw failure(error);
    if (!data.session || !data.user) throw new AuthFailure('Não foi possível iniciar sua sessão. Tente novamente.');
    return toUser(data.user);
  },
  async signUp({ name, email, password }) {
    const { data, error } = await getSupabase().auth.signUp({ email: normalizeEmail(email), password, options: { data: { display_name: name.trim() } } });
    if (error) throw failure(error);
    return { user: data.session && data.user ? toUser(data.user) : null, confirmationRequired: !data.session };
  },
  async signOut() {
    const { error } = await getSupabase().auth.signOut({ scope: 'local' });
    if (error) throw failure(error);
  },
  async resendConfirmation(email) {
    const { error } = await getSupabase().auth.resend({ type: 'signup', email: normalizeEmail(email) });
    if (error) throw failure(error);
  },
  subscribe(listener) {
    if (!isSupabaseConfigured()) return () => {};
    const { data: { subscription } } = getSupabase().auth.onAuthStateChange((event, session) => {
      if (event !== 'INITIAL_SESSION') listener(session?.user ? toUser(session.user) : null);
    });
    return () => subscription.unsubscribe();
  },
  startAutoRefresh() { if (isSupabaseConfigured()) getSupabase().auth.startAutoRefresh(); },
  stopAutoRefresh() { if (isSupabaseConfigured()) getSupabase().auth.stopAutoRefresh(); },
};
