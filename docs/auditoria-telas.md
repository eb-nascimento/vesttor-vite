# Auditoria das telas — Vesttor V2/V3

Revisão consolidada em 25/09/2026. O escopo desta auditoria é o arquivo oficial do Figma e sua documentação. Ela não comprova a implementação das funcionalidades no React/Firebase.

## Resultado

O arquivo possui atualmente 12 seções e 372 telas no padrão V2/V3. Todas as áreas principais possuem versões desktop e mobile nos temas escuro e claro.

Foram verificadas:

- 212 telas existentes na revisão anterior;
- 160 novas telas de validação, processamento, sucesso, confirmação e falha operacional;
- versões mobile das áreas principais por inspeção visual;
- separação entre as seções no canvas;
- títulos, descrições, botões e caixas de texto com maior risco de colisão.

Após os ajustes, a verificação final não encontrou texto visível fora dos frames, colisão entre títulos e descrições ou sobreposição entre seções. Diferenças de 1 px causadas por bordas internas não foram tratadas como erro visual.

O inventário completo, com IDs, estados e regras de organização, está registrado neste documento.

## Fontes e decisões de produto

Foram considerados:

- `docs/requisitos.md`;
- `docs/SDD.md`;
- `docs/transacoes-v2.md`;
- `docs/parcelamento.md`;
- as referências visuais clara e escura da pasta `docs/Documentação`;
- as decisões tomadas durante a revisão das telas.

Em caso de conflito, prevalecem as decisões mais recentes:

- a Home continua sendo a entrada principal para cadastrar transações;
- Home e Dashboard são páginas diferentes;
- as seções permanecem na mesma ordem no canvas;
- elementos podem ser reorganizados dentro de uma seção quando isso melhora a leitura;
- cada página é organizada com desktop e mobile lado a lado, e a variação clara abaixo da escura;
- o mobile deve usar proporções próprias, sem reproduzir componentes gigantes do desktop;
- a tela de Transações inicia com o painel de filtros recolhido;
- Orçamentos utiliza a versão V3, mais densa e próxima de uma tabela.

## Cobertura atual

| Área | Seção | Telas | Cobertura principal |
| --- | --- | ---: | --- |
| Login | `187:3` | 4 | Entrada por e-mail/senha e Google |
| Cadastro | `192:2` | 4 | Criação de conta |
| Recuperação e verificação | `192:141` | 12 | Recuperar senha, verificar e-mail e redefinir senha |
| Estados de autenticação | `194:60` | 44 | Sucessos, erros, carregamento, links expirados e falha no envio |
| Home | `207:5` | 32 | Cadastro, validação, salvamento, sucesso, falhas, saldos e últimas movimentações |
| Dashboard | `207:9` | 16 | Visão analítica resumida |
| Transações | `222:2` | 48 | Extrato, edição, exclusão simples/parcelada e retornos operacionais |
| Categorias | `254:2` | 52 | Lista, criação, validação, exclusão, bloqueios e retornos operacionais |
| Métodos de pagamento | `255:2` | 52 | Lista, criação, validação, exclusão, bloqueios e retornos operacionais |
| Orçamentos | `256:2` | 52 | Entradas, gastos fixos/variáveis, CRUD, alertas e estados V3 |
| Relatórios | `257:2` | 16 | Comparativos, categorias e planejado × realizado |
| Conta e preferências | `259:2` | 40 | Perfil, preferências, salvamento, risco e exclusão da conta |

## Correções realizadas na revisão

- Título e subtítulo mobile de Métodos de pagamento foram separados e reposicionados.
- Títulos e descrições dos estados mobile de Relatórios e Conta receberam espaçamento mínimo consistente.
- As caixas de texto das transações recentes do Dashboard mobile foram limitadas à área disponível.
- O estado de falha no envio de recuperação foi reorganizado após a quebra do título em duas linhas.
- A nova família de estados de recuperação foi movida para a seção correta de estados de autenticação.
- As seções foram redimensionadas sem alterar suas posições no canvas.

## Novos erros operacionais documentados

Foram acrescentadas quatro variações — desktop/mobile e escuro/claro — para cada situação:

1. falha ao salvar uma transação, preservando os campos;
2. exclusão de categoria bloqueada por uso;
3. exclusão de método de pagamento bloqueada por uso;
4. falha ao salvar um orçamento;
5. falha na confirmação de identidade;
6. falha ao enviar o e-mail de recuperação de senha.

Total acrescentado: 24 telas.

## O que a auditoria não comprova

- funcionamento real de formulários, filtros ou autenticação;
- persistência e isolamento dos dados por usuário;
- envio real de e-mails;
- foco, navegação por teclado e leitura por leitor de tela;
- contraste de todos os pares de cores;
- comportamento em larguras intermediárias entre 390 e 1440 px;
- aceite de usabilidade pela orientadora ou por usuários finais.

## Próximas validações recomendadas

1. Executar o protótipo ponta a ponta em modo apresentação.
2. Testar os fluxos alternativos e retornos após erros.
3. Validar foco, teclado, mensagens e contraste na implementação.
4. Comparar a aplicação implementada com as telas aprovadas do Figma.
5. Registrar feedback de usabilidade antes de alterar a estrutura das seções.

## Inventário detalhado do Figma

### Referência

- Arquivo: `Vesttor — Design System`
- File key: `fDeglPOLWDf4zxIikgYEXv`
- Página: `03 — Padrões V2`
- Page node: `187:2`

### Organização do canvas

As áreas do produto permanecem separadas em seções. Uma seção não deve ser trocada de posição com outra. Ajustes internos são permitidos quando melhoram hierarquia, leitura ou adaptação ao mobile.

Padrão das páginas principais:

```text
Tema escuro:  Desktop | Mobile
Tema claro:   Desktop | Mobile
```

Nas seções extensas de estados, o mesmo princípio é repetido em blocos. Os estados são alternativas de uma mesma página e não representam elementos simultâneos.

#### Dimensões de referência

| Contexto | Largura | Altura |
| --- | ---: | --- |
| Desktop principal | 1440 px | variável conforme conteúdo |
| Mobile principal | 390 px | variável conforme conteúdo |
| Desktop de estado | 1440 px | 720 ou 900 px |
| Mobile de estado | 390 px | 844 px |

### Princípios visuais

- Fonte principal: Inter.
- Temas escuro e claro mantêm a mesma hierarquia de conteúdo.
- O mobile usa componentes compactos, margens próximas de 20 px e alvos de toque proporcionais.
- Cards agrupam conteúdo relacionado e evitam grandes áreas vazias sem função.
- Títulos e descrições não se sobrepõem; descrições começam após o fim real do título.
- Botões não ficam colados ao texto anterior ou às bordas do card.
- Estados apresentam contexto, mensagem principal, explicação e uma ação possível.
- A navegação mantém o padrão visual da área autenticada.

### Login

- Seção: `187:3` — `V2.1 — Autenticação`
- Quantidade: 4 telas
- Variações: desktop/mobile, escuro/claro
- Conteúdo: e-mail, senha, recuperação, login com Google e acesso ao cadastro.

### Cadastro

- Seção: `192:2` — `V2.2 — Cadastro`
- Quantidade: 4 telas
- Variações: desktop/mobile, escuro/claro
- Conteúdo: nome, e-mail, senha, confirmação e acesso ao login.

### Recuperação, verificação e redefinição

- Seção: `192:141` — `V2.3 — Recuperação, verificação e redefinição`
- Quantidade: 12 telas
- Fluxos: recuperar senha, verificar e-mail e redefinir senha
- Cada fluxo possui desktop/mobile, escuro/claro.

### Estados de autenticação

- Seção: `194:60` — `V2.4 — Estados de autenticação`
- Quantidade: 44 telas

Estados existentes:

- senha redefinida;
- e-mail confirmado;
- link expirado;
- validação de senha;
- falha ao criar conta;
- e-mail ainda não confirmado;
- e-mail reenviado;
- falha ao entrar com Google;
- login com erro;
- login carregando;
- falha no envio da recuperação de senha.

IDs do novo estado de recuperação:

| Variação | Node ID |
| --- | --- |
| Desktop escuro | `315:460` |
| Mobile escuro | `315:478` |
| Desktop claro | `315:496` |
| Mobile claro | `315:514` |

