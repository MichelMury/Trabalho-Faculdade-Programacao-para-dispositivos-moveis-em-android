import { useRef, useState, type ComponentRef } from 'react';
import { Text, TextInput } from 'react-native';
import { AuthLayout } from '../components/AuthLayout';
import { AuthButton, AuthField, AuthLink, Notice } from '../components/AuthControls';
import { authStyles as s } from '../components/authStyles';
import { authMessage, normalizeEmail, validEmail, type RegisterCredentials } from '../auth/types';

type Props = { onRegister: (credentials: RegisterCredentials) => Promise<void>; onBack: () => void };
export function RegisterScreen({ onRegister, onBack }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const emailRef = useRef<ComponentRef<typeof TextInput>>(null);
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);
  const confirmationRef = useRef<ComponentRef<typeof TextInput>>(null);
  const clearError = (field: string) => { setErrors(old => ({ ...old, [field]: '' })); setNotice(''); };
  async function submit() {
    if (inFlight.current) return;
    const next: Record<string, string> = {};
    if (name.trim().length < 2 || name.trim().length > 80) next.name = 'Informe seu nome, entre 2 e 80 caracteres.';
    if (!validEmail(normalizeEmail(email))) next.email = 'Digite um e-mail válido.';
    if (password.length < 8 || password.length > 128 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) next.password = 'Use de 8 a 128 caracteres, com letras e números.';
    if (!confirmation || confirmation !== password) next.confirmation = 'As senhas precisam ser iguais.';
    setErrors(next); setNotice('');
    if (Object.keys(next).length) return;
    inFlight.current = true; setBusy(true);
    try { await onRegister({ name: name.trim(), email: normalizeEmail(email), password }); setPassword(''); setConfirmation(''); }
    catch (error) { setNotice(authMessage(error)); }
    finally { inFlight.current = false; setBusy(false); }
  }
  return <AuthLayout title="Seu cantinho de carinho." subtitle="Crie sua conta e venha fazer parte." eyebrow="BEM-VINDA À FAMÍLIA">
    <Text style={s.formTitle}>Criar minha conta</Text>
    <AuthField label="Nome" placeholder="Como podemos chamar você?" value={name} onChangeText={value => { setName(value); clearError('name'); }} error={errors.name} maxLength={80} autoComplete="name" textContentType="name" autoCapitalize="words" returnKeyType="next" onSubmitEditing={() => emailRef.current?.focus()} editable={!busy} />
    <AuthField ref={emailRef} label="E-mail" placeholder="seuemail@exemplo.com" value={email} onChangeText={value => { setEmail(value); clearError('email'); }} error={errors.email} maxLength={254} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" textContentType="emailAddress" returnKeyType="next" onSubmitEditing={() => passwordRef.current?.focus()} editable={!busy} />
    <AuthField ref={passwordRef} label="Senha" password placeholder="Pelo menos 8 caracteres" value={password} onChangeText={value => { setPassword(value); clearError('password'); }} error={errors.password} autoComplete="new-password" textContentType="newPassword" autoCapitalize="none" autoCorrect={false} maxLength={128} returnKeyType="next" onSubmitEditing={() => confirmationRef.current?.focus()} editable={!busy} />
    <AuthField ref={confirmationRef} label="Confirmar senha" password placeholder="Digite a senha novamente" value={confirmation} onChangeText={value => { setConfirmation(value); clearError('confirmation'); }} error={errors.confirmation} autoComplete="new-password" textContentType="newPassword" autoCapitalize="none" autoCorrect={false} maxLength={128} returnKeyType="go" onSubmitEditing={submit} editable={!busy} />
    <Text style={[s.subtitle, { textAlign: 'left', marginTop: -8, marginBottom: 18 }]}>Use letras e números. Sua senha não fica salva no aplicativo.</Text>
    <Notice message={notice} onClose={() => setNotice('')} />
    <AuthButton label="Criar conta" busy={busy} onPress={submit} />
    <AuthLink label="Já tenho conta. Entrar" onPress={onBack} disabled={busy} />
  </AuthLayout>;
}
