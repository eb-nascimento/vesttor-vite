# Vesttor - Requisitos do Projeto

> **Registro histórico ou proposta:** o conteúdo abaixo preserva decisões e planos da época e pode divergir da implementação entregue. Para o estado do MVP e suas limitações, consulte [MVP](../MVP.md) e [índice da documentação](README.md). Não interprete requisitos propostos como funcionalidades prontas.

> **Documento histórico e não normativo.** Esta versão contém premissas anteriores à revisão de 26/09/2026. As fontes atuais são [Requisitos V2](requisitos-v2.md), [Especificação funcional](especificacao-funcional.md) e [Modelo de dados](modelo-de-dados.md).

## 1. Visao geral

O Vesttor e uma aplicacao web de controle e planejamento financeiro pessoal.

O sistema permite que uma pessoa autenticada acompanhe receitas, despesas e saldo, organizando suas movimentacoes financeiras de forma simples. O objetivo de evolucao do produto e ir alem de um CRUD de transacoes, adicionando categorias, metodos de pagamento, relatorios e principalmente orcamento mensal por categoria.

## 2. Problema

Muitas pessoas controlam suas financas com planilhas, anotacoes ou aplicativos genericos. Essas solucoes ajudam, mas nem sempre deixam claro como o dinheiro esta sendo planejado e consumido ao longo do mes.

Problemas identificados:

- Falta de organizacao das movimentacoes financeiras;
- Dificuldade em visualizar receitas, despesas e saldo;
- Dificuldade em entender para onde o dinheiro esta indo;
- Ausencia de planejamento mensal por categoria;
- Dificuldade em saber quanto ainda pode ser gasto em cada area;
- Falta de relatorios simples para analise financeira;
- Dependencia de controles manuais pouco praticos.

## 3. Objetivo do produto

Desenvolver uma aplicacao web simples, moderna e responsiva para controle e planejamento financeiro pessoal.

O sistema deve permitir que o usuario:

- Crie uma conta e acesse suas informacoes com seguranca;
- Cadastre receitas e despesas;
- Edite e exclua transacoes;
- Visualize saldo, receitas e despesas;
- Organize transacoes por categoria;
- Organize transacoes por metodo de pagamento;
- Defina orcamento mensal por categoria;
- Acompanhe o consumo do orcamento ao longo do mes;
- Filtre movimentacoes;
- Consulte relatorios financeiros;
- Identifique categorias com orcamento proximo do limite ou ultrapassado.

## 4. Escopo atual implementado

A versao atual contempla:

- Cadastro e login com e-mail e senha;
- Encerramento de sessao;
- Persistencia de transacoes no Cloud Firestore;
- Separacao das transacoes por usuario autenticado;
- CRUD completo de transacoes;
- Validacao do formulario de transacoes;
- Estados de carregamento e erro;
- Resumo financeiro com receitas, despesas e saldo;
- Filtro por tipo: todas, receitas ou despesas;
- Ordenacao por data ou valor;
- Mensagem de lista vazia;
- Conversao entre data do formulario e `Timestamp` do Firestore;
- Rotas de login e home;
- Protecao basica de paginas autenticadas no cliente;
- Redesenho da interface Home (Home V2) com grid responsivo de duas colunas;
- Formulario com selecao exclusiva Despesa/Receita (Despesa na esquerda por padrao);
- Renderizacao condicional de metodo de pagamento e parcelamento para despesas;
- Categorias dinamicas e calculo de parcelas em tempo real;
- Filtros em formato de pilulas e ordenacao sincronizada na URL;
- Tela completa de Transações V2 com paginação dinâmica de 10/8 itens;
- Paginador de Competência mensal fixo como Fonte da Verdade;
- Melhorias de Acessibilidade (Focus Trap em Modais e CustomSelect interativo);
- Fechamento inteligente de popovers por detecção de blur e teclado;
- Tela de Planejamento (Budget) com visualização de orçamento mensal e equação financeira;
- Mapeamento dinâmico de "Transações Fantasmas" (gastos não planejados previamente);
- Painel lateral com "Comprometimento Total", alertas de limite e próximos vencimentos;
- Tabela de planejamentos interativa com filtros (Fixo, Variável, etc), busca e edição.

## 5. Escopo alvo

Faz parte do objetivo final do Vesttor:

- Cadastro e gerenciamento de categorias;
- Cadastro e gerenciamento de metodos de pagamento;
- Associacao de transacoes com categoria;
- Associacao de transacoes com metodo de pagamento;
- Definicao de orcamento mensal por categoria;
- Calculo de orcamento utilizado;
- Calculo de orcamento restante;
- Percentual de consumo do orcamento;
- Alertas visuais de orcamento proximo do limite ou ultrapassado;
- Filtros por periodo, tipo, categoria e metodo de pagamento;
- Relatorio mensal;
- Relatorio por categoria;
- Relatorio por metodo de pagamento;
- Relatorio de orcamento por categoria;
- Autenticacao com Google;
- Interface visual final;
- Deploy de producao com Firebase Hosting.

## 6. Fora do escopo inicial

Nao fazem parte da versao inicial:

- Integracao automatica com bancos;
- Leitura automatica de extratos bancarios;
- Integracao com Open Finance;
- Emissao de relatorios fiscais;
- Aplicativo mobile nativo;
- Controle financeiro empresarial;
- Multiplos usuarios compartilhando a mesma conta;
- Funcionalidades contabeis;
- Observabilidade e monitoramento avancado.

## 7. Regras de negocio

### RN01 - Receitas aumentam o saldo

Toda transacao classificada como receita deve somar ao saldo total.

### RN02 - Despesas reduzem o saldo

Toda transacao classificada como despesa deve subtrair do saldo total.

### RN03 - Apenas despesas impactam o orcamento

O orcamento por categoria deve ser afetado apenas por transacoes do tipo despesa. Receitas nao devem consumir orcamento.

### RN04 - Orcamento e mensal

O orcamento definido para cada categoria deve ser considerado dentro de um mes de referencia.

Exemplo:

- Orcamento de alimentacao para junho;
- Orcamento de alimentacao para julho;
- Orcamento de alimentacao para agosto.

### RN05 - Despesa deve possuir categoria

Toda despesa deve estar vinculada a uma categoria para que o sistema consiga calcular o orcamento utilizado.

### RN06 - Transacao deve possuir metodo de pagamento

Toda transacao deve possuir um metodo de pagamento vinculado.

### RN07 - Orcamento proximo do limite

O sistema deve indicar visualmente quando uma categoria estiver proxima do limite definido.

Regra sugerida:

- Ate 79% utilizado: dentro do orcamento;
- De 80% a 99% utilizado: proximo do limite;
- A partir de 100% utilizado: orcamento ultrapassado.

### RN08 - Exclusao de categoria com transacoes

O sistema nao deve permitir excluir uma categoria vinculada a transacoes existentes, a menos que exista uma regra de substituicao ou confirmacao especifica.

### RN09 - Exclusao de metodo com transacoes

O sistema nao deve permitir excluir um metodo de pagamento vinculado a transacoes existentes, a menos que exista uma regra de substituicao ou confirmacao especifica.

### RN10 - Alteracoes atualizam indicadores

Sempre que uma transacao, categoria, metodo de pagamento ou orcamento for alterado, o sistema deve atualizar os indicadores financeiros automaticamente.

### RN11 - Identidade definida pelo backend

Toda transacao deve possuir `userId`. Na arquitetura alvo, o backend deve obter o UID do contexto autenticado e nao deve aceitar que o cliente escolha ou altere esse campo.

### RN12 - Descricao da transacao

A descricao e obrigatoria, deve ser normalizada e pode possuir no maximo 100 caracteres. A referencia de aproximadamente cinco palavras e apenas uma orientacao de uso.

### RN13 - Valor da transacao

O valor deve ser numerico, finito e maior que zero. Nao existe limite maximo de negocio definido.

### RN14 - Datas permitidas

Datas passadas e futuras sao permitidas. A proposta visual de compras parceladas esta definida em [Transacao e parcelamento](parcelamento.md). A geracao, o vinculo entre parcelas e os testes de persistencia permanecem pendentes de implementacao.

### RN15 - Criacao sem duplicacoes

A criacao de transacoes deve ser idempotente. Repeticoes da mesma intencao, inclusive por duplo clique, timeout ou retentativa de rede, devem produzir uma unica transacao.

### RN16 - Confirmacao de alteracoes

Edicao e exclusao devem exigir confirmacao explicita na interface. A confirmacao visual nao substitui a autorizacao e a verificacao de propriedade no backend.

### RN17 - Parcelamento de despesas em regime de competencia mensal