### Home

- Seção: `207:5` — `Home V2`
- Quantidade: 32 telas
- Principais: 4
- Estados: carregando, sem dados, erro, validação do formulário, salvando, sucesso e falha ao salvar

A Home é obrigatoriamente centrada no cadastro de transações. No desktop também apresenta saldos e últimas transações. Ela não deve ser substituída pelo Dashboard.

### Dashboard

- Seção: `207:9` — `Dashboard V2`
- Quantidade: 16 telas
- Principais: 4
- Estados: carregando, sem dados e erro

Conteúdo: saldo disponível, receitas, despesas, fluxo mensal, orçamento, alertas e transações recentes.

### Transações

- Seção: `222:2` — `Transações V2`
- Quantidade: 48 telas
- Principais: 4
- Estados: carregando, sem resultados, erro ao carregar, falha ao salvar, confirmação/resultado da edição e confirmação/processamento/resultado da exclusão

Regras visuais:

- o filtro começa recolhido e é aberto pelo ícone/botão de filtro;
- o desktop usa tabela e o mobile usa cards;
- o resumo do período respeita a competência selecionada;
- a paginação usa 10 itens no desktop e 8 no mobile;
- despesas informam `À vista` ou `Parcela X/Y`.

IDs da falha ao salvar:

| Variação | Node ID |
| --- | --- |
| Desktop escuro | `315:2` |
| Mobile escuro | `315:24` |
| Desktop claro | `315:49` |
| Mobile claro | `315:71` |

A mensagem informa que os campos foram preservados para reduzir duplicações em retentativas.

### Categorias

- Seção: `254:2` — `Categorias V2`
- Quantidade: 52 telas
- Principais: 4
- Estados: carregando, sem dados, erro, validação, salvamento, sucesso, falha ao salvar, confirmação, processamento, sucesso/falha ao excluir e exclusão bloqueada

IDs da exclusão bloqueada:

| Variação | Node ID |
| --- | --- |
| Desktop escuro | `315:96` |
| Mobile escuro | `315:117` |
| Desktop claro | `315:142` |
| Mobile claro | `315:163` |

Categorias vinculadas a transações não são excluídas diretamente. A interface orienta desativar ou substituir a categoria.

### Métodos de pagamento

- Seção: `255:2` — `Métodos de pagamento V2`
- Quantidade: 52 telas
- Principais: 4
- Estados: carregando, sem dados, erro, validação, salvamento, sucesso, falha ao salvar, confirmação, processamento, sucesso/falha ao excluir e exclusão bloqueada

IDs da exclusão bloqueada:

| Variação | Node ID |
| --- | --- |
| Desktop escuro | `315:188` |
| Mobile escuro | `315:209` |
| Desktop claro | `315:234` |
| Mobile claro | `315:255` |

Métodos vinculados a transações devem ser desativados ou substituídos antes da exclusão.

### Orçamentos

- Seção: `256:2` — `Orçamentos V3`
- Quantidade: 52 telas
- Principais: 4
- Estados: carregando, sem dados, erro ao carregar, validação, salvamento, sucesso, falha ao salvar, confirmação/processamento/resultado da exclusão e limite ultrapassado

A versão aprovada é a V3. As versões exploratórias anteriores devem ser desconsideradas.

Estrutura principal:

- referência mensal;
- resumo de planejado, realizado e saldo;
- grupos compactos de entradas, gastos fixos e gastos variáveis;
- valores planejados e realizados;
- percentual e alertas de consumo;
- densidade próxima de tabela para mostrar mais dados em menos espaço.

IDs da falha ao salvar:

| Variação | Node ID |
| --- | --- |
| Desktop escuro | `315:280` |
| Mobile escuro | `315:300` |
| Desktop claro | `315:327` |
| Mobile claro | `315:347` |

### Relatórios

- Seção: `257:2` — `Relatórios V2`
- Quantidade: 16 telas
- Principais: 4
- Estados: carregando, sem dados e erro

Conteúdo:

- receitas, despesas e saldo do período;
- receitas × despesas;
- despesas por categoria;
- planejado × realizado;
- alternância entre visão mensal e por categorias.

### Conta e preferências

- Seção: `259:2` — `Conta e preferências V2`
- Quantidade: 40 telas
- Principais: 4
- Estados: salvando, perfil incompleto, erro ao atualizar, falha de identidade, sucesso/falha ao salvar e confirmação/processamento/conclusão da exclusão da conta

Conteúdo:

- perfil e e-mail;
- preferência de tema: escuro, claro ou sistema;
- informações de sessão;
- saída da conta;
- zona de risco e exclusão permanente.

IDs da falha de identidade:

| Variação | Node ID |
| --- | --- |
| Desktop escuro | `315:374` |
| Mobile escuro | `315:394` |
| Desktop claro | `315:417` |
| Mobile claro | `315:437` |

Antes da exclusão da conta, a interface exige nova autenticação. Em caso de falha, orienta entrar novamente.

## Matriz de estados

| Área | Principal | Leitura | Validação | Processamento | Sucesso | Confirmação | Falha operacional |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Home | ✓ | Carregando, vazio e erro | ✓ | Salvando | ✓ | — | Falha ao salvar |
| Dashboard | ✓ | Carregando, vazio e erro | — | — | — | — | — |
| Transações | ✓ | Carregando, sem resultado e erro | Formulário existente | Editando e excluindo | Edição e exclusão | Edição e série parcelada | Salvar e excluir |
| Categorias | ✓ | Carregando, vazio e erro | ✓ | Salvando e excluindo | Salvar e excluir | Exclusão | Salvar, excluir e vínculo ativo |
| Métodos | ✓ | Carregando, vazio e erro | ✓ | Salvando e excluindo | Salvar e excluir | Exclusão | Salvar, excluir e vínculo ativo |
| Orçamentos | ✓ | Carregando, vazio e erro | ✓ | Salvando e excluindo | Salvar e excluir | Exclusão | Salvar, excluir e limite excedido |
| Relatórios | ✓ | Carregando, sem dados e erro | — | — | — | — | — |
| Conta | ✓ | Perfil incompleto e erro | Dados existentes | Salvando e excluindo | Salvar e excluir | Exclusão | Salvar e identidade |

Os fluxos de autenticação possuem estados próprios e não seguem exatamente a matriz das páginas autenticadas.

## Regras de texto e espaçamento

- Títulos mobile podem quebrar linha, mas a descrição deve ser reposicionada a partir da altura final do título.
- Título e subtítulo de página mantêm separação visual clara.
- Descrições de estado usam linguagem direta, informam o ocorrido e dizem se os dados foram preservados.
- A ação principal aparece depois da explicação, com espaço suficiente para não parecer parte do texto.
- Textos ocultos de variações internas não entram na auditoria de limites.
- Caixas de texto não ultrapassam o frame, mesmo quando os glifos aparentam caber.

## Método de validação

Foram percorridos os frames diretos das 12 seções. As verificações buscaram:

- texto visível fora do frame;
- colisão entre `Title` e `Subtitle`;
- colisão entre título e descrição dos estados;
- overflow relevante em contêineres;
- sobreposição entre as seções do canvas.

Também foram inspecionadas versões mobile representativas de Home, Dashboard, Transações, Categorias, Métodos, Orçamentos, Relatórios, Conta e dos estados operacionais adicionados.

Resultado final:

- 372 telas documentadas;
- 160 telas novas validadas individualmente nesta revisão;
- zero texto visível fora dos novos frames;
- zero colisão semântica entre títulos e descrições nas novas telas;
- zero rótulo fora dos botões;
- zero sobreposição entre seções;
- posições das seções preservadas.

## Requisitos para a implementação

O Figma define aparência, conteúdo e intenção dos estados. A implementação ainda deve garantir:

- foco visível e ordem de tabulação;
- focus trap em modais;
- anúncios adequados para leitores de tela;
- contraste conforme WCAG;
- prevenção real de duplicidade;
- autorização e isolamento por usuário;
- responsividade entre os breakpoints documentados;
- mensagens derivadas de erros reais do Firebase sem expor detalhes técnicos.
