# Ana’s Baby — aplicativo mobile

Primeira etapa do trabalho: **somente a tela de login**, em React Native + Expo + TypeScript, para Android e iOS. A prévia web serve para conferir a interface no computador.

## O que está pronto

- Tela em português, com rosa suave, branco, lilás e detalhes em verde-água inspirados em https://www.anasbabyreborn.com.br/.
- Ilustrações vetoriais originais de roupas infantis. Sem bonecas, fotos de bebês ou imagens externas.
- E-mail e senha, exibição/ocultação da senha, validação e mensagens acessíveis.
- Rolagem, área segura e tratamento do teclado para telas pequenas.
- Estado de carregamento e prevenção de envio duplicado para a integração futura.
- Testes automatizados do formulário e configuração TypeScript estrita.

**Esta etapa é de interface.** Nenhuma senha é salva ou enviada, nenhum usuário é autenticado. Entrar, criar conta e recuperar senha informam que o acesso estará disponível em breve. `LoginScreen` aceita uma função assíncrona `onLogin` para a futura integração.

## Executar

Requer Node.js 22 ou superior e pnpm 11.25.0 (`npm install -g pnpm@11.25.0`).

```sh
git clone -b feat/tela-login https://github.com/Huttas/Trabalho-Faculdade-programa-o-para-dispositivos-m-veis-em-android.git
cd Trabalho-Faculdade-programa-o-para-dispositivos-m-veis-em-android
pnpm install --frozen-lockfile
pnpm start
```

Abra o projeto com uma versão do Expo Go compatível com o SDK 58 no Android ou iPhone. Celular e computador precisam estar na mesma rede. No Windows, o iOS pode ser conferido em um iPhone físico; o simulador iOS exige macOS/Xcode.

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
- `__tests__/LoginScreen.test.tsx`: casos automatizados.
- `docs/PROGRESSO.md`: histórico e próximas etapas do trabalho.

## Branches

Esta etapa fica em `feat/tela-login`. A `main` fica preservada até a revisão/integração. Para uma etapa posterior, primeiro use como base a versão mais recente aprovada e crie uma branch com o nome da funcionalidade, por exemplo `feat/autenticacao` ou `feat/cadastro`. Commits registram o progresso de cada etapa, sem sobrescrever as anteriores.

## Referências técnicas

- https://docs.expo.dev/
- https://docs.expo.dev/versions/latest/sdk/svg/
- https://callstack.github.io/react-native-testing-library/
