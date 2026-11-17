# Modelo de Dados do Vesttor

> **Registro histórico ou proposta:** o conteúdo abaixo preserva decisões e planos da época e pode divergir da implementação entregue. Para o estado do MVP e suas limitações, consulte [MVP](../MVP.md) e [índice da documentação](README.md). Não interprete requisitos propostos como funcionalidades prontas.

**Versão:** 2.0
**Revisão:** 08/10/2026
**Responsável:** Eduardo Bernardo do Nascimento
**Banco:** Cloud Firestore, banco `(default)`

## 1. Escopo do modelo

A tarefa aprovada em 08/10/2026 organiza os dados privados em subcoleções de `usuarios/{uid}`, mantendo `userId` imutável como validação redundante. Ele corrige valores, datas, situações, catálogos, planejamento, parcelamento e recorrência sem antecipar ambientes compartilhados. O modelo de ambientes é uma evolução separada.

O código atual ainda usa o contrato legado descrito na seção 11. Nenhuma tabela desta especificação deve ser interpretada como já implementada sem a situação correspondente.

## 2. Convenções

| Tema | Convenção |
| --- | --- |
| Identificadores | IDs aleatórios gerados pelo Firestore ou UUID; permanentes após criação |
| Valores | Inteiros positivos em centavos |
| Moeda | Código ISO 4217; `BRL` no MVP |
| Competência | String `AAAA-MM` |
| Datas civis | String `AAAA-MM-DD` |
| Auditoria | Timestamp do servidor |
| Propriedade | `userId` obtido da sessão no MVP |
| Exclusão histórica | Cancelamento, estorno ou desativação; exclusão física somente quando autorizada |

Strings ISO são usadas para datas sem horário porque preservam ordenação e não mudam de dia por fuso. Timestamp permanece adequado para eventos técnicos.

## 3. Modelo conceitual

```text
Usuário 1 ─── N Transações
Usuário 1 ─── N Recorrências
Usuário 1 ─── N Limites mensais
Usuário 1 ─── N Categorias personalizadas
Usuário 1 ─── N Meios personalizados
Usuário 1 ─── 1 Preferência de catálogo

Parcelamento 1 ─── N Transações
Recorrência 1 ─── N Ocorrências
Categoria 1 ─── N Transações
Meio financeiro 1 ─── N Transações liquidadas
Catálogo universal 1 ─── N Itens universais
```

Planejamento não cria um tipo paralelo de item financeiro. Uma intenção financeira é uma transação `prevista`; o planejamento guarda somente limites.

## 4. Coleções do modelo-alvo do MVP

```text
usuarios/{uid}/transacoes/{transacaoId}
usuarios/{uid}/recorrencias/{recorrenciaId}
usuarios/{uid}/limitesPlanejamento/{limiteId}
usuarios/{uid}/categoriasPersonalizadas/{categoriaId}
usuarios/{uid}/meiosFinanceirosPersonalizados/{meioId}
preferenciasCatalogo/{userId}

categoriasUniversais/{categoriaId}
meiosFinanceirosUniversais/{meioId}
versoesCatalogo/{versaoId}
```

Todas as coleções privadas ficam sob `usuarios/{uid}` e possuem `userId`. Catálogos universais não pertencem ao usuário e são somente leitura para o cliente.

## 5. Transação

### 5.1 Estrutura

