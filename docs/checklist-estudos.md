# Checklist de Estudos - Vesttor

Este checklist registra o que ja foi estudado/implementado no projeto e o que ainda falta fazer. A ideia e evitar repetir CRUD simples e manter o foco em conceitos novos.

## Diretriz de estudo

O estudo deve priorizar conceitos novos antes de replicar padroes ja aprendidos em outras telas. Depois que um conceito estiver entendido e aplicado uma primeira vez, ele pode ser replicado no restante do projeto.

Antes de abrir muitos CRUDs parecidos, a prioridade e consolidar autenticacao, seguranca, rotas, estado via URL e deploy. Ao fechar um bloco de estudo, este documento deve registrar o que foi aprendido e o que ainda ficou pendente.

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

### Documentacao

- [x] `docs/requisitos.md` criado.
- [x] `docs/arquitetura.md` criado.
- [x] `README.md` atualizado para apontar para os documentos novos.
- [x] `docs/SDD.md` mantido como historico.

## Ajustes pendentes pequenos

- [x] Remover import nao usado de `Navigate` em `Header.jsx`.
- [x] Remover imports de logos que nao forem ficar definitivamente no `Header` depois da escolha visual.
- [ ] Revisar texto com acentos quebrados em alguns componentes.
- [x] Revisar `Header.css` e decidir o estilo final do menu ativo.
- [x] Decidir qual logo sera a oficial no `Header`.
- [x] Decidir se o favicon fica como esta ou se sera ajustado manualmente depois.

## Proximos estudos recomendados

### React Router

- [x] Criar rota `/home` ou remover o link para `/home` se ela nao for existir.
- [x] Entender diferenca entre `Link`, `NavLink` e `Navigate`.
- [x] Melhorar menu ativo com CSS.
- [ ] Criar rotas privadas futuras: `/orcamentos`, `/relatorios`, `/categorias`.
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
- [ ] Criar orcamento mensal por categoria.
- [ ] Calcular valor utilizado do orcamento.
- [ ] Calcular valor restante do orcamento.
- [ ] Criar alertas de orcamento perto do limite.
- [ ] Criar relatorios simples.

### Firebase e seguranca

- [ ] Publicar regras seguras para `transacoes`.
- [ ] Testar isolamento com duas contas diferentes.
- [ ] Migrar ou remover documentos antigos sem `userId`.
- [ ] Mover configuracao Firebase para variaveis de ambiente do Vite.
- [ ] Traduzir mensagens tecnicas do Firebase para mensagens amigaveis.

### Firebase Authentication - proximos passos

- [ ] Estudar provedores de login social no Firebase Authentication.
- [ ] Configurar login com Google no Firebase Console.
- [ ] Implementar autenticacao com Google usando `GoogleAuthProvider`.
- [ ] Decidir se o login com Google sera por popup ou redirecionamento.
- [ ] Tratar erros especificos do login com Google.
- [ ] Garantir que usuario criado via Google continue usando o mesmo fluxo de `useAuth`.
- [ ] Testar login, logout e persistencia de sessao com conta Google.

### Firebase Hosting e deploy

- [ ] Estudar diferenca entre ambiente local, build e deploy.
- [ ] Instalar e configurar Firebase CLI.
- [ ] Fazer login na Firebase CLI.
- [ ] Inicializar Firebase Hosting no projeto.
- [ ] Configurar Hosting para servir o build do Vite em `dist`.
- [ ] Garantir fallback de rotas para SPA com React Router.
- [ ] Rodar `npm run build` antes do deploy.
- [ ] Publicar primeira versao com Firebase Hosting.
- [ ] Testar login, rotas privadas e leitura do Firestore no site publicado.
- [ ] Documentar comandos de build e deploy no `README.md`.

### Qualidade

- [ ] Criar testes para funcoes de `utils`.
- [ ] Separar erro de carregamento, erro de operacao e erro de validacao.
- [ ] Revisar acessibilidade de formularios.
- [ ] Revisar labels dos inputs.
- [ ] Revisar foco, botoes e mensagens de erro.
- [ ] Rodar build normal quando o `dist` nao estiver travado pelo Windows.

## Regra de estudo combinada

- Nao focar em repetir CRUD simples.
- Priorizar conceitos novos.
- Primeiro estudar novidades; depois replicar o que ja foi aprendido em outras telas.
- Codigo da aplicacao so deve ser alterado pelo assistente quando o usuario pedir explicitamente.
- Documentacao pode ser atualizada pelo assistente ao fechar blocos de estudo.
- `requisitos.md` registra produto, escopo e regras.
- `arquitetura.md` registra implementacao e decisoes tecnicas.
- Este checklist registra progresso e proximos passos.
