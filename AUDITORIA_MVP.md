# Validação técnica do MVP — 13/11/2026

## Etapa 2 para revisão — orçamentos híbridos (v0.7.0)

- A identidade do orçamento agora considera mês, categoria e classificação (Entrada/Fixo/Variável). Fixo e variável da mesma categoria podem coexistir. Duplicatas da mesma classificação continuam bloqueadas, inclusive em criações concorrentes pelo serviço da aplicação.
- As despesas têm um novo campo opcional `classificacao` (`Fixo` ou `Variável`). O formulário sugere o padrão da categoria, aceita alteração e preserva a escolha na edição. Receitas não carregam esse campo. Compras parceladas propagam a classificação para a série, sem alterar nesta etapa a lógica das datas.
- O realizado cruza categoria e classificação, sem compartilhar gastos entre os dois orçamentos. As listas de transações mostram a classificação junto à categoria.
- Lançamentos antigos sem o campo usam o padrão da categoria na leitura, inclusive se havia um orçamento com outra classificação; podem ser reclassificados por edição. A tela avisa esse fallback. Não houve migração nem regravação de dados de produção.
- IDs de orçamento antigos continuam sendo lidos; a edição move o documento para o ID canônico correspondente à classificação, preservando sua data de criação. Criar a outra classificação não remove o registro anterior.
- Security Rules locais aceitam o campo opcional apenas em despesas e rejeitam classificações desconhecidas. As regras precisam ser publicadas antes do uso desta versão contra o Firebase publicado. Não houve deploy nem commit.
- Validação: 145 testes de aplicação aprovados, incluindo interações com React real, e 37 testes de Rules/serviços aprovados com Firestore real emulado no projeto `demo-vesttor-rules`, porta 8180. O emulador já instalado foi iniciado diretamente com Java 26, sem baixar a CLI. A primeira execução teve timeout no teste administrativo de migração durante a inicialização; a suíte completa passou com `--testTimeout 20000` e `GCLOUD_PROJECT=demo-vesttor-rules`. Testes confirmam coexistência, realizado separado, duplicidade concorrente, conversão despesa/receita e validação do novo campo.
- Versão anterior 0.6.4 → 0.7.0 por funcionalidade compatível com campo opcional novo. A correção do calendário das parcelas e o limite de descrição permanecem para as próximas etapas.

## Etapa 1 para revisão - classificação no formulário (v0.6.3)

O formulário de orçamento agora apresenta Classificação: despesas aceitam Fixo ou Variável; receitas usam Entrada; Outros permite as três opções. Ao selecionar uma categoria, o formulário preenche sua sugestão padrão, permitindo alteração manual. A edição preserva a classificação salva. Os defaults existentes (Moradia, Contas & Serviços e Educação como fixos) foram centralizados no catálogo em código e compartilhados com o cálculo dos itens não planejados. Não houve alteração no schema ou nas Rules.

O usuário esclareceu que deseja dois orçamentos da mesma categoria no mês, um fixo e um variável. O bloqueio por natureza descrito abaixo é a implementação anterior e ainda precisa ser revisto na próxima etapa, junto à identificação da classificação dos lançamentos para separar corretamente o realizado. Essa ampliação não foi implementada nesta etapa. A correção das parcelas e o limite de descrição também ficam para etapas posteriores. Nenhum commit foi criado.

## Atualização após as correções — v0.6.2

- Achados 2 e 3 corrigidos: cruzamento por categoria e natureza; receitas sem orçamento são classificadas como entradas, incluindo Investimentos e Dividendos.
- Achado 5 corrigido no fluxo da aplicação: criação e edição verificam duplicatas, incluindo legado; a identidade considera mês, categoria e natureza. Fixo e Variável pertencem à mesma natureza de despesa. Novas gravações usam ID determinístico e transação para evitar duas criações concorrentes. Editar um registro com ID antigo o move atomicamente para o ID determinístico, preservando os campos e a data de criação. Não foi executada migração nem gravação em produção.
- Dados antigos duplicados não multiplicam mais o realizado na tela; registros existentes não foram removidos. A soma dos valores planejados de duplicatas antigas ainda exige saneamento dos dados, caso existam.
- A proteção de unicidade está nos serviços da aplicação; as Rules existentes não impedem que um cliente alternativo crie documentos com IDs arbitrários. Garantia contra clientes que contornem o serviço exigiria reforçar o contrato nas Rules ou no backend.
- Achados 1, 4 e 6 aguardam definição/implementação; o usuário solicitou explicação para 1 e 6 e está avaliando o comportamento desejado para parcelas.
- Verificações: lint e build aprovados; 132 testes em 21 arquivos aprovados, incluindo dez novas regressões. A disputa de criação foi testada com transações simuladas; a integração real com Firestore e Security Rules continua pendente no ambiente restrito.
- Versão incrementada de 0.6.1 para 0.6.2 por correções compatíveis. O aviso de bundle acima de 500 kB permanece.

