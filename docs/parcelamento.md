# Transação e parcelamento

Decisão de interface de 10/09/2026. Entrega no Figma; não representa implementação no React/Firebase ou aceite final do protótipo.

## Formulário

Ordem: **Tipo → Data → Valor → Método de pagamento → Categoria → Descrição**.

- Tipo usa dois botões de seleção exclusiva: Despesa e Receita.
- Não há campo Observação.
- Abaixo do método de pagamento, um checkbox pequeno “Parcelar compra” substitui os botões Não/Sim para despesas no crédito. A linha inteira é clicável, com área de toque de 44 px.
- Marcar revela quantidade de parcelas, primeiro vencimento e resumo compacto, sem card destacado. Valor passa a ser identificado como Valor total. Os campos ficam lado a lado no desktop e empilhados no mobile.
- Quantidade deve ser inteira e maior ou igual a 2. A data da primeira parcela é obrigatória. O desenho inclui exemplos de erros e confirmação antes do registro.
- Exemplo: compra de R$ 1.200,00 em 3 parcelas de R$ 400,00, de outubro a dezembro de 2026. A data da compra é distinta da data da primeira parcela.
- Ao trocar o tipo, preservar campos compatíveis, solicitar categoria compatível e desativar parcelamento para receita. A simulação não cobre todas as combinações de métodos e categorias.

O layout existente, saldo acima do formulário mobile e versões desktop/mobile nos temas claro/escuro foram preservados.

## Referência e edição

Referência consultada, sem alterações: `C:\Users\eduar\OneDrive\VSCode\Gestor Financeiro`, especialmente `public/index.html`, `public/js/ui.js`, `public/js/main.js` e `public/js/firestore-service.js`.

A versão antiga exibia parcelamento no crédito, dividia o total e criava lançamentos mensais vinculados. Sua edição alterava somente o lançamento selecionado. Por isso, no estado de edição parcelada, o valor é o da parcela; quantidade e primeira data são informativas, e a confirmação esclarece que as demais parcelas não mudam. Alteração da série inteira não está proposta nesta entrega. O antigo “Gasto fixo” não foi incorporado: recorrência é outra funcionalidade.

## Requisitos para implementação

- Cada parcela deve afetar somente o orçamento do seu mês; não contabilizar simultaneamente o total da compra.
- Definir contrato de dados do grupo e parcelas, valores em centavos e distribuição do arredondamento preservando o total.
- Definir cálculo mensal para dias que não existem no mês seguinte e tratamento de fuso, evitando os problemas de somar meses diretamente à data.
- Garantir criação consistente, sem duplicação em retentativas, e isolamento por usuário.
- Especificar exclusão de parcela versus série antes de implementar. A exclusão em grupo da versão antiga não é aprovação automática dessa regra.
- Testar criação, edição individual, cancelamento, datas e cálculos. O Figma não comprova essas funcionalidades.
- Functions/Blaze continuam adiados conforme o plano do projeto; nenhuma cobrança ou serviço foi ativado.

## Referências visuais

- [Estados de tipo e parcelamento](https://www.figma.com/design/fDeglPOLWDf4zxIikgYEXv?node-id=131-2926)
- [Nova compra parcelada — mobile claro](https://www.figma.com/design/fDeglPOLWDf4zxIikgYEXv?node-id=133-3508)
- [Confirmação do parcelamento](https://www.figma.com/design/fDeglPOLWDf4zxIikgYEXv?node-id=139-3676)

Pendente: revisão do usuário e teste ponta a ponta em apresentação. Seletores e campos são estados demonstrativos, não um formulário com persistência.
