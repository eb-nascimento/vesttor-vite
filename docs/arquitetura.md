# Vesttor - Arquitetura e Implementacao

## 1. Visao tecnica

O Vesttor e uma aplicacao web criada com React, Vite, Firebase Authentication e Cloud Firestore.

Este documento registra como o projeto esta implementado, quais decisoes tecnicas foram tomadas e quais conceitos foram estudados durante a evolucao da aplicacao.

Para requisitos de produto, regras de negocio e escopo funcional, consulte `docs/requisitos.md`.

A implementacao descrita neste documento representa o estado atual. A arquitetura alvo com Cloud Functions, seus contratos e o plano de migracao estao em `docs/cloud-functions.md`.

## 2. Stack principal

- React;
- Vite;
- React Router;
- Firebase Authentication;
- Cloud Firestore;
- JavaScript;
- CSS.

## 3. Arquitetura em camadas

A aplicacao usa uma arquitetura simples em camadas:

```mermaid
flowchart TD
    UI["Componentes React"] --> Pages["Paginas"]
    Pages --> Hooks["Hooks de estado e fluxo"]
    Hooks --> Services["Services Firebase"]
    Hooks --> Utils["Funcoes puras em utils"]
    Services --> Auth["Firebase Authentication"]
    Services --> DB["Cloud Firestore"]
```

Responsabilidades:

| Camada       | Responsabilidade                                   |
| ------------ | -------------------------------------------------- |
| `pages`      | Telas acessadas por rotas                          |
| `layouts`    | Estruturas compartilhadas entre paginas            |
| `routes`     | Regras de acesso e componentes ligados a navegacao |
| `components` | Interface, formularios, listas, cards e controles  |
| `hooks`      | Estado, efeitos e coordenacao das operacoes        |
| `services`   | Comunicacao com Firebase Auth e Firestore          |
| `utils`      | Calculos, validacoes e transformacoes puras        |
| `config`     | Inicializacao dos servicos externos                |

## 4. Estrutura atual do projeto

```text
src/
|-- assets/
|   |-- edit.svg
|   `-- trash.svg
|
|-- components/
|   |-- CardResumo.jsx
|   |-- ContainerResumo.jsx
|   |-- ControlesTransacoes.jsx
|   |-- Form.jsx
|   |-- FormAuth.jsx
|   |-- Header.jsx
|   |-- ItemTransacao.jsx
|   `-- ListaTransacoes.jsx
|
|-- config/
|   `-- firebase.js
|
|-- hooks/
|   |-- useAuth.js
|   `-- useTransacoes.js
|
|-- layouts/
|   `-- AppLayout.jsx
|
|-- pages/
|   |-- Home.jsx
|   `-- Login.jsx
|
|-- routes/
|   |-- PrivateRoute.jsx
|   `-- PublicRoute.jsx
|
|-- services/
|   |-- authService.js
|   `-- transacoesService.js
|
|-- styles/
|   `-- themes/
|       |-- theme-base.css
|       |-- theme-dark.css
|       `-- theme-light.css
|
|-- utils/
|   |-- calculos.js
|   `-- transacao.js
|
|-- App.jsx
|-- App.css
|-- index.css
`-- main.jsx
```

## 5. Inicializacao da aplicacao

`src/main.jsx` cria a raiz React e envolve `App` com `BrowserRouter`.

Responsabilidade do `BrowserRouter`:

- Permitir que o React leia a URL atual;
- Controlar navegacao sem recarregar a pagina inteira;
- Habilitar `Routes`, `Route`, `Navigate`, `Outlet` e demais recursos do React Router.

Fluxo inicial:

```text
main.jsx
`-- BrowserRouter
    `-- App
```

## 6. React Router

### 6.1. Rotas atuais

Rotas atuais:

| Rota     | Tipo     | Comportamento                                          |
| -------- | -------- | ------------------------------------------------------ |
| `/login` | Publica  | Exibe login apenas para usuario nao autenticado        |
| `/home`  | Privada  | Exibe home apenas para usuario autenticado             |
| `*`      | Fallback | Redireciona para `/home` ou `/login` conforme a sessao |

### 6.2. Estrutura atual em `App.jsx`

