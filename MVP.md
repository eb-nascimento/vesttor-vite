# Fechamento do MVP — Vesttor

Fechamento funcional: 13/11/2026. Revisão documental: 17/11/2026. Versão do projeto: 0.8.1 (`package.json`).

O responsável pelo projeto declarou concluído o escopo funcional do MVP após a implementação da tela de métodos de pagamento. Esta decisão congela o escopo desta primeira entrega; funcionalidades descritas em planejamentos anteriores que excedam os itens abaixo são evolução futura e não condicionam o fechamento do MVP.

## Escopo entregue

- Autenticação com e-mail/senha e Google, cadastro e recuperação de senha no fluxo existente.
- Cadastro, edição e exclusão de receitas e despesas, incluindo despesas parceladas.
- Resumo financeiro mensal na Home.
- Consulta de transações com busca, filtros, ordenação e paginação.
- Planejamento mensal com comparação entre valores planejados e realizados.
- Catálogo universal de 110 categorias: 80 disponíveis para despesas e 31 para receitas, com “Outros” compartilhada entre as duas naturezas.
- Catálogo universal de 26 métodos de pagamento, compartilhado pela tela de métodos, formulário e filtros de transações.
- Telas de categorias e métodos com busca, filtro por tipo e resumo; apresentação responsiva baseada no Figma e nos componentes do projeto.
- Selects compartilhados com busca por digitação, correspondência sem acentos e seleção por teclado.
- Persistência das transações e planejamentos no Firestore, vinculada ao usuário autenticado.

## Referência da implementação para a banca

O MVP é uma aplicação web de finanças pessoais em React, Vite e Firebase. Após o login, a Home apresenta a soma de receitas, despesas e a diferença entre ambas para o mês selecionado, a partir da data registrada nas transações. Esse resultado não é saldo bancário e não distingue pagamento ou recebimento efetivo. O planejamento compara valores previstos por categoria e classificação com transações do período; não há conciliação bancária nem controle de liquidação.

| Área | Situação nesta versão |
| --- | --- |
| Acesso | Cadastro e entrada por e-mail e senha, entrada com Google e fluxo de recuperação de senha; depende da configuração do Firebase Authentication. |
| Transações | Receitas e despesas com criação, edição, exclusão, consulta mensal, busca, filtros, ordenação e paginação. |
| Parcelamento | Despesas parceladas são criadas em lote; há edição e exclusão de parcelas conforme o fluxo disponível. Não existe controle de parcelas liquidadas ou faturas. |
| Planejamento | Orçamentos mensais por categoria e tipo Entrada, Fixo ou Variável, com comparação ao realizado. |
| Catálogos | Categorias e métodos predefinidos no código, com consulta e filtros; cadastro próprio indisponível. |
| Outras telas | Dashboard, Minha conta e Configurações exibem estado em construção. |

### Dados e segurança

Novas transações e planejamentos são gravados em `usuarios/{uid}/transacoes` e `usuarios/{uid}/planejamentos`, com `userId` e valores monetários inteiros em centavos. Transações também são lidas da coleção raiz legada; na edição individual, um registro legado é movido para o caminho privado. O planejamento lê apenas registros privados com ID determinístico `orcamento-{mesAno}-{tipo}-{categoria}`: planejamentos antigos fora desse contrato não aparecem e não são apagados automaticamente. Consulte os serviços e as regras para o contrato preciso.

As regras locais restringem dados privados ao usuário autenticado e validam campos; a existência dessas regras no repositório não comprova sua publicação no ambiente da banca. Os catálogos apresentados pela aplicação são arquivos locais; regras para catálogos futuros não significam que sua gestão esteja disponível. A configuração ativa não publica Cloud Functions.

### Roteiro de demonstração

1. Entrar com uma conta de demonstração preparada no ambiente escolhido.
2. Registrar uma receita e uma despesa, e apresentar os totais mensais na Home.
3. Consultar e filtrar as transações; demonstrar uma despesa parcelada e sua distribuição entre meses.
4. Criar um planejamento para uma categoria com movimentação no mesmo mês e comparar previsto e realizado.
5. Mostrar os catálogos e esclarecer que são predefinidos; indicar as telas em construção e as evoluções futuras.

Antes da banca, confirme o acesso à conta, provedores e domínio autorizado, dados de demonstração, conexão, publicação da aplicação, regras e índices no projeto de destino. Esses pontos dependem do ambiente e não são comprovados apenas pelo código.

## Decisões do MVP

Categorias e métodos são pré-definidos no código e oferecidos a todos os usuários. Não há cadastro personalizado nesta entrega. Os botões de criação ficam desativados e as ações de edição, ocultação, desativação e exclusão não ficam disponíveis nas telas de catálogos. O catálogo não exige cópia ou carga inicial de documentos no Firestore.

Os identificadores dos métodos e nomes das categorias anteriormente utilizados são preservados para compatibilidade com o histórico. O fechamento não declara migração dos dados existentes nem implementação integral do modelo-alvo descrito na documentação técnica.

O aplicativo mantém o caminho atual de acesso ao Firestore protegido por Security Rules. Cloud Functions e ativação do plano Blaze não são requisitos deste MVP.

## Validação disponível

Na implementação da tela de métodos foram aprovados lint, build e 122 testes automatizados em 19 arquivos. A suíte inclui regras de negócio, formulários, hooks, filtros, selects pesquisáveis, confirmação de exclusão e interações de busca/filtro da tela de métodos.

Os testes novos de interação usam jsdom e serviços simulados quando necessário. Eles verificam comportamento, mas não comprovam dimensões, aparência ou responsividade em navegador real. O build ainda emite aviso de bundle acima de 500 kB.

## Encerramento funcional e preparação da entrega

O MVP está concluído no escopo aceito pelo responsável. Permanecem atividades de validação e entrega: conferência visual e responsiva final em navegador, verificação do ambiente publicado, regras e índices do ambiente de destino, preparação da demonstração e entregas acadêmicas. A suíte de Security Rules não foi reexecutada como parte da implementação da tela de métodos.

Este registro não comprova deploy, integração da branch à main, envio de artigo/código ou realização da banca. Essas etapas devem ter evidências próprias.

## Evolução futura

- Categorias e métodos personalizados, preferências de ocultação e gerenciamento dos catálogos.
- Fluxos dedicados e demais melhorias de autenticação previstas no backlog, incluindo verificação de e-mail.
- Dashboard dedicado, relatórios, alertas e demais páginas/estados ainda incompletos.
- Recorrências, contas financeiras e ambientes compartilhados.
- Migração completa do legado e do modelo-alvo financeiro.
- Backend com Cloud Functions, App Check e melhorias operacionais de produção.

Esses itens não são apresentados como funcionalidades concluídas neste marco. As especificações e o backlog anteriores devem ser interpretados à luz desta decisão de escopo.