| Campo | Tipo | Obrigatório | Regra |
| --- | --- | :---: | --- |
| `userId` | string | sim | Imutável; igual ao UID autenticado |
| `natureza` | string | sim | `receita` ou `despesa` |
| `descricao` | string | sim | 1 a 100 caracteres |
| `valorCentavos` | integer | sim | Maior que zero |
| `moeda` | string | sim | `BRL` no MVP |
| `competencia` | string | sim | `AAAA-MM` |
| `dataCompra` | string | não | `AAAA-MM-DD` |
| `dataVencimento` | string | condicional | Obrigatória quando confirmada |
| `dataLiquidacao` | string | condicional | Obrigatória quando paga ou recebida |
| `situacao` | string | sim | `prevista`, `confirmada`, `paga`, `recebida`, `cancelada` ou `estornada` |
| `categoriaId` | string | sim | ID universal ou personalizado |
| `categoriaOrigem` | string | sim | `universal` ou `personalizada` |
| `categoriaNomeHistorico` | string | sim | Nome usado no cadastro |
| `meioFinanceiroId` | string | condicional | Obrigatório quando liquidada |
| `meioFinanceiroOrigem` | string | condicional | `universal` ou `personalizado` |
| `meioFinanceiroNomeHistorico` | string | não | Nome usado na liquidação |
| `classificacao` | string | sim | `fixa` ou `variavel` |
| `parcelamentoId` | string | condicional | Imutável na série |
| `numeroParcela` | integer | condicional | 1 até `totalParcelas` |
| `totalParcelas` | integer | condicional | 2 a 72 |
| `valorTotalCentavos` | integer | condicional | Total da obrigação |
| `recorrenciaId` | string | não | Origem da ocorrência |
| `ocorrenciaChave` | string | não | Única por recorrência e competência |
| `transacaoOrigemId` | string | não | Original de estorno ou correção |
| `criadoEm` | timestamp | sim | Servidor e imutável |
| `criadoPor` | string | sim | UID e imutável |
| `atualizadoEm` | timestamp | sim | Timestamp do servidor |
| `atualizadoPor` | string | sim | UID responsável |
| `revisao` | integer | sim | Incrementada em cada alteração |

### 5.2 Coerência

- `paga` só aceita despesa e exige `dataLiquidacao` e meio financeiro.
- `recebida` só aceita receita e exige `dataLiquidacao` e meio financeiro.
- `confirmada` exige vencimento e não exige liquidação.
- `prevista` pode não possuir vencimento ou meio financeiro.
- `cancelada` representa obrigação não liquidada.
- `estornada` referencia a transação liquidada de origem.
- `emAtraso` não existe como campo; é derivado de situação, vencimento e data atual.
- Campos de parcelamento aparecem juntos ou não aparecem.

## 6. Parcelamento

Não existe documento obrigatório para a série no MVP; o grupo é identificado por `parcelamentoId`. Todas as parcelas preservam `numeroParcela`, `totalParcelas` e `valorTotalCentavos`.

O excedente de divisão é distribuído a partir da primeira parcela. Exemplo para 10.000 centavos em três parcelas: 3.334, 3.333 e 3.333.

Liquidações passadas não são substituídas. Alterações afetam a ocorrência escolhida e, mediante confirmação, futuras não liquidadas. Cancelamentos não renumeram a série.

## 7. Recorrência

`usuarios/{uid}/recorrencias/{recorrenciaId}`:

| Campo | Tipo | Regra |
| --- | --- | --- |
| `userId` | string | Proprietário |
| `natureza` | string | Receita ou despesa |
| `descricao` | string | 1 a 100 caracteres |
| `valorEstimadoCentavos` | integer | Positivo |
| `moeda` | string | `BRL` |
| `categoriaId` | string | Categoria válida |
| `classificacao` | string | Fixa ou variável |
| `periodicidade` | string | `mensal` no MVP |
| `diaBase` | integer | 1 a 31 |
| `competenciaInicial` | string | `AAAA-MM` |
| `competenciaFinal` | string | Opcional |
| `ativa` | boolean | Controla novas ocorrências |
| `criadoEm`, `atualizadoEm` | timestamp | Auditoria |
| `criadoPor`, `atualizadoPor` | string | Auditoria |
| `revisao` | integer | Concorrência otimista |

A ocorrência usa chave determinística `{recorrenciaId}_{AAAA-MM}`. O dia inexistente é substituído pelo último dia do mês. A regra pode produzir transação prevista sem gravação antecipada infinita; materialização e edição devem ser idempotentes.

## 8. Planejamento

`usuarios/{uid}/limitesPlanejamento/{limiteId}`:

| Campo | Tipo | Regra |
| --- | --- | --- |
| `userId` | string | Proprietário |
| `competencia` | string | `AAAA-MM` |
| `categoriaId` | string | Categoria universal ou personalizada |
| `categoriaOrigem` | string | Origem do catálogo |
| `categoriaNomeHistorico` | string | Nome no momento da definição |
| `natureza` | string | Receita ou despesa |
| `limiteCentavos` | integer | Zero ou positivo |
| `criadoEm`, `atualizadoEm` | timestamp | Auditoria |
| `revisao` | integer | Concorrência |

