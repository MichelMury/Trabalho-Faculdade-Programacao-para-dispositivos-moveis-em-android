# Cadastro e login — etapa 2

O aplicativo usa Supabase Auth para validar contas em um servidor HTTPS. Um cadastro pode ser usado em celulares diferentes. A senha não é gravada no aplicativo: o servidor é responsável pelo hash e pela verificação.

## Modo da apresentação

O projeto está configurado para **cadastro imediato, sem confirmação do e-mail**, conforme autorizado para a demonstração acadêmica. Isso não comprova que o usuário é dono do endereço informado. As telas também tratam confirmação de e-mail se ela for habilitada futuramente.

Antes de usar com clientes reais, habilite confirmação e configure SMTP no Supabase. O SMTP padrão do serviço é restrito a membros da equipe e tem limite de envio. Recuperação de senha e atualização de perfil ainda não fazem parte desta etapa.

## Sessões

- Android e iOS: o conteúdo da sessão é cifrado com AES-GCM; a chave AES fica no Keychain/Keystore via SecureStore. O ciphertext pode ser maior que um item do SecureStore e fica no AsyncStorage.
- A senha digitada não é incluída nessa persistência.
- Ao abrir o app, uma sessão existente é validada com o servidor. Sem internet, o app oferece tentar novamente.
- Enquanto o app está ativo, a sessão é renovada pelo SDK Supabase.
- Sair encerra a sessão deste aparelho e remove os dados locais. Outros aparelhos continuam conectados.
- Web: somente sessão em memória, que é perdida ao recarregar a página; não deixa tokens em localStorage em PCs compartilhados.

## Configuração pública

`src/auth/publicConfig.ts` contém somente a URL do projeto e a chave publishable, própria para distribuição em aplicativos. A chave não concede acesso administrativo. A senha do banco e as chaves secret/service_role nunca entram no código.

Variáveis `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` em `.env` podem substituir a configuração pública. Reinicie o Expo após alterar variáveis.

Não foram criadas tabelas públicas de clientes nem políticas que exponham listas de usuários. Os dados desta etapa permanecem no Supabase Auth. Nome de exibição é metadado e não deve ser usado como autorização.

## Demonstrar no celular

1. Instale as dependências com `pnpm install --frozen-lockfile`.
2. Rode `pnpm exec expo start --go` e mantenha o terminal aberto.
3. No iPhone, entre na mesma conta Expo no computador (`pnpm exec expo login`) e no Expo Go.
4. Leia o QR code. Se a rede da faculdade bloquear a conexão, use `pnpm exec expo start --go --tunnel`.
5. Toque em **Criar uma conta**. Informe nome, e-mail e senha com 8 ou mais caracteres, letras e números; repita a senha.
6. Confira **Minha conta**, toque em **Sair da conta** e entre novamente com o mesmo e-mail e senha.
7. Feche e reabra o app para conferir a restauração da sessão; no outro aparelho, entre com a mesma conta.

## Testes

`pnpm typecheck` e `pnpm test` verificam tipos e testes automatizados. Os testes exercitam validação, senhas divergentes, estados de carregamento, cadastro/login/logout, restauração e revogação de sessão, erros do servidor e cifragem com nonce diferente e rejeição de adulteração.

A criptografia dos testes usa WebCrypto real no Node como substituto das APIs nativas Expo. A exportação dos bundles não substitui a verificação das APIs nativas em aparelhos Android/iOS.

## Referências

- https://supabase.com/docs/guides/auth/quickstarts/react-native
- https://supabase.com/docs/guides/auth/auth-smtp
- https://supabase.com/docs/guides/getting-started/api-keys
- https://docs.expo.dev/versions/latest/sdk/crypto/
- https://docs.expo.dev/versions/latest/sdk/securestore/
