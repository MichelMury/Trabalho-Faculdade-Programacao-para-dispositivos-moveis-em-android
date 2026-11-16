export type PasswordDeriver = (password: string, salt: string, iterations: number) => Promise<string>;
export class PasswordCryptoError extends Error {}
let nativeDeriver: PasswordDeriver | null = null;
const waiting = new Set<(derive: PasswordDeriver) => void>();

export function installPasswordDeriver(derive: PasswordDeriver) {
  nativeDeriver = derive;
  for (const ready of waiting) ready(derive);
  waiting.clear();
  return () => { if (nativeDeriver === derive) nativeDeriver = null; };
}

export async function deriveWithWebCrypto(subtle: SubtleCrypto, password: string, salt: string, iterations: number) {
  const saltBytes = Uint8Array.from(salt.match(/.{2}/g)!, value => parseInt(value, 16));
  const key = await subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: saltBytes, iterations }, key, 256);
  return Array.from(new Uint8Array(bits), byte => byte.toString(16).padStart(2, '0')).join('');
}

/** O navegador usa WebCrypto diretamente; aparelhos usam o motor local instalado pelo host. */
export async function derivePassword(password: string, salt: string, iterations: number) {
  if (nativeDeriver) return nativeDeriver(password, salt, iterations);
  if (globalThis.crypto?.subtle) return deriveWithWebCrypto(globalThis.crypto.subtle, password, salt, iterations);
  const derive = await new Promise<PasswordDeriver>((resolve, reject) => {
    const ready = (value: PasswordDeriver) => { clearTimeout(timer); waiting.delete(ready); resolve(value); };
    const timer = setTimeout(() => {
      waiting.delete(ready);
      reject(new PasswordCryptoError('O motor de segurança não iniciou. Feche o Expo Go e abra pelo QR code atualizado.'));
    }, 10_000);
    waiting.add(ready);
  });
  return derive(password, salt, iterations);
}
