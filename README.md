# Ana’s Baby

Aplicativo acadêmico de venda de roupas infantis, desenvolvido por Michel Santos Mury para a disciplina Programação para Dispositivos Móveis, do curso de Análise e Desenvolvimento de Sistemas, com orientação de Lucas Floriano.

**Projeto em desenvolvimento.** Produtos, tamanhos e preços são ilustrativos. O aplicativo encaminha uma intenção de compra ao WhatsApp; disponibilidade, frete, pagamento e confirmação são combinados com a loja.

## Telas e requisitos

| Requisito | Implementação nesta etapa |
| --- | --- |
| Pelo menos três telas | Login/cadastro, home e detalhes do produto |
| FlatList | Catálogo com duas colunas e filtros de categoria |
| Recurso do celular | Abertura do WhatsApp por React Native Linking |
| Proteção da senha | PBKDF2 HMAC SHA256 com salt por conta e 600 mil iterações |
| Persistência local | Cadastro salvo com AsyncStorage, sem senha em texto puro |
| Git | Branches por etapa e commits descritivos |
| Três testes automatizados | CT01, CT02 e CT03, além dos sete testes anteriores |

## Executar

Use Node.js 24 LTS e pnpm 11.25.0.

```sh
git clone -b fix/iphone-crypto-nativo https://github.com/MichelMury/Trabalho-Faculdade-Programacao-para-dispositivos-moveis-em-android.git
cd Trabalho-Faculdade-Programacao-para-dispositivos-moveis-em-android
pnpm install --frozen-lockfile
pnpm start
```

Abra em um Expo Go compatível com o SDK 58. Computador e celular devem estar na mesma rede. Para conferir no navegador, execute `pnpm web`.

Na primeira visita, toque em **Criar uma conta**, informe e-mail e senha de 8 a 128 caracteres. Após cadastrar, a home abre. Use **Sair** para voltar e testar o login com o mesmo cadastro. A conta fica somente neste aparelho ou navegador; limpar os dados do aplicativo remove o cadastro. A sessão fica em memória, então fechar e abrir exige entrar novamente. A recuperação de senha ainda não está disponível.

Na home, escolha uma roupa. Nos detalhes, selecione tamanho e quantidade e toque em **Comprar pelo WhatsApp**. O número configurado é `55 21 98967-0373`. A mensagem inclui peça, tamanho, quantidade, preço unitário e total das peças. A pessoa confirma o envio no WhatsApp. O frete não entra no total.

## Como os dados são guardados

O AsyncStorage guarda o cadastro local no formato `{ version, email, salt, hash, iterations }`. O salt é aleatório e o hash é derivado por PBKDF2. A senha digitada não é gravada. O PBKDF2 usa WebCrypto: em Android/iOS, um host WebView local executa o cálculo fora do Hermes, sem carregar páginas externas ou enviar senhas pela rede; no navegador, WebCrypto é chamado diretamente. O catálogo de demonstração fica em `src/data/products.ts`; ele não é um estoque conectado a um banco de dados.

Hash não é criptografia reversível. Esta implementação serve para demonstrar proteção de senhas e persistência local no trabalho acadêmico. Não há servidor, autenticação entre dispositivos ou proteção de dados de uma loja real. Para produção, seria necessário autenticar e autorizar no servidor, com transporte HTTPS. A proteção visual `secureTextEntry` apenas oculta o campo na tela.

## Testes e evidências

```sh
pnpm typecheck
pnpm test --ci --json --outputFile=resultado-testes.json
node scripts/test-summary.cjs
pnpm exec expo export --platform all --output-dir dist-ci
```

Na aba **Actions**, abra **Testes automatizados** e uma execução da branch `fix/iphone-crypto-nativo`. O **Summary** mostra a tabela de resultados. O passo **Executar testes** mostra a saída do Jest. O guia [docs/TESTES.md](docs/TESTES.md) explica os três casos e quais prints usar no relatório.

Os testes não enviam mensagens. A compilação exporta bundles web, Android e iOS; não gera APK/IPA e não substitui teste em celular real.

## Branches desta entrega

- `feat/autenticacao-local`: cadastro, login local e proteção da senha.
- `feat/home-catalogo-whatsapp`: home, detalhes e integração do pedido.
- `test/requisitos-relatorio`: testes, automação e documentação; contém as etapas anteriores.

As branches são sequenciais: a última reúne o trabalho desta entrega. A correção atual está em `fix/iphone-crypto-nativo`, baseada na entrega completa. A `main` permanece como estava, aguardando revisão. O histórico está em [docs/PROGRESSO.md](docs/PROGRESSO.md).

## Ajustar para os produtos reais

Edite nomes, preços em centavos, tamanhos e descrições em `src/data/products.ts`. As ilustrações são originais e representam apenas roupas. O número e a mensagem ficam em `src/services/whatsapp.ts`. Ao passar do catálogo de demonstração para produtos reais, atualize também os avisos de demonstração na home, na mensagem e nesta documentação.

## Referências técnicas

- [Expo Crypto](https://docs.expo.dev/versions/latest/sdk/crypto/)
- [Web Cryptography API](https://www.w3.org/TR/WebCryptoAPI/)
- [React Native Linking](https://reactnative.dev/docs/linking)
- [React Native FlatList](https://reactnative.dev/docs/flatlist)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
