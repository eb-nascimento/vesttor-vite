# Checklist de Estudos - Vesttor

Este checklist registra o que ja foi estudado/implementado no projeto e o que ainda falta fazer. A ideia e evitar repetir CRUD simples e manter o foco em conceitos novos.

## Diretriz de estudo

O estudo deve priorizar conceitos novos antes de replicar padroes ja aprendidos em outras telas. Depois que um conceito estiver entendido e aplicado uma primeira vez, ele pode ser replicado no restante do projeto.

Antes de abrir muitos CRUDs parecidos, a prioridade e consolidar autenticacao, seguranca, rotas, estado via URL e deploy. Ao fechar um bloco de estudo, este documento deve registrar o que foi aprendido e o que ainda ficou pendente.

## Papel do assistente

- Manter este checklist, os SDDs e a documentacao atualizados ao final de cada etapa.
- Definir a estrategia de qualidade e os cenarios que precisam de teste conforme o risco da alteracao.
- Orientar, revisar e interpretar os resultados de lint, testes, build e deploy.
- Nao alterar o codigo da aplicacao: a implementacao continua sendo feita pelo usuario.

## Concluido

### Base do projeto

- [x] Projeto React com Vite configurado.
- [x] Estrutura inicial com `src`, `components`, `pages`, `hooks`, `services`, `utils` e `config`.
- [x] Firebase configurado em `src/config/firebase.js`.
- [x] Separacao basica entre UI, hooks, services e utils.

### Firebase Authentication

- [x] Cadastro de usuario com e-mail e senha.
- [x] Login com e-mail e senha.
- [x] Logout.
- [x] Hook `useAuth` usando `onAuthStateChanged`.
- [x] Estado de carregamento da autenticacao com `carregandoAuth`.
- [x] Redirecionamento conforme usuario logado ou nao logado.
- [x] Login com Google usando Firebase Authentication.
- [x] Entendimento de provedores externos com `GoogleAuthProvider`.
- [x] Confirmacao de que `useAuth` continua funcionando com diferentes provedores.
- [x] Mapeamento de erros tecnicos do Firebase Auth para mensagens amigaveis.
- [x] Uso de `erro.code` nos fluxos de login, cadastro e login com Google.

### Firestore e transacoes

- [x] CRUD de transacoes no Firestore.
- [x] Transacoes associadas ao `userId` do usuario autenticado.
- [x] Consulta filtrada por usuario.
- [x] Leitura em tempo real com `onSnapshot`.
- [x] Conversao entre input de data e `Timestamp` do Firestore.
- [x] Hook `useTransacoes` concentrando estado e operacoes.
- [x] Calculo de saldo, receitas e despesas em `utils/calculos.js`.

### Interface e componentes

- [x] Formulario de autenticacao.
- [x] Formulario de transacao.
- [x] Lista de transacoes.
- [x] Item de transacao.
- [x] Cards de resumo financeiro.
- [x] Filtro local por tipo.
- [x] Ordenacao local por data e valor.
- [x] Mensagem de lista vazia.
- [x] Estados basicos de carregamento e erro.

### React Router

- [x] `BrowserRouter` configurado em `main.jsx`.
- [x] Rotas declaradas com `Routes` e `Route`.
- [x] Redirecionamentos com `Navigate`.
- [x] Pagina `/login`.
- [x] Pagina `/home`.
- [x] Pagina `/transacoes` criada como segunda rota privada.
- [x] Rota `*` redirecionando para `/home` ou `/login` conforme a sessao.
- [x] `PrivateRoute` em `src/routes/PrivateRoute.jsx`.
- [x] `PublicRoute` em `src/routes/PublicRoute.jsx`.
- [x] Pasta `src/routes` criada para componentes ligados a navegacao.

### Layout compartilhado