Compras parceladas geram lancamentos mensais individuais vinculados por um `parcelamentoId`. Cada parcela afeta exclusivamente o fluxo de caixa e saldo do seu respectivo mes de vencimento, impedindo que o valor global de uma compra comprometa indevidamente o saldo do mes inicial.

### RN18 - Arredondamento bancario de centavos na primeira parcela

O valor de compras parceladas e calculado com precisao de centavos inteiros. O residuo da divisao nao exata e somado integralmente a primeira parcela, garantindo que a soma de todas as parcelas coincida com o valor total da compra.

### RN19 - Calendario e vencimentos de parcelas em meses menores

Ao projetar os vencimentos mensais futuros, o dia base da compra e mantido. Se o mes subsequente nao possuir aquele dia (ex: 31 de janeiro em relacao a fevereiro), a data e ajustada para o ultimo dia valido do mes correspondente.

### RN20 - Saldo da Home e limite de exibicao

Os indicadores de saldo, receitas e despesas na pagina inicial refletem estritamente o mes e ano corrente. A lista recente na Home exibe no maximo as 5 ultimas movimentacoes para preservar a proporcao visual com o formulario, direcionando a consulta completa para `/transacoes`.

### RN21 - Exclusao de serie parcelada

Ao solicitar a exclusao de um lancamento parcelado, o usuario deve poder escolher entre excluir apenas a parcela pontual selecionada ou excluir aquela e todas as parcelas futuras da serie, preservando as parcelas anteriores ja pagas.

### RN22 - Deduplicacao e escopo temporal nas transacoes recentes da Home

Na lista de transacoes recentes da Home, movimentacoes com vencimento em meses futuros sao ocultadas para nao poluir o extrato imediato. Alem disso, cada compra parcelada vinculada por `parcelamentoId` aparece no maximo uma unica vez entre as movimentacoes recentes, exibindo a parcela ativa mais recente do periodo (ex: `1/24` em setembro, virando `2/24` em outubro), garantindo que as vagas da Home fiquem livres para outras movimentacoes.

### RN23 - Edicao atomica de serie parcelada e conversao

Ao editar uma compra parcelada, o formulario preenche o valor total da compra e limpa sufixos de parcela na descricao. Alteracoes no total da compra, na quantidade de parcelas (ex: de 10x para 5x) ou na data base recalculam e regravam todas as parcelas da serie atomicamente via `writeBatch` no Firestore. Se o usuario desmarcar o parcelamento, a serie e substituida por uma transacao pontual unica. Se uma transacao pontual for editada e marcada como parcelada, ela e convertida em uma serie de parcelas.

### RN24 - Validacao e controles de entrada do formulario

O campo de valor normaliza entradas em moeda corrente impedindo mais de 2 digitos apos a virgula ou ponto. O campo de parcelas suporta digitacao numerica direta, botoes de incremento/decremento (`[ - ]` e `[ + ]`), atalhos rapidos (`2x` ate `24x`) e clamping seguro entre 2 e 72 parcelas. O seletor de data utiliza componente React dedicado (`DatePicker.jsx`) com navegacao mensal em portugues e selecao intuitiva.

### RN25 - Extrato completo de Transacoes (Figma Transacoes V2)

A rota `/transacoes` exibe o extrato financeiro completo do usuario. Diferente da Home, a tela de Transacoes nao restringe o numero de lancamentos a 5 e exibe as movimentacoes de acordo com os filtros de competencia selecionados. O card superior "Resumo do periodo" calcula dinamicamente 4 metricas (Saldo no periodo, Receitas, Despesas e Quantidade de registros) estritamente sobre a lista de movimentacoes filtradas.

### RN26 - Criacao e edicao modal no extrato

O botao `+ Nova transacao` na tela de Transacoes abre um Modal flutuante contendo o formulario completo de transacoes com suporte a parcelamento, validacoes e calendario visual. A edicao de transacoes avulsas ou series parceladas a partir da tabela/card tambem e realizada em modal, mantendo o usuario no contexto do extrato.

### RN27 - Painel retratil de filtros e busca

A tela de Transacoes disponibiliza um botao de acao `Abrir filtros` que expande/recolhe um painel retratil contendo: campo de busca textual em tempo real por descricao, filtro por tipo (Todas, Receitas, Despesas), seletor de mes/ano, selecao de categoria, selecao de metodo de pagamento, opcoes de ordenacao e botao para limpar todos os filtros aplicados.

### RN28 - Apresentacao contextual de subtitulos

