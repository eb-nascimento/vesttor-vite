# Relatório de QA Vesttor

Ambiente: https://dev.vesttor.com | 16/11/2026, horário de Brasília

Avaliação exploratória em conta de teste criada para este trabalho. As telas foram percorridas em navegador interno com largura estreita. Os testes foram pontuais e não representam aprovação para produção.

## Problemas encontrados

### Alta — Exclusão imediata
Em Transações, cliquei em Excluir na despesa fictícia e ela desapareceu imediatamente; o saldo foi atualizado. Não apareceu confirmação ou opção de desfazer visível. Não verifiquei se existe outra forma de recuperação. Reproduzir: criar uma despesa e clicar em excluir. Sugestão: confirmar a operação ou permitir desfazer.

### Média — Erro técnico no login
Com campos vazios, Entrar exibiu “Firebase: Error (auth/invalid-email)”. Esperado: informar quais campos precisam ser preenchidos ou que o e-mail é inválido.

### Observação — Mensagem antiga persiste entre telas
Após provocar erro no login, acessei Esqueci minha senha e a mensagem anterior continuou visível. A mensagem de recuperação também permaneceu ao retornar ao login. A recuperação ainda não está implementada, conforme informado pelo usuário; reavaliar quando esse fluxo entrar no escopo.

### Fora do escopo atual — Recuperação com campo vazio
O usuário informou que a recuperação ainda não está implementada. A observação anterior descreve apenas a interface existente e não deve ser tratada como defeito de uma funcionalidade pronta.

### Baixa — Texto no singular
Com um registro, Transações mostrou “1 transações”. Ajustar concordância.

## Funcionalidades ainda indisponíveis

Dashboard, Minha conta e Configurações apresentam aviso de construção. Categorias e Métodos de pagamento exibem os catálogos, mas criação e gerenciamento estão indicados como funcionalidades futuras. São limitações anunciadas pela interface, não necessariamente bugs; conferir se pertencem ao escopo do lançamento.

## Testes realizados

- Cadastro com e-mail fictício: conta criada e acesso à página inicial realizado.
- Transação vazia: campo de valor recebeu validação obrigatória.
- Despesa de R$ 100 em Alimentação, via Pix: lista e resumo atualizaram corretamente.
- Busca por descrição inexistente: estado vazio e resumo filtrado zerado.
- Edição para R$ 125: lista e resumo passaram a exibir o novo valor.
- Exclusão: registro sumiu e resumo voltou a zero; ver achado de exclusão imediata.
- Planejamento: orçamento variável de Alimentação de R$ 200 mostrou planejado R$ 200 e realizado R$ 100; o saldo projetado ficou em -R$ 200, sem receitas planejadas.
- Próximos vencimentos: exibiu a despesa de teste; a regra para transações já pagas não foi validada.
- Categorias e métodos: catálogos abriram com dados predefinidos.

## Testes pendentes

Receitas, parcelamento, datas, filtros combinados, paginação, edição e exclusão de orçamento, persistência em nova sessão, recuperação por e-mail real, Google, falhas de rede, acessibilidade, outros tamanhos de tela e navegadores, isolamento entre usuários, segurança e desempenho. Não afirmar que esses cenários passaram sem executá-los.

A data padrão observada na transação foi 17/11, enquanto o contexto em Brasília indicava 16/11. Reproduzir com relógio e fuso controlados antes de classificar como defeito.

A transação fictícia foi excluída; a conta de teste e o orçamento fictício de R$ 200 permaneceram no ambiente de desenvolvimento.

## Segunda rodada de testes

### Novos achados

**Média — Busca de categorias exige acento.** Em Categorias, buscar “saude” não retornou resultados, embora “saúde” tenha retornado Saúde e Plano de saúde. Sugestão: normalizar acentos na pesquisa. Reprodução: Menu da conta > Minhas categorias > buscar os dois termos.

**Média — Erro técnico também na senha incorreta.** Login com e-mail da conta de teste e senha errada apresentou “Firebase: Error (auth/invalid-credential)”. Recomenda-se uma mensagem clara, como “E-mail ou senha incorretos”, sem revelar qual dos dois está errado.