A combinação `userId + competencia + categoriaId + natureza` é única. Confirmadas e liquidadas consomem o limite; previstas formam projeção separada. Copiar um mês não cria duplicatas nem altera recorrências.

## 9. Catálogos

### 9.1 Item universal

| Campo | Tipo | Regra |
| --- | --- | --- |
| ID do documento | string | Aleatório, permanente e registrado no arquivo de catálogo |
| `nome` | string | 1 a 60 caracteres |
| `naturezasPermitidas` | array | Receita, despesa ou ambas |
| `ativo` | boolean | Desativação sem exclusão |
| `ordem` | integer | Ordem de apresentação |
| `criadoEm`, `atualizadoEm` | timestamp | Auditoria |

O arquivo versionado preserva os mesmos IDs em toda publicação. O cliente possui leitura autenticada; somente rotina administrativa confiável grava.

### 9.2 Item personalizado

Categorias e meios personalizados possuem `userId`, nome, naturezas permitidas, ativo, auditoria e revisão. A chave de comparação normaliza maiúsculas, espaços e acentos. Itens referenciados são desativados.

### 9.3 Preferências

`preferenciasCatalogo/{userId}` armazena arrays de IDs universais ocultos e `atualizadoEm`. Ocultar não copia nem modifica o item global.

## 10. Consultas e índices

- Transações sempre são consultadas com `userId` e intervalo de competência ou liquidação.
- Filtros complementares podem ser aplicados localmente dentro do período carregado.
- Índices compostos são definidos apenas para consultas efetivamente implementadas.
- Paginação usa cursor ou recorte delimitado; a interface nunca mantém uma página inválida após filtragem.
- Relatórios agrupam pelo ID da categoria ou meio e podem exibir o nome atual, preservando o nome histórico no detalhe.

## 11. Contrato legado verificado

| Área | Contrato atual | Situação |
| --- | --- | --- |
| Transações | Coleção raiz `transacoes`, `userId`, `valor`, `data` Timestamp, categoria e método em texto | A ser refatorada |
| Parcelamento | Campos de série na própria transação; edição substitui série | A ser refatorada |
| Planejamento | Coleção raiz `planejamentos`, `mesAno`, `tipo`, `valorPlanejado` | A ser refatorada |
| Categorias e meios | Constantes locais e textos | Planejada |
| Auditoria | Parcial; planejamento novo usa Timestamp de servidor | Parcialmente implementada |

## 12. Migração

1. Publicar regras compatíveis com os formatos atuais.
2. Preparar aplicação capaz de ler legado e alvo e gravar somente no alvo.
3. Executar migração versionada, idempotente e com modo de simulação.
4. Converter valor para centavos, datas civis, situações, referências de catálogo e auditoria.
5. Validar contagens, somas por usuário, parcelas e referências.
6. Remover compatibilidade antiga.
7. Publicar regras finais mais rígidas.

Falhas não podem apagar documentos antigos. Cada execução produz relatório de convertidos, ignorados e rejeitados.

## 13. Ambientes financeiros futuros

Ambientes não alteram o modelo físico do MVP. Na evolução, a propriedade passará de `userId` para `ambienteFinanceiroId`, mantendo `criadoPor` e `atualizadoPor`.

Cada usuário poderá possuir no máximo um ambiente de cada tipo: pessoal, compartilhado, familiar e empresarial. Dados, catálogos personalizados, planejamento e relatórios permanecem isolados. Convites terão token único, validade, revogação e papel: proprietário, administrador, editor ou visualizador.

## 14. Fora do escopo atual

- Contas bancárias, carteiras e conciliação.
- Faturas completas de cartão.
- Transferências internas.
- Várias moedas, conversão, Cloud Functions e App Check.

## 15. Transição implementada em 08/10/2026

Services gravam transações e planejamentos na hierarquia privada com centavos e leem os dois caminhos por período mensal. O schema de datas, situações, referências e limites das seções anteriores continua como evolução planejada. O contrato exato desta etapa, preferências por item, migração administrativa com simulação e rollback estão em `docs/migracao-financeira.md`. Nenhuma migração ou publicação de produção foi executada nesta etapa.
