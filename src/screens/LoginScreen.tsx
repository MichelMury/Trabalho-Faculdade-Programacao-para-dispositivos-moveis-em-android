import { useRef, useState, type ComponentRef } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClothingIllustration } from '../components/ClothingIllustration';
import { Icon } from '../components/Icon';
import { colors, serif } from '../theme';

export type LoginCredentials = { email: string; password: string };
type Props = { onLogin?: (credentials: LoginCredentials) => Promise<void> };

export function LoginScreen({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState<'email' | 'password' | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const passwordInput = useRef<ComponentRef<typeof TextInput>>(null);

  async function submit() {
    if (inFlight.current) return;
    const normalizedEmail = email.trim().toLowerCase();
    const nextErrors: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) nextErrors.email = 'Digite um e-mail válido.';
    if (!password) nextErrors.password = 'Digite sua senha.';
    setErrors(nextErrors);
    setNotice('');
    if (Object.keys(nextErrors).length) return;
    if (!onLogin) {
      setNotice('O acesso à conta estará disponível em breve.');
      return;
    }
    inFlight.current = true;
    setBusy(true);
    try {
      await onLogin({ email: normalizedEmail, password });
    } catch {
      setNotice('Não foi possível entrar. Confira seus dados e tente novamente.');
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={s.page}>
            <View style={s.ribbon}>{[colors.lilac, '#A7C69B', '#E5A6B7', colors.mint, colors.peach].map(color => <View key={color} style={[s.ribbonPart, { backgroundColor: color }]} />)}</View>
            <View style={s.content}>
              <View style={s.brand}>
                <View style={s.brandIcon}><Icon name="heart" size={18} color={colors.pinkDark} /></View>
                <Text style={s.brandName}>Ana’s Baby</Text>
                <Text style={s.brandTagline}>M O D A  I N F A N T I L</Text>
              </View>
              <ClothingIllustration />
              <View style={s.heading}>
                <Text style={s.eyebrow}>UM MUNDO DE CARINHO</Text>
                <Text accessibilityRole="header" style={s.title}>Que bom ter você aqui.</Text>
                <Text style={s.subtitle}>Pequenas roupinhas. Grandes momentos.</Text>
              </View>
              <View style={s.form}>
                <Text style={s.formTitle}>Entre na sua conta</Text>
                <Text style={s.label}>E-mail</Text>
                <View style={[s.inputBox, focused === 'email' && s.focus, !!errors.email && s.invalid]}>
                  <Icon name="mail" />
                  <TextInput accessibilityLabel="E-mail" style={s.input} placeholder="seuemail@exemplo.com" placeholderTextColor="#A08E98" value={email} onChangeText={value => { setEmail(value); setErrors(old => ({ ...old, email: undefined })); setNotice(''); }} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" textContentType="emailAddress" returnKeyType="next" onSubmitEditing={() => passwordInput.current?.focus()} editable={!busy} maxLength={254} />
                </View>
                {!!errors.email && <Text accessibilityRole="alert" style={s.error}>{errors.email}</Text>}
                <View style={s.passwordLabel}>
                  <Text style={s.label}>Senha</Text>
                  <Pressable accessibilityRole="button" disabled={busy} onPress={() => setNotice('A recuperação de senha estará disponível em breve.')} hitSlop={8}><Text style={s.link}>Esqueceu a senha?</Text></Pressable>
                </View>
                <View style={[s.inputBox, focused === 'password' && s.focus, !!errors.password && s.invalid]}>
                  <Icon name="lock" />
                  <TextInput ref={passwordInput} accessibilityLabel="Senha" style={s.input} placeholder="Digite sua senha" placeholderTextColor="#A08E98" value={password} onChangeText={value => { setPassword(value); setErrors(old => ({ ...old, password: undefined })); setNotice(''); }} onFocus={() => setFocused('password')} onBlur={() => setFocused(null)} secureTextEntry={!visible} autoCapitalize="none" autoCorrect={false} autoComplete="current-password" textContentType="password" returnKeyType="go" onSubmitEditing={submit} editable={!busy} />
                  <Pressable style={s.eye} accessibilityRole="button" accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'} onPress={() => setVisible(old => !old)} disabled={busy}><Icon name={visible ? 'eye-off' : 'eye'} /></Pressable>
                </View>
                {!!errors.password && <Text accessibilityRole="alert" style={s.error}>{errors.password}</Text>}
                {!!notice && <View style={s.notice}><Text accessibilityRole="alert" style={s.noticeText}>{notice}</Text><Pressable accessibilityRole="button" accessibilityLabel="Fechar aviso" style={s.dismiss} onPress={() => setNotice('')}><Icon name="close" size={16} /></Pressable></View>}
                <Pressable accessibilityRole="button" accessibilityLabel="Entrar" accessibilityState={{ disabled: busy, busy }} disabled={busy} onPress={submit} style={({ pressed }) => [s.button, pressed && s.pressed, busy && s.disabled]}>
                  {busy ? <ActivityIndicator color="white" accessibilityLabel="Entrando" /> : <><Text style={s.buttonText}>Entrar</Text><Icon name="arrow" color="white" size={21} /></>}
                </Pressable>
                <View style={s.signup}><Text style={s.signupText}>Sua primeira visita?</Text><Pressable accessibilityRole="button" disabled={busy} onPress={() => setNotice('O cadastro estará disponível em breve.')} hitSlop={8}><Text style={s.signupLink}>Criar uma conta</Text></Pressable></View>
              </View>
              <View style={s.footer}><View style={s.footerLine} /><Icon name="heart" size={13} color={colors.pink} /><Text style={s.footerText}>Feito de carinho, para vestir amor.</Text><View style={s.footerLine} /></View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
  page: { width: '100%', maxWidth: 480, backgroundColor: colors.background },
  ribbon: { height: 4, flexDirection: 'row' },
  ribbonPart: { flex: 1 },
  content: { paddingHorizontal: 28, paddingTop: 24, paddingBottom: 24 },
  brand: { alignItems: 'center', marginBottom: 15 },
  brandIcon: { width: 32, height: 32, backgroundColor: colors.pinkLight, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  brandName: { fontFamily: serif, color: colors.ink, fontSize: 30, fontStyle: 'italic' },
  brandTagline: { color: colors.pinkDark, fontSize: 9, marginTop: 6, fontWeight: '600' },
  heading: { alignItems: 'center', marginTop: 9, marginBottom: 26 },
  eyebrow: { color: colors.pinkDark, fontSize: 9, letterSpacing: 2.2, fontWeight: '600', marginBottom: 10 },
  title: { fontFamily: serif, fontSize: 27, color: colors.ink, textAlign: 'center', lineHeight: 36 },
  subtitle: { color: colors.muted, fontSize: 12, lineHeight: 20, marginTop: 6, textAlign: 'center' },
  form: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 23 },
  formTitle: { color: colors.ink, fontSize: 17, fontWeight: '600', marginBottom: 22 },
  label: { fontSize: 12, fontWeight: '600', color: colors.ink, marginBottom: 8 },
  inputBox: { flexDirection: 'row', alignItems: 'center', minHeight: 52, borderColor: colors.line, borderWidth: 1, backgroundColor: colors.paper, borderRadius: 12, paddingLeft: 15 },
  input: { flex: 1, minWidth: 0, height: 52, paddingLeft: 12, paddingRight: 12, color: colors.ink, fontSize: 14, ...Platform.select({ web: { outlineStyle: 'none' as any }, default: {} }) },
  focus: { borderColor: colors.pinkDark },
  invalid: { borderColor: colors.error },
  passwordLabel: { marginTop: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  link: { color: colors.pinkDark, fontSize: 11, fontWeight: '500' },
  eye: { minHeight: 48, width: 44, alignItems: 'center', justifyContent: 'center' },
  error: { color: colors.error, fontSize: 12, marginTop: 7 },
  notice: { backgroundColor: colors.pinkLight, borderRadius: 10, paddingLeft: 12, paddingVertical: 6, marginTop: 14, flexDirection: 'row', alignItems: 'center' },
  noticeText: { color: colors.ink, fontSize: 12, lineHeight: 18, flex: 1 },
  dismiss: { width: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  button: { marginTop: 23, backgroundColor: colors.pinkDark, borderRadius: 12, minHeight: 54, flexDirection: 'row', gap: 12, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: colors.paper, fontSize: 15, fontWeight: '600' },
  pressed: { backgroundColor: '#7D4156', transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.65 },
  signup: { marginTop: 22, flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 6 },
  signupText: { color: colors.muted, fontSize: 12, lineHeight: 20 },
  signupLink: { color: colors.pinkDark, fontSize: 12, fontWeight: '600', lineHeight: 20 },
  footer: { marginTop: 31, flexDirection: 'row', gap: 7, alignItems: 'center', justifyContent: 'center' },
  footerText: { color: colors.muted, fontSize: 9, flexShrink: 1, textAlign: 'center', lineHeight: 16 },
  footerLine: { flex: 1, maxWidth: 27, height: 1, backgroundColor: colors.line },
});
