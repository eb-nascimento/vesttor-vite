# Versionamento do Vesttor

Ao concluir um conjunto de alterações do projeto, revise e atualize a versão antes de preparar seu commit ou entrega. Essa é uma etapa habitual de encerramento, inclusive para alterações de documentação e configuração.

## Escolha do incremento

- `patch`: correções, documentação, organização e ajustes de configuração sem nova funcionalidade ou quebra de compatibilidade.
- `minor`: novas funcionalidades compatíveis. Durante a fase `0.x`, use também para mudanças relevantes de contrato e registre a migração necessária.
- `major`: mudanças incompatíveis a partir de `1.0.0`. A passagem de `0.x` para `1.0.0` depende da decisão de lançar a primeira versão estável.

## Procedimento de encerramento

1. Confira a versão atual e o diff de `package.json` e `package-lock.json`. Se a versão já foi atualizada para o conjunto em andamento, preserve esse incremento.
2. Escolha o incremento pelo conjunto completo de mudanças, e não pela quantidade de arquivos ou mensagens no chat.
3. Execute um dos comandos abaixo na raiz, atualizando os dois arquivos juntos:

   ```powershell
   npm.cmd version patch --no-git-tag-version
   npm.cmd version minor --no-git-tag-version
   npm.cmd version major --no-git-tag-version
   ```

4. Confirme que `package.json.version`, `package-lock.json.version` e `package-lock.json.packages[""].version` são iguais. `lockfileVersion` é o formato do npm e não participa da versão do produto.
5. Informe a versão anterior, a nova versão e o motivo no encerramento da tarefa.

Uma consulta, execução de testes, build ou deploy da mesma entrega não exige outro incremento. Ao mesclar branches, preserve a versão já atribuída à entrega; quando houver mudanças de entregas distintas, confira o histórico e consolide uma versão adequada, sem diminuir versões existentes.

O assistente está autorizado a atualizar esses campos como parte do encerramento de alterações solicitadas. Isso não autoriza implementar funcionalidades fora do escopo, criar commits ou tags, fazer push, publicar ou executar migrações. O comando com `--no-git-tag-version` não cria commit nem tag. Esta convenção é um procedimento de trabalho; não foi instalado um incremento automático em hooks ou CI.
