import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, serif } from '../theme';
import { Icon } from './Icon';

export function StoreHeader({ onBack, onLogout }: { onBack?: () => void; onLogout?: () => void }) {
  return <View>
    <View style={s.ribbon}>{[colors.lilac, '#A7C69B', '#E5A6B7', colors.mint, colors.peach].map(color => <View key={color} style={{ flex: 1, backgroundColor: color }} />)}</View>
    <View style={s.row}>
      {onBack ? <Pressable accessibilityRole="button" accessibilityLabel="Voltar para a home" onPress={onBack} style={s.action}><Text style={s.actionText}>‹ Voltar</Text></Pressable> : <View style={s.action}><Icon name="heart" color={colors.pinkDark} /></View>}
      <View style={s.brand}><Text style={s.name}>Ana’s Baby</Text><Text style={s.tagline}>M O D A  I N F A N T I L</Text></View>
      {onLogout ? <Pressable accessibilityRole="button" onPress={onLogout} style={s.action}><Text style={s.actionText}>Sair</Text></Pressable> : <View style={s.action} />}
    </View>
  </View>;
}

const s = StyleSheet.create({
  ribbon: { height: 4, flexDirection: 'row' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 19 },
  action: { minWidth: 64, minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  actionText: { color: colors.pinkDark, fontSize: 13, fontWeight: '600' },
  brand: { flex: 1, alignItems: 'center' },
  name: { fontFamily: serif, fontStyle: 'italic', fontSize: 27, color: colors.ink },
  tagline: { fontSize: 8, color: colors.pinkDark, marginTop: 5 },
});
