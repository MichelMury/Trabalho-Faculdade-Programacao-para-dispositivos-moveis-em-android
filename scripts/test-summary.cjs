const fs = require('fs');
const file = 'resultado-testes.json';
if (!fs.existsSync(file)) {
  console.log('Nenhum resultado gerado. Consulte o passo que falhou.');
  process.exit(0);
}
const result = JSON.parse(fs.readFileSync(file, 'utf8'));
const lines = [
  '# Resultado dos testes automatizados', '',
  `Testes aprovados: **${result.numPassedTests}/${result.numTotalTests}**. Falhas: **${result.numFailedTests}**.`, '',
  '| Caso | Resultado |', '| --- | --- |',
];
for (const suite of result.testResults) {
  for (const test of suite.assertionResults) lines.push(`| ${test.fullName.replaceAll('|', '/')} | ${test.status === 'passed' ? 'Aprovado' : test.status} |`);
}
lines.push('', 'Os testes de interface usam React Native Testing Library. A abertura do WhatsApp é simulada; nenhuma mensagem é enviada. No CT01, o PBKDF2 executa de verdade e o armazenamento nativo é simulado em memória.', '', 'A exportação de bundles não equivale à geração de APK/IPA nem substitui testar em celulares reais.');
const summary = lines.join('\n') + '\n';
console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
