// HTML e script locais: nenhuma página, biblioteca ou senha é enviada para a internet.
// WebCrypto do WebKit/Chromium executa PBKDF2 fora do Hermes, mantendo o mesmo hash.
export const PASSWORD_WORKER_SCRIPT = `
(function () {
  const post = function (message) { window.ReactNativeWebView.postMessage(JSON.stringify(message)); };
  window.derivePasswordKey = async function (request) {
    try {
      if (!Number.isSafeInteger(request.id) || request.iterations !== 600000 ||
          typeof request.password !== 'string' || request.password.length > 128 ||
          !/^[0-9a-f]{32}$/.test(request.salt)) throw new Error('Invalid request');
      const salt = Uint8Array.from(request.salt.match(/.{2}/g), function (value) { return parseInt(value, 16); });
      const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(request.password), 'PBKDF2', false, ['deriveBits']);
      request.password = '';
      const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: salt, iterations: request.iterations }, key, 256);
      const hash = Array.from(new Uint8Array(bits), function (byte) { return byte.toString(16).padStart(2, '0'); }).join('');
      post({ id: request.id, hash: hash });
    } catch (_) {
      request.password = '';
      post({ id: request.id, error: true });
    }
  };
  post({ ready: !!(globalThis.crypto && crypto.subtle) });
})();
`;

export const PASSWORD_WORKER_HTML = `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; connect-src 'none'"></head><body><script>${PASSWORD_WORKER_SCRIPT}</script></body></html>`;
