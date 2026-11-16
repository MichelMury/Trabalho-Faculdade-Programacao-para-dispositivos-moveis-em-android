import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRandomBytesAsync } from 'expo-crypto';
import { pbkdf2Async } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, hexToBytes, utf8ToBytes } from '@noble/hashes/utils.js';

const ITERATIONS = 600_000;
type Account = { version: 1; email: string; salt: string; hash: string; iterations: number };
export type Customer = { email: string };
export class AuthError extends Error {}
const keyFor = (email: string) => `@anasbaby/account/${email}`;

async function derive(password: string, salt: string, iterations: number) {
  return bytesToHex(await pbkdf2Async(sha256, utf8ToBytes(password), hexToBytes(salt), {
    c: iterations, dkLen: 32, asyncTick: 10,
  }));
}

/** Cadastro acadêmico local: só salt e hash são persistidos, nunca a senha. */
export async function register(email: string, password: string): Promise<Customer> {
  email = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AuthError('Digite um e-mail válido.');
  if (password.length < 8 || password.length > 128) throw new AuthError('Use uma senha de 8 a 128 caracteres.');
  if (await AsyncStorage.getItem(keyFor(email))) throw new AuthError('Este e-mail já tem cadastro neste aparelho. Entre na sua conta.');
  const salt = bytesToHex(await getRandomBytesAsync(16));
  const account: Account = { version: 1, email, salt, hash: await derive(password, salt, ITERATIONS), iterations: ITERATIONS };
  await AsyncStorage.setItem(keyFor(email), JSON.stringify(account));
  return { email };
}

export async function login(email: string, password: string): Promise<Customer> {
  email = email.trim().toLowerCase();
  const raw = await AsyncStorage.getItem(keyFor(email));
  if (!raw || password.length > 128) throw new AuthError('E-mail ou senha incorretos. Cadastre sua conta neste aparelho primeiro.');
  const account: Account = JSON.parse(raw);
  if (account.version !== 1 || account.iterations !== ITERATIONS || !/^[0-9a-f]{32}$/.test(account.salt) || !/^[0-9a-f]{64}$/.test(account.hash)) {
    throw new AuthError('Não foi possível ler o cadastro deste aparelho.');
  }
  const candidate = await derive(password, account.salt, account.iterations);
  let difference = 0;
  for (let i = 0; i < account.hash.length; i++) difference |= candidate.charCodeAt(i) ^ account.hash.charCodeAt(i);
  if (difference !== 0) throw new AuthError('E-mail ou senha incorretos.');
  return { email };
}
