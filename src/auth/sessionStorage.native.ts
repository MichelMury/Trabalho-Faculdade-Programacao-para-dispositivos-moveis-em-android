import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { AESEncryptionKey, AESSealedData, aesEncryptAsync, aesDecryptAsync, digestStringAsync, CryptoDigestAlgorithm } from 'expo-crypto';

// Somente a chave AES fica no Keychain/Keystore. A sessão pode ser maior que o
// limite de um item do SecureStore e é persistida como ciphertext autenticado.
async function storageKeys(key: string) {
  const hash = await digestStringAsync(CryptoDigestAlgorithm.SHA256, key);
  return { encryption: `ana-baby.${hash}.key`, payload: `ana-baby.${hash}.session` };
}

export const sessionStorage = {
  async getItem(key: string): Promise<string | null> {
    const keys = await storageKeys(key);
    const cipher = await AsyncStorage.getItem(keys.payload);
    if (!cipher) return null;
    const encodedKey = await SecureStore.getItemAsync(keys.encryption);
    if (!encodedKey) {
      await AsyncStorage.removeItem(keys.payload);
      return null;
    }
    const aesKey = await AESEncryptionKey.import(encodedKey, 'hex');
    const bytes = await aesDecryptAsync(AESSealedData.fromCombined(cipher), aesKey);
    return new TextDecoder().decode(bytes);
  },
  async setItem(key: string, value: string): Promise<void> {
    const keys = await storageKeys(key);
    let encodedKey = await SecureStore.getItemAsync(keys.encryption);
    if (!encodedKey) {
      const generatedKey = await AESEncryptionKey.generate();
      encodedKey = await generatedKey.encoded('hex');
      await SecureStore.setItemAsync(keys.encryption, encodedKey, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY });
    }
    const aesKey = await AESEncryptionKey.import(encodedKey, 'hex');
    const sealed = await aesEncryptAsync(new TextEncoder().encode(value), aesKey);
    await AsyncStorage.setItem(keys.payload, await sealed.combined('base64'));
  },
  async removeItem(key: string): Promise<void> {
    const keys = await storageKeys(key);
    // Remover primeiro a chave torna o ciphertext inútil mesmo se a segunda operação falhar.
    await SecureStore.deleteItemAsync(keys.encryption);
    await AsyncStorage.removeItem(keys.payload);
  },
};
