import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { Icon } from './Icon';
import { ClothingIllustration } from './ClothingIllustration';
import { authStyles as s } from './authStyles';

export function AuthLayout({ title, subtitle, eyebrow = 'UM MUNDO DE CARINHO', children }: { title: string; subtitle: string; eyebrow?: string; children: ReactNode }) {
  return <SafeAreaView style={s.safe}><KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={s.page}>
        <View style={s.ribbon}>{[colors.lilac, '#A7C69B', '#E5A6B7', colors.mint, colors.peach].map(color => <View key={color} style={[s.ribbonPart, { backgroundColor: color }]} />)}</View>
        <View style={s.content}>
          <View style={s.brand}><View style={s.brandIcon}><Icon name="heart" size={18} color={colors.pinkDark} /></View><Text style={s.brandName}>Ana’s Baby</Text><Text style={s.brandTagline}>M O D A  I N F A N T I L</Text></View>
          <ClothingIllustration />
          <View style={s.heading}><Text style={s.eyebrow}>{eyebrow}</Text><Text accessibilityRole="header" style={s.title}>{title}</Text><Text style={s.subtitle}>{subtitle}</Text></View>
          <View style={s.form}>{children}</View>
          <View style={s.footer}><View style={s.footerLine} /><Icon name="heart" size={13} color={colors.pink} /><Text style={s.footerText}>Feito de carinho, para vestir amor.</Text><View style={s.footerLine} /></View>
        </View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView></SafeAreaView>;
}
