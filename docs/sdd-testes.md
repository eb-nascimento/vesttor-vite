# Estratégia de Testes do Vesttor

**Revisão:** 26/09/2026

> A estratégia vigente prioriza riscos de perda de dados, cálculo incorreto e acesso indevido. A última verificação registrada aprovou 30 testes Vitest e 5 testes das Security Rules. As contagens e a orientação reduzida das versões anteriores estão superadas por esta revisão.

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

| Área | Estado |
| --- | --- |
| Cálculos, filtros, ordenação e parcelamento | Cobertos por testes unitários |
| Contrato de Transações com `useTransacoes` | Coberto por teste de regressão |
| Isolamento de `transacoes` e `planejamentos` | Coberto por 5 testes de Rules |
| Services, formulários, Budget, autenticação e migração | Cobertura ainda insuficiente |

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

### Segurança e migração

- Testar descrição, centavos, datas civis, situação e campos protegidos.
- Testar criação, edição e exclusão apenas pelo proprietário.
- Testar tentativa de forjar `userId`, autoria ou revisão.
- Testar Security Rules com proprietário, outra conta e pessoa anônima.
- Testar migração repetida, documentos inválidos e reconciliação de somas.
- Confirmar que a leitura em tempo real permanece restrita ao proprietário.

Cloud Functions permanecem fora do escopo atual.

## 7. Execucao

Durante o desenvolvimento, usar:

```bash
npm test
```

Antes de concluir uma etapa, usar a execucao unica:

```bash
npm run test:run
```

O padrão mínimo de verificação local do projeto é:

```bash
npm run lint
npm run test:run
npm run test:rules
npm run build
```

## 8. Decisão de qualidade

Uma funcionalidade só é concluída com testes proporcionais ao risco, lint, build, Rules quando aplicável e documentação sincronizada. Publicação é uma etapa separada. As próximas prioridades são planejamento, services, formulários, autenticação, datas, parcelamentos, recorrências e migração.
