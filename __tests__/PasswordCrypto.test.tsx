import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { PasswordCryptoHost } from '../src/components/PasswordCryptoHost.native';
import { derivePassword } from '../src/services/passwordCrypto';
import { PASSWORD_WORKER_SCRIPT } from '../src/services/passwordWorker';

const { webcrypto, pbkdf2Sync } = require('node:crypto');
const { Buffer } = require('node:buffer');
const { runInNewContext } = require('node:vm');
const mockInject = jest.fn();

jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');
  return { __esModule: true, default: React.forwardRef((props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({ injectJavaScript: mockInject }));
    return React.createElement(View, { ...props, testID: 'crypto-host' });
  }) };
});

afterEach(() => { mockInject.mockClear(); });

test('CT05 script local WebCrypto mantém o hash PBKDF2 anterior e não transmite a senha na resposta', async () => {
  const postMessage = jest.fn();
  const workerWindow: any = { ReactNativeWebView: { postMessage } };
  runInNewContext(PASSWORD_WORKER_SCRIPT, { window: workerWindow, crypto: webcrypto, TextEncoder, Uint8Array });
  expect(JSON.parse(postMessage.mock.calls[0][0])).toEqual({ ready: true });
  const password = 'Senha de teste 123';
  const salt = '01010101010101010101010101010101';
  const request = { id: 1, password, salt, iterations: 600000 };
  await workerWindow.derivePasswordKey(request);
  const response = JSON.parse(postMessage.mock.calls[1][0]);
  const expected = pbkdf2Sync(password, Buffer.from(salt, 'hex'), 600000, 32, 'sha256').toString('hex');
  expect(response).toEqual({ id: 1, hash: expected });
  expect(postMessage.mock.calls[1][0]).not.toContain(password);
  expect(request.password).toBe('');
});

test('CT06 host nativo encaminha requisição ao motor local e recebe o resultado', async () => {
  const view = render(<PasswordCryptoHost />);
  const host = screen.getByTestId('crypto-host', { includeHiddenElements: true });
  fireEvent(host, 'message', { nativeEvent: { data: JSON.stringify({ ready: true }) } });
  const result = derivePassword('Senha de teste 123', '01'.repeat(16), 600000);
  expect(mockInject).toHaveBeenCalledTimes(1);
  const injected = mockInject.mock.calls[0][0];
  const request = JSON.parse(injected.slice('window.derivePasswordKey('.length, -'); true;'.length));
  expect(request).toMatchObject({ id: 1, iterations: 600000, salt: '01'.repeat(16) });
  expect(host.props.onShouldStartLoadWithRequest({ url: 'https://example.com' })).toBe(false);
  expect(host.props.source.html).toContain("connect-src 'none'");
  await act(async () => {
    fireEvent(host, 'message', { nativeEvent: { data: JSON.stringify({ id: 1, hash: 'a'.repeat(64) }) } });
    await expect(result).resolves.toBe('a'.repeat(64));
  });
  view.unmount();
});

test('CT07 host rejeita verificação pendente se o processo de cálculo encerrar', async () => {
  const view = render(<PasswordCryptoHost />);
  const host = screen.getByTestId('crypto-host', { includeHiddenElements: true });
  fireEvent(host, 'message', { nativeEvent: { data: JSON.stringify({ ready: true }) } });
  const result = derivePassword('Senha de teste 123', '01'.repeat(16), 600000);
  const assertion = expect(result).rejects.toThrow('Não foi possível iniciar');
  fireEvent(host, 'contentProcessDidTerminate');
  await assertion;
  view.unmount();
});

