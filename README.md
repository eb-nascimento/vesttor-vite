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

Utilize Node.js 24.18.0, fixado em `.nvmrc` e `.node-version`, e npm. Os workflows usam a versão de `.nvmrc`.

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

### Versionamento

A versão é revisada ao concluir cada conjunto de alterações. Consulte a [convenção de versionamento](docs/versionamento.md).

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

Os testes de regras dependem dos pré-requisitos do Firebase Emulator Suite, incluindo Java 21 ou superior.

### Ambiente isolado e validação

O build verifica as seis variáveis obrigatórias `VITE_FIREBASE_*`; valores ausentes, vazios ou `-` impedem a geração. `VITE_FIREBASE_MEASUREMENTID` é opcional. Os arquivos de ambiente ficam em `config/env/`; o CI fornece as mesmas variáveis pelo ambiente.

Para desenvolvimento isolado, execute `npm run emulators` e `npm run dev:emulator` em terminais separados. Esse modo usa `demo-vesttor`; os testes de regras usam `demo-vesttor-rules`, com `firebase.test.json` e porta 8180.

### Refatoração financeira e publicação

Novas gravações usam `usuarios/{uid}/transacoes` e `usuarios/{uid}/planejamentos`, com valores inteiros em centavos. Transações mantêm leitura compatível com a coleção raiz. Planejamentos usam apenas IDs calculados a partir de mês, classificação e categoria; registros anteriores de teste deixam de aparecer, mas não são apagados. As Rules precisam ser publicadas antes desta versão do aplicativo. O script histórico de migração financeira não adapta planejamentos ao novo ID e não deve ser usado para migrá-los sem revisão. Relatórios privados de migração ficam em `migration-reports/`, ignorados pelo Git.

`deploy:hosting`, `deploy:rules` e `deploy:indexes` publicam recursos separadamente. Rules e índices compatíveis devem ser publicados e os índices devem estar prontos antes da publicação da aplicação. Nenhuma publicação ou migração em produção faz parte desta mesclagem. A configuração ativa não inclui Functions; a pasta `functions/` preserva o scaffold para referência futura.

### Estágio do projeto

MVP funcional concluído e aceito pelo responsável em 13/11/2026. Inclui autenticação, transações, planejamento mensal, 110 categorias padrão e 26 métodos de pagamento. Os catálogos têm cadastro desativado neste MVP. Consulte o [registro de fechamento do MVP](MVP.md) para escopo, decisões, validações e evolução futura. A conferência visual final e a preparação da publicação e das entregas acadêmicas permanecem etapas de entrega.

### Documentação

- [Índice da documentação e fontes atuais](docs/README.md).
- [Referência do MVP entregue](MVP.md); especificações e arquitetura anteriores são registros históricos.
- [Proposta de backend com Cloud Functions](docs/cloud-functions.md).
- [Temas e identidade visual](docs/temas.md).
- [Ambientes e publicação](docs/ambientes-e-deploy.md).
- [Uso de IA e modo de estudo acompanhado](docs/uso-de-ia.md).

Parte da documentação contém registros históricos. Confira os avisos de cada documento e o código atual antes de utilizar decisões antigas como referência de implementação.

## Organização das pastas

- `config/`: configurações de Vite e ESLint; `config/env/` contém os arquivos de ambiente.
- `src/`: código da aplicação e testes próximos dos componentes, hooks e utilitários.
- `public/`: arquivos públicos servidos diretamente.
- `functions/`: scaffold inativo de Cloud Functions, preservado para referência futura.
- `firebase/`: regras de segurança e índices do Firestore, referenciados em `firebase.json`.
- `tests/firestore/`: testes das regras executados com o emulador.
- `docs/`: documentação técnica; consulte o [índice](docs/README.md) para distinguir fontes atuais e históricas.
- `docs/academico/` e `docs/entregas/`: referências acadêmicas e documentos de entrega.
- `docs/imagens/`: capturas de tela da documentação.
- `docs/planejamento/`: anotações e tarefas de acompanhamento.
- `.tmp/` e `output/`: arquivos temporários e saídas locais, ignorados pelo Git.
- `dist/`, `node_modules/` e `.firebase/`: saídas de build, dependências e cache das ferramentas.

As configurações de Vite e ESLint ficam em `config/`, e os arquivos `.env*` em `config/env/`. Use os scripts `npm run dev`, `npm run lint`, `npm run build`, `npm run preview` e `npm run test:run`, que já apontam para os novos caminhos. Os workflows usam esses scripts e continuam recebendo as variáveis pelo ambiente. `firebase.json`, `.firebaserc`, `.gitignore`, `package.json` e `package-lock.json` permanecem na raiz para o fluxo atual das ferramentas, junto ao `README.md`. A entrada HTML está em `src/index.html`; o Vite usa `src/` como raiz, lê os arquivos públicos de `public/` e continua gerando `dist/`. O Vitest mantém a raiz de testes no diretório do repositório. O glossário está em `docs/CONTEXT.md`. `config/skills-lock.json` preserva o registro anterior das skills; o instalador poderá gerar um novo lockfile na raiz, pois não descobre automaticamente a cópia arquivada. O Firebase pode voltar a gerar logs na raiz; arquivos `*.log` já são ignorados. Parte de `docs/` está ignorada pelo Git; documentos ainda não rastreados não entram automaticamente em commits.

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

Use Node.js 24.18.0, pinned in `.nvmrc` and `.node-version`, and npm. The workflows use `.nvmrc`.

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

Rules tests require Firebase Emulator Suite prerequisites, including Java 21 or newer.

### Project status

The functional MVP was accepted by the project owner on November 13, 2026. It includes authentication, transactions, monthly planning, 110 predefined categories and 26 payment methods. Custom catalog creation is disabled for this MVP. See the [MVP closure record](MVP.md) for scope, validation, delivery activities and future work. Final browser visual checks and release preparation remain delivery steps.

### Documentation

The following documents are primarily in Portuguese:

- [Documentation index and current sources](docs/README.md).
- [Delivered MVP reference](MVP.md); earlier specifications and architecture documents are historical.
- [Proposed Cloud Functions backend](docs/cloud-functions.md).
- [Themes and visual identity](docs/temas.md).
- [Environments and deployment](docs/ambientes-e-deploy.md).
- [AI usage and guided study workflow](docs/uso-de-ia.md).

Some documentation contains historical records. Check each document's notices and the current source code before using older decisions as implementation guidance.