Na tabela desktop e nos cards mobile, cada lancamento de despesa deve informar explicitamente na segunda linha da descricao se foi realizado `A vista` ou se e `Parcelado (ex: Parcela 1/10)`. Para receitas, nenhum subtitulo adicional e exibido, mantendo o layout limpo.

### RN29 - Paginacao no extrato

A listagem de transacoes aplica paginacao para otimizar desempenho e usabilidade: 10 itens por pagina em visualizacao desktop e 8 itens por pagina em telas mobile. A interface de paginacao exibe indicador de intervalo (`X–Y de Z transacoes`) e botoes de navegacao (`<`, paginas numericas com a atual em destaque, e `>`).

## 8. Modelo de dados alvo

### 8.1. Transacao

```js
{
  id: string,
  userId: string,
  descricao: string,
  valor: number,
  data: Timestamp,
  tipo: "receita" | "despesa",
  categoriaId?: string,
  metodoPagamentoId?: string,
  parcelamentoId?: string,
  numeroParcela?: number,
  totalParcelas?: number,
  criadoEm: Timestamp,
  atualizadoEm?: Timestamp
}
```

### 8.2. Categoria

```js
{
  id: string,
  userId: string,
  nome: string,
  tipo: "receita" | "despesa" | "ambos",
  cor?: string,
  ativo: boolean,
  criadoEm: Timestamp,
  atualizadoEm?: Timestamp
}
```

### 8.3. Metodo de pagamento

```js
{
  id: string,
  userId: string,
  nome: string,
  tipo?: "dinheiro" | "pix" | "debito" | "credito" | "transferencia" | "outro",
  ativo: boolean,
  criadoEm: Timestamp,
  atualizadoEm?: Timestamp
}
```

### 8.4. Orcamento mensal

```js
{
  id: string,
  userId: string,
  categoriaId: string,
  mes: number,
  ano: number,
  valorPlanejado: number,
  criadoEm: Timestamp,
  atualizadoEm?: Timestamp
}
```

## 9. Telas previstas

### 9.1. Autenticacao

Deve permitir:

- Criar conta;
- Fazer login;
- Exibir erros de autenticacao.

### 9.2. Home

Decisão de produto: a Home existente permanece como primeira tela após o login, com o registro de transação como ação principal, sem reorganização estrutural do layout.

Deve manter o formulário de transação e o resumo financeiro existente. As visões analíticas detalhadas ficam na tela separada de Resumo financeiro:

- Saldo atual;
- Total de receitas;
- Total de despesas;
- Resumo do orcamento mensal;
- Categorias com maior consumo;
- Alertas de orcamento excedido;
- Atalho para nova transacao, sem substituir a Home como entrada do sistema.

O mapeamento visual e seus limites de validação estão em `docs/auditoria-telas.md`.

### 9.3. Transacoes

Deve permitir:

- Cadastrar transacao;
- Editar transacao;
- Excluir transacao;
- Listar transacoes;
- Filtrar transacoes;
- Ordenar transacoes.

### 9.4. Categorias

Deve permitir:

- Cadastrar categoria;
- Editar categoria;
- Excluir categoria;
- Listar categorias.

### 9.5. Metodos de pagamento

Deve permitir:

- Cadastrar metodo de pagamento;
- Editar metodo de pagamento;
- Excluir metodo de pagamento;
- Listar metodos.

### 9.6. Orcamentos

Deve permitir:

- Definir orcamento mensal por categoria;
- Editar orcamento;
- Visualizar valor utilizado;
- Visualizar valor restante;
- Visualizar percentual utilizado;
- Identificar orcamento proximo do limite ou ultrapassado.

### 9.7. Relatorios

Deve apresentar:

- Relatorio mensal;
- Relatorio por categoria;
- Relatorio por metodo de pagamento;
- Relatorio de orcamento.

## 10. Criterios de aceite do estado atual

- Usuario consegue criar conta e entrar;
- Sessao permanece apos recarregar;
- Usuario consegue sair;
- Apenas transacoes consultadas pelo UID atual aparecem;
- Nova transacao recebe `userId`;
- CRUD persiste apos recarregar;
- Datas sao armazenadas como `Timestamp`;
- Filtros e ordenacao funcionam sem alterar os dados;
- Resumo acompanha as transacoes carregadas;
- Falhas do Firebase geram mensagem de erro;
- Usuario nao autenticado nao acessa paginas privadas;
- Usuario autenticado e redirecionado ao tentar acessar login.