**Baixa — Adicionar planejamento de item realizado cria registro de R$ 0 imediatamente.** Em Planejamento, ao clicar em “Adicionar ao planejamento de Salário” na linha ainda não planejada, a interface mudou diretamente para “Editar planejamento”, com R$ 0 e status “Acima do limite”, sem abrir o formulário de valor. Não foi verificada a intenção de produto; revisar se a ação deve abrir o modal e se o status faz sentido para uma receita.

**Observação — Busca de planejamento sem resultado.** Com filtro Entradas e termo inexistente, a tabela ficou sem linhas de resultado e sem mensagem explícita no estado observado. Avaliar incluir orientação para limpar filtros.

### Casos adicionais executados

- Receita: criada receita Salário de R$ 2.500; resumo da página inicial exibiu o valor e o saldo esperado.
- Parcelamento: R$ 100 em 3 parcelas. Prévia mostrou R$ 33,34 na primeira e R$ 33,33 nas demais; novembro, dezembro e janeiro mostraram, respectivamente, parcelas 1/3, 2/3 e 3/3, totalizando R$ 100.
- Filtro por tipo: em janeiro, selecionar Receitas ocultou a parcela de despesa. Limpar filtros restaurou Todos e voltou à competência atual.
- Filtros combinados: Despesas + texto “parcelada” retornou um registro de novembro.
- Validação: despesa com valor zero exibiu “O valor deve ser um número positivo”; descrição vazia recebeu validação obrigatória.
- Planejamento: edição de Alimentação de R$ 200 para R$ 300 refletiu o novo valor e o percentual; receita Salário foi planejada em R$ 3.000 e o saldo projetado ficou em R$ 2.700 com despesa planejada de R$ 300.
- Planejamento: campo de valor vazio foi obrigatório; tentativa de orçamento duplicado da mesma categoria e classificação no mês exibiu orientação para editar o existente.
- Filtro de planejamento por Entradas ocultou a despesa; pesquisa por termo inexistente retirou as linhas.
- Persistência: recarga manteve planejamento e valores; sair e entrar novamente na conta de teste manteve receita e despesa.
- Transações: abertura e fechamento do formulário de nova transação funcionaram.
- Senha incorreta: não autenticou; exibiu mensagem técnica citada acima. Login com senha correta voltou à conta.

### Limites e pendências após esta rodada

Os testes acima cobrem casos específicos, não todas as combinações. Permanecem pendentes paginação com múltiplas páginas, ordenações e todos os seletores, transações em datas de borda e anos bissextos, alterações de parcelas e efeito sobre a série, edição de receita, regras de exclusão e recuperação, orçamento fixo e mudança de competência, recuperação com caixa postal acessível, Google, validação de regras de acesso entre contas, falhas de rede, acessibilidade por teclado e leitor de tela, teste em aparelhos e navegadores distintos e desempenho. Telas ainda em construção não podem ter funcionalidades inexistentes validadas. A data e fuso continuam como hipótese, não defeito confirmado.

A conta de teste agora contém receita fictícia de R$ 2.500, compra fictícia de R$ 100 em três parcelas e planejamentos de Salário de R$ 3.000 e Alimentação de R$ 300. Não remover sem verificar a forma de recuperação.

### Verificações automatizadas locais

- npm run lint: passou.
- npm run test:run: 22 arquivos e 150 testes passaram. A configuração exclui explicitamente os testes de regras do Firestore; eles não foram executados. Esses resultados referem-se ao código local e não garantem que ele seja idêntico à versão publicada no ambiente dev.

## Terceira rodada de testes

### Resultados

