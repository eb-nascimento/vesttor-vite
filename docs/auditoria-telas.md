# Auditoria dos requisitos de interface — Vesttor

Revisão de 10/09/2026. Escopo desta entrega: Figma e documentação; não implementa as funcionalidades no React/Firebase.

## Fontes e decisões

Revisados `docs/requisitos.md`, `docs/SDD.md` e os critérios de aceite dos cards de Figma do backlog no Notion. Em conflitos, prevalecem as decisões recentes de produto: Home para adicionar transação, layout existente preservado, núcleo mobile antes das áreas analíticas, landing opcional por último e Functions/Blaze somente no pós-MVP.

## Cobertura visual

| Área | Cobertura acrescentada | Referência no Figma |
| --- | --- | --- |
| Transações | Tipo em seletor, data, valor, método, categoria e descrição; parcelamento expansível; busca, filtros, ordenação, edição e confirmações | [Transações e navegação](https://www.figma.com/design/fDeglPOLWDf4zxIikgYEXv?node-id=124-2740) |
| Categorias e métodos | Listas, criação separada de edição, situação ativa/inativa, confirmações, bloqueio de exclusão de itens em uso | [Categorias e métodos](https://www.figma.com/design/fDeglPOLWDf4zxIikgYEXv?node-id=106-572) |
| Orçamentos | Referência mensal, categoria de despesa, limite, usado, restante, percentual, níveis de alerta, edição/exclusão e exemplo sem movimentação | [Orçamentos](https://www.figma.com/design/fDeglPOLWDf4zxIikgYEXv?node-id=124-2741) |
| Resumo e relatórios | Receitas/despesas/saldo, consumo de orçamento, alertas, recortes mensal/categoria/método e comparação planejado × realizado | [Resumo e relatórios](https://www.figma.com/design/fDeglPOLWDf4zxIikgYEXv?node-id=124-2742) |
| Conta | Perfil, tema claro/escuro/sistema, saída, consequências da exclusão e nova autenticação | [Conta e preferências](https://www.figma.com/design/fDeglPOLWDf4zxIikgYEXv?node-id=124-2743) |
| Autenticação | Login com recuperação, sucesso de redefinição/verificação, link expirado, validação de senha, falha de cadastro/Google, e-mail pendente e reenvio | [Autenticação complementar](https://www.figma.com/design/fDeglPOLWDf4zxIikgYEXv?node-id=124-2744) |

As áreas possuem versões desktop de 1200 px e mobile de 390 px, nos temas claro e escuro. As folhas intituladas “Estados” apresentam exemplos alternativos para especificação; não representam estados simultâneos em uma tela do aplicativo. O teclado mobile é ilustrativo, não uma implementação de teclado.

## Regras refletidas no desenho

- RN03–RN07: somente despesas consomem orçamento; referência mensal; categoria para despesa e método para transação; limites de atenção em 80% e 100%.
- RN08–RN09: bloquear exclusão de categoria/método com transações; oferecer desativação sem apagar o histórico.
- RN10: mensagens de conclusão indicam atualização da lista e dos indicadores; os cálculos do protótipo são dados demonstrativos.
- RN12–RN14: descrição até 100 caracteres, valor positivo e finito sem teto de negócio e datas passadas/futuras. Observação removida por decisão do usuário.
- RN15: mensagem de operação incerta preserva os campos e orienta verificar antes de reenviar. Idempotência real depende da implementação, não do protótipo.
- RN16: edição e exclusão passam por confirmação explícita.

## Verificação realizada e limites

A revisão do formulário e os estados de parcelamento estão descritos em [Transação e parcelamento](parcelamento.md), com referência à primeira versão do projeto. Foram conferidas visualmente a Home expandida, a validação e a confirmação mobile; a edição distingue uma parcela da compra completa.

- Inspeção visual por amostragem de categorias mobile, edição de transação desktop, Home mobile com os novos campos, orçamentos desktop e erro de autenticação mobile.
- Auditoria geométrica dos novos frames e correção da altura das linhas de ações desktop.
- Ligações de navegação criadas para as áreas e ações principais; sem serviços reais, persistência ou envio de e-mails.
- Não foi executado teste de usabilidade com a orientadora, nem certificação integral de acessibilidade. Teclado real, leitor de tela, foco, contraste de todos os componentes e comportamento responsivo intermediário devem ser testados na implementação.
- Seletores e filtros apresentam os campos e opções previstos; o protótipo não simula integralmente todos os valores e combinações.

## O que continua pendente

1. Revisão visual e de usabilidade com o usuário/orientadora; registrar feedback e priorizar ajustes críticos.
2. Teste ponta a ponta do protótipo em modo apresentação, incluindo ramos alternativos. As ligações criadas não equivalem a esse aceite.
3. Implementação e testes das funcionalidades no aplicativo, conforme os cards próprios do backlog. Persistência, isolamento por usuário, cálculos, exclusão completa de conta e requisitos de backend não são comprovados pelo Figma.
4. Landing page: opcional e última prioridade, não adicionada nesta revisão.
5. Functions, Blaze e proteções de custo: pós-MVP de produção, sem ativação nesta entrega.

O backlog deve distinguir desenho entregue para revisão, aceite do protótipo e implementação. Esta auditoria não declara que o produto inteiro está concluído.
