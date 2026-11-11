import { useEffect, useState } from 'react';
import { ActivityIndicator, AppState, BackHandler, Platform } from 'react-native';
import { authService } from './auth/authService';
import { authMessage, type AuthGateway, type AuthUser, type LoginCredentials, type RegisterCredentials } from './auth/types';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { ConfirmEmailScreen } from './screens/ConfirmEmailScreen';
import { AccountScreen } from './screens/AccountScreen';
import { AuthLayout } from './components/AuthLayout';
import { AuthButton, Notice } from './components/AuthControls';
import { colors } from './theme';

export function AuthApp({ gateway = authService }: { gateway?: AuthGateway }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [route, setRoute] = useState<'login' | 'register' | 'confirm'>('login');
  const [email, setEmail] = useState('');
  const [ready, setReady] = useState(false);
  const [bootError, setBootError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    let revision = 0;
    let unsubscribe = () => {};
    setReady(false); setBootError('');
    try {
      unsubscribe = gateway.subscribe(next => { revision++; if (active) { setUser(next); if (!next) setRoute('login'); } });
      const initialRevision = revision;
      gateway.restore().then(next => { if (active && revision === initialRevision) setUser(next); }).catch(error => { if (active) setBootError(authMessage(error)); }).finally(() => { if (active) setReady(true); });
    } catch (error) { setBootError(authMessage(error)); setReady(true); }
    const onState = (state: string | null | undefined) => { try { if (state === 'active') gateway.startAutoRefresh(); else gateway.stopAutoRefresh(); } catch { /* Configuração ausente é mostrada ao tentar entrar. */ } };
    if (Platform.OS !== 'web') onState(AppState.currentState);
    const subscription = Platform.OS !== 'web' ? AppState.addEventListener('change', onState) : null;
    return () => { active = false; unsubscribe(); subscription?.remove(); try { gateway.stopAutoRefresh(); } catch {} };
  }, [gateway, attempt]);
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => { if (!user && route !== 'login') { setRoute('login'); return true; } return false; });
    return () => subscription.remove();
  }, [route, user]);
  async function login(credentials: LoginCredentials) { setUser(await gateway.signIn(credentials)); }
  async function register(credentials: RegisterCredentials) {
    const result = await gateway.signUp(credentials); setEmail(credentials.email);
    if (result.user) setUser(result.user); else setRoute('confirm');
  }
  async function signOut() { await gateway.signOut(); setUser(null); setEmail(''); setRoute('login'); }
  if (!ready) return <AuthLayout title="Só um instante…" subtitle="Estamos preparando seu cantinho."><ActivityIndicator color={colors.pinkDark} accessibilityLabel="Carregando sua conta" /></AuthLayout>;
  if (bootError) return <AuthLayout title="Vamos tentar de novo?" subtitle="Não foi possível abrir sua conta agora."><Notice message={bootError} /><AuthButton label="Tentar novamente" onPress={() => setAttempt(old => old + 1)} /></AuthLayout>;
  if (user) return <AccountScreen user={user} onSignOut={signOut} />;
  if (route === 'register') return <RegisterScreen onRegister={register} onBack={() => setRoute('login')} />;
  if (route === 'confirm') return <ConfirmEmailScreen email={email} onResend={() => gateway.resendConfirmation(email)} onBack={() => setRoute('login')} />;
  return <LoginScreen key={email} initialEmail={email} onLogin={login} onCreateAccount={() => setRoute('register')} />;
}
