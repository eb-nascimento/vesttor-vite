# QA de regressão — 21/10/2026

## Escopo e resultado

QA automatizado local dos critérios dos cartões [Executar QA de regressão do CRUD](https://app.notion.com/3c6bfca688028117b322dd679a2e4eb9) e [Mapear erros amigáveis do Firestore](https://app.notion.com/3c6bfca6880281ef9104e7c5d4cb77e7).

Base: branch `dev`, commit `ca620436dd737ef64a175e4a4de1980a835c4cbc`, com alterações locais descritas abaixo. Versão revisada de `0.5.0` para `0.5.1` pelas correções da suíte e ampliação da cobertura. Não foram realizados commit, push, deploy ou migração de dados reais. Os cartões do Notion não foram alterados.

| Verificação | Resultado | Alcance |
| --- | --- | --- |
| `npm.cmd run lint` | Aprovado | Código analisado sem erros de lint. |
| `npm.cmd run test:run` | 102 testes aprovados, 14 arquivos | Regras de negócio, filtros, ordenação, paginação, resumos, formulários, falhas de escrita e reconexão com mocks. |
| Suíte `tests/firestore/firestore.rules.test.js` | 25 testes aprovados | Firestore Emulator, projeto fictício `demo-vesttor-rules`, serviços reais e Security Rules locais. |
| `npm.cmd run build` | Aprovado | Bundle gerado; aviso de chunk maior que 500 kB permanece. |

Na execução isolada do emulador foram usadas portas livres temporárias, pois 8180 e posteriormente 8280 estavam ocupadas. O comando foi equivalente ao `test:rules`, substituindo apenas o arquivo de configuração por uma cópia temporária de `firebase.test.json` com portas livres. A configuração temporária foi removida após o encerramento. `TEMP` e `TMP` foram direcionados a `.tmp/` na sessão de teste.

## Matriz dos critérios

- Criar, editar e excluir: testes de formulários e propagação de falhas, mais execução dos serviços reais contra o emulador, verificando persistência em centavos e ID estável na edição de legado.
- Filtros e ordenação: testes das funções de filtragem, ordenação por data e hook de filtros; retorno à primeira página e navegação para mês vazio.
- Resumo: cálculos e renderização dos indicadores conforme a natureza dos resultados filtrados.
- Tempo real: novo teste mantém a mesma assinatura mensal ativa e confirma lista vazia, criação, alteração de descrição/valor e exclusão sem recarregar.
- Isolamento e validação: Rules verificam propriedade, acesso anônimo, acesso cruzado, campos inválidos, catálogos e preferências.
- Migração: simulação, cópia, repetição e rollback executados exclusivamente no emulador.

## Erros amigáveis

O mapeamento cobre permissão negada, sessão expirada, indisponibilidade, prazo excedido, conflito, registro existente, argumento inválido, valor fora do intervalo, pré-condição, registro ausente, limite temporário e cancelamento. Códigos com prefixo `firestore/` são normalizados. Erros desconhecidos recebem alternativa segura, sem mostrar `error.message` do SDK.

Os testes exercitam códigos conhecidos, valores ausentes, código desconhecido e nome herdado (`toString`), sem revelar o conteúdo técnico usado como sentinela. A auditoria encontrou uso do mapeamento nos hooks de transações/planejamentos, formulário de transações e operações assíncronas. Os testes existentes verificam preservação dos campos após erro, bloqueio de duplicidade, liberação após falha e reconexão da leitura.

## Problemas encontrados e alterações feitas

1. Três imports da suíte de integração ainda apontavam para `./src/`, relativos ao antigo local do teste. Corrigidos para `../../src/`. Nenhuma alteração de regra de negócio.
2. O teste mensal assumia que o primeiro snapshot já continha os dados esperados. Ao executar o novo teste de tempo real antes dele, recebeu lista vazia e falhou. Passou a aguardar explicitamente os dados esperados com prazo limitado, verificar erros e cancelar a assinatura em `finally`. A execução final aprovou os 25 testes.
3. Adicionados testes das mensagens `out-of-range` e `cancelled`, antes mapeadas mas sem cenários explícitos na tabela de testes.

## Limitações e próximos passos

Este resultado comprova os cenários automatizados descritos. Não houve navegação com cliques em navegador, validação visual/responsiva, autenticação ponta a ponta ou teste da aplicação publicada. Os testes de componentes usam renderização estática ou mocks de hooks; não equivalem a um teste completo no navegador. Os índices e Rules do emulador não confirmam o estado implantado em DEV ou PRD.

Os cartões podem receber esta evidência como QA automatizado executado. A conclusão do QA completo depende de conferir os fluxos reais no navegador e as dependências de integração/regras no ambiente de destino.

Durante o trabalho surgiram alterações paralelas em `scripts/migracaoFinanceira.js` e `scripts/migrar-financeiro.js`. Esses arquivos foram preservados e não foram editados nesta tarefa. O relatório descreve as execuções observadas; futuras alterações nesses arquivos exigem nova validação dos cenários afetados.