```jsx
<Routes>
  <Route
    element={
      <PrivateRoute usuario={usuario}>
        <AppLayout />
      </PrivateRoute>
    }
  >
    <Route path="/home" element={<Home usuario={usuario} />} />
  </Route>

  <Route
    path="/login"
    element={
      <PublicRoute usuario={usuario}>
        <Login />
      </PublicRoute>
    }
  />

  <Route path="*" element={<Navigate to={usuario ? "/home" : "/login"} />} />
</Routes>
```

Pontos importantes:

- A rota pai protegida nao possui `path`;
- Ela serve como casca para protecao e layout;
- `/home` e uma rota filha;
- A rota filha aparece dentro do `Outlet` de `AppLayout`;
- A rota `*` trata enderecos desconhecidos.

## 7. Componentes de rota

### 7.1. `PrivateRoute`

`PrivateRoute` recebe `usuario` e `children`.

Regra:

- Sem usuario: redireciona para `/login`;
- Com usuario: renderiza `children`.

Uso conceitual:

```jsx
<PrivateRoute usuario={usuario}>
  <Home usuario={usuario} />
</PrivateRoute>
```

### 7.2. `PublicRoute`

`PublicRoute` representa o caso inverso.

Regra:

- Com usuario: redireciona para `/home`;
- Sem usuario: renderiza `children`.

Uso conceitual:

```jsx
<PublicRoute usuario={usuario}>
  <Login />
</PublicRoute>
```

## 8. Layout compartilhado

### 8.1. `AppLayout`

`AppLayout` centraliza a estrutura comum da area autenticada.

Ele renderiza:

- `Header`;
- `main`;
- `Outlet`.

Estrutura:

```jsx
function AppLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}
```

Conceito:

```text
PrivateRoute
`-- AppLayout
    |-- Header
    `-- main
        `-- Outlet
            `-- Home
```

O `Outlet` marca onde a rota filha sera renderizada.

## 9. Paginas

### 9.1. `Login.jsx`

Responsabilidade:

- Compor a tela de autenticacao;
- Renderizar `FormAuth`;
- Deixar a regra de redirecionamento em `PublicRoute`.

### 9.2. `Home.jsx`

Responsabilidade atual:

- Usar `useTransacoes(usuario?.uid)`;
- Renderizar resumo financeiro;
- Renderizar formulario de transacao;
- Renderizar lista de transacoes;
- Exibir carregamento e erro;
- Exibir email do usuario;
- Disponibilizar logout.

Com a criacao de `AppLayout`, `Home` nao deve mais renderizar `Header` nem criar outro `main`. A estrutura comum pertence ao layout.

## 10. Autenticacao

### 10.1. `useAuth`

`useAuth` observa a sessao com `onAuthStateChanged`.

Retorno:

```js
{
  (usuario, carregandoAuth);
}
```

Fluxo:

```mermaid
sequenceDiagram
    participant App
    participant Hook as useAuth
    participant Auth as Firebase Auth

    App->>Hook: inicializa
    Hook->>Auth: onAuthStateChanged
    Auth-->>Hook: usuario ou null
    Hook-->>App: usuario + carregandoAuth=false
```

`App` aguarda `carregandoAuth` terminar antes de decidir quais rotas exibir ou redirecionar.

### 10.2. `authService.js`

Encapsula chamadas do Firebase Authentication:

- `createUserWithEmailAndPassword`;
- `signInWithEmailAndPassword`;
- `GoogleAuthProvider`;
- `signInWithPopup`;
- `signOut`.


### 10.3. Login com Google

A autenticacao com Google foi adicionada como provedor externo do Firebase Authentication.

Conceitos registrados neste bloco:

- `GoogleAuthProvider` representa o provedor de login Google;
- `signInWithPopup` inicia o fluxo em uma janela externa;
- o Firebase cria ou reutiliza o usuario autenticado;
- `useAuth` nao precisa conhecer o tipo de login usado, pois `onAuthStateChanged` observa o estado geral da sessao;
- depois do login, o restante da aplicacao continua usando `usuario.uid` para separar os dados por usuario.

O proximo refinamento recomendado e converter erros tecnicos do Firebase Authentication em mensagens amigaveis para o usuario.

## 11. Firestore e transacoes

### 11.1. `useTransacoes`

`useTransacoes(userId)` coordena o estado de transacoes.

Responsabilidades:

- Manter lista de transacoes;
- Controlar carregamento;
- Controlar erros;
- Controlar transacao em edicao;
- Adicionar, editar e excluir transacoes;
- Calcular saldo, receitas e despesas a partir da lista.

Valores derivados:

- `saldo`;
- `receitas`;
- `despesas`.

Esses valores nao ficam em estado proprio; sao calculados a partir de `transacoes`.

### 11.2. `transacoesService.js`

Encapsula operacoes do Cloud Firestore.

Funcoes atuais:

| Funcao                  | Responsabilidade                               |
| ----------------------- | ---------------------------------------------- |
| `observarTransacoes`    | Assinar transacoes do usuario com `onSnapshot` |
| `criarTransacaoNaApi`   | Criar documento no Firestore                   |
| `editarTransacaoNaApi`  | Atualizar documento existente                  |
| `excluirTransacaoNaApi` | Excluir documento                              |

A leitura usa tempo real com `onSnapshot`.

Fluxo:

```text
Home
`-- useTransacoes(usuario.uid)
    `-- observarTransacoes(userId)
        `-- query transacoes where userId == uid
            `-- onSnapshot
```

Com isso, criacoes, edicoes e exclusoes sao refletidas automaticamente pelo listener.

## 12. Utilitarios

### 12.1. `utils/calculos.js`

Funcoes puras:

- `calcularSaldo`;
- `calcularReceitas`;
- `calcularDespesas`.

### 12.2. `utils/transacao.js`

Funcoes puras:

- `criarTransacao`;
- `filtrarTransacoes`;
- `ordenarTransacoes`;
- `validarTransacao`.

A ordenacao cria copia do array antes de usar `sort`, evitando mutacao direta do estado.

## 13. Modelo atual no Firestore

Colecao:

```text
transacoes
```

Documento atual:

```js
{
  id: "ID gerado pelo Firestore",
  userId: "UID do Firebase Authentication",
  data: Timestamp,
  descricao: "Salario",
  valor: 3500,
  tipo: "receita"
}
```

Datas sao armazenadas como `Timestamp` e convertidas nas fronteiras da interface.

## 14. Seguranca

A consulta do frontend filtra por `userId`, mas isso nao substitui regras de seguranca do Firestore.

Regra alvo para `transacoes`:

```text
match /transacoes/{transactionId} {
  allow read: if request.auth != null
    && request.auth.uid == resource.data.userId;

  allow create: if request.auth != null
    && request.auth.uid == request.resource.data.userId;

  allow update: if request.auth != null
    && request.auth.uid == resource.data.userId
    && request.auth.uid == request.resource.data.userId;

  allow delete: if request.auth != null
    && request.auth.uid == resource.data.userId;
}
```

No futuro, regras equivalentes deverao ser criadas para:

- `categorias`;
- `metodosPagamento`;
- `orcamentos`.

### 14.1. Arquitetura alvo de seguranca

A arquitetura alvo mantem os dados na mesma base do Cloud Firestore e preserva a leitura em tempo real pelo frontend. Criacao, edicao e exclusao serao migradas para HTTPS callable Cloud Functions.

No backend:

- o UID sera obtido do contexto autenticado, nunca aceito do payload;
- toda transacao continuara vinculada obrigatoriamente a um `userId`;
- descricao tera no maximo 100 caracteres;
- valor devera ser positivo e finito, sem maximo de negocio;
- datas passadas e futuras serao permitidas;
- criacao devera ser idempotente para impedir duplicacoes;
- edicao e exclusao verificarao a propriedade do documento.

Depois da migracao das escritas, as Security Rules deverao manter somente a leitura direta por proprietario e negar escritas diretas do cliente. Esta arquitetura ainda nao esta implementada; detalhes e ordem segura de migracao estao em `docs/cloud-functions.md`.

## 15. Decisoes tecnicas registradas

### 15.1. Firestore no lugar de armazenamento local

O Firestore permite persistencia remota, acesso em diferentes dispositivos e separacao por usuario autenticado.

### 15.2. Services isolados

Componentes nao chamam Firebase diretamente. A comunicacao externa fica nos services.

### 15.3. Hooks como coordenadores de fluxo

Hooks como `useAuth` e `useTransacoes` coordenam estado, efeitos e chamadas aos services.

### 15.4. Estado derivado sem `useState`

Saldo, receitas e despesas sao calculados a partir da lista de transacoes, evitando duplicacao de estado.