As seções abaixo registram os achados originais e suas reproduções, anteriores às correções acima.

## Parecer

O projeto compila e a suíte existente passa, mas há erros funcionais em planejamento e edição de parcelamentos que devem ser corrigidos antes de considerar a entrega validada. Esta auditoria não alterou a implementação nem publicou recursos.

## Escopo e evidências

- Escopo confrontado com `MVP.md`: autenticação, transações, parcelas, resumo mensal, consulta, planejamento e catálogos universais.
- Revisão dos componentes React, hooks, serviços Firebase, configuração de ambiente, Security Rules e índices locais.
- `npm run lint`: aprovado, saída 0.
- `npm run test:run`: 19 arquivos e 122 testes aprovados.
- `npm run build`: aprovado, saída 0. JavaScript principal de 738,89 kB, 228,85 kB gzip; aviso de chunk acima de 500 kB.
- Reproduções locais executando o trecho de cálculo atual de `Budget.jsx` com dados controlados e as funções reais de parcelamento. São reproduções de lógica, não testes ponta a ponta com persistência.
- Figma acessado: arquivo `fDeglPOLWDf4zxIikgYEXv`, páginas identificadas e referência mobile de planejamento `281:158` inspecionada. A referência prevê grupos de entradas, fixos e variáveis. Não foi feita comparação visual completa das telas renderizadas.

## Achados

### 1. Alta — novos orçamentos não permitem definir entrada ou gasto fixo

Arquivo: `src/features/budget/components/ModalFormPlanejamento.jsx`, linhas 28–42 e 58–72.

O formulário inicializa `tipo` como `Variável`, exibe apenas categoria e valor e envia `form.tipo` sem recalculá-lo. Criar um orçamento de Salário ou Aluguel pelo botão de novo orçamento grava ambos como variáveis. Isso afeta grupos e saldo projetado. Editar um registro existente preserva o tipo anterior, mas também não permite corrigi-lo.

Correção sugerida: permitir escolher a natureza e a classificação de despesa, com categorias compatíveis, e validar essa combinação antes de gravar.

### 2. Alta — receitas sem planejamento podem virar despesas

Arquivo: `src/pages/Budget.jsx`, linhas 57–81.

A classificação dos itens sem planejamento depende de uma lista curta de nomes, ignorando `t.tipo`. Uma receita de Dividendos de R$ 100, sem orçamento, produziu entradas realizadas de R$ 0 e variáveis realizadas de R$ 100. Investimentos também está explicitamente associado a Fixo.

Correção sugerida: reconhecer receita a partir de `t.tipo`; usar classificação de categoria apenas para distinguir despesas fixas e variáveis.

### 3. Alta — a categoria compartilhada Outros mistura receita e despesa

Arquivo: `src/pages/Budget.jsx`, linhas 41–53 e 69–81.

O cruzamento e a identificação dos itens não planejados usam apenas categoria. Com orçamento de entrada Outros, receita de R$ 100 e despesa de R$ 30 em Outros, o cálculo retornou R$ 130 em entradas realizadas. A despesa deixou de aparecer separadamente.

Correção sugerida: identificar o grupo por categoria e natureza, filtrando o realizado pela natureza correspondente ao planejamento. A mesma separação deve valer para itens sem planejamento.

### 4. Alta — editar uma parcela intermediária desloca toda a série

Arquivos: `src/features/transactions/components/FormTransacao.jsx`, linhas 66–68 e 254–270; `src/services/transacoesService.js`, função `atualizarCompraParceladaNaApi`.

