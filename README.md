# React + Vite

## Modo de acompanhamento com assistente

Este projeto e conduzido como estudo acompanhado. O assistente deve atuar como guia tecnico: explicar conceitos, sugerir caminhos, revisar raciocinios, apontar riscos e atualizar documentacao quando combinado.

O assistente nao deve implementar codigo da aplicacao, criar arquivos de codigo, editar componentes, services, hooks, rotas, estilos ou configuracoes do projeto. As alteracoes de codigo devem ser feitas pelo estudante.

A unica excecao permitida e a atualizacao de documentacao do projeto quando isso for solicitado ou quando uma etapa/bloco de estudo for encerrado. Por padrao, ao final de cada etapa concluida, o assistente deve atualizar os documentos relevantes e indicar os proximos passos de estudo.


## Ambiente e deploy

### Versão do Node

Use **Node 24.18.0 LTS**, fixado em `.nvmrc` e `.node-version`. Os workflows de Hosting usam `.nvmrc`; `package.json` aceita a linha 24 a partir dessa versão. A versão foi validada no ambiente local. Veja a [publicação oficial do Node](https://nodejs.org/en/blog/release/v24.18.0).

Com nvm, execute `nvm install 24.18.0` e `nvm use 24.18.0`; depois `npm ci`. Para testar Security Rules, instale Java 21 ou superior e confirme que `java -version` funciona no terminal.

### Qualidade local

```bash
npm run lint
npm run test:run
npm run test:rules
```

O lint usa ESLint com regras recomendadas para JavaScript, React Hooks e Vite. A etapa atual de qualidade considera o lint sem erros como criterio minimo antes de seguir para novos estudos.
### Variaveis de ambiente
A configuracao do Firebase fica em `.env`, que nao deve ser versionado. O arquivo `.env.example` documenta as variaveis necessarias sem valores reais.

As variaveis precisam usar o prefixo `VITE_`, pois a aplicacao roda no frontend com Vite.

O build valida `API_KEY`, `AUTHDOMAIN`, `PROJECTID`, `STORAGEBUCKET`, `MESSAGINGSENDERID` e `APPID`, todos com o prefixo `VITE_FIREBASE_`. Ausências, valores vazios e o placeholder `-` interrompem o build com os nomes das variáveis a preencher. `VITE_FIREBASE_MEASUREMENTID` é opcional. Configure as mesmas variáveis no CI antes de publicar. A validação respeita os arquivos e a prioridade do ambiente [documentados pelo Vite](https://vite.dev/guide/env-and-mode).

Para desenvolvimento isolado, em dois terminais:

```bash
npm run emulators
npm run dev:emulator
```

Esse modo usa o projeto fictício `demo-vesttor` e valores de configuração próprios em `.env.emulator`. Os testes de Rules usam `demo-vesttor-rules`, sem acesso ao banco de produção.

### Build de producao

```bash
npm run build
```

O build gera os arquivos finais na pasta `dist`.

### Deploy manual com Firebase Hosting

```bash
npm run deploy:hosting
npm run deploy:rules
npm run deploy:indexes
```

Configuracao atual do Hosting:

- projeto Firebase: `gestor-financeiro-43435`;
- pasta publica: `dist`;
- fallback de SPA habilitado para React Router, redirecionando rotas para `/index.html`.

Os três comandos são independentes. Hosting executa o build validado antes da publicação; Rules e índices publicam apenas seus respectivos recursos. A configuração ativa não contém Functions nem predeploy de Functions. O scaffold da pasta `functions` permanece inativo para rastreabilidade; a proposta está em `docs/cloud-functions.md` e pertence ao pós-MVP. O MVP usa Auth e Firestore com Security Rules no plano Spark. Não execute scripts do scaffold como parte do MVP.

### Deploy automatico com GitHub Actions

O Firebase CLI criou workflows em `.github/workflows`:

- `firebase-hosting-merge.yml`: publica no canal live quando houver push na branch `main`;
- `firebase-hosting-pull-request.yml`: cria preview de Hosting em pull requests do proprio repositorio.

Os workflows executam:

```bash
npm ci && npm run build
```

O deploy usa o secret do GitHub `FIREBASE_SERVICE_ACCOUNT_GESTOR_FINANCEIRO_43435`, criado pelo Firebase CLI. Esse secret fica no GitHub e nao deve ser salvo no codigo.

## Documentacao do projeto

A documentacao do projeto foi separada em:

- [`docs/requisitos.md`](docs/requisitos.md): requisitos, escopo, regras de negocio e criterios de aceite;
- [`docs/arquitetura.md`](docs/arquitetura.md): arquitetura, implementacao, rotas, hooks, Firebase e decisoes tecnicas;
- [`docs/cloud-functions.md`](docs/cloud-functions.md): arquitetura alvo de backend, seguranca, contratos e migracao incremental para Cloud Functions;
- [`docs/temas.md`](docs/temas.md): temas claro e escuro, tokens CSS, logos, icones, calendario e futura troca de preferencia.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
