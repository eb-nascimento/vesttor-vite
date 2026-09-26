# Vesttor

O Vesttor organiza controle e planejamento financeiro pessoal. Este glossário define a linguagem oficial do domínio. Os documentos em `docs` usam estes termos; nomes diferentes presentes no código atual são contratos legados a serem refatorados.

## Transações

**Transação**: registro de uma receita ou despesa em determinada competência. Evitar como sinônimos: movimentação, lançamento e operação.

**Receita**: transação que aumenta o resultado financeiro.

**Despesa**: transação que reduz o resultado financeiro. “Gasto” pode aparecer apenas como linguagem informal da interface.

**Competência**: mês ao qual a transação pertence para análise e planejamento, independentemente de vencimento ou liquidação. Persistência-alvo: `AAAA-MM`.

**Vencimento**: data civil em que uma obrigação deve ser paga ou recebida. Persistência-alvo: `AAAA-MM-DD`.

**Liquidação**: pagamento efetivo de uma despesa ou recebimento efetivo de uma receita. Evitar: efetivação e baixa.

**Resultado do mês**: receitas menos despesas consideradas pela competência. Não representa saldo bancário.

**Fluxo líquido**: receitas recebidas menos despesas pagas no período de liquidação. Não representa saldo bancário.

## Situação financeira

**Prevista**: intenção ou projeção sem obrigação confirmada.

**Confirmada**: obrigação existente, ainda não paga ou recebida.

**Paga ou recebida**: transação liquidada. A interface adapta o termo à natureza.

**Cancelada**: obrigação confirmada que deixou de produzir efeito antes da liquidação.

**Estornada**: movimentação já liquidada cuja correção preserva o original e registra o movimento inverso.

**Em atraso**: condição calculada para uma transação confirmada, não liquidada e com vencimento anterior à data atual. Não é uma situação persistida.

## Pagamento e repetição

**Meio financeiro**: conceito neutro para o método de pagamento de uma despesa ou a forma de recebimento de uma receita, como Pix, dinheiro, cartão, boleto ou transferência.

**Condição de pagamento**: forma temporal de cumprimento de uma obrigação, classificada como à vista ou parcelada. Não é sinônimo de meio financeiro.

**Parcela**: uma das obrigações finitas de um parcelamento.

**Parcelamento**: divisão finita de uma obrigação total. Pode utilizar qualquer meio financeiro compatível e pode representar receita ou despesa.

**Recorrência**: regra que gera obrigações independentes em intervalos definidos, com término opcional. Não é parcelamento.

**Fixo**: classificação de previsibilidade. No produto, marcar um gasto como fixo também ativa recorrência mensal; uma recorrência pode continuar sendo variável.

## Classificação e catálogo

**Categoria**: finalidade de uma transação. Pode aceitar receita, despesa ou ambas.

**Catálogo universal**: conjunto de categorias e meios financeiros oferecido a todas as pessoas usuárias.

**Item personalizado**: categoria ou meio financeiro criado pelo usuário.

**Ocultação**: preferência pessoal que remove um item universal de novos seletores, sem alterar o catálogo nem o histórico.

**Desativação**: impede novos usos de um item personalizado sem apagar referências históricas.

## Planejamento

**Planejamento mensal**: conjunto de limites de uma competência.

**Limite planejado**: valor desejado para uma combinação de competência, categoria e natureza.

**Projeção**: total das transações previstas. É exibida separadamente do valor já comprometido.

**Comprometido**: total das transações confirmadas e pagas ou recebidas na competência. Não é uma situação persistida.

## Acesso atual e futuro

**Usuário**: pessoa autenticada que, no MVP, possui dados privados vinculados diretamente ao seu UID.

**Ambiente financeiro**: espaço futuro totalmente isolado, pessoal, compartilhado, familiar ou empresarial. Cada usuário poderá possuir no máximo um de cada tipo e alternar entre eles.

**Convite**: ingresso futuro em ambiente não pessoal por link autenticado, revogável, com token único, validade e papel previamente definido.
