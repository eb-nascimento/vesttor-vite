# SDD de Testes - Vesttor

## 1. Objetivo

Definir uma estrategia de testes proporcional ao risco do Vesttor. O objetivo nao e atingir cobertura total, mas proteger comportamentos importantes contra regressoes e orientar quais testes devem acompanhar cada nova alteracao.

## 2. Principios

- Testar comportamento observavel, nao detalhes internos da implementacao.
- Priorizar regras de negocio, calculos e fluxos que alteram dados.
- Cada correcao de bug deve receber um teste de regressao quando for viavel.
- Evitar testes de componentes puramente visuais, sem comportamento relevante.
- Usar mocks apenas para dependencias externas, como Firebase.
- Um teste deve ter nome descritivo, dados pequenos e uma unica expectativa principal.

## 3. Camadas de teste

| Camada | Quando usar | Exemplos no Vesttor |
| --- | --- | --- |
| Unitario | Funcoes puras e regras isoladas | calculos, filtros, validacao e ordenacao de transacoes |
| Componente | Interacao ou estado visivel importante | envio de formulario, mensagens de validacao, filtro selecionado |
| Integracao | Modulos que precisam funcionar juntos | formulario chamando hook e atualizando a lista |
| Manual | Integracoes externas ou aspecto visual | Firebase real, regras de seguranca, responsividade e contraste |

## 4. Cobertura atual

| Area | Arquivo | Estado | Comportamento coberto |
| --- | --- | --- | --- |
| Calculos | `src/utils/calculos.test.js` | Implementado | Soma de receitas |
| Filtros | `src/utils/transacao.test.js` | Implementado | Todas, receitas e despesas |

Os testes existentes comprovam que a configuracao do Vitest funciona e protegem dois comportamentos de regra de negocio. Eles sao uma base suficiente para a etapa atual de estudos.

## 5. Criterios para adicionar testes

Adicionar ou ampliar testes quando uma alteracao:

1. criar ou modificar uma regra de calculo;
2. aceitar, rejeitar ou transformar dados do usuario;
3. alterar permissao, autenticacao ou isolamento de dados;
4. corrigir um defeito que possa reaparecer;
5. mudar um fluxo essencial, como criar, editar ou excluir transacoes.

Nao e obrigatorio criar teste novo para ajustes exclusivamente visuais, textos estaticos ou componentes sem logica/interacao relevante.

## 6. Roteiro para futuras funcionalidades

### Categorias e metodos de pagamento

- Validar que uma transacao recebe apenas uma categoria e um metodo validos.
- Validar filtros por categoria e metodo.
- Validar estado vazio quando nao houver resultados.

### Orcamento mensal

- Calcular valor utilizado, restante e percentual por categoria.
- Cobrir limite exato, abaixo do limite e acima do limite.
- Cobrir ausencia de transacoes e ausencia de orcamento configurado.

### Formularios

- Mostrar erros para campos obrigatorios e valores invalidos.
- Impedir envio invalido.
- Confirmar envio valido e limpeza/atualizacao esperada do formulario.

### Firebase e autenticacao

- Manter Firebase real como validacao manual/integrada.
- Em testes automatizados, simular apenas o contrato necessario do Firebase.
- Validar mensagens amigaveis para erros de autenticacao mapeados.

### Cloud Functions e seguranca

- Testar validadores de descricao, valor, data, tipo e campos protegidos.
- Testar callable sem autenticacao e com payload invalido.
- Testar criacao, edicao e exclusao apenas pelo proprietario.
- Testar tentativa de forjar `userId`.
- Testar retentativas simultaneas e sequenciais com a mesma chave de idempotencia.
- Testar descricao com 100 e 101 caracteres, valores altos e datas passadas e futuras.
- Testar Security Rules com proprietario, outro usuario e usuario anonimo.
- Usar Functions e Firestore Emulators antes de validar no projeto Firebase real.
- Confirmar que a leitura em tempo real continua restrita ao proprietario.

Esses testes passam a ser obrigatorios para a migracao das escritas. Os testes existentes continuam representando apenas a cobertura atual do frontend.

## 7. Execucao

Durante o desenvolvimento, usar:

```bash
npm test
```

Antes de concluir uma etapa, usar a execucao unica:

```bash
npm run test:run
```

O padrao minimo de verificacao local do projeto e:

```bash
npm run lint
npm run test:run
npm run build
```

## 8. Decisao de qualidade atual

O Vesttor possui testes unitarios iniciais e lint configurado. A proxima ampliacao de cobertura deve acontecer junto de uma funcionalidade nova ou de um bug real; testes de componente sao um proximo tema de estudo, nao um requisito imediato para encerrar esta etapa.
