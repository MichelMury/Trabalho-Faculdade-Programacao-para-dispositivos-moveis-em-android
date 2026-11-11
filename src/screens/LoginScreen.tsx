import { useRef, useState, type ComponentRef } from 'react';
import { Text, TextInput, View } from 'react-native';
import { AuthLayout } from '../components/AuthLayout';
import { AuthButton, AuthField, AuthLink, Notice } from '../components/AuthControls';
import { authStyles as s } from '../components/authStyles';
import { authMessage, normalizeEmail, validEmail, type LoginCredentials } from '../auth/types';

export type { LoginCredentials } from '../auth/types';
type Props = { onLogin: (credentials: LoginCredentials) => Promise<void>; onCreateAccount: () => void; initialEmail?: string };
export function LoginScreen({ onLogin, onCreateAccount, initialEmail = '' }: Props) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const passwordInput = useRef<ComponentRef<typeof TextInput>>(null);
  async function submit() {
    if (inFlight.current) return;
    const normalizedEmail = normalizeEmail(email);
    const nextErrors: typeof errors = {};
    if (!validEmail(normalizedEmail)) nextErrors.email = 'Digite um e-mail válido.';
    if (!password) nextErrors.password = 'Digite sua senha.';
    setErrors(nextErrors); setNotice('');
    if (Object.keys(nextErrors).length) return;
    inFlight.current = true; setBusy(true);
    try { await onLogin({ email: normalizedEmail, password }); setPassword(''); }
    catch (error) { setNotice(authMessage(error)); }
    finally { inFlight.current = false; setBusy(false); }
  }
  return <AuthLayout title="Que bom ter você aqui." subtitle="Pequenas roupinhas. Grandes momentos.">
    <Text style={s.formTitle}>Entre na sua conta</Text>
    <AuthField label="E-mail" placeholder="seuemail@exemplo.com" value={email} onChangeText={value => { setEmail(value); setErrors(old => ({ ...old, email: undefined })); setNotice(''); }} error={errors.email} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" textContentType="emailAddress" returnKeyType="next" onSubmitEditing={() => passwordInput.current?.focus()} editable={!busy} maxLength={254} />
    <AuthField ref={passwordInput} label="Senha" password placeholder="Digite sua senha" value={password} onChangeText={value => { setPassword(value); setErrors(old => ({ ...old, password: undefined })); setNotice(''); }} error={errors.password} autoCapitalize="none" autoCorrect={false} autoComplete="current-password" textContentType="password" returnKeyType="go" onSubmitEditing={submit} editable={!busy} />
    <Notice message={notice} onClose={() => setNotice('')} />
    <AuthButton label="Entrar" busy={busy} onPress={submit} />
    <View style={[s.signup, { alignItems: 'center', marginTop: 12 }]}><Text style={s.signupText}>Sua primeira visita?</Text><AuthLink label="Criar uma conta" onPress={onCreateAccount} disabled={busy} /></View>
  </AuthLayout>;
}
