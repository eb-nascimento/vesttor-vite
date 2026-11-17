# Migração financeira — hierarquia privada e centavos

> **Registro histórico ou proposta:** o conteúdo abaixo preserva decisões e planos da época e pode divergir da implementação entregue. Para o estado do MVP e suas limitações, consulte [MVP](../MVP.md) e [índice da documentação](README.md). Não interprete requisitos propostos como funcionalidades prontas.

Revisão: 08/10/2026. Banco configurado: `(default)`, Standard. As ferramentas estão implementadas; nenhum dado de produção foi migrado e nenhuma regra ou índice foi publicado nesta etapa.

## Contrato implementado

Novas transações: `usuarios/{uid}/transacoes/{id}`. Novos planejamentos: `usuarios/{uid}/planejamentos/{id}`. Os IDs e o campo `userId` permanecem estáveis. `valorCentavos`, `valorTotalCentavos` e `planejadoCentavos` substituem os valores decimais. O adaptador de leitura fornece reais para componentes e formulários existentes; somas são calculadas em inteiros e convertidas apenas para apresentação.

A leitura reúne raiz e destino, deduplicando pelo ID e dando prioridade ao destino. As duas fontes devem responder antes de mostrar dados. Transações são consultadas por intervalo mensal `[início, próximo mês)` de `data`; planejamentos por `mesAno`. Filtros locais e paginação operam apenas nesse recorte. Todos os filtros retornam à primeira página; os cards seguem a natureza do resultado, inclusive filtros por categoria. Não há mais consulta de todos os períodos.

Edição de um documento legado grava o destino e remove a origem no mesmo batch. Exclusão remove ambas as cópias, evitando reaparecimento. A ferramenta administrativa abaixo apenas copia: mantém a origem para conferência e rollback. Clientes antigos devem ser retirados de circulação antes do corte definitivo, pois uma alteração pela versão antiga na raiz não prevalece sobre um destino já existente.

As datas e nomes dos campos de domínio atuais (`data`, `tipo`, `categoria`, `metodoPagamento`, `mesAno`) permanecem nesta transição. Competência/liquidação/situação, referências de catálogo e limites mensais têm tarefas próprias e não foram antecipados. As Rules já protegem catálogos universais e personalizados; nenhuma tela ou catálogo foi criado.

Catálogos universais: `categoriasUniversais`, `meiosFinanceirosUniversais`, leitura autenticada e nenhuma escrita do cliente. Personalizados: subcoleções homônimas com sufixo `Personalizadas`, schema estrito, autoria imutável, timestamps e revisão incremental; exclusão bloqueada, usando desativação. Preferências: `usuarios/{uid}/preferenciasCategorias/{idUniversal}` e `preferenciasMeios/{idUniversal}`, com `oculto` booleano e `atualizadoEm`. Esta decisão evita arrays não validados de IDs em um documento comum.

## Execução controlada

O SDK administrativo é dependência de desenvolvimento, usado somente no CLI. Não ativa Functions, não integra o bundle do navegador e não provisiona recursos. Autenticação administrativa usa Application Default Credentials; nunca coloque credenciais no repositório. No emulador, use `FIRESTORE_EMULATOR_HOST` e projeto `demo-...`.

1. Executar lint, testes unitários, testes de Rules e build. `firebase.test.json` usa porta 8180 para separar os testes do ambiente de desenvolvimento.
2. Publicar as Rules compatíveis e os índices versionados pelos comandos separados do README; aguardar os índices ficarem prontos antes da aplicação que usa as novas consultas.
3. Publicar a aplicação com leitura dual e escrita no destino. Retirar clientes antigos de circulação.
4. Simular um UID por vez, com projeto explícito:

   ```powershell
   npm run migration:financeiro -- --project gestor-financeiro-43435 --uid UID
   ```

5. Revisar o relatório privado em `migration-reports/`: rejeitados, contagens e somas em centavos. Resolver divergências antes de prosseguir. Relatórios estão excluídos do Git.
6. Executar a cópia revisada:

   ```powershell
   npm run migration:financeiro -- --project gestor-financeiro-43435 --uid UID --apply
   ```

7. Repetir a simulação para comprovar idempotência. A ferramenta não sobrescreve destinos divergentes; usa transações para recusar alterações concorrentes na origem. Comparar receitas/despesas e limites no aplicativo com os relatórios e verificar isolamento no emulador.
8. Manter leitura dual durante a janela de transição. A remoção em massa da raiz e o fechamento das permissões legadas são uma operação posterior, depois da conferência de todos os UIDs. Esta ferramenta não apaga a raiz.

## Rollback

Parar gravações e identificar o relatório da execução aplicada. Simular primeiro:

```powershell
npm run migration:financeiro -- --project gestor-financeiro-43435 --uid UID --rollback migration-reports/RELATORIO.json
```

Com `--apply`, a reversão remove somente destinos criados por aquela execução quando origem e destino continuam exatamente iguais ao relatório. Cópias preexistentes, alterações posteriores e origens removidas ou modificadas são preservadas e reportadas como rejeição; exigem reconciliação manual usando o backup do relatório. Nunca restaurar a versão antiga do aplicativo sem essa reconciliação, pois ela não lê gravações feitas apenas no destino.

Não há troca de projeto implícita: o rollback exige projeto e UID iguais aos do relatório. Relatórios de simulação não podem ser usados para rollback.
