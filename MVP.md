# Fechamento do MVP — Vesttor

Data: 13/11/2026. Marco de documentação: versão 0.6.1.

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
