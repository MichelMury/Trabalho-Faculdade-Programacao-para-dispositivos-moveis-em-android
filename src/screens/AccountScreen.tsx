import { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { AuthLayout } from '../components/AuthLayout';
import { AuthButton, Notice } from '../components/AuthControls';
import { authStyles as s } from '../components/authStyles';
import { colors } from '../theme';
import { authMessage, type AuthUser } from '../auth/types';

export function AccountScreen({ user, onSignOut }: { user: AuthUser; onSignOut: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const inFlight = useRef(false);
  async function signOut() {
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true);
    try { await onSignOut(); }
    catch (error) { setNotice(authMessage(error)); }
    finally { inFlight.current = false; setBusy(false); }
  }
  return <AuthLayout title={`Olá, ${user.name.split(' ')[0]}!`} subtitle="Seu cantinho está pronto para receber você." eyebrow="BEM-VINDA DE VOLTA">
    <Text style={s.formTitle}>Minha conta</Text>
    <View style={{ padding: 18, borderRadius: 14, backgroundColor: colors.paper, borderColor: colors.line, borderWidth: 1, marginBottom: 22 }}>
      <Text style={s.label}>Nome</Text><Text style={[s.subtitle, { textAlign: 'left', marginTop: 0, marginBottom: 14 }]}>{user.name}</Text>
      <Text style={s.label}>E-mail</Text><Text style={[s.subtitle, { textAlign: 'left', marginTop: 0 }]}>{user.email}</Text>
    </View>
    <Notice message={notice} /><AuthButton label="Sair da conta" onPress={signOut} busy={busy} />
  </AuthLayout>;
}
