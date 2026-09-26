# Especificação Funcional e Técnica: Transação e Parcelamento

> **Revisão de 26/09/2026.** A criação parcelada em lote está implementada. A edição atual da série está **A ser refatorada** porque ainda substitui documentos anteriores, inclusive parcelas liquidadas. Os nomes consumidos pela tela foram alinhados ao contrato de `useTransacoes` e receberam cobertura de regressão.

Este documento define a arquitetura, regras de negócio, modelo de dados e comportamento de interface para compras parceladas no Vesttor, consolidado após sessão de refinamento de domínio (_grilling session_).

## Regra aprovada para a refatoração

- Parcelas pagas ou recebidas são imutáveis.
- A edição poderá afetar somente a parcela escolhida ou ela e as futuras ainda não liquidadas.
- O `parcelamentoId`, a numeração original e o total histórico serão preservados.
- Cancelamento não renumera a série; transação liquidada incorreta é corrigida por estorno.
- O modelo permitirá parcelamento de receitas, embora a primeira interface possa priorizar despesas.
- Pagamento antecipado mantém competência e vencimento e registra a data real de liquidação.
- Recorrência terá regra própria, chave determinística por competência, início, término opcional e edição “Somente esta” ou “Esta e as próximas”.

## Conceitos separados

- **Condição de pagamento:** à vista ou parcelada.
- **Método de pagamento:** Pix, dinheiro, cartão, boleto, transferência ou outro.
- **Parcelamento:** obrigação finita com quantidade e total conhecidos.
- **Recorrência:** regra que gera obrigações independentes, com término opcional. Está planejada e não deve ser representada como parcelamento.

Uma compra pode ser parcelada no boleto ou no Pix. Um seguro anual pago em parcelas também é parcelamento; uma renovação anual automática é recorrência. O método pode sugerir um estado inicial, mas não comprova sozinho que houve liquidação.

---

## 1. Visão Geral e Princípio Contábil

### O Problema do Regime de Caixa

Se um usuário recebe **R$ 3.000,00** de salário e compra um celular de **R$ 5.000,00** parcelado em **24x** de R$ 208,33:

- **Abordagem incorreta**: Lançar uma única despesa de R$ 5.000,00 em uma só competência distorce o resultado mensal e esconde a distribuição das obrigações.
- **Abordagem adotada para resultado por competência**: a compra gera obrigações mensais de R$ 208,33, com centavos excedentes na primeira parcela. Isso não comprova saída de caixa: o fluxo líquido só considera uma parcela quando ela for efetivamente paga.

---

## 2. Modelo de Dados no Cloud Firestore

### 2.1. Granularidade: Múltiplos Documentos Reais

Cada parcela é armazenada como um **documento individual** na coleção `transacoes`, vinculada a um grupo comum.

**Vantagens da decisão:**

1. Os filtros de mês, listas e relatórios do Firestore funcionam de forma nativa e rápida, sem exigir projeções virtuais complexas em memória.
2. Cada mês contém exatamente os registros contábeis que pertencem a ele.

### 2.2. Contrato de Atributos da Parcela

| Campo              | Tipo        | Descrição                                          | Exemplo                           |
| :----------------- | :---------- | :------------------------------------------------- | :-------------------------------- |
| `userId`           | `string`    | UID do usuário autenticado (obrigatório)           | `"abc123xyz"`                     |
| `data`             | `timestamp` | Data de vencimento daquela parcela específica      | `Timestamp(2026-10-15)`           |
| `descricao`        | `string`    | Nome da transação; o sufixo atual é legado e deve ser removido | `"Celular"` |
| `valor`            | `number`    | Valor monetário da parcela individual              | `208.41` (1ª) / `208.33` (demais) |
| `tipo`             | `string`    | Tipo de movimentação (sempre `"despesa"`)          | `"despesa"`                       |
| `categoria`        | `string`    | Categoria selecionada                              | `"Outros"`                        |
| `metodoPagamento`  | `string`    | Método de pagamento                                | `"cartao_credito"`                |
| `parcelamentoId`   | `string`    | UUID compartilhado por todas as parcelas da compra | `"uuid-v4-gerado"`                |
| `numeroParcela`    | `number`    | Índice ordinal da parcela atual (1 a N)            | `1`                               |
| `totalParcelas`    | `number`    | Quantidade total de parcelas da série              | `24`                              |
| `valorTotalCompra` | `number`    | Valor total original da compra para referência     | `5000.00`                         |

---

## 3. Regras Matemáticas e de Calendário

### 3.1. Arredondamento Bancário (Centavos na 1ª Parcela)

Em divisões não exatas (dízimas), a sobra de centavos é somada à **1ª parcela**:

$$\text{totalCentavos} = \text{round}(\text{valorTotal} \times 100)$$
$$\text{centavosBase} = \lfloor \text{totalCentavos} / \text{totalParcelas} \rfloor$$
$$\text{sobraCentavos} = \text{totalCentavos} \pmod{\text{totalParcelas}}$$

- **Parcela 1**: $(\text{centavosBase} + \text{sobraCentavos}) / 100$
- **Parcelas 2 a N**: $\text{centavosBase} / 100$

> **Exemplo R$ 5.000,00 em 24x:**
>
> - $500.000 \div 24 = 20.833$ centavos por parcela, com resto de **8 centavos**.
> - **Parcela 1**: R$ 208,33 + R$ 0,08 = **R$ 208,41**.
> - **Parcelas 2 a 24**: **R$ 208,33**.
> - **Soma Total**: $208,41 + (23 \times 208,33) = \mathbf{R\$\ 5.000,00}$ (precisão exata de centavos).

