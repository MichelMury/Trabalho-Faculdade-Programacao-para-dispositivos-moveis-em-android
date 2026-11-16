import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRandomBytesAsync } from 'expo-crypto';
import { derivePassword, PasswordCryptoError } from './passwordCrypto';

const ITERATIONS = 600_000;
export const AUTH_TIMEOUT_MS = 30_000;
type Account = { version: 1; email: string; salt: string; hash: string; iterations: number };
export type Customer = { email: string };
export class AuthError extends Error {}
const keyFor = (email: string) => `@anasbaby/account/${email}`;
let pendingDerivation: Promise<string> | null = null;

/** Libera o formulário se uma operação local parar de responder. */
async function withDeadline<T>(operation: (ensureActive: () => void) => Promise<T>): Promise<T> {
  let expired = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeoutError = new AuthError('A verificação demorou demais. Feche e abra o aplicativo e tente novamente.');
  const ensureActive = () => { if (expired) throw timeoutError; };
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => { expired = true; reject(timeoutError); }, AUTH_TIMEOUT_MS);
  });
  try {
    return await Promise.race([operation(ensureActive), timeout]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}

async function derive(password: string, salt: string, iterations: number) {
  if (pendingDerivation) throw new AuthError('Uma verificação ainda está terminando. Aguarde alguns segundos e tente novamente.');
  pendingDerivation = derivePassword(password, salt, iterations);
  try { return await pendingDerivation; }
  catch (error) {
    if (error instanceof PasswordCryptoError) throw new AuthError(error.message);
    throw new AuthError('Não foi possível verificar a senha neste aparelho. Tente abrir o app novamente.');
  }
  finally { pendingDerivation = null; }
}

/** Cadastro acadêmico local: só salt e hash são persistidos, nunca a senha. */
export async function register(email: string, password: string): Promise<Customer> {
  return withDeadline(async ensureActive => {
    email = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AuthError('Digite um e-mail válido.');
    if (password.length < 8 || password.length > 128) throw new AuthError('Use uma senha de 8 a 128 caracteres.');
    if (await AsyncStorage.getItem(keyFor(email))) throw new AuthError('Este e-mail já tem cadastro neste aparelho. Entre na sua conta.');
    const salt = Array.from(await getRandomBytesAsync(16), byte => byte.toString(16).padStart(2, '0')).join('');
    ensureActive();
    const account: Account = { version: 1, email, salt, hash: await derive(password, salt, ITERATIONS), iterations: ITERATIONS };
    ensureActive();
    await AsyncStorage.setItem(keyFor(email), JSON.stringify(account));
    ensureActive();
    return { email };
  });
}

export async function login(email: string, password: string): Promise<Customer> {
  return withDeadline(async ensureActive => {
    email = email.trim().toLowerCase();
    const raw = await AsyncStorage.getItem(keyFor(email));
    ensureActive();
    if (!raw || password.length > 128) throw new AuthError('E-mail ou senha incorretos. Cadastre sua conta neste aparelho primeiro.');
    const account: Account = JSON.parse(raw);
    if (account.version !== 1 || account.iterations !== ITERATIONS || !/^[0-9a-f]{32}$/.test(account.salt) || !/^[0-9a-f]{64}$/.test(account.hash)) {
      throw new AuthError('Não foi possível ler o cadastro deste aparelho.');
    }
    const candidate = await derive(password, account.salt, account.iterations);
    ensureActive();
    let difference = 0;
    for (let i = 0; i < account.hash.length; i++) difference |= candidate.charCodeAt(i) ^ account.hash.charCodeAt(i);
    if (difference !== 0) throw new AuthError('E-mail ou senha incorretos.');
    return { email };
  });
}
