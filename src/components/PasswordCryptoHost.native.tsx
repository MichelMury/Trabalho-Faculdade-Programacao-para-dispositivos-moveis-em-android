import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import WebView, { type WebViewMessageEvent } from 'react-native-webview';
import { installPasswordDeriver, PasswordCryptoError, type PasswordDeriver } from '../services/passwordCrypto';
import { PASSWORD_WORKER_HTML } from '../services/passwordWorker';

const source = { html: PASSWORD_WORKER_HTML, baseUrl: 'https://localhost/' };
type Job = { resolve: (hash: string) => void; reject: (error: Error) => void; timer: ReturnType<typeof setTimeout> };

/** Host local de 1 pixel para usar WebCrypto sem executar PBKDF2 no Hermes. */
export function PasswordCryptoHost() {
  const webView = useRef<WebView<object>>(null);
  const jobs = useRef(new Map<number, Job>());
  const sequence = useRef(0);
  const uninstall = useRef<(() => void) | null>(null);
  const engineError = () => new PasswordCryptoError('Não foi possível iniciar a verificação segura neste aparelho. Feche o Expo Go e tente novamente.');

  const derive: PasswordDeriver = (password, salt, iterations) => new Promise((resolve, reject) => {
    const id = ++sequence.current;
    if (!webView.current) { reject(engineError()); return; }
    const timer = setTimeout(() => {
      jobs.current.delete(id);
      reject(new PasswordCryptoError('O cálculo da senha não respondeu. Feche o Expo Go e tente novamente.'));
    }, 20_000);
    jobs.current.set(id, { resolve, reject, timer });
    try {
      webView.current.injectJavaScript(`window.derivePasswordKey(${JSON.stringify({ id, password, salt, iterations })}); true;`);
    } catch {
      clearTimeout(timer); jobs.current.delete(id); reject(engineError());
    }
  });

  function failEngine() {
    uninstall.current?.();
    uninstall.current = installPasswordDeriver(async () => { throw engineError(); });
    for (const job of jobs.current.values()) { clearTimeout(job.timer); job.reject(engineError()); }
    jobs.current.clear();
  }

  function onMessage(event: WebViewMessageEvent) {
    let data: { ready?: boolean; id?: number; hash?: string; error?: boolean };
    try { data = JSON.parse(event.nativeEvent.data); } catch { return; }
    if (typeof data.ready === 'boolean') {
      if (!data.ready) { failEngine(); return; }
      uninstall.current?.();
      uninstall.current = installPasswordDeriver(derive);
      return;
    }
    if (typeof data.id !== 'number') return;
    const job = jobs.current.get(data.id);
    if (!job) return;
    clearTimeout(job.timer); jobs.current.delete(data.id);
    if (!data.error && typeof data.hash === 'string' && /^[0-9a-f]{64}$/.test(data.hash)) job.resolve(data.hash);
    else job.reject(engineError());
  }

  useEffect(() => () => {
    uninstall.current?.();
    for (const job of jobs.current.values()) { clearTimeout(job.timer); job.reject(engineError()); }
    jobs.current.clear();
  }, []);

  return <View pointerEvents="none" accessible={false} importantForAccessibility="no-hide-descendants" style={{ position: 'absolute', left: 0, top: 0, width: 1, height: 1, opacity: 0 }}>
    <WebView<object> ref={webView} source={source} originWhitelist={['https://localhost', 'about:blank']} onMessage={onMessage}
      onError={failEngine} onContentProcessDidTerminate={failEngine} onRenderProcessGone={failEngine}
      onShouldStartLoadWithRequest={request => request.url === 'about:blank' || request.url === 'https://localhost/'}
      javaScriptEnabled domStorageEnabled={false} incognito cacheEnabled={false} scrollEnabled={false}
      allowFileAccess={false} allowFileAccessFromFileURLs={false} allowUniversalAccessFromFileURLs={false}
      setSupportMultipleWindows={false} accessible={false} style={{ width: 1, height: 1, backgroundColor: 'transparent' }} />
  </View>;
}