- [x] Pasta `src/layouts` criada.
- [x] `AppLayout` criado.
- [x] Uso de `Outlet` para renderizar rotas filhas.
- [x] Rotas privadas agrupadas dentro de uma rota pai sem `path`.
- [x] `Header` movido para o layout compartilhado.
- [x] `Home` deixou de ser responsavel pela estrutura comum da aplicacao.

### Navegacao

- [x] `NavLink` usado no `Header`.
- [x] Links para `/home` e `/transacoes`.
- [x] Classe ativa configurada com `isActive`.
- [x] Botao de logout no `Header`.

### Logos e SVG

- [x] SVGs de logo adicionados em `src/assets`.
- [x] Componentes JSX criados para as logos.
- [x] `Logo.jsx`.
- [x] `LogoVertical.jsx`.
- [x] `LogoHorizontal.jsx`.
- [x] `LogoGrafia.jsx`.
- [x] `viewBox` calculado automaticamente a partir dos paths.
- [x] Tamanhos fixos aplicados dentro dos componentes, sem exigir props no uso.
- [x] `Header` exibindo as logos para visualizacao.

### Identidade visual

- [x] Separar tokens compartilhados, claros e escuros em `src/styles/themes`.
- [x] Definir paleta base da marca.
- [x] Definir cores de fundo, superficies, textos, bordas e estados.
- [x] Definir tokens especificos para indicadores do dashboard.
- [x] Aplicar cor de texto e fundo globais no `body`.
- [x] Preservar a identidade clara e definir a identidade escura como padrao.
- [x] Preparar seletores `data-theme` para a futura configuracao de tema.
- [x] Aplicar tokens visuais nos componentes existentes.
- [x] Transformar sombras e focos em variaveis tematicas.
- [x] Adaptar as logos para as cores dos temas.
- [x] Aplicar cores semanticas aos icones de editar e excluir.
- [x] Adequar o calendario nativo ao tema com `color-scheme`.
- [x] Adicionar rotulos acessiveis aos botoes de icones.
- [ ] Implementar a interface e a persistencia da preferencia de tema.
- [ ] Realizar uma revisao visual completa de contraste antes da entrega final.

### Qualidade de codigo

- [x] Rodar `npm run lint` e interpretar os erros do ESLint.
- [x] Corrigir import ausente em `FormAuth.jsx`.
- [x] Refatorar `Form.jsx` para usar um unico estado de formulario.
- [x] Entender uso de `key` para remontar componente ao alternar entre criacao e edicao.
- [x] Remover `setState` sincronico em `useEffect` no formulario.
- [x] Ajustar `useTransacoes` para manter o efeito focado na assinatura externa do Firestore.
- [x] Validar que `npm run lint` executa sem erros.

### Documentacao

- [x] `docs/requisitos.md` criado.
- [x] `docs/arquitetura.md` criado.
- [x] `docs/temas.md` criado com a arquitetura da identidade visual.
- [x] `README.md` atualizado para apontar para os documentos novos.
- [x] `docs/SDD.md` mantido como historico.

## Ajustes pendentes pequenos

- [x] Remover import nao usado de `Navigate` em `Header.jsx`.
- [x] Remover imports de logos que nao forem ficar definitivamente no `Header` depois da escolha visual.
- [x] Revisar texto com acentos quebrados em alguns componentes.
- [x] Revisar `Header.css` e decidir o estilo final do menu ativo.
- [x] Decidir qual logo sera a oficial no `Header`.
- [x] Decidir se o favicon fica como esta ou se sera ajustado manualmente depois.

## Proximos estudos recomendados

### React Router

- [x] Criar rota `/home` ou remover o link para `/home` se ela nao for existir.
- [x] Entender diferenca entre `Link`, `NavLink` e `Navigate`.
- [x] Melhorar menu ativo com CSS.
- [x] Criar paginas-base para Dashboard, Conta, Pagamentos, Categorias e Configuracoes.
- [x] Adicionar links de Dashboard no cabecalho e destinos no menu da conta.
- [x] Registrar as rotas privadas de Dashboard, Conta, Pagamentos, Categorias e Configuracoes no `App.jsx`.
- [ ] Criar rotas privadas futuras: `/orcamentos` e `/relatorios`.
- [ ] Entender rotas aninhadas com mais de uma pagina filha.

