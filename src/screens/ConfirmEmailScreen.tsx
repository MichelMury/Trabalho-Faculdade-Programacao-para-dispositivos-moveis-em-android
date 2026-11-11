import { useEffect, useRef, useState } from 'react';
import { Text } from 'react-native';
import { AuthLayout } from '../components/AuthLayout';
import { AuthButton, AuthLink, Notice } from '../components/AuthControls';
import { authStyles as s } from '../components/authStyles';
import { authMessage } from '../auth/types';

export function ConfirmEmailScreen({ email, onResend, onBack }: { email: string; onResend: () => Promise<void>; onBack: () => void }) {
  const [busy, setBusy] = useState(false);
  const [remaining, setRemaining] = useState(60);
  const [message, setMessage] = useState('');
  const inFlight = useRef(false);
  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setTimeout(() => setRemaining(old => old - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining]);
  async function resend() {
    if (inFlight.current || remaining > 0) return;
    inFlight.current = true; setBusy(true);
    try { await onResend(); setMessage('Se houver uma confirmação pendente, um novo e-mail será enviado.'); setRemaining(60); }
    catch (error) { setMessage(authMessage(error)); }
    finally { inFlight.current = false; setBusy(false); }
  }
  return <AuthLayout title="Falta só um carinho." subtitle="Confirme seu e-mail para começar." eyebrow="QUASE TUDO PRONTO">
    <Text style={s.formTitle}>Confira sua caixa de entrada</Text>
    <Text style={[s.subtitle, { textAlign: 'left', marginBottom: 20 }]}>Se o cadastro puder ser concluído, você receberá uma mensagem em {email}. Abra o link de confirmação e depois volte ao aplicativo para entrar. Confira também a pasta de spam.</Text>
    <Notice message={message} />
    <AuthButton label="Voltar para entrar" onPress={onBack} disabled={busy} />
    <AuthLink label={remaining > 0 ? `Reenviar e-mail em ${remaining}s` : 'Reenviar confirmação'} onPress={resend} disabled={busy || remaining > 0} />
  </AuthLayout>;
}
