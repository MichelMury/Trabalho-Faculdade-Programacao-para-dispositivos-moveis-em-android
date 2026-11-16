import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductArt } from '../components/ProductArt';
import { StoreHeader } from '../components/StoreHeader';
import { formatMoney, type Product } from '../data/products';
import { openOrder } from '../services/whatsapp';
import { colors, serif } from '../theme';

export function ProductScreen({ product, onBack }: { product: Product; onBack: () => void }) {
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  async function buy() {
    if (inFlight.current) return;
    if (!size) { setNotice('Escolha um tamanho antes de comprar.'); return; }
    inFlight.current = true; setBusy(true); setNotice('');
    try { await openOrder(product, size, quantity); }
    catch { setNotice('Não foi possível abrir o WhatsApp. Confira sua conexão e tente novamente.'); }
    finally { inFlight.current = false; setBusy(false); }
  }
  return <SafeAreaView style={s.safe}><ScrollView style={s.page} contentContainerStyle={s.scroll}>
    <StoreHeader onBack={onBack} />
    <View style={s.body}>
      <View style={s.art}><ProductArt product={product} height={260} /></View>
      <Text style={s.eyebrow}>{product.category.toUpperCase()}</Text><Text accessibilityRole="header" style={s.title}>{product.name}</Text><Text style={s.price}>{formatMoney(product.priceCents)}</Text>
      <Text style={s.description}>{product.description}</Text>
      <Text style={s.label}>Escolha o tamanho</Text>
      <View style={s.sizes}>{product.sizes.map(item => <Pressable key={item} accessibilityRole="button" accessibilityLabel={`Tamanho ${item}`} accessibilityState={{ selected: size === item }} disabled={busy} onPress={() => { setSize(item); setNotice(''); }} style={[s.size, size === item && s.selected]}><Text style={[s.sizeText, size === item && { color: 'white' }]}>{item}</Text></Pressable>)}</View>
      <Text style={s.label}>Quantidade</Text><View style={s.quantity}>
        <Pressable accessibilityRole="button" accessibilityLabel="Diminuir quantidade" accessibilityState={{ disabled: quantity === 1 || busy }} disabled={quantity === 1 || busy} onPress={() => setQuantity(value => value - 1)} style={s.quantityButton}><Text style={s.quantitySymbol}>−</Text></Pressable>
        <Text accessibilityLabel={`Quantidade: ${quantity}`} style={s.quantityValue}>{quantity}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Aumentar quantidade" accessibilityState={{ disabled: quantity === 10 || busy }} disabled={quantity === 10 || busy} onPress={() => setQuantity(value => value + 1)} style={s.quantityButton}><Text style={s.quantitySymbol}>+</Text></Pressable>
      </View>
      <View style={s.total}><Text style={s.label}>Total das peças</Text><Text testID="order-total" style={s.totalValue}>{formatMoney(product.priceCents * quantity)}</Text></View>
      <Text style={s.note}>Frete não incluído. Disponibilidade, entrega e pagamento serão combinados com a loja no WhatsApp.</Text>
      {!!notice && <Text accessibilityRole="alert" style={s.error}>{notice}</Text>}
      <Pressable accessibilityRole="button" accessibilityLabel="Comprar pelo WhatsApp" accessibilityState={{ busy, disabled: busy }} disabled={busy} onPress={buy} style={({ pressed }) => [s.buy, pressed && { opacity: 0.8 }, busy && { opacity: 0.65 }]}>{busy ? <ActivityIndicator color="white" /> : <Text style={s.buyText}>Comprar pelo WhatsApp →</Text>}</Pressable>
      <Text style={s.note}>A mensagem abrirá preenchida. Confira e toque em enviar no WhatsApp.</Text>
    </View>
  </ScrollView></SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, alignItems: 'center' },
  page: { width: '100%', maxWidth: 480 },
  scroll: { paddingBottom: 32 },
  body: { paddingHorizontal: 24 },
  art: { backgroundColor: colors.pinkLight, borderRadius: 22, padding: 10, marginBottom: 25 },
  eyebrow: { fontSize: 10, letterSpacing: 1.5, color: colors.pinkDark, fontWeight: '600' },
  title: { fontFamily: serif, fontSize: 29, color: colors.ink, lineHeight: 36, marginTop: 9 },
  price: { color: colors.pinkDark, fontWeight: '700', fontSize: 24, marginTop: 12 },
  description: { fontSize: 13, lineHeight: 21, color: colors.muted, marginTop: 14, marginBottom: 24 },
  label: { color: colors.ink, fontSize: 13, fontWeight: '600', marginBottom: 10 },
  sizes: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginBottom: 25 },
  size: { borderWidth: 1, borderColor: colors.line, minWidth: 54, minHeight: 48, borderRadius: 12, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' },
  selected: { backgroundColor: colors.pinkDark, borderColor: colors.pinkDark },
  sizeText: { color: colors.ink, fontSize: 14, fontWeight: '600' },
  quantity: { flexDirection: 'row', alignItems: 'center', gap: 22, marginBottom: 24 },
  quantityButton: { width: 48, height: 48, backgroundColor: colors.paper, borderColor: colors.line, borderWidth: 1, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  quantitySymbol: { color: colors.pinkDark, fontSize: 25 },
  quantityValue: { color: colors.ink, fontSize: 18, fontWeight: '600' },
  total: { borderTopColor: colors.line, borderTopWidth: 1, paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 },
  totalValue: { color: colors.ink, fontSize: 25, fontWeight: '700' },
  note: { color: colors.muted, fontSize: 11, lineHeight: 18, marginTop: 10 },
  error: { color: colors.error, fontSize: 13, lineHeight: 20, marginTop: 15 },
  buy: { minHeight: 56, borderRadius: 12, backgroundColor: '#3E7565', alignItems: 'center', justifyContent: 'center', marginTop: 23, paddingHorizontal: 12 },
  buyText: { color: 'white', fontWeight: '600', fontSize: 15, textAlign: 'center' },
});
