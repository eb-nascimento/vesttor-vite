# Plano de Correções e Evolução do Vesttor

> **Registro histórico ou proposta:** o conteúdo abaixo preserva decisões e planos da época e pode divergir da implementação entregue. Para o estado do MVP e suas limitações, consulte [MVP](../MVP.md) e [índice da documentação](README.md). Não interprete requisitos propostos como funcionalidades prontas.

**Revisão:** 26/09/2026

## 1. Estratégia

Primeiro estabilizar domínio, dados, segurança e migração. Novas telas funcionais entram depois. A autorização para alterar código será decidida caso a caso.

## 2. Definição de pronto

Uma atividade funcional só é concluída com código, testes proporcionais ao risco, lint, build, testes de regras quando aplicáveis e documentação e backlog sincronizados. Publicação é separada.

## 3. Prioridade imediata sem código

1. [x] Consolidar documentação e documentos acadêmicos.
2. [x] Sincronizar Notion com situações e decisões.
3. [x] Publicar somente regras compatíveis e já testadas no banco `(default)` em 26/09/2026.

## 4. Refatorações P0

- Propagar erros dos services e preservar formulários após falha.
- Impedir envio duplicado.
- Corrigir seleção mensal e datas legadas no planejamento.
- Impedir limites duplicados por mês, categoria e natureza.
- Preservar parcelas liquidadas ao editar séries.
- Implementar situações, datas civis, centavos e auditoria do modelo-alvo.
- Corrigir rota de recuperação de senha.
- Endurecer Rules com esquema, inteiros, coerência e imutabilidade.
- Criar migração idempotente com simulação e relatório.

## 5. Refatorações P1

- Cards totalmente derivados do resultado filtrado.
- Paginação por período e retorno à primeira página após filtro.
- Navegação por meses vazios e futuros.
- Planejamento por limites e previsões como transações.
- Catálogos universais e personalizados.
- Recorrência determinística e edição desta ou das próximas.
- Próximos vencimentos e atrasos derivados.
- Páginas acadêmicas “Em construção”.

## 6. Qualidade e operação

- Fixar versão do Node.
- Executar lint, testes, regras e build antes de publicar.
- Validar variáveis `VITE_FIREBASE_*`.
- Usar comandos separados de Hosting, Rules e índices.
- Retirar Functions da configuração ativa enquanto estiver fora do escopo.
- Ampliar testes de hooks, services, formulários, Budget, autenticação e migração.

## 7. Migração

1. Rules compatíveis.
2. Aplicação com leitura dos dois contratos.
3. Novas gravações no modelo-alvo.
4. Migração por usuário, repetível.
5. Relatório e validação.
6. Remoção do legado.
7. Rules finais.

## 8. Futuro documentado

- Contas bancárias, cartões, faturas e transferências.
- Exclusão integral de conta por backend.
- Ambientes pessoal, compartilhado, familiar e empresarial.
- Cloud Functions e App Check depois do MVP.

## 9. Restrições vigentes

- Não implementar código sem autorização específica.
- Não ativar Blaze.
- Não antecipar ambientes financeiros no modelo físico do MVP.
- Versionar a pasta `docs` apenas mais perto da entrega.

## 10. Implementação local em 08/10/2026

Preparadas as quatro tarefas de hierarquia por UID, centavos, Rules/índices e cards/paginação mensal. Migração com simulação, backup privado, idempotência e rollback guardado. Validar no emulador antes de publicar; execução nos dados reais e retirada do legado permanecem etapas operacionais separadas. Consulte `docs/migracao-financeira.md`.
