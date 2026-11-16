import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRandomBytesAsync } from 'expo-crypto';
import { AUTH_TIMEOUT_MS, login, register } from '../src/services/auth';

jest.mock('expo-crypto', () => ({ getRandomBytesAsync: jest.fn() }));

test('CT01 cadastro persiste hash e salt, rejeita senha errada e permite entrar novamente', async () => {
  await AsyncStorage.clear();
  // Só a fonte nativa de aleatoriedade é substituída: PBKDF2 executa de verdade.
  jest.mocked(getRandomBytesAsync).mockResolvedValueOnce(new Uint8Array(16).fill(1)).mockResolvedValueOnce(new Uint8Array(16).fill(2));
  const password = 'Senha de teste 123';
  let timerRanDuringHash = false;
  const heartbeat = setTimeout(() => { timerRanDuringHash = true; }, 0);
  await register('  MICHEL@exemplo.com  ', password);
  clearTimeout(heartbeat);
  // Regressão Expo Go: o cálculo precisa liberar timers e renderização.
  expect(timerRanDuringHash).toBe(true);
  const raw = (await AsyncStorage.getItem('@anasbaby/account/michel@exemplo.com'))!;
  const account = JSON.parse(raw);
  expect(raw).not.toContain(password);
  expect(account).toMatchObject({ version: 1, email: 'michel@exemplo.com', iterations: 600000 });
  expect(account.hash).toMatch(/^[a-f0-9]{64}$/);
  expect(account.salt).toHaveLength(32);
  await register('outra@exemplo.com', password);
  const other = JSON.parse((await AsyncStorage.getItem('@anasbaby/account/outra@exemplo.com'))!);
  expect(other.hash).not.toBe(account.hash);
  await expect(login('michel@exemplo.com', 'senha incorreta')).rejects.toThrow('E-mail ou senha incorretos.');
  await expect(login('michel@exemplo.com', password)).resolves.toEqual({ email: 'michel@exemplo.com' });
  await expect(register('michel@exemplo.com', password)).rejects.toThrow('já tem cadastro');
  await expect(register('curta@exemplo.com', '123')).rejects.toThrow('8 a 128');
}, 120000);

test('CT04 leitura local travada encerra com erro e ignora a conclusão atrasada', async () => {
  jest.useFakeTimers();
  let resolveRead!: (value: string | null) => void;
  const read = jest.spyOn(AsyncStorage, 'getItem').mockImplementationOnce(() => new Promise(resolve => { resolveRead = resolve; }));
  try {
    const attempt = login('travado@exemplo.com', 'Senha de teste 123');
    const result = expect(attempt).rejects.toThrow('A verificação demorou demais');
    await jest.advanceTimersByTimeAsync(AUTH_TIMEOUT_MS);
    await result;
    resolveRead(null);
    await Promise.resolve();
    expect(jest.getTimerCount()).toBe(0);
  } finally {
    read.mockRestore();
    jest.useRealTimers();
  }
});