- Paginação: com 13 transações na competência, a primeira página exibiu 1 a 10 e a segunda 11 a 13; avançar, voltar e desabilitar os botões nos extremos funcionaram.
- Edição de receita: alterei Salário de R$ 2.500 para R$ 2.600. A lista, o resumo das receitas e o saldo mudaram de acordo.
- Edição de série parcelada: mudei o total de R$ 100 para R$ 120. Novembro, dezembro e janeiro passaram a mostrar R$ 40 em cada uma das três parcelas, mantendo as datas.
- Fim de mês: uma compra parcelada em 31/12/2026, em três vezes, gerou parcelas em 31/12/2026, 31/01/2027 e 28/02/2027, de R$ 30 cada. Ano bissexto continua sem teste na aplicação.
- Planejamento por competência: dezembro exibiu a parcela de R$ 40 e não repetiu os orçamentos de novembro. Criei um planejamento fixo de Alimentação de R$ 500 em dezembro; resumo e linha fixa refletiram R$ 500 planejados e R$ 0 realizados.
- Ordenação por maior valor: em novembro, o resultado móvel exibiu receita de R$ 2.600, parcela de R$ 40 e despesas em ordem decrescente de R$ 11 a R$ 4 na primeira página. As outras ordenações não foram exaustivamente validadas.
- Isolamento visual entre contas: criei uma segunda conta de teste e confirmei que ela abriu sem as transações e os orçamentos da primeira. Isto verifica apenas a interface normal; não comprova as regras de acesso contra chamadas diretas.
- Responsividade: a 390 x 844, examinei Transações e Planejamento visualmente; navegação móvel, resumo e conteúdo estavam visíveis na parte observada. Não equivale a teste completo em aparelhos reais ou em todas as telas.

### Regras do Firestore

A tentativa de executar npm run test:rules não iniciou os testes: o comando tentou obter firebase-tools do registro npm, mas houve falha de DNS/rede ENOTFOUND. Nenhuma conclusão sobre as regras pode ser inferida desse resultado.

### Ainda não executado ou bloqueado

Recuperação com uma caixa de e-mail acessível, login Google com conta disponível, exclusão e recuperação de série e orçamento, ano bissexto no ambiente publicado, cobertura completa de filtros e ordenações, testes por leitor de tela e teclado, outros navegadores e dispositivos, falhas de rede, desempenho e segurança contra acesso direto entre contas. O teste de interface com duas contas não substitui o teste das regras. Não foi feita limpeza dos registros, pois a exclusão não apresenta confirmação visível.

### Dados restantes

Além das contas fictícias, há 11 despesas de paginação de R$ 1 a R$ 11, receita de R$ 2.600, duas séries de parcelas de teste e planejamentos fictícios; tudo criado no ambiente de desenvolvimento.


## Quarta rodada de testes e estado atual

O usuário informou que recuperação de senha ainda não está implementada. Esse fluxo está fora do escopo atual; as observações anteriores são históricas e não representam reprovação de uma funcionalidade entregue. As listas de pendências anteriores registram o estado na data de cada rodada; esta seção prevalece.

- Ano bissexto: no ambiente publicado, selecionei 29/02/2028, registrei despesa de R$ 29 e confirmei o registro com data e valor na competência Fevereiro de 2028.
- Filtro de método: na competência com uma despesa Pix, Cartão de Crédito retornou zero registros e Pix retornou a despesa esperada.
- Teclado: na página Transações, Tab levou ao botão Nova Transação; Enter abriu o formulário, o foco foi para Fechar formulário, e Escape fechou o formulário e devolveu o foco ao botão de origem. Teste parcial, não uma auditoria completa.
- Regras Firestore: tentei usar o Firebase CLI já instalado em vez de baixá-lo. O processo permaneceu sem resposta e foi interrompido; a suíte não produziu resultado. A tentativa anterior com npx falhou por DNS. Sem conclusão sobre regras de segurança.

### Pendências reais após esta rodada

- Login Google: depende de uma sessão Google acessível para completar o fluxo; não foi autenticado.
- Regras do Firestore e acesso direto entre contas: bloqueados neste ambiente; o isolamento visual observado não comprova segurança.
- Exclusão de série e orçamento: não exercitada nesta rodada. A exclusão observada anteriormente foi imediata, sem confirmação ou recuperação visível; requer ação explícita para exclusão permanente mesmo com dados de teste.
- Acessibilidade completa com leitor de tela, testes em navegadores e dispositivos distintos, falhas de rede, desempenho e combinações adicionais de filtros e ordenações: não concluídos.
- Recuperação de senha: funcionalidade ainda não implementada, fora do escopo atual.

Um registro fictício de R$ 29 em 29/02/2028 foi acrescentado à segunda conta de teste.
