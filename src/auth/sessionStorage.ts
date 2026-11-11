// Prévia web: sessão em memória. Não grava tokens em localStorage no navegador
// de um laboratório compartilhado. Android/iOS usam sessionStorage.native.ts.
const values = new Map<string, string>();
export const sessionStorage = {
  async getItem(key: string) { return values.get(key) ?? null; },
  async setItem(key: string, value: string) { values.set(key, value); },
  async removeItem(key: string) { values.delete(key); },
};
