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

- [x] Criar tokens CSS globais em `App.css`.
- [x] Definir paleta base da marca.
- [x] Definir cores de fundo, superficies, textos, bordas e estados.
- [x] Definir tokens especificos para indicadores do dashboard.
- [x] Aplicar cor de texto e fundo globais no `body`.
- [ ] Aplicar os tokens visuais gradualmente nos componentes existentes.
- [ ] Revisar contraste e acessibilidade visual no acabamento final do projeto.

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

- [x] Verificar que regras seguras para `transacoes` ja estavam publicadas.
- [ ] Testar isolamento com duas contas diferentes.
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
- [ ] Testar isolamento com duas contas diferentes.
- [ ] Validar leitura, criacao, edicao e exclusao apenas pelo dono da transacao.
- [ ] Registrar decisao sobre regra atual de `categorias`: leitura para usuario autenticado e escrita bloqueada.

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

- [ ] Criar testes para funcoes de `utils`.
- [x] Rodar `npm run lint`.
- [x] Corrigir erros apontados pelo ESLint.
- [x] Entender a regra `react-hooks/set-state-in-effect`.
- [ ] Separar erro de carregamento, erro de operacao e erro de validacao.
- [ ] Revisar acessibilidade de formularios.
- [ ] Revisar labels dos inputs.
- [ ] Revisar foco, botoes e mensagens de erro.
- [x] Rodar build normal apos configuracao de variaveis de ambiente.

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
