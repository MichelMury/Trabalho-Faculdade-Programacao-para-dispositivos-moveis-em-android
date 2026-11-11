# Ana’s Baby — aplicativo mobile

Aplicativo React Native + Expo + TypeScript para Android e iOS. Etapa atual: cadastro e login por e-mail e senha com Supabase Auth, para usar a mesma conta em vários aparelhos. A prévia web serve para conferir a interface no computador.

## O que está pronto

- Tela em português, com rosa suave, branco, lilás e detalhes em verde-água inspirados em https://www.anasbabyreborn.com.br/.
- Ilustrações vetoriais originais de roupas infantis. Sem bonecas, fotos de bebês ou imagens externas.
- E-mail e senha, exibição/ocultação da senha, validação e mensagens acessíveis.
- Rolagem, área segura e tratamento do teclado para telas pequenas.
- Login, cadastro com confirmação de senha, confirmação de e-mail quando exigida pelo servidor e área Minha conta com logout.
- Sessão renovada automaticamente e persistida com AES-GCM no celular, com a chave protegida pelo SecureStore.
- Estado de carregamento, erros em português e prevenção de envio duplicado.
- Testes automatizados do formulário e configuração TypeScript estrita.

As senhas são enviadas somente por HTTPS ao Supabase Auth, que faz a verificação no servidor. O app não grava senhas. No Android/iOS, somente a sessão é persistida de forma cifrada. Na prévia web a sessão fica em memória e é encerrada ao recarregar a página.

A configuração pública do projeto fica em `src/auth/publicConfig.ts`: somente a URL e a chave publishable, próprias para distribuição em aplicativos. Não contém senha do banco nem chave secret/service_role. Para usar outro projeto, copie `.env.example` para `.env`, preencha os valores públicos e reinicie o Expo.

O cadastro imediato sem confirmação de e-mail está habilitado para a apresentação, conforme autorizado. Antes de usar com clientes reais, configure SMTP e confirmação de e-mail. Veja [os detalhes da autenticação](docs/AUTENTICACAO.md).

## Executar

Requer Node.js 24 LTS (ou 22.13.0+) e pnpm 11.25.0 (`npm install -g pnpm@11.25.0`).

```sh
git clone -b feat/login-cadastro https://github.com/Huttas/Trabalho-Faculdade-programa-o-para-dispositivos-m-veis-em-android.git
cd Trabalho-Faculdade-programa-o-para-dispositivos-m-veis-em-android
pnpm install --frozen-lockfile
pnpm start
```

Abra o projeto com uma versão do Expo Go compatível com o SDK 58 no Android ou iPhone. No iPhone, entre com a mesma conta Expo no Expo Go e na CLI (pnpm exec expo login). Celular e computador precisam estar na mesma rede. No Windows, o iOS pode ser conferido em um iPhone físico; o simulador iOS exige macOS/Xcode.

```sh
pnpm web           # prévia no navegador
pnpm typecheck     # verificação de tipos
pnpm test          # testes automatizados
pnpm export:web    # compilação da prévia web
```

## Organização

- `App.tsx`: inicialização do aplicativo e área segura.
- `src/screens/LoginScreen.tsx`: tela e comportamento do formulário.
- `src/components/`: ícones e ilustração originais.
- `src/theme.ts`: paleta e tipografia.
- `src/auth/`: integração Supabase e persistência cifrada da sessão.
- `src/AuthApp.tsx`: navegação, restauração e renovação da sessão.
- `__tests__/`: testes de login, cadastro, navegação, integração e criptografia da sessão.
- `docs/PROGRESSO.md`: histórico e próximas etapas do trabalho.

## Branches

Esta etapa fica em `feat/login-cadastro`. A etapa inicial permanece em `feat/tela-login`. A `main` fica preservada até a revisão/integração. Para uma etapa posterior, primeiro use como base a versão mais recente aprovada e crie uma branch com o nome da funcionalidade. Commits registram o progresso de cada etapa, sem sobrescrever as anteriores.

## Referências técnicas

- https://docs.expo.dev/
- https://docs.expo.dev/versions/latest/sdk/svg/
- https://callstack.github.io/react-native-testing-library/
