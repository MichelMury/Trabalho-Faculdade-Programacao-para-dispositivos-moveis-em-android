# Progresso do trabalho

## 16/11/2026 — `fix/textos-da-loja`

A pedido de Michel, removidos os avisos de demonstração da home, das descrições das roupas e da mensagem do WhatsApp. Mantidos os dados do pedido, endereço, preços, aviso de frete e confirmação com a loja. Os produtos e preços cadastrados não foram alterados nem validados como catálogo real da empresa.

## 16/11/2026 — `feat/endereco-entrega`

Formulário de entrega acrescentado aos detalhes do produto: nome do recebedor, CEP, rua, número, complemento opcional, bairro, cidade e UF. Validação dos campos obrigatórios, formato do CEP e sigla de estado antes de abrir o WhatsApp. Aceita s/n para endereço sem número. O CEP não é consultado em serviço externo e a validação não comprova a existência física do endereço.

A mensagem do pedido inclui o endereço junto com peça, tamanho, quantidade, preço unitário e total. O cliente confere a mensagem e confirma o envio no WhatsApp. Frete, disponibilidade e prazo permanecem a combinar com a loja. O formulário não efetua cobrança nem agenda entrega automaticamente. O endereço fica apenas na memória da tela, sem persistência adicional.

Incluído tratamento do teclado no iPhone e navegação entre campos. Testes: CT03 ampliado para exigir endereço e conferir a mensagem; CT08 e CT09 cobrem dados inválidos, complemento opcional, endereço acentuado e número s/n. Validação local: 16 testes aprovados em 6 arquivos, TypeScript e exportação web/Android/iOS concluídos. Fluxo de endereço ainda não confirmado em aparelho real.

## 16/11/2026 — `fix/iphone-crypto-nativo`

O novo teste no iPhone continuou atingindo o limite de 30 segundos tanto no login quanto no cadastro. A atualização anterior corrigiu a liberação de tarefas, mas não resolveu a lentidão do PBKDF2 no Hermes desse aparelho.

Substituído o cálculo em JavaScript pelo WebCrypto. No iPhone, uma WebView local usa o motor WebKit; no Android, o motor Chromium. O componente é fornecido pelo Expo Go. O HTML é estático, não carrega páginas externas e bloqueia conexões com CSP; a senha não é enviada pela rede. Na web, WebCrypto é chamado diretamente.

Mantidos PBKDF2 HMAC SHA256, 600 mil iterações, salt e formato do cadastro anterior. Nenhuma conta foi apagada. A biblioteca @noble/hashes foi removida. Foram acrescentados testes do script real com WebCrypto, da comunicação do host nativo e da falha do processo.

Validação local: 14 testes aprovados em 5 arquivos, TypeScript e exportação web/Android/iOS concluídos. A WebView nativa é simulada nos testes. Após reabrir a prévia atualizada, Michel confirmou que o acesso funcionou no iPhone. Essa confirmação cobre o fluxo de acesso; não comprova envio do pedido no WhatsApp ou testes completos de todos os recursos no aparelho. A correção anterior está mantida no histórico, mas não deve ser descrita como solução confirmada no aparelho.

## 16/11/2026 — `fix/login-expo-go`

Após relato de carregamento contínuo no Expo Go, a inspeção da biblioteca @noble/hashes 2.0.1 mostrou que a função de yield usava apenas microtarefas. Atualização para 2.4.0, que libera o agendador de tarefas e permite que timers e renderização avancem durante o PBKDF2. Mantidos algoritmo, 600 mil iterações, salt e formato dos cadastros anteriores.

Adicionado limite de 30 segundos para as operações de autenticação. Uma conclusão após o limite não abre a conta, e verificações de hash concorrentes são rejeitadas enquanto o cálculo anterior ainda termina. O limite não interrompe o cálculo criptográfico em andamento.

Regressão incluída para verificar que timers executam durante o cálculo e novo CT04 para leitura local sem resposta. Validação local: 11 testes aprovados, TypeScript e exportação web/Android/iOS concluídos. Expo reiniciado com túnel e cache limpo. A confirmação de funcionamento no celular do aluno ainda depende de novo teste no aparelho; a compilação não substitui essa confirmação.

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