## 11. Criterios de aceite do escopo alvo

### CA01 - Cadastro de categoria

Dado que o usuario esta autenticado, quando cadastrar uma categoria valida, entao ela deve ser salva e exibida na lista de categorias do usuario.

### CA02 - Cadastro de metodo de pagamento

Dado que o usuario esta autenticado, quando cadastrar um metodo de pagamento valido, entao ele deve ser salvo e disponibilizado no cadastro de transacoes.

### CA03 - Transacao com categoria e metodo

Dado que existem categorias e metodos cadastrados, quando o usuario cadastrar uma transacao, entao devera informar categoria e metodo de pagamento.

### CA04 - Orcamento por categoria

Dado que o usuario definiu um orcamento para uma categoria, quando cadastrar uma despesa nessa categoria, entao o sistema deve atualizar o valor utilizado e o valor restante.

### CA05 - Alerta de orcamento excedido

Dado que os gastos de uma categoria ultrapassaram o orcamento definido, quando o usuario visualizar o resumo de orcamento, entao o sistema deve indicar visualmente que o orcamento foi excedido.

### CA06 - Filtros avancados

Dado que existem transacoes cadastradas, quando o usuario aplicar filtros por periodo, tipo, categoria ou metodo de pagamento, entao o sistema deve exibir apenas as transacoes correspondentes.

### CA07 - Relatorios

Dado que existem movimentacoes cadastradas, quando o usuario acessar a tela de relatorios, entao o sistema deve apresentar informacoes consolidadas sobre receitas, despesas e orcamento.

### CA08 - Identidade confiavel

Dado um usuario autenticado, quando criar uma transacao, entao o documento deve receber o UID obtido pelo backend, independentemente de campos adicionais enviados pelo cliente.

### CA09 - Criacao idempotente

Dadas chamadas simultaneas ou sequenciais com a mesma chave de idempotencia, quando a criacao for processada, entao apenas uma transacao deve existir e as repeticoes devem retornar o mesmo resultado logico.

### CA10 - Validacao dos campos

Dada uma transacao, quando a descricao tiver ate 100 caracteres, o valor for positivo e finito e a data passada ou futura for valida, entao o backend deve aceitar esses campos. Uma descricao com mais de 100 caracteres deve ser rejeitada.

### CA11 - Leitura em tempo real e isolamento

Dado um usuario autenticado, quando suas transacoes forem alteradas, entao a interface deve receber a atualizacao em tempo real sem ler documentos de outros usuarios.

### CA12 - Escritas protegidas

Dado que a migracao para Functions foi concluida, quando o cliente tentar criar, editar ou excluir diretamente no Firestore, entao as Security Rules devem negar a operacao.

## 12. Prioridades de produto

### 12.1. Alta prioridade

1. Completar os fluxos de cadastro, login, recuperacao de senha e verificacao de e-mail.
2. Corrigir lint, codificacao UTF-8 e estados de processamento.
3. Adicionar categorias e metodos de pagamento com isolamento por usuario.
4. Detalhar as transacoes e concluir a experiencia mobile do nucleo.
5. Aplicar no React o layout responsivo aprovado no Figma.
6. Testar Security Rules e regressao com duas contas.
7. Preparar e entregar os artefatos academicos nas datas definidas.

### 12.2. Media prioridade

1. Implementar orcamento mensal por categoria.
2. Implementar calculo de orcamento utilizado.
3. Implementar alertas visuais de orcamento.
4. Separar erro inicial de erro de operacao.
5. Implementar filtros e relatorios financeiros.
6. Desenhar dashboard, conta e preferencias somente depois do mobile.

### 12.3. Pos-MVP de producao

1. Confirmar edicao e regiao do Firestore e definir a infraestrutura das Functions.
2. Implementar validacao, autorizacao e idempotencia no backend.
3. Migrar criacao, edicao e exclusao para callable Functions.
4. Configurar App Check, IAM, logs, alertas e protecoes de custo.
5. Bloquear escritas diretas somente depois da migracao validada e com rollback documentado.

### 12.4. Qualidade

1. Criar testes para `utils`.
2. Criar testes dos hooks e formularios.
3. Revisar acessibilidade de labels, foco e mensagens.
4. Revisar codificacao UTF-8 dos textos.
5. Mover configuracao Firebase para variaveis de ambiente do Vite.
6. Revisar interface visual final.
7. Preparar deploy de producao.
