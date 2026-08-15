# Temas e identidade visual

## 1. Objetivo

O projeto possui duas identidades visuais, clara e escura, baseadas nas imagens:

- `docs/Documentação/identidade-visual-claro.png`;
- `docs/Documentação/identidade-visual-escuro.png`.

O tema escuro é o padrão atual. O tema claro anterior foi preservado para uma futura configuração de preferência, sem duplicar regras de layout nos componentes.

Esta etapa alterou somente cores, sombras, logos, ícones e controles nativos. A estrutura, os tamanhos, os espaçamentos e a disposição dos componentes não foram redesenhados. A única família tipográfica utilizada continua sendo `Inter`.

## 2. Estrutura dos arquivos

```text
src/
|-- styles/
|   `-- themes/
|       |-- theme-base.css
|       |-- theme-dark.css
|       `-- theme-light.css
`-- App.css
```

Responsabilidades:

| Arquivo | Responsabilidade |
| --- | --- |
| `theme-base.css` | Tokens iguais nos dois temas, como fonte, destaques, estados, indicadores e foco |
| `theme-dark.css` | Valores específicos da identidade escura e aplicação do tema padrão |
| `theme-light.css` | Valores da identidade clara anterior, preservados para seleção futura |
| `App.css` | Importação dos temas e regras globais de `html` e `body` |

## 3. Ordem de importação

O `App.css` importa os arquivos nesta ordem:

```css
@import "./styles/themes/theme-base.css";
@import "./styles/themes/theme-dark.css";
@import "./styles/themes/theme-light.css";
```

A ordem é intencional:

1. `theme-base.css` define os valores compartilhados;
2. `theme-dark.css` aplica o escuro em `:root` e permite sua seleção explícita;
3. `theme-light.css` vem por último para sobrescrever os valores escuros quando `data-theme="light"` estiver presente.

## 4. Seletores e tema padrão

O tema escuro usa:

```css
:root,
[data-theme="dark"] {
  /* tokens escuros */
}
```

Por estar associado ao `:root`, ele funciona sem JavaScript e sem atributo no HTML. O tema claro está preparado assim:

```css
[data-theme="light"] {
  /* tokens claros */
}
```

Para testar manualmente o tema claro, basta definir o atributo no elemento raiz:

```html
<html data-theme="light">
```

Para voltar explicitamente ao tema escuro:

```html
<html data-theme="dark">
```

A interface de configuração e a persistência da preferência ainda não foram implementadas.

## 5. Tokens compartilhados

Os tokens abaixo permanecem iguais nos dois temas:

| Token | Valor ou referência | Uso |
| --- | --- | --- |
| `--font-family-base` | `"Inter", sans-serif` | Tipografia global |
| `--color-accent` | `#1ba7ff` | Destaque azul e foco |
| `--color-growth` | `#20c997` | Crescimento e gradientes positivos |
| `--color-dashboard-income` | `#16a34a` | Indicador de receitas |
| `--color-dashboard-expense` | `#dc2626` | Indicador de despesas |
| `--color-dashboard-balance` | `#2563eb` | Indicador de saldo |
| `--color-success` | `#22c55e` | Estado de sucesso |
| `--color-warning` | `#f59e0b` | Estado de alerta |
| `--color-error` | `#ef4444` | Estado de erro |
| `--shadow-focus` | halo azul com 18% de opacidade | Foco de campos e seletores |

Também existem aliases semânticos para ícones:

```css
--color-icon-default: var(--color-text-muted);
--color-icon-action: var(--color-accent);
--color-icon-danger: var(--color-error);
```

Esses aliases evitam cores literais dentro dos componentes. O ícone de edição usa a cor de ação; o de exclusão usa a cor de perigo.

## 6. Tokens específicos por tema

Os dois arquivos usam os mesmos nomes de variáveis. Assim, os componentes não precisam saber qual tema está ativo.

| Token | Tema escuro | Tema claro |
| --- | --- | --- |
| `--color-primary` | `#1ba7ff` | `#05213a` |
| `--color-primary-dark` | `#0b3d5c` | `#001629` |
| `--color-primary-light` | `#20c997` | `#0b3d5c` |
| `--color-logo` | `#f6f8fb` | `#05213a` |
| `--color-bg` | `#050b16` | `#f6f8fb` |
| `--color-surface` | `#0b1f33` | `#ffffff` |
| `--color-surface-alt` | `#20364d` | `#eef3f8` |
| `--color-text` | `#f6f8fb` | `#0f172a` |
| `--color-text-muted` | `#a9b7c8` | `#64748b` |
| `--color-text-light` | `#ffffff` | `#ffffff` |
| `--color-border` | `#20364d` | `#e2e8f0` |