### URL como estado

- [x] Migrar filtro de transacoes para URL com `useSearchParams`.
- [x] Colocar ordenacao na URL.
- [x] Aprender valores padrao quando query params nao existem.
- [x] Permitir compartilhar link com filtros aplicados.

### Organizacao de paginas

- [x] Separar melhor `Home` e `Transacoes`.
- [ ] Mover lista/formulario de transacoes para a pagina `Transacoes` quando fizer sentido.
- [x] Deixar `Home` mais focado em resumo e indicadores.

### Produto financeiro

- [ ] Criar categorias.
- [ ] Criar metodos de pagamento.
- [ ] Associar transacoes com categoria.
- [ ] Associar transacoes com metodo de pagamento.
- [x] Criar orcamento mensal por categoria.
- [x] Calcular valor utilizado do orcamento.
- [x] Calcular valor restante do orcamento.
- [x] Criar alertas de orcamento perto do limite.
- [ ] Criar relatorios simples.

### Firebase e seguranca

- [x] Verificar que regras seguras para `transacoes` ja estavam publicadas.
- [x] Testar isolamento com duas contas diferentes.
- [ ] Migrar ou remover documentos antigos sem `userId`.
- [x] Mover configuracao Firebase para variaveis de ambiente do Vite.
- [x] Traduzir mensagens tecnicas do Firebase Authentication para mensagens amigaveis.

### Firebase Authentication - login com Google

- [x] Estudar provedores de login social no Firebase Authentication.
- [x] Configurar login com Google no Firebase Console.
- [x] Implementar autenticacao com Google usando `GoogleAuthProvider`.
- [x] Decidir usar login com Google por popup.
- [x] Garantir que usuario criado via Google continue usando o mesmo fluxo de `useAuth`.
- [x] Testar login, logout e persistencia de sessao com conta Google.
- [x] Tratar erros especificos do login com Google com mensagens amigaveis.

### Mensagens amigaveis - Firebase Authentication

- [x] Estudar `erro.code` nos erros do Firebase Authentication.
- [x] Criar uma funcao para converter codigos tecnicos em mensagens de usuario.
- [x] Aplicar o mapeamento nos fluxos de login, cadastro e login com Google.
- [x] Testar casos como senha incorreta, e-mail ja cadastrado e popup fechado.
- [ ] Reutilizar o mesmo padrao futuramente para erros do Firestore.

### Seguranca do Firestore - transacoes

- [x] Entender por que filtro no frontend nao substitui regras de seguranca.
- [x] Verificar que as regras seguras para a colecao `transacoes` ja estavam publicadas.
- [x] Confirmar que `create`, `read`, `update` e `delete` comparam `request.auth.uid` com `userId`.
- [x] Testar isolamento com duas contas diferentes.
- [ ] Validar leitura, criacao, edicao e exclusao apenas pelo dono da transacao.
- [ ] Registrar decisao sobre regra atual de `categorias`: leitura para usuario autenticado e escrita bloqueada.

### Cloud Functions - migracao segura de transacoes (Pos-MVP)

Decisao vigente: manter o MVP no plano Spark. A implementacao, os testes e o deploy de Functions ficam congelados ate a preparacao de producao, sem ativar Blaze nesta etapa.

