import { useRef, useState, type ComponentRef } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductArt } from '../components/ProductArt';
import { StoreHeader } from '../components/StoreHeader';
import { formatMoney, type Product } from '../data/products';
import { openOrder } from '../services/whatsapp';
import { colors, serif } from '../theme';
import { emptyDelivery, formatPostalCode, validateDelivery, type DeliveryAddress, type DeliveryErrors } from '../services/delivery';

const deliveryFields: { key: keyof DeliveryAddress; label: string; placeholder: string; keyboardType?: TextInputProps['keyboardType']; autoComplete?: TextInputProps['autoComplete']; maxLength: number }[] = [
  { key: 'recipient', label: 'Nome de quem vai receber', placeholder: 'Nome do recebedor', autoComplete: 'name', maxLength: 80 },
  { key: 'postalCode', label: 'CEP', placeholder: '00000-000', keyboardType: 'number-pad', autoComplete: 'postal-code', maxLength: 9 },
  { key: 'street', label: 'Rua ou avenida', placeholder: 'Nome da rua ou avenida', autoComplete: 'street-address', maxLength: 120 },
  { key: 'number', label: 'Número', placeholder: '123 ou s/n', maxLength: 15 },
  { key: 'complement', label: 'Complemento (opcional)', placeholder: 'Apartamento, bloco, casa dos fundos...', maxLength: 120 },
  { key: 'neighborhood', label: 'Bairro', placeholder: 'Seu bairro', maxLength: 80 },
  { key: 'city', label: 'Cidade', placeholder: 'Sua cidade', maxLength: 80 },
  { key: 'state', label: 'Estado (UF)', placeholder: 'RJ', maxLength: 2 },
];

export function ProductScreen({ product, onBack }: { product: Product; onBack: () => void }) {
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [delivery, setDelivery] = useState<DeliveryAddress>({ ...emptyDelivery });
  const [deliveryErrors, setDeliveryErrors] = useState<DeliveryErrors>({});
  const addressInputs = useRef<Partial<Record<keyof DeliveryAddress, ComponentRef<typeof TextInput> | null>>>({});
  const inFlight = useRef(false);
  async function buy() {
    if (inFlight.current) return;
    if (!size) { setNotice('Escolha um tamanho antes de comprar.'); return; }
    const { address, errors } = validateDelivery(delivery);
    setDeliveryErrors(errors);
    const firstInvalid = deliveryFields.find(field => errors[field.key]);
    if (firstInvalid) {
      setNotice('Confira os dados de entrega antes de continuar.');
      addressInputs.current[firstInvalid.key]?.focus();
      return;
    }
    inFlight.current = true; setBusy(true); setNotice('');
    try { await openOrder(product, size, quantity, address); }
    catch { setNotice('Não foi possível abrir o WhatsApp. Confira sua conexão e tente novamente.'); }
    finally { inFlight.current = false; setBusy(false); }
  }
  return <SafeAreaView style={s.safe}><KeyboardAvoidingView style={s.page} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}><ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
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
      <View style={s.delivery}>
        <Text accessibilityRole="header" style={s.deliveryTitle}>Onde vamos entregar?</Text>
        <Text style={s.deliveryHint}>Preencha o endereço para a loja combinar a entrega. O complemento é opcional.</Text>
        {deliveryFields.map((field, index) => <View key={field.key} style={s.deliveryField}>
          <Text style={s.label}>{field.label}</Text>
          <TextInput ref={input => { addressInputs.current[field.key] = input; }} accessibilityLabel={field.label}
            style={[s.addressInput, !!deliveryErrors[field.key] && s.invalidInput]} placeholder={field.placeholder} placeholderTextColor="#A08E98"
            value={delivery[field.key]} editable={!busy} keyboardType={field.keyboardType} autoComplete={field.autoComplete}
            autoCapitalize={field.key === 'state' ? 'characters' : 'words'} autoCorrect={false} maxLength={field.maxLength}
            returnKeyType={index === deliveryFields.length - 1 ? 'done' : 'next'}
            onSubmitEditing={() => { if (index < deliveryFields.length - 1) addressInputs.current[deliveryFields[index + 1].key]?.focus(); }}
            onChangeText={value => {
              const nextValue = field.key === 'postalCode' ? formatPostalCode(value) : field.key === 'state' ? value.replace(/[^a-z]/gi, '').toUpperCase() : value;
              setDelivery(old => ({ ...old, [field.key]: nextValue }));
              setDeliveryErrors(old => ({ ...old, [field.key]: undefined }));
              setNotice('');
            }} />
          {!!deliveryErrors[field.key] && <Text accessibilityRole="alert" style={s.fieldError}>{deliveryErrors[field.key]}</Text>}
        </View>)}
      </View>
      <View style={s.total}><Text style={s.label}>Total das peças</Text><Text testID="order-total" style={s.totalValue}>{formatMoney(product.priceCents * quantity)}</Text></View>
      <Text style={s.note}>Frete não incluído. Disponibilidade, entrega e pagamento serão combinados com a loja no WhatsApp.</Text>
      {!!notice && <Text accessibilityRole="alert" style={s.error}>{notice}</Text>}
      <Pressable accessibilityRole="button" accessibilityLabel="Comprar pelo WhatsApp" accessibilityState={{ busy, disabled: busy }} disabled={busy} onPress={buy} style={({ pressed }) => [s.buy, pressed && { opacity: 0.8 }, busy && { opacity: 0.65 }]}>{busy ? <ActivityIndicator color="white" /> : <Text style={s.buyText}>Comprar pelo WhatsApp →</Text>}</Pressable>
      <Text style={s.note}>O pedido e o endereço abrirão preenchidos na conversa com a loja. Confira e toque em enviar no WhatsApp.</Text>
    </View>
  </ScrollView></KeyboardAvoidingView></SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, alignItems: 'center' },
  page: { flex: 1, width: '100%', maxWidth: 480 },
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
  delivery: { borderTopColor: colors.line, borderTopWidth: 1, paddingTop: 24, marginBottom: 24 },
  deliveryTitle: { fontFamily: serif, fontSize: 24, color: colors.ink },
  deliveryHint: { fontSize: 12, lineHeight: 20, color: colors.muted, marginTop: 8, marginBottom: 20 },
  deliveryField: { marginBottom: 16 },
  addressInput: { minHeight: 52, borderWidth: 1, borderColor: colors.line, borderRadius: 12, backgroundColor: colors.paper, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: colors.ink },
  invalidInput: { borderColor: colors.error },
  fieldError: { color: colors.error, fontSize: 12, lineHeight: 18, marginTop: 6 },
  total: { borderTopColor: colors.line, borderTopWidth: 1, paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 },
  totalValue: { color: colors.ink, fontSize: 25, fontWeight: '700' },
  note: { color: colors.muted, fontSize: 11, lineHeight: 18, marginTop: 10 },
  error: { color: colors.error, fontSize: 13, lineHeight: 20, marginTop: 15 },
  buy: { minHeight: 56, borderRadius: 12, backgroundColor: '#3E7565', alignItems: 'center', justifyContent: 'center', marginTop: 23, paddingHorizontal: 12 },
  buyText: { color: 'white', fontWeight: '600', fontSize: 15, textAlign: 'center' },
});
