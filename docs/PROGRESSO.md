# Progresso do trabalho

## 11/11/2026 — `feat/tela-login`

Escopo confirmado: criar somente a tela de login, mantendo o restante do aplicativo para os próximos dias.

- [x] Base React Native + Expo para Android e iOS.
- [x] Tela de login com cores inspiradas na referência.
- [x] Apenas ilustrações de roupinhas infantis.
- [x] Validação de campos e botão para mostrar/ocultar senha.
- [x] Casos de teste automatizados do formulário.

Validação desta etapa: 7 testes automatizados aprovados, TypeScript sem erros, prévia web compilada e bundles Hermes exportados para Android e iOS. Revisão visual no navegador em 390 × 844 e 320 × 568, sem transbordamento horizontal. A exportação dos bundles não substitui gerar APK/IPA ou testar em dispositivos: Android e iOS físicos ainda não foram testados.

## 11/11/2026 — `feat/login-cadastro`

- [x] Login e cadastro integrados ao Supabase Auth por HTTPS.
- [x] Nome, e-mail, senha e confirmação, com validação e erros em português.
- [x] Cadastro imediato para a aula, sem confirmação de e-mail, autorizado pelo usuário.
- [x] Área Minha conta e logout do aparelho atual.
- [x] Persistência da sessão cifrada com AES-GCM e chave no SecureStore.
- [x] Restauração validada no servidor e renovação automática da sessão.
- [x] Fluxo de confirmação/reenvio para quando a confirmação for habilitada.
- [x] Pelo menos três telas: login, cadastro, Minha conta; há ainda confirmação de e-mail.

Validação: 28 testes automatizados aprovados, TypeScript sem erros e exportação de bundles para Android, iOS e web. No servidor real, foram verificados cadastro, recusa de senha incorreta, login por dois clientes, identidade retornada pelo servidor e logout de um cliente sem encerrar o outro. No navegador, login e logout reais foram exercitados e o cadastro revisado em 390 × 844. A verificação das APIs nativas de persistência em dispositivos reais continua necessária. Foi criada uma conta sintética identificada como “Teste automatizado” para essas verificações.

## Requisitos da entrega completa — ainda pendentes

- [x] Autenticação com tratamento seguro das credenciais e transporte HTTPS.
- [x] Persistência da sessão de autenticação no celular.
- [ ] Recurso do celular, como vibração, câmera ou galeria.
- [ ] Uso de `FlatList` em uma lista apropriada.
- [x] Pelo menos três telas.
- [x] Testes das novas funcionalidades.
- [ ] Verificação em Android e iOS físicos ou emuladores/simuladores.

FlatList e um recurso do celular permanecem para próximas etapas solicitadas. Para uso com clientes reais, configure SMTP e confirmação de e-mail; a confirmação está desligada especificamente para a demonstração acadêmica autorizada. Recuperação de senha ainda não foi implementada.