- [x] Documentar arquitetura alvo e fronteiras entre frontend, Functions e Firestore.
- [x] Confirmar permanencia dos dados no mesmo Cloud Firestore.
- [x] Confirmar leitura em tempo real pelo frontend.
- [x] Definir descricao com ate 100 caracteres, valor positivo sem maximo e datas passadas ou futuras.
- [x] Definir `userId` obrigatorio e derivado do contexto autenticado.
- [x] Definir criacao idempotente sem duplicacoes.
- [x] Definir confirmacao de edicao e exclusao.
- [x] Registrar a decisao de confirmar edicao e regiao do Firestore apenas na preparacao de producao.
- [ ] Definir regiao, memoria, concorrencia e limites das Functions.
- [ ] Auditar documentos antigos sem `userId`.
- [ ] Inicializar Functions 2nd gen e emuladores.
- [ ] Implementar validadores, autenticacao, autorizacao e erros estruturados.
- [ ] Implementar e testar chave de idempotencia.
- [ ] Migrar criacao, edicao e exclusao para callable Functions.
- [ ] Testar isolamento, retentativas e Security Rules.
- [ ] Negar escritas diretas somente depois da migracao validada.
- [ ] Configurar App Check, IAM, logs, alertas e custos.

### Variaveis de ambiente no Vite

- [x] Estudar uso de `.env` no Vite.
- [x] Entender o prefixo obrigatorio `VITE_`.
- [x] Mover configuracao Firebase para variaveis de ambiente.
- [x] Garantir que `.env` nao seja versionado.
- [x] Corrigir sintaxe do `.env` para `CHAVE=valor`.
- [x] Validar login e Firebase apos a mudanca.
- [x] Criar `.env.example` para documentar variaveis necessarias sem valores reais.

### Firebase Hosting e deploy

- [x] Estudar diferenca entre ambiente local, build e deploy.
- [x] Instalar e configurar Firebase CLI.
- [x] Fazer login na Firebase CLI.
- [x] Inicializar Firebase Hosting no projeto.
- [x] Configurar Hosting para servir o build do Vite em `dist`.
- [x] Garantir fallback de rotas para SPA com React Router.
- [x] Rodar `npm run build` antes do deploy.
- [x] Publicar primeira versao com Firebase Hosting.
- [x] Testar login, rotas privadas e leitura do Firestore no site publicado.
- [x] Documentar comandos de build e deploy no `README.md`.

### Qualidade

- [x] Criar testes unitarios iniciais para funcoes de `utils`.
- [x] Registrar estrategia e criterios de teste em `docs/sdd-testes.md`.
- [ ] Ampliar testes somente quando uma funcionalidade ou correcao de maior risco exigir.
- [x] Rodar `npm run lint`.
- [x] Corrigir erros apontados pelo ESLint.
- [x] Entender a regra `react-hooks/set-state-in-effect`.
- [x] Separar erro de leitura, erro de operacao e erro de validacao.
- [x] Revisar acessibilidade de formularios.
- [x] Associar labels aos inputs com `htmlFor` e `id`.
- [x] Adicionar foco visivel nos botoes e alertas acessiveis para mensagens de erro.
- [x] Rodar build normal apos configuracao de variaveis de ambiente.

### Redesenho da Home e Formulario Avancado (Figma Home V2)

- [x] Implementar layout em grid de duas colunas na Home (sidebar de formulario e painel de resumo e transacoes).
- [x] Atualizar tokens de cores, gradientes e bordas em `theme-base.css` e temas claro/escuro alinhados ao Figma.
- [x] Criar switcher de tipo de transacao exclusivo no formulario com Despesa a esquerda e selecionada por padrao.
- [x] Formatar input de valor monetario com prefixo de moeda visual.
- [x] Aplicar renderizacao condicional idiomatica no React para exibir Metodo de Pagamento e Parcelamento exclusivamente quando o tipo for Despesa.
- [x] Configurar categorias dinamicas que se adaptam automaticamente ao tipo de movimentacao (Despesa vs Receita).
- [x] Implementar calculo visual e interativo de parcelamento com selecao de parcelas em tempo real.
- [x] Atualizar controles de transacoes com pills de filtro e seletor de ordenacao estilizado.
- [x] Adicionar subtitulos informativos e rodape de historico aos cards e a lista de movimentacoes.
- [x] Atualizar `firestore.rules` com validacao tipada para campos opcionais (`categoria`, `metodoPagamento`, `parcelado`, `parcelas`).
- [x] Garantir higienizacao de codigo: 0 erros de ESLint, 0 regras CSS orfas e 100% de testes Vitest aprovados.