### 15.5. Layout compartilhado para area autenticada

`AppLayout` evita repetir `Header` e estrutura principal em cada pagina privada.

### 15.6. Formulario com estado unico

`Form.jsx` usa um unico objeto de estado para os campos do formulario de transacao.

Essa decisao reduz estados paralelos para `data`, `descricao`, `valor`, `tipo` e `erro`, facilitando reset, validacao e preenchimento em modo de edicao.

O estado inicial e criado a partir de `transacaoEditando` quando existe uma transacao em edicao. Para isso, `Home.jsx` usa uma `key` no componente `Form`, alternando entre o id da transacao editada e `"nova-transacao"`. Quando a `key` muda, o React remonta o formulario e o estado inicial e recalculado.

Com isso, o formulario nao precisa usar `useEffect` para copiar props para estado local.

### 15.7. Efeitos focados em sistemas externos

O projeto passou a evitar `setState` sincronico dentro do corpo de `useEffect` quando esse estado pode ser inicializado ou derivado de outra forma.

No caso de `useTransacoes`, o efeito fica focado em sincronizar o React com um sistema externo: a assinatura do Firestore via `onSnapshot`.

Atualizacoes de estado relacionadas aos dados remotos acontecem dentro dos callbacks do listener, e nao como inicializacao sincronica no corpo do efeito.

## 16. Blocos de estudo concluidos

### 16.1. Firebase e Firestore

Conceitos praticados:

- Configuracao do Firebase;
- Autenticacao com e-mail e senha;
- Separacao de dados por usuario;
- CRUD no Firestore;
- Conversao de datas para `Timestamp`;
- Listener em tempo real com `onSnapshot`.

### 16.2. Hooks customizados

Conceitos praticados:

- `useAuth` para sessao;
- `useTransacoes` para dados e operacoes;
- Separacao entre estado, services e interface;
- Cleanup de efeitos.

### 16.3. React Router

Conceitos praticados:

- `BrowserRouter`;
- `Routes`;
- `Route`;
- `Navigate`;
- Rotas privadas;
- Rotas publicas;
- `children`;
- Rota pai sem `path`;
- Rota filha;
- `Outlet`;
- Layout compartilhado.

### 16.4. URL como estado

Conceitos praticados:

- `useSearchParams` para ler e escrever query params;
- filtro de transacoes persistido na URL;
- ordenacao de transacoes persistida na URL;
- valores padrao quando parametros nao existem;
- preservacao de um parametro ao alterar outro;
- possibilidade de recarregar ou compartilhar a pagina mantendo filtros aplicados.


### 16.5. Variaveis de ambiente no Vite

Conceitos praticados:

- uso de `.env` para separar configuracao de ambiente do codigo fonte;
- acesso aos valores com `import.meta.env`;
- prefixo obrigatorio `VITE_` para variaveis expostas ao frontend pelo Vite;
- sintaxe correta do arquivo `.env` como `CHAVE=valor`;
- inclusao de `.env` no `.gitignore` para evitar versionar configuracoes locais;
- validacao do Firebase apos mover a configuracao para variaveis de ambiente.

Registro relacionado:

- `.env.example` criado para documentar as variaveis necessarias sem valores reais.

### 16.6. Identidade visual base

Conceitos praticados:

- separacao dos tokens em `styles/themes/theme-base.css`, `theme-dark.css` e `theme-light.css`;
- uso dos mesmos nomes de variaveis nos dois temas para desacoplar componentes da preferencia visual;
- aplicacao do tema escuro como padrao por meio de `:root`;
- preparacao da troca futura com os seletores `[data-theme="dark"]` e `[data-theme="light"]`;
- tokens especificos para indicadores de dashboard, como receitas, despesas e saldo;
- aplicacao de cor de texto e fundo globais no `body`;
- separacao de cores por responsabilidade: marca, destaque, fundos, textos, bordas e estados;
- conversao de sombras e halos de foco fixos em tokens tematicos;
- logos SVG incorporadas ao JSX usando `--color-logo`;
- icones de acao usando tokens semanticos de destaque e perigo;
- uso de `color-scheme` para adequar controles nativos, como o calendario;
- manutencao da fonte `Inter` e do layout existente.

Decisoes relacionadas:

- a identidade clara anterior permanece disponivel e nao foi sobrescrita;
- o seletor de preferencia e sua persistencia ainda serao implementados;
- a documentacao detalhada esta em `docs/temas.md`.


### 16.7. Firebase Hosting e deploy

Conceitos praticados:

- diferenca entre ambiente local, build de producao e aplicacao publicada;
- uso de `npm run build` para gerar a pasta `dist`;
- configuracao do Firebase Hosting para servir a aplicacao Vite;
- configuracao de fallback para SPA com React Router;
- publicacao da primeira versao da aplicacao com Firebase Hosting;
- validacao de login, rotas privadas e leitura do Firestore no ambiente publicado.

Registro relacionado:

- comandos de build, deploy manual e deploy automatico documentados no `README.md`.

### 16.8. Qualidade com ESLint

Conceitos praticados:

- execucao de `npm run lint`;
- leitura de erros do ESLint por arquivo, linha e regra;
- diferenca entre erro real de codigo e recomendacao de padrao React;
- correcao de import ausente em `FormAuth.jsx`;
- refatoracao de formulario para estado unico;
- uso de `key` para remontar componente quando o contexto muda;
- entendimento da regra `react-hooks/set-state-in-effect`;
- ajuste de efeito para sincronizar com o Firestore sem inicializacao sincronica de estado.

Estado atual:

- `npm run lint` executa sem erros.

### 16.9. Acessibilidade de formularios

Foram revisados os formularios de autenticacao e de transacoes.

- Cada campo possui `label` associado por `htmlFor` e `id`.
- O formulario de autenticacao informa `autoComplete` para e-mail e senha.
- Mensagens dinamicas de erro usam `role="alert"` para serem anunciadas por tecnologias assistivas.
- Botoes possuem foco visivel com `:focus-visible`.
- `npm run lint` foi executado sem erros apos os ajustes.

Validacao manual recomendada: percorrer os formularios com `Tab` e `Shift + Tab`, confirmando ordem logica e foco visivel.

### 16.10. Estados de erro nas transacoes

O hook `useTransacoes` separa falhas por origem:

- `erroLeitura`: erro da assinatura do Firestore ao carregar ou atualizar a lista;
- `erroOperacao`: erro ao criar, editar ou excluir uma transacao;
- `form.erro`: validacao local dos dados no formulario.

`Home.jsx` mostra o erro de leitura no lugar da lista. O erro de operacao e exibido sem ocultar as transacoes que ja foram carregadas. O lint e o build executam sem erros apos a separacao.

### 16.11. Validacao de isolamento entre contas

O isolamento de leitura das transacoes foi validado manualmente com duas contas diferentes. Cada conta visualiza apenas as transacoes associadas ao seu proprio `userId`.

A validacao detalhada de criacao, edicao e exclusao de documentos pertencentes a outra conta continua registrada no checklist como verificacao complementar das regras do Firestore.

### 16.12. Menu da conta

Foi adicionado um menu visual de conta no cabecalho, com icones do `lucide-react` e estilos proprios em `MenuAccount.css`.

- O menu aparece ao passar o cursor ou ao navegar por teclado para dentro do componente.
- Os botoes de icone possuem rotulos acessiveis.
- O menu possui foco visivel e utiliza os tokens de cor existentes.
- As rotas de conta, pagamentos, categorias e configuracoes continuam como proximos modulos; os links atuais apenas preparam a navegacao.
- `npm run lint` e `npm run build` foram executados sem erros.
### 16.13. Estrutura de paginas e navegacao preparada

Foram criados arquivos-base para as paginas `Dashboard`, `Account`, `Payments`, `Categories` e `Settings`. O cabecalho possui um link para Dashboard, e o menu da conta aponta para os demais destinos.

Essas paginas ainda nao possuem conteudo funcional e as rotas correspondentes ainda nao foram registradas no `App.jsx`. Enquanto isso, o redirecionamento curinga da aplicacao leva esses enderecos de volta para `/home`.
## 17. Proximos passos tecnicos

1. Criar testes para funcoes puras em `utils`.
2. Separar erros de carregamento, operacao, autenticacao e validacao.
3. Revisar codificacao UTF-8 dos textos exibidos.
4. Aplicar os tokens visuais de `App.css` nos componentes existentes.
5. Avancar para um novo modulo de produto quando fizer sentido: categorias, metodos de pagamento ou orcamentos.
