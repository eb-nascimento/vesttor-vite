# Vesttor Vite

[Português](#português) · [English](#english)

## Português

Aplicação web de controle e planejamento financeiro pessoal, desenvolvida com React, Vite e Firebase.

O Vesttor nasceu da busca por uma melhor organização financeira. Esta versão dá continuidade ao [estudo inicial com HTML, CSS e JavaScript](https://github.com/eb-nascimento/vesttor), aprofundando o desenvolvimento com componentes React, hooks, rotas e persistência de dados.

### Objetivo

Facilitar o acompanhamento de receitas, despesas e saldo, conectando o registro das movimentações ao planejamento mensal. O projeto também faz parte da minha evolução em desenvolvimento web, com atenção à organização do código, à experiência de uso e à acessibilidade.

### Funcionalidades presentes

- Cadastro e login com e-mail e senha, login com Google e recuperação de senha.
- Cadastro, edição e exclusão de receitas e despesas.
- Registro e gerenciamento de despesas parceladas.
- Resumo de receitas, despesas e saldo do mês na página inicial.
- Consulta de transações com filtros, ordenação e paginação.
- Tela de planejamento mensal que relaciona valores planejados e movimentações registradas.
- Persistência com Cloud Firestore e consultas vinculadas ao usuário autenticado.

### Tecnologias

React · Vite · JavaScript · CSS · React Router · Firebase Authentication · Cloud Firestore · Lucide React

Qualidade: ESLint · Vitest · testes de Security Rules com Firebase Emulator Suite.

### Execução local

Utilize Node.js 22, versão utilizada pelo workflow de build, e npm.

```bash
git clone https://github.com/eb-nascimento/vesttor-vite.git
cd vesttor-vite
npm ci
```

Copie `config/env/.env.example` para `config/env/.env` e substitua os valores de exemplo pela configuração do seu projeto Firebase. Habilite os provedores de autenticação necessários, configure os domínios autorizados e prepare o Firestore com as regras de acesso do projeto.

```bash
npm run dev
```

Acesse o endereço informado pelo Vite no terminal. As variáveis `VITE_*` são incorporadas ao frontend; credenciais administrativas e chaves privadas devem permanecer fora delas. O arquivo `.env` não deve ser versionado.

### Verificações e build

```bash
npm run lint
npm run test:run
npm run build
```

O build é gerado em `dist/`. O comando `npm run test:run` exclui os testes de Security Rules, executados separadamente:

```bash
npm run test:rules
```

Os testes de regras dependem dos pré-requisitos do Firebase Emulator Suite, incluindo Java compatível.

### Estágio do projeto

Aplicação em desenvolvimento. As páginas dedicadas a dashboard, categorias e meios financeiros ainda apresentam avisos de construção na versão consultada. Recursos descritos nos documentos de planejamento não devem ser interpretados automaticamente como entregues.

### Documentação

- [Índice da documentação e fontes atuais](docs/README.md).
- [Especificação funcional](docs/especificacao-funcional.md) e [arquitetura atual](docs/arquitetura-v2.md).
- [Proposta de backend com Cloud Functions](docs/cloud-functions.md).
- [Temas e identidade visual](docs/temas.md).
- [Ambientes e publicação](docs/ambientes-e-deploy.md).
- [Uso de IA e modo de estudo acompanhado](docs/uso-de-ia.md).

Parte da documentação contém registros históricos. Confira os avisos de cada documento e o código atual antes de utilizar decisões antigas como referência de implementação.

## Organização das pastas

- `config/`: configurações de Vite e ESLint; `config/env/` contém os arquivos de ambiente.
- `src/`: código da aplicação e testes próximos dos componentes, hooks e utilitários.
- `public/`: arquivos públicos servidos diretamente.
- `functions/`: código e dependências das Cloud Functions.
- `firebase/`: regras de segurança e índices do Firestore, referenciados em `firebase.json`.
- `tests/firestore/`: testes das regras executados com o emulador.
- `docs/`: documentação técnica; consulte o [índice](docs/README.md) para distinguir fontes atuais e históricas.
- `docs/academico/` e `docs/entregas/`: referências acadêmicas e documentos de entrega.
- `docs/imagens/`: capturas de tela da documentação.
- `docs/planejamento/`: anotações e tarefas de acompanhamento.
- `.tmp/` e `output/`: arquivos temporários e saídas locais, ignorados pelo Git.
- `dist/`, `node_modules/` e `.firebase/`: saídas de build, dependências e cache das ferramentas.

As configurações de Vite e ESLint ficam em `config/`, e os arquivos `.env*` em `config/env/`. Use os scripts `npm run dev`, `npm run lint`, `npm run build`, `npm run preview` e `npm run test:run`, que já apontam para os novos caminhos. Os workflows usam esses scripts e continuam recebendo as variáveis pelo ambiente. `firebase.json`, `.firebaserc`, `.gitignore`, `package.json` e `package-lock.json` permanecem na raiz para o fluxo atual das ferramentas, junto ao `README.md`. A entrada HTML está em `src/index.html`; o Vite usa `src/` como raiz, lê os arquivos públicos de `public/` e continua gerando `dist/`. O Vitest mantém a raiz de testes no diretório do repositório. O glossário está em `docs/CONTEXT.md`. `config/skills-lock.json` preserva o registro anterior das skills; o instalador poderá gerar um novo lockfile na raiz, pois não descobre automaticamente a cópia arquivada. O Firebase pode voltar a gerar logs na raiz; arquivos `*.log` já são ignorados. A decisão existente de ignorar novos documentos em `docs/` foi preservada; documentos já versionados continuam sendo acompanhados pelo Git.

---

## English

A personal finance tracking and planning web application built with React, Vite, and Firebase.

Vesttor grew from the need to better organize personal finances. This version builds on the [initial HTML, CSS, and JavaScript study](https://github.com/eb-nascimento/vesttor), expanding the work with React components, hooks, routing, and data persistence.

### Purpose

Make it easier to track income, expenses, and balance while connecting recorded transactions to monthly planning. The project is also part of my growth in web development, with attention to code organization, usability, and accessibility.

### Features present in the implementation

- Email and password registration and login, Google login, and password recovery.
- Creating, editing, and deleting income and expense transactions.
- Recording and managing installment expenses.
- Current-month income, expense, and balance summary on the home page.
- Transaction browsing with filters, sorting, and pagination.
- A monthly planning page connecting planned amounts and recorded transactions.
- Cloud Firestore persistence and queries scoped to the authenticated user.

### Technologies

React · Vite · JavaScript · CSS · React Router · Firebase Authentication · Cloud Firestore · Lucide React

Quality tooling: ESLint · Vitest · Security Rules tests with Firebase Emulator Suite.

### Local setup

Use Node.js 22, the version used by the build workflow, and npm.

```bash
git clone https://github.com/eb-nascimento/vesttor-vite.git
cd vesttor-vite
npm ci
```

Copy `config/env/.env.example` to `config/env/.env` and replace the example values with your Firebase project configuration. Enable the required authentication providers, configure authorized domains, and prepare Firestore with the project's access rules.

```bash
npm run dev
```

Open the address shown by Vite in the terminal. `VITE_*` variables are included in the frontend bundle; keep administrative credentials and private keys out of them. Do not commit `.env`.

### Checks and build

```bash
npm run lint
npm run test:run
npm run build
```

Build output is generated in `dist/`. The `npm run test:run` command excludes Security Rules tests, which run separately:

```bash
npm run test:rules
```

Rules tests require Firebase Emulator Suite prerequisites, including a compatible Java installation.

### Project status

The application is under development. Dedicated dashboard, category, and payment-method pages still display construction notices in the reviewed version. Features described in planning documents should not automatically be treated as delivered.

### Documentation

The following documents are primarily in Portuguese:

- [Documentation index and current sources](docs/README.md).
- [Functional specification](docs/especificacao-funcional.md) and [current architecture](docs/arquitetura-v2.md).
- [Proposed Cloud Functions backend](docs/cloud-functions.md).
- [Themes and visual identity](docs/temas.md).
- [Environments and deployment](docs/ambientes-e-deploy.md).
- [AI usage and guided study workflow](docs/uso-de-ia.md).

Some documentation contains historical records. Check each document's notices and the current source code before using older decisions as implementation guidance.
