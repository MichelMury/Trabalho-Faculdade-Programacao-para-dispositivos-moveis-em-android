import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthApp } from './src/AuthApp';

export default function App() {
  return <SafeAreaProvider><StatusBar style="dark" /><AuthApp /></SafeAreaProvider>;
}
