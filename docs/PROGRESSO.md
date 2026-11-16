# Progresso do trabalho

## 16/11/2026 — `test/requisitos-relatorio`

Três novos casos automatizados adicionados e sete anteriores preservados. Resultado local: 10 testes aprovados em 4 arquivos; TypeScript sem erros; exportação web, Android e iOS concluída. Os bundles nativos não são APK/IPA.

Conferência manual na prévia web: cadastro, navegação, seleção de tamanho e quantidade, total de R$ 79,80 para duas peças de R$ 39,90 e novo login após recarregar a página. Inspeção visual da home e dos detalhes. A largura de 390 pixels não apresentou transbordamento horizontal na verificação do DOM. Sem teste em celular real e sem envio de mensagens.

Workflow GitHub Actions e guia `docs/TESTES.md` acrescentados para consultar resultados e obter evidências do relatório. O resultado remoto deve ser conferido na execução correspondente; o registro acima se refere à validação local.

O repositório também contém a branch anterior `feat/login-cadastro`, que foi preservada. Esta linha de trabalho parte da `main` e usa cadastro local conforme a preferência informada nesta etapa.

## 16/11/2026 — `feat/home-catalogo-whatsapp`

- Login e cadastro conectados à home; sair retorna ao login e limpa a sessão em memória.
- Home com FlatList de duas colunas, filtros de categoria e ilustrações originais de roupas.
- Terceira tela com detalhes, seleção de tamanho, quantidade e cálculo em centavos.
- Integração via Linking com WhatsApp 55 21 98967 0373. Abre mensagem com peça, tamanho, quantidade, preço unitário e total. O cliente confirma o envio.
- Voltar pelo botão da tela ou botão físico do Android retorna ao catálogo.

Produtos e preços são de demonstração. Fotos, estoque, frete, pagamento e confirmação automática de venda não foram integrados. A mensagem identifica a demonstração e orienta confirmar entrega e disponibilidade. Não há envio automático de mensagens.

## 16/11/2026 — `feat/autenticacao-local`

Cadastro e verificação local de contas com PBKDF2 HMAC SHA256, 600 mil iterações e salt aleatório de 16 bytes por conta. Persistência com AsyncStorage de e-mail, salt e hash; a senha não é armazenada. Cadastro acessível pela própria tela de login. Integração de navegação na próxima etapa.

Este é um cadastro acadêmico no aparelho, sem servidor, sessão persistente ou recuperação de senha. Não equivale a uma autenticação de produção nem sincroniza contas entre dispositivos. Hash de senha não é criptografia reversível. Para uma loja real, será necessário serviço de autenticação e controle de acesso no servidor.

## 11/11/2026 — `feat/tela-login`

Escopo confirmado: criar somente a tela de login, mantendo o restante do aplicativo para os próximos dias.

- [x] Base React Native + Expo para Android e iOS.
- [x] Tela de login com cores inspiradas na referência.
- [x] Apenas ilustrações de roupinhas infantis.
- [x] Validação de campos e botão para mostrar/ocultar senha.
- [x] Casos de teste automatizados do formulário.

Validação desta etapa: 7 testes automatizados aprovados, TypeScript sem erros, prévia web compilada e bundles Hermes exportados para Android e iOS. Revisão visual no navegador em 390 × 844 e 320 × 568, sem transbordamento horizontal. A exportação dos bundles não substitui gerar APK/IPA ou testar em dispositivos: Android e iOS físicos ainda não foram testados.

## Requisitos registrados em 11/11/2026 — situação naquela data

- [ ] Autenticação real com tratamento seguro das credenciais e transporte HTTPS.
- [ ] Persistência de dados, se escolhida para o trabalho.
- [ ] Recurso do celular, como vibração, câmera ou galeria.
- [ ] Uso de `FlatList` em uma lista apropriada.
- [ ] Pelo menos três telas.
- [ ] Testes das novas funcionalidades.
- [ ] Verificação em Android e iOS físicos ou emuladores/simuladores.

Os itens acima serão implementados somente nas próximas etapas solicitadas. A tela atual não deve ser apresentada como autenticação completa ou login criptografado.
