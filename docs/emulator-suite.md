# Testes das Regras no Emulator Suite

**Revisão:** 26/09/2026  
**Situação:** Implementada para o contrato atual

## Cobertura atual

A suíte `tests/firestore/firestore.rules.test.js` executa no emulador do Firestore e valida isolamento de `transacoes` e `planejamentos`. Na última verificação registrada, foram aprovados 5 testes de regras e 30 testes Vitest da aplicação.

Os cenários incluem autenticação, proprietário correto, acesso de outra conta, formatos aceitos no contrato legado e campos protegidos. Java está disponível no ambiente atual; a anotação antiga de emulador indisponível está obsoleta.

## Execução

- `npm test`: testes unitários e de componentes.
- `npm run test:rules`: inicia o emulador e executa as regras.
- `npm run lint`: análise estática.
- `npm run build`: compilação de produção.

O fluxo local não ativa Blaze nem grava no projeto remoto.

## Limites conhecidos

A suíte atual protege o modelo legado e as regras compatíveis. Antes do endurecimento final, deve cobrir centavos inteiros, campos obrigatórios, coerência de situação e datas, auditoria imutável, catálogos e migração. Testes precisam usar pelo menos duas identidades.

O uso de `firebase-tools@latest` torna a execução dependente de rede e versão variável; a automação futura deve fixar a versão da ferramenta.