Sombras também são temáticas porque fundos claros e escuros precisam de opacidades diferentes:

| Token | Uso |
| --- | --- |
| `--shadow-card` | Formulários e painéis comuns |
| `--shadow-card-raised` | Cards de resumo e menus elevados |
| `--shadow-dialog` | Formulário de autenticação |

## 7. Aplicação nos componentes

As cores literais de sombra e foco foram removidas dos componentes e substituídas por tokens:

| Componente | Alteração temática |
| --- | --- |
| `CardResumo.css` | Usa `--shadow-card-raised` |
| `ControlesTransacoes.css` | Usa `--shadow-focus` no seletor em foco |
| `Form.css` | Usa `--shadow-card`, `--shadow-focus` e aparência temática do calendário |
| `FormAuth.css` | Usa `--shadow-dialog` e `--shadow-focus` |
| `ListaTransacoes.css` | Usa `--shadow-card` e cores semânticas nos ícones |
| `MenuAccount.css` | Usa `--shadow-card-raised`; os ícones herdam as cores do texto e dos estados |

## 8. Logos

Os componentes SVG abaixo deixaram de usar `fill` preto fixo:

- `Logo.jsx`;
- `LogoGrafia.jsx`;
- `LogoHorizontal.jsx`;
- `LogoVertical.jsx`.

Todos usam agora:

```jsx
fill="var(--color-logo)"
```

O resultado é uma marca clara no tema escuro e azul-marinho no tema claro. Os arquivos SVG em `src/assets` foram preservados; a troca dinâmica ocorre nos componentes SVG incorporados ao JSX.

## 9. Ícones e acessibilidade

Os ícones do `lucide-react` herdam a propriedade CSS `color`. Por isso:

- editar recebe `--color-icon-action`;
- excluir recebe `--color-icon-danger`;
- conta e logout continuam herdando as cores semânticas do menu.

Os botões de editar e excluir também receberam `aria-label`, respectivamente `Editar transação` e `Excluir transação`, para que a ação não dependa apenas do desenho do ícone.

## 10. Calendário e controles nativos

Cada tema define a propriedade CSS `color-scheme`:

```css
/* theme-dark.css */
color-scheme: dark;

/* theme-light.css */
color-scheme: light;
```

Isso informa ao navegador qual aparência usar em controles nativos, especialmente o indicador e o popup de `input[type="date"]`. O indicador WebKit também recebeu cursor e ajuste de opacidade em `Form.css`.

A aparência exata do popup do calendário ainda pode variar entre navegadores e sistemas operacionais, pois ele é um controle nativo. A solução atual mantém acessibilidade e comportamento padrão sem substituir o calendário por um componente JavaScript.

## 11. Como adicionar ou alterar um token

Antes de criar uma variável, deve-se verificar se o valor é compartilhado:

- se o valor for igual nos dois temas, adicionar em `theme-base.css`;
- se variar, usar o mesmo nome em `theme-dark.css` e `theme-light.css`;
- nos componentes, consumir somente `var(--nome-do-token)`;
- evitar hexadecimal, `rgb()` ou sombra literal fora dos arquivos de tema;
- usar nomes semânticos que descrevam a função, não apenas a cor.

Exemplo de token variável:

```css
/* theme-dark.css */
--color-example: #f6f8fb;

/* theme-light.css */
--color-example: #05213a;

/* componente */
color: var(--color-example);
```

## 12. Próxima evolução prevista

Uma futura configuração de tema deverá:

1. permitir escolher claro ou escuro;
2. aplicar `data-theme` no elemento `html`;
3. persistir a preferência do usuário;
4. aplicar a preferência antes da primeira renderização para evitar mudança visual durante o carregamento;
5. opcionalmente considerar `prefers-color-scheme` quando não existir preferência salva.

Nenhuma dessas etapas é necessária para o tema escuro funcionar como padrão hoje.

## 13. Validação realizada

Após a implementação e os ajustes de ícones e calendário, foram executados:

```bash
npm run lint
npm run build
npm run test:run
```

Resultados:

- ESLint sem erros;
- build de produção concluído;
- 2 arquivos de teste aprovados;
- 4 testes aprovados.