### Planejamento e Especificação de Parcelamento

- [x] Conduzir sessão de refinamento de domínio (grilling) para modelagem de compras parceladas.
- [x] Definir regime de competência contábil mensal (sem distorção de saldo inicial negativo).
- [x] Especificar persistência granular em múltiplos documentos vinculados por `parcelamentoId`.
- [x] Definir regra de arredondamento bancário de centavos na 1ª parcela.
- [x] Definir algoritmo de calendário para meses irregulares (clamp ao último dia do mês).
- [x] Especificar alternância flexível entre Valor Total e Valor da Parcela, com quantidade aberta de parcelas no formulário.
- [x] Definir cálculo de saldo restrito ao mês corrente e limite de 5 itens recentes na Home.
- [x] Definir modal de exclusão com opção de apagar apenas uma parcela ou a série futura.
- [x] Consolidar documentação em `docs/parcelamento.md`, `docs/requisitos.md` e `docs/arquitetura.md`.

### Implementação e Finalização 100% da Home e Compras Parceladas

- [x] Criar utilitários matemáticos de divisão de centavos e projeção de calendário em `src/utils/parcelamento.js`.
- [x] Criar suíte de testes unitários com Vitest em `src/utils/parcelamento.test.js` (9 testes cobrindo divisão, restos, alternância de modos e clamping de meses bissextos/curtos).
- [x] Atualizar `firestore.rules` com validação de esquema estrito (`hasOnly`) para campos `parcelamentoId`, `numeroParcela`, `totalParcelas`, `valorTotalCompra`.
- [x] Implementar funções em lote (`writeBatch`) em `src/services/transacoesService.js` (`criarCompraParceladaNaApi` e `excluirParcelasFuturasNaApi`).
- [x] Integrar `useTransacoes` com cálculo em tempo real do mês atual (`saldoMesAtual`, `receitasMesAtual`, `despesasMesAtual`) e operações parceladas.
- [x] Integrar `Form.jsx` com switcher de modo ("Valor total" vs "Valor por parcela"), input numérico aberto, atalhos em botões (pills) e resumo de cálculo em tempo real com sobra de centavos.
- [x] Criar componente modal acessível `ModalExclusaoParcelamento.jsx` e estilos correspondentes em `ModalExclusaoParcelamento.css`.
- [x] Atualizar `ItemTransacao.jsx` para indicar número da parcela e acionar confirmação seletiva de exclusão.
- [x] Atualizar `ListaTransacoes.jsx` com paginação visual (`maxItens={5}`), integração com o modal de exclusão de série e subtítulo dinâmico.
- [x] Atualizar `ContainerResumo.jsx` com indicação visual dinâmica do mês corrente (ex: "Saldos do mês atual (Março)").
- [x] Conectar 100% da Home (`src/pages/Home.jsx`) ao novo fluxo de compras parceladas, limites de tamanho e métricas mensais.
- [x] Implementar filtro temporal de competência e deduplicação de compras parceladas na Home em `src/utils/transacao.js` (máximo 1 parcela por compra recente, suprimindo poluição de meses futuros).
- [x] Criar componente `DatePicker` personalizado em JavaScript (React) em `src/components/DatePicker.jsx` e `DatePicker.css` com navegação mensal, botão "Hoje", fechamento ao clicar fora/Escape e formatação amigável pt-BR.
- [x] Remover setinhas nativas (spin buttons) de inputs numéricos em `Form.css` (`-webkit-appearance` e `moz-appearance: textfield`).
- [x] Bloquear digitação de mais de 2 números após a vírgula ou ponto em `normalizarInputValor` e `validarTransacao` (`Form.jsx`), com suporte nativo à digitação em formato brasileiro (`inputMode="decimal"`).
- [x] Ampliar suíte de testes unitários com novos testes de validação de casas decimais e normalização monetária em `src/utils/transacao.test.js` (27/27 testes aprovados no Vitest).
- [x] Simplificar o formulário de parcelas: campo de valor padronizado como valor total da compra, com label contextual `Valor total da compra`, divisão automática transparente e remoção do seletor confuso "Valor por parcela".
- [x] Desbloquear a digitação no campo de parcelas: permitir apagar e digitar livremente sem interferência do `onChange`, aplicando validação e clamping seguro (2 a 72) no `onBlur` e no envio.
- [x] Implementar controle stepper visual `[ − ]` e `[ + ]` integrado ao campo de parcelas para incremento/decremento intuitivo.
- [x] Implementar edição atômica de séries de parcelamento (`atualizarCompraParceladaNaApi` e `converterParaParceladaNaApi`) via `writeBatch` no Firestore, com higienização de descrição e carregamento do valor global da compra.
- [x] Validar compilação de produção (`npm run build`), testes unitários (29/29 aprovados no Vitest) e conformidade no linter (`npm run lint` 0 erros).

