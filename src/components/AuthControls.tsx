import { forwardRef, useState, type ComponentRef, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Icon } from './Icon';
import { authStyles as s } from './authStyles';

type FieldProps = TextInputProps & { label: string; error?: string; password?: boolean; action?: ReactNode };
export const AuthField = forwardRef<ComponentRef<typeof TextInput>, FieldProps>(function AuthField({ label, error, password, action, ...props }, ref) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const visibilityLabel = label === 'Confirmar senha' ? 'confirmação de senha' : 'senha';
  return <View style={{ marginBottom: 18 }}>
    <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}><Text style={s.label}>{label}</Text>{action}</View>
    <View style={[s.inputBox, focused && s.focus, !!error && s.invalid]}>
      <Icon name={password ? 'lock' : label === 'Nome' ? 'user' : 'mail'} />
      <TextInput {...props} ref={ref} accessibilityLabel={label} style={s.input} placeholderTextColor="#A08E98" secureTextEntry={password ? !visible : false} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      {password && <Pressable accessibilityRole="button" accessibilityLabel={`${visible ? 'Ocultar' : 'Mostrar'} ${visibilityLabel}`} style={s.eye} disabled={props.editable === false} onPress={() => setVisible(old => !old)}><Icon name={visible ? 'eye-off' : 'eye'} /></Pressable>}
    </View>
    {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
  </View>;
});

export function AuthButton({ label, busy = false, onPress, disabled = false }: { label: string; busy?: boolean; disabled?: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: busy || disabled, busy }} disabled={busy || disabled} onPress={onPress} style={({ pressed }) => [s.button, { marginTop: 5 }, pressed && s.pressed, (busy || disabled) && s.disabled]}>
    {busy ? <ActivityIndicator color="white" accessibilityLabel="Aguarde" /> : <><Text style={s.buttonText}>{label}</Text><Icon name="arrow" color="white" size={21} /></>}
  </Pressable>;
}

export function Notice({ message, onClose }: { message: string; onClose?: () => void }) {
  if (!message) return null;
  return <View style={[s.notice, { marginTop: 0, marginBottom: 14 }]}><Text accessibilityRole="alert" style={s.noticeText}>{message}</Text>{onClose && <Pressable accessibilityRole="button" accessibilityLabel="Fechar aviso" style={s.dismiss} onPress={onClose}><Icon name="close" size={16} /></Pressable>}</View>;
}

export function AuthLink({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={{ minHeight: 44, justifyContent: 'center', alignItems: 'center' }}><Text style={s.signupLink}>{label}</Text></Pressable>;
}