### 3.2. Calendário e Meses Irregulares (Clamp no Fim do Mês)

Ao projetar as datas futuras, o dia do mês deve ser mantido sempre que possível. Caso o mês subsequente não contenha aquele dia (ex: 31 de janeiro), a data é ajustada para o **último dia válido do mês**:

- Compra em **31/01/2026** em 3x:
  - Parcela 1: `31/01/2026`
  - Parcela 2: `28/02/2026` (último dia de fevereiro)
  - Parcela 3: `31/03/2026` (volta ao dia 31)

---

## 4. Comportamento do Formulário (`Form.jsx`)

1. **Modo de Entrada Flexível**:
   - A implementação atual recebe somente o **valor total** e calcula as parcelas. Um modo alternativo para informar o valor da parcela não faz parte do fluxo atual.
2. **Quantidade Livre de Parcelas**:
   - Campo numérico aberto (`min={2}`, `max={72}`), permitindo qualquer número digitado pelo usuário (ex: 15x, 18x, etc.), acompanhado de botões rápidos para as quantidades mais comuns (2x, 3x, 6x, 10x, 12x).
3. **Renderização Condicional**:
   - O bloco de parcelamento é exibido **exclusivamente para o tipo Despesa**. Ao alternar para Receita, o bloco e o método de pagamento são desmontados e ignorados no envio.

---

## 5. Visualização na Home (`Home.jsx`)

1. **Saldo do Mês Atual**:
   - Os cards de **Receitas**, **Despesas** e **Saldo Total** somam apenas os lançamentos cujo vencimento recai no **mês e ano corrente**.
   - As parcelas futuras permanecem no banco e afetam o resultado de sua própria competência; o fluxo líquido só muda quando cada parcela é paga ou recebida.
2. **Lista Compacta da Home (Top 5 e Deduplicação)**:
   - A lista de transações recentes na página inicial exibe no máximo **5 itens** para não ultrapassar a altura do formulário fixado na coluna esquerda.
   - **Escopo Temporal Recente**: Oculta lançamentos com vencimentos em meses futuros (> mês corrente), evitando que parcelas de 2027/2028 poluam o extrato imediato.
   - **Deduplicação de Série Parcelada**: Garante que cada compra parcelada (`parcelamentoId`) ocupe **no máximo 1 linha** na Home, exibindo apenas a parcela de competência do momento (ex: `1/24` em setembro, virando `2/24` em outubro), deixando as outras 4 posições livres para outras movimentações reais.
   - Um link de rodapé (_"Abrir todas as transações (X) &rarr;"_) direciona para `/transacoes`, onde todas as transações de todos os meses podem ser visualizadas e filtradas.
3. **Badges de Parcela**:
   - Cada lançamento parcelado exibe a etiqueta visual `Parcela X/Y`, derivada de `numeroParcela` e `totalParcelas`. O modelo-alvo não inclui esse sufixo na descrição persistida.

---

## 6. Ciclo de Vida: Exclusão e Edição

### 6.1. Exclusão com Pergunta de Escopo

Ao clicar no ícone de exclusão em uma transação com `parcelamentoId`, um modal de confirmação apresenta duas opções:

1. **"Excluir apenas esta parcela (ex: 3/15)"**:
   - Remove apenas o documento selecionado. As demais 14 parcelas permanecem inalteradas.
2. **"Excluir esta e as parcelas futuras (da 3 até a 15)"**:
   - Remove da parcela atual até a última da série ($numeroParcela \ge 3$).
   - As parcelas anteriores (1 e 2) são **preservadas**, pois representam pagamentos já consolidados no passado.

### 6.2. Edição de Série e Conversão Atômica

1. **Edição de Compras Parceladas**:
   - Ao iniciar a edição de um lançamento com `parcelamentoId`, o formulário higieniza a descrição (remove o sufixo `(X/Y)`) e preenche o campo de valor com o **valor total da compra** (`valorTotalCompra`).
   - O seletor de parcelas carrega o total de parcelas original, permitindo alterar a quantidade de parcelas (ex: de 10x para 5x), a data base ou o valor global.
   - Ao salvar, a função `atualizarCompraParceladaNaApi` executa uma transação atômica via `writeBatch`: exclui todas as parcelas antigas da série e grava o novo conjunto de parcelas recalculadas com as novas datas de vencimento e valores mensais.

2. **Conversão entre Formatos**:
   - **Parcelada para Única**: Se o usuário desmarcar a opção "Parcelar esta compra" ao editar uma compra parcelada, a série inteira é excluída e substituída por um lançamento único avulso.
   - **Única para Parcelada**: Se o usuário editar uma despesa avulsa e marcar a opção de parcelamento, a transação original é substituída pela nova série parcelada gerada.

3. **Controles de Entrada e Usabilidade**:
   - O campo de valor formata dinamicamente e impede a digitação de mais de 2 casas decimais.
   - O número de parcelas conta com controle stepper integrado (`[ − ]` e `[ + ]`), digitação livre sem interrupção de backspace, atalhos rápidos de 2x a 24x e validação automática entre 2 e 72 parcelas no blur ou submit.
   - O seletor de data utiliza calendário visual interativo em Javascript nativo (`DatePicker.jsx`) com formatação em português e suporte a navegação rápida.
