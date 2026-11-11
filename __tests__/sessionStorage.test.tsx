import { sessionStorage } from '../src/auth/sessionStorage.native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

jest.mock('@react-native-async-storage/async-storage', () => {
  const data = new Map<string, string>();
  return { getItem: jest.fn(async (key: string) => data.get(key) ?? null), setItem: jest.fn(async (key: string, value: string) => { data.set(key, value); }), removeItem: jest.fn(async (key: string) => { data.delete(key); }), clear: jest.fn(async () => data.clear()) };
});
jest.mock('expo-secure-store', () => {
  const data = new Map<string, string>();
  return { WHEN_UNLOCKED_THIS_DEVICE_ONLY: 1, getItemAsync: jest.fn(async (key: string) => data.get(key) ?? null), setItemAsync: jest.fn(async (key: string, value: string) => { data.set(key, value); }), deleteItemAsync: jest.fn(async (key: string) => { data.delete(key); }) };
});
// Em Node, usa AES-GCM real via WebCrypto para testar o adaptador. As APIs
// nativas Expo são verificadas separadamente em aparelhos físicos.
jest.mock('expo-crypto', () => {
  const { webcrypto, createHash } = require('node:crypto');
  const { Buffer } = require('node:buffer');
  return {
    CryptoDigestAlgorithm: { SHA256: 'SHA256' },
    digestStringAsync: async (_algorithm: string, value: string) => createHash('sha256').update(value).digest('hex'),
    AESEncryptionKey: {
      generate: async () => { const bytes = webcrypto.getRandomValues(new Uint8Array(32)); return { encoded: async () => Buffer.from(bytes).toString('hex') }; },
      import: async (encoded: string) => webcrypto.subtle.importKey('raw', Buffer.from(encoded, 'hex'), 'AES-GCM', false, ['encrypt', 'decrypt']),
    },
    AESSealedData: { fromCombined: (value: string) => value },
    aesEncryptAsync: async (bytes: Uint8Array, key: CryptoKey) => {
      const nonce = webcrypto.getRandomValues(new Uint8Array(12));
      const cipher = await webcrypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, key, bytes);
      return { combined: async () => Buffer.concat([Buffer.from(nonce), Buffer.from(cipher)]).toString('base64') };
    },
    aesDecryptAsync: async (value: string, key: CryptoKey) => {
      const data = Buffer.from(value, 'base64');
      return new Uint8Array(await webcrypto.subtle.decrypt({ name: 'AES-GCM', iv: data.subarray(0, 12) }, key, data.subarray(12)));
    },
  };
});
beforeAll(() => {
  const util = require('node:util');
  Object.defineProperty(globalThis, 'TextEncoder', { configurable: true, value: util.TextEncoder });
  Object.defineProperty(globalThis, 'TextDecoder', { configurable: true, value: util.TextDecoder });
});
beforeEach(() => { jest.clearAllMocks(); });

test('persiste e restaura sessão grande com caracteres acentuados sem texto puro', async () => {
  const value = JSON.stringify({ name: 'João 🧸', token: 'credencial-de-teste'.repeat(400) });
  await sessionStorage.setItem('test-large', value);
  const stored = jest.mocked(AsyncStorage.setItem).mock.calls.at(-1)![1];
  expect(stored).not.toContain('credencial-de-teste');
  expect(stored).not.toContain('João');
  await expect(sessionStorage.getItem('test-large')).resolves.toBe(value);
  expect(jest.mocked(SecureStore.setItemAsync).mock.calls[0][1]).toHaveLength(64);
});
test('usa nonce diferente ao gravar novamente a mesma sessão', async () => {
  await sessionStorage.setItem('test-nonce', 'mesma sessão');
  await sessionStorage.setItem('test-nonce', 'mesma sessão');
  const calls = jest.mocked(AsyncStorage.setItem).mock.calls;
  expect(calls[0][1]).not.toBe(calls[1][1]);
  await expect(sessionStorage.getItem('test-nonce')).resolves.toBe('mesma sessão');
});
test('não aceita sessão adulterada', async () => {
  await sessionStorage.setItem('test-tamper', 'credencial');
  const [key, encrypted] = jest.mocked(AsyncStorage.setItem).mock.calls[0];
  await AsyncStorage.setItem(key, encrypted.slice(0, 20) + (encrypted[20] === 'A' ? 'B' : 'A') + encrypted.slice(21));
  await expect(sessionStorage.getItem('test-tamper')).rejects.toThrow();
});
test('sair remove a chave e a sessão persistida', async () => {
  await sessionStorage.setItem('test-remove', 'credencial');
  await sessionStorage.removeItem('test-remove');
  await expect(sessionStorage.getItem('test-remove')).resolves.toBeNull();
  expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(1);
  expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1);
});