### Especificação e Planejamento: Transações V2 (Figma Node 222:2)

- [x] Inspecionar design completo de Transações V2 no Figma (Node `222:2`, desktop 1440x860 e mobile 390x1154, temas claro e escuro).
- [x] Conduzir sessão de alinhamento e refinamento (_grilling_) cobrindo Q1 a Q6 (modal de nova transação, resumo dinâmico, painel retrátil de filtros, paginação de 10/8 itens, extrato completo por competência e subtítulos de despesa à vista vs parcelada).
- [x] Consolidar regras de produto RN25 a RN29 em `docs/requisitos.md`.
- [x] Consolidar arquitetura da página, funções puras e gestão de estado em `docs/arquitetura.md` (seção 16.17).
- [x] Criar documento de especificação funcional e técnica completa em `docs/transacoes-v2.md` com tokens, paleta de cores e árvore de componentes.
- [x] Implementar e testar funções puras de filtragem avançada multi-critério e paginação com 36/36 testes unitários aprovados no Vitest.

### Implementação: Transações V2 e Acessibilidade (A11y)

- [x] Implementar o componente `PaginadorMes` como Fonte da Verdade de competência no cabeçalho.
- [x] Construir o hook customizado `useFiltrosTransacoes` para isolar a complexidade de estado e paginação.
- [x] Substituir `<select>` nativos por componente acessível `CustomSelect.jsx` (teclado, focus, scroll, blur).
- [x] Integrar trava de foco nativa (Focus Trap) em modais (`ModalBase.jsx`) e restaurar foco após fechamento.
- [x] Integrar fechamento por evento de Blur em popovers (`CustomSelect` e `DatePicker`).
- [x] Montar página completa `Transacoes.jsx` consumindo os filtros dinâmicos e repassando para tabela e cartões.
- [x] Concluir o checklist de documentação arquitetural no `arquitetura.md` e `transacoes-v2.md`.

## Regra de estudo combinada

- Nao focar em repetir CRUD simples.
- Priorizar conceitos novos.
- Primeiro estudar novidades; depois replicar o que ja foi aprendido em outras telas.
- Codigo da aplicacao nunca deve ser alterado pelo assistente; o assistente deve apenas guiar, explicar, revisar e documentar.
- Documentacao deve ser atualizada pelo assistente ao fechar cada etapa ou bloco de estudo concluido.
- Apos atualizar a documentacao, o assistente deve indicar os proximos passos recomendados.
- `requisitos.md` registra produto, escopo e regras.
- `arquitetura.md` registra implementacao e decisoes tecnicas.
- Este checklist registra progresso e proximos passos.
