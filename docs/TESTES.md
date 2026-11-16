# Testes para o relatório

O aplicativo está em desenvolvimento. Os testes documentam as funcionalidades implementadas até esta etapa.

## Onde ver o resultado no GitHub

1. Abra a aba **Actions** do repositório.
2. Selecione **Testes automatizados** e a execução da branch `feat/endereco-entrega`.
3. Na página **Summary**, confira a tabela com os nomes dos testes e o resultado. Esse é um bom local para tirar o print do relatório.
4. Para ver o terminal, abra **Testes e compilacao**, depois **Executar testes**.
5. Em **Artifacts**, baixe `resultado-testes` para obter o resultado em JSON.

Uma execução verde comprova que as verificações daquela versão passaram. Uma execução vermelha precisa ser investigada antes de usar como resultado aprovado.

## Três novos casos principais

| Caso | O que é verificado | Arquivo |
| --- | --- | --- |
| CT01 | Cadastro normaliza e-mail, persiste salt e hash sem senha em texto puro, diferencia hashes para a mesma senha, rejeita senha incorreta e aceita a correta. Também rejeita duplicidade e senha curta. | `__tests__/Auth.test.tsx` |
| CT02 | Login abre home com FlatList, filtro mostra somente a categoria escolhida, produto abre detalhes, voltar retorna à home e sair limpa a sessão. | `__tests__/App.test.tsx` |
| CT03 | Compra exige endereço e tamanho, respeita quantidade mínima, calcula 2 × R$ 39,90 = R$ 79,80 e abre o número da loja com mensagem correta. Falha ao abrir mostra aviso. | `__tests__/ProductScreen.test.tsx` |
| CT04 | Operação local que não responde exibe erro após 30 segundos e não aceita uma conclusão atrasada como login bem-sucedido. | `__tests__/Auth.test.tsx` |
| CT05 | Script de cálculo local usa WebCrypto e gera o mesmo PBKDF2 do cadastro anterior, sem senha na resposta. | `__tests__/PasswordCrypto.test.tsx` |
| CT06 | Host encaminha a requisição e recebe o hash; bloqueia navegação externa. | `__tests__/PasswordCrypto.test.tsx` |
| CT07 | Encerramento do processo de cálculo rejeita a operação pendente. | `__tests__/PasswordCrypto.test.tsx` |
| CT08 | Endereço incompleto, CEP incorreto e UF inexistente bloqueiam o pedido. | `__tests__/Delivery.test.tsx` |
| CT09 | Complemento opcional, número s/n e endereço acentuado são incluídos corretamente no pedido. | `__tests__/Delivery.test.tsx` |

Os sete testes anteriores do formulário de login foram preservados. Total após o formulário de entrega: dezesseis testes.

## Executar no computador

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test --ci --json --outputFile=resultado-testes.json
node scripts/test-summary.cjs
pnpm exec expo export --platform all --output-dir dist-ci
```

O terminal mostra `Tests: 16 passed, 16 total` quando todos passam. O JSON também pode ser usado para gerar o resumo. O teste de hash pode demorar, pois calcula PBKDF2 com 600 mil iterações de verdade.

## Limites da verificação

AsyncStorage é simulado em memória nos testes. O teste confirma o contrato de leitura e gravação, mas a persistência após fechar o aplicativo precisa ser conferida em aparelho. A fonte aleatória nativa também é simulada; o algoritmo PBKDF2 não é simulado. No CT02, a autenticação é simulada para isolar a navegação; o CT01 verifica o serviço real de autenticação local.

`Linking.openURL` é simulado para conferir número e texto sem abrir uma conversa de verdade. A confirmação de envio, WhatsApp instalado, entrega da mensagem e comportamento do botão físico precisam de teste manual no celular.

Exportar bundles Android/iOS não gera APK/IPA nem comprova execução em aparelho real.

## Texto que pode ser adaptado no relatório

Foram implementados três novos casos de teste automatizado com Jest e React Native Testing Library. Eles verificam o cadastro e o login local com senha protegida por hash, a navegação entre as telas e a montagem do pedido para o WhatsApp. O caso de compra verifica o tamanho selecionado, a quantidade, o preço unitário e o valor total. A integração externa é simulada para que os testes não enviem mensagens. Os testes anteriores do formulário também foram mantidos, totalizando dezesseis casos após incluir as regressões de tempo limite, os testes do motor WebCrypto e a validação do endereço. Os resultados podem ser consultados na aba Actions do GitHub.

Os CT01 e CT05 executam WebCrypto real no Node. Os CT06 e CT07 simulam a WebView nativa para testar a comunicação. Michel confirmou manualmente que o acesso funcionou no iPhone após a atualização. Os testes automatizados não comprovam execução física nem medem o tempo de login no aparelho; a confirmação manual também não substitui testar os demais recursos.