O formulário abre com a data da parcela selecionada. Ao salvar, usa essa data como início de uma série nova, enquanto o serviço exclui a série inteira. Na reprodução, a série 15/jan, 15/fev e 15/mar passou para 15/fev, 15/mar e 15/abr ao salvar a edição da segunda parcela sem alterar os campos. O período anterior perde seu lançamento.

Correção sugerida: obter a data original da compra e preservar a posição da parcela, ou apresentar explicitamente uma edição apenas das parcelas futuras. Evitar substituir toda a série usando a data da parcela selecionada.

### 5. Média — orçamentos duplicados contam o realizado várias vezes

Arquivos: `src/services/planejamentoService.js`, linhas 10–13; `src/pages/Budget.jsx`, linhas 41–49 e 98–108; `firebase/firestore.rules`, validação de planejamentos.

A criação usa IDs automáticos, sem verificação de unicidade por mês, categoria e natureza. Cada orçamento soma novamente as mesmas transações. Dois orçamentos de Alimentação com um gasto real de R$ 50 produziram R$ 100 de variáveis realizadas.

Correção sugerida: definir a identidade única do orçamento e impor a criação de forma atômica; se múltiplos orçamentos por categoria forem desejados, distribuir o realizado em vez de repeti-lo.

### 6. Média — descrição aceita pelo formulário pode ser recusada pelo Firestore

Arquivos: `src/utils/transacao.js`, função `validarTransacao`; `src/utils/parcelamento.js`, linha 123; `firebase/firestore.rules`, linha 58.

O formulário exige apenas descrição não vazia. As regras limitam o documento a 100 caracteres. No parcelamento, o sufixo também conta: uma descrição base com 100 caracteres virou 106 em `(1/2)`. A operação é recusada na persistência, com erro genérico em vez de orientação de comprimento.

Correção sugerida: validar o limite final de cada documento, reservando espaço para o maior sufixo da série, e explicar o limite no formulário. Também rejeitar parcelas de valor zero antes do envio quando o total em centavos for inferior ao número de parcelas.

## Pontos positivos observados

- Consultas mensais por usuário, com cancelamento dos listeners.
- Escritas novas na hierarquia privada do usuário, com dinheiro em centavos.
- Rules locais exigem autenticação/propriedade e restringem campos e valores; há testes existentes de acesso cruzado e anônimo. Esta observação é estática, não certifica as regras publicadas.
- Operações de séries usam batches, evitando gravações parcialmente confirmadas dentro de cada batch.
- Tratamento de falhas de leitura/escrita e bloqueio de envio duplicado nos formulários.
- Modais implementam Escape, gerenciamento de foco e bloqueio de rolagem; selects e abas têm suporte de teclado. Ainda requerem verificação no navegador.
- Catálogos e criação desativada estão de acordo com a decisão de escopo do MVP. Páginas futuras não foram classificadas como funcionalidades obrigatórias ausentes.

## Limites e pendências da validação

- `npm run test:rules` foi iniciado, mas não concluiu a inicialização via `npx firebase-tools@latest` durante a revisão. Não há aprovação da suíte de Rules nesta execução.
- Tentativas de conexão local em 127.0.0.1:4400 e 127.0.0.1:5173 foram recusadas pelas permissões de socket do ambiente. Não foram executados fluxos reais de navegador/autenticação/CRUD; responsividade, console e fidelidade visual continuam pendentes.
- Não foram verificadas as configurações efetivamente publicadas de Auth, Rules, índices, domínios autorizados ou recuperação por e-mail. Não houve alteração de dados reais.
- A comparação com o Figma ficou restrita à estrutura e à referência mobile de planejamento. Não é aprovação visual das demais páginas ou temas.
- Parte dos testes de formulário substitui hooks React e desativa `useEffect`; esses testes não comprovam inicialização real, renderização completa ou integração entre componentes. Os 122 testes aprovados não cobrem os achados acima.

## Ordem recomendada

1. Corrigir natureza/classificação, separação de Outros e duplicação de realizado no planejamento.
2. Corrigir edição da série a partir de uma parcela intermediária.
3. Alinhar validações do formulário às Rules e adicionar regressões para os casos reproduzidos.
4. Executar Rules em emulador e fluxos completos em navegador isolado, em desktop e mobile, antes da publicação.
5. Reduzir o bundle com carregamento de rotas sob demanda após os erros funcionais.
