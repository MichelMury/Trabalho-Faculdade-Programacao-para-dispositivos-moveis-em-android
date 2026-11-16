import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClothingIllustration } from '../components/ClothingIllustration';
import { ProductArt } from '../components/ProductArt';
import { StoreHeader } from '../components/StoreHeader';
import { formatMoney, products, type Product } from '../data/products';
import { colors, serif } from '../theme';

const categories = ['Todas', 'Bodies', 'Conjuntos', 'Vestidos'] as const;
export function HomeScreen({ onSelect, onLogout }: { onSelect: (product: Product) => void; onLogout: () => void }) {
  const [category, setCategory] = useState<typeof categories[number]>('Todas');
  const filtered = products.filter(product => category === 'Todas' || product.category === category);
  return <SafeAreaView style={s.safe}><View style={s.page}>
    <FlatList testID="catalog-list" data={filtered} keyExtractor={item => item.id} numColumns={2} columnWrapperStyle={s.columns} contentContainerStyle={s.list}
      ListHeaderComponent={<>
        <StoreHeader onLogout={onLogout} />
        <View style={s.hero}><Text style={s.eyebrow}>BEM-VINDO À NOSSA LOJINHA</Text><Text accessibilityRole="header" style={s.title}>Carinho em cada detalhe.</Text><Text style={s.subtitle}>Roupinhas para acompanhar os pequenos momentos.</Text><ClothingIllustration /></View>
        <View style={s.section}><Text accessibilityRole="header" style={s.sectionTitle}>Encontre seu carinho favorito</Text><Text style={s.hint}>Catálogo de demonstração · peças e preços ilustrativos</Text>
          <View style={s.filters}>{categories.map(item => <Pressable key={item} accessibilityRole="button" accessibilityLabel={`Filtrar ${item}`} accessibilityState={{ selected: category === item }} onPress={() => setCategory(item)} style={[s.chip, category === item && s.selected]}><Text style={[s.chipText, category === item && s.selectedText]}>{item}</Text></Pressable>)}</View>
        </View>
      </>}
      renderItem={({ item }) => <Pressable accessibilityRole="button" accessibilityLabel={`Ver ${item.name}`} onPress={() => onSelect(item)} style={({ pressed }) => [s.card, pressed && { opacity: 0.75 }]}>
        <View style={s.art}><ProductArt product={item} /></View><View style={s.cardText}><Text style={s.category}>{item.category}</Text><Text style={s.productName}>{item.name}</Text><Text style={s.price}>{formatMoney(item.priceCents)}</Text><Text style={s.details}>Escolher tamanho →</Text></View>
      </Pressable>}
      ListFooterComponent={<View style={s.footer}><Text style={s.footerTitle}>Gostou de uma roupinha?</Text><Text style={s.subtitle}>Escolha a peça e combine sua compra com a loja pelo WhatsApp.</Text></View>}
    />
  </View></SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, alignItems: 'center' },
  page: { flex: 1, width: '100%', maxWidth: 480 },
  list: { paddingBottom: 24 },
  columns: { paddingHorizontal: 20, gap: 12 },
  hero: { marginHorizontal: 20, paddingHorizontal: 16, paddingTop: 23, backgroundColor: colors.pinkLight, borderRadius: 22, alignItems: 'center' },
  eyebrow: { color: colors.pinkDark, fontSize: 9, letterSpacing: 1.5, fontWeight: '600', textAlign: 'center' },
  title: { fontFamily: serif, fontSize: 27, lineHeight: 35, color: colors.ink, textAlign: 'center', marginTop: 10 },
  subtitle: { fontSize: 12, color: colors.muted, textAlign: 'center', lineHeight: 19, marginTop: 7 },
  section: { paddingHorizontal: 20, paddingTop: 28 },
  sectionTitle: { fontFamily: serif, fontSize: 22, color: colors.ink },
  hint: { color: colors.muted, fontSize: 11, lineHeight: 18, marginTop: 8 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginVertical: 18 },
  chip: { paddingHorizontal: 12, minHeight: 44, borderRadius: 22, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, justifyContent: 'center' },
  selected: { backgroundColor: colors.pinkDark, borderColor: colors.pinkDark },
  chipText: { color: colors.ink, fontSize: 12 },
  selectedText: { color: 'white' },
  card: { flex: 1, borderRadius: 16, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, marginBottom: 14, overflow: 'hidden' },
  art: { backgroundColor: '#F9F0ED' },
  cardText: { padding: 12 },
  category: { color: colors.muted, fontSize: 10 },
  productName: { color: colors.ink, fontSize: 14, fontWeight: '600', lineHeight: 20, marginTop: 6 },
  price: { color: colors.pinkDark, fontSize: 17, fontWeight: '700', marginTop: 10 },
  details: { color: colors.pinkDark, fontSize: 11, lineHeight: 18, marginTop: 8 },
  footer: { marginHorizontal: 20, backgroundColor: '#EAF3F0', borderRadius: 16, padding: 20, marginTop: 8 },
  footerTitle: { color: colors.ink, fontFamily: serif, fontSize: 21, textAlign: 'center' },
});
