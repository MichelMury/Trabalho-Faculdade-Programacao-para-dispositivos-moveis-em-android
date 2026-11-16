import { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProductScreen } from './src/screens/ProductScreen';
import { login, register, type Customer } from './src/services/auth';
import type { Product } from './src/data/products';
import { PasswordCryptoHost } from './src/components/PasswordCryptoHost';

export default function App() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!selected) return false;
      setSelected(null);
      return true;
    });
    return () => listener.remove();
  }, [selected]);
  return <SafeAreaProvider><StatusBar style="dark" /><PasswordCryptoHost />{
    !customer ? <LoginScreen onLogin={async ({ email, password }) => setCustomer(await login(email, password))} onRegister={async ({ email, password }) => setCustomer(await register(email, password))} />
      : selected ? <ProductScreen key={selected.id} product={selected} onBack={() => setSelected(null)} />
        : <HomeScreen onSelect={setSelected} onLogout={() => { setSelected(null); setCustomer(null); }} />
  }</SafeAreaProvider>;
}
