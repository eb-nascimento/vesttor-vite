# Firebase Emulator Suite

O desenvolvimento local usa os emuladores de Authentication e Firestore. Esse fluxo não ativa o plano Blaze e não grava dados no projeto remoto.

## Pré-requisitos

- Node.js 20 ou superior;
- JDK 21 ou superior, exigido pela versão atual do Firestore Emulator;
- Firebase CLI autenticada no projeto `gestor-financeiro-43435`.

Para conferir o Java instalado:

```bash
java -version
```

Em 01/09/2026, a máquina ainda possuía Java 8. A configuração está pronta, mas o Firestore Emulator só poderá iniciar após a atualização para JDK 21 ou superior.

## Iniciar

Abra dois terminais na raiz do projeto.

No primeiro:

```bash
npm run emulators
```

No segundo:

```bash
npm run dev:emulator
```

A interface dos emuladores fica em `http://127.0.0.1:4000`.

## Portas locais

- Authentication: `127.0.0.1:9099`
- Firestore: `127.0.0.1:8080`
- Emulator UI: `127.0.0.1:4000`

O arquivo `.env.emulator` habilita a conexão local somente quando o Vite é iniciado com `--mode emulator`. O comando normal `npm run dev` continua apontando para o Firebase configurado no `.env`.

## Dados e segurança

Os emuladores iniciam sem dados, oferecendo um estado reproduzível para cada execução. Usuários criados no Authentication Emulator e documentos gravados no Firestore Emulator são locais e desaparecem quando os emuladores são encerrados.

As regras em `firestore.rules` são um protótipo para a coleção `transacoes`. Elas exigem autenticação, isolam documentos por `userId` e validam os campos usados atualmente pelo frontend. As regras precisam ser revisadas e endurecidas antes de qualquer publicação em produção.
