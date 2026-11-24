# Diário de Treino (app)

Aplicativo móvel para registrar treinos de musculação e acompanhar a evolução das cargas.
Trabalho da disciplina **Desenvolvimento de Aplicações Móveis**.

- **Repositório do app:** https://github.com/samuelfigueired/diario-treino-app
- **Repositório da API (Java Spring Boot):** https://github.com/samuelfigueired/diario-treino-api
- **Versão web publicada (abre no navegador, inclusive no iPhone):** https://diario-treino.expo.app
- **API publicada:** https://diario-treino-api.onrender.com ([Swagger](https://diario-treino-api.onrender.com/swagger-ui.html))

> A API gratuita do Render "dorme" após 15 minutos sem uso. O primeiro acesso pode levar cerca de 1 minuto.

## Como abrir o app

| Opção | Como | Observação |
|---|---|---|
| **Navegador (mais simples)** | Abra https://diario-treino.expo.app no computador ou no celular | Funciona em qualquer aparelho, inclusive iPhone. Crie uma conta na tela de login |
| **Expo Go rodando o código** | Siga "Como rodar" abaixo e leia o QR code do `npx expo start` com o Expo Go | Precisa do Expo Go compatível com o **SDK 58** (Android: Play Store; iPhone: veja a nota abaixo) |
| **Expo Go pela versão publicada (EAS Update)** | No Expo Go, abra `exp://u.expo.dev/2e483760-69cc-4beb-b8f5-00c4ffd4024f?runtime-version=0.1.0&channel-name=preview` | Só abre para contas convidadas no projeto `@samuelfigueiredo/diario-treino` no Expo; para outras contas o Expo Go mostra erro 403 |

> **iPhone:** o Expo Go da App Store pode não acompanhar o SDK mais recente do Expo. Se o Expo Go do iPhone recusar o projeto, use a versão no navegador.

## Como rodar

### Opção 1: usando a API publicada (mais simples)

Requisitos: Node.js 22.13 ou mais novo e o app **Expo Go** no celular.

```cmd
npm install
echo EXPO_PUBLIC_API_URL=https://diario-treino-api.onrender.com> .env
npx expo start
```

Leia o QR code com o Expo Go (Android) ou com a câmera (iPhone). Para abrir no navegador, aperte `w`.

### Opção 2: com a API rodando no computador

1. Na pasta da API (Java 17 e Maven): `mvn spring-boot:run`. Ela sobe em `http://localhost:8080` com banco H2 local.
2. Aqui no app: `copy .env.example .env` e troque `EXPO_PUBLIC_API_URL` pelo **IP do computador** na rede Wi-Fi (ex.: `http://192.168.0.10:8080`). `localhost` não funciona no celular.
3. `npm install` e `npx expo start`.

Crie uma conta na própria tela de login.

### Verificações

```cmd
npm run typecheck
npm test
```

## Requisitos do trabalho

| Requisito | Onde está |
|---|---|
| React Native com Expo | Expo SDK 58, TypeScript (`package.json`, `app.json`) |
| Mínimo de 3 telas com navegação | Expo Router: login, abas (Treinos, Histórico, Evolução, Perfil), detalhe, criação/edição de treino, execução e edição de sessão (`src/app/`) |
| FlatList | Lista de treinos (`src/app/(tabs)/index.tsx`) e histórico por semana (`src/app/(tabs)/historico.tsx`) |
| Consumo de API com loading e erro | `src/api/` (cliente HTTP + hooks do TanStack Query); `EstadoLista` mostra carregando, erro com "Tentar de novo" e vazio (`src/components/ui/EstadoLista.tsx`) |
| Context API | `src/contextos/`: `AutenticacaoContext` (login/saída, protege as abas), `PreferenciasContext` (descanso entre séries) e `TreinoEmAndamentoContext` (treino em execução, compartilhado entre a execução e Meus treinos) |
| Persistência com AsyncStorage | `src/armazenamento/local.ts`: guarda as **preferências** e o **treino em andamento** (as séries voltam se o app fechar no meio do treino). Os treinos e sessões finalizados ficam no banco, pela API |

Por segurança, o **token de login** não vai para o AsyncStorage (que não é criptografado): fica no `expo-secure-store` no celular e no `localStorage` na versão web (`src/api/token.ts`).

## Bibliotecas além das vistas em aula

| Biblioteca | Para quê |
|---|---|
| [Expo Router](https://docs.expo.dev/router/introduction/) | Navegação por arquivos em `src/app/` (pilha, abas e modais), construída sobre o React Navigation |
| [TanStack Query](https://tanstack.com/query/latest) | Chamadas à API com cache, estados de carregando/erro, nova tentativa e atualização das listas depois de salvar |
| [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) | Persistência local das preferências e do treino em andamento |
| [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/) | Guarda o token de login criptografado no aparelho |
| [react-native-svg](https://github.com/software-mansion/react-native-svg) | Ícones e o gráfico de evolução de carga |
| [react-native-web](https://necolas.github.io/react-native-web/) + react-dom | Versão web publicada no Expo Hosting |
| [expo-updates](https://docs.expo.dev/versions/latest/sdk/updates/) | Publicar atualizações (EAS Update) sem gerar novo build |
| [Jest](https://jestjs.io/) + jest-expo | Testes das regras puras em `src/regras/__tests__` |

## Estrutura

```
src/
├── app/              rotas (Expo Router): login, (tabs)/index|historico|evolucao|perfil,
│                     treino/novo, treino/[id], treino/[id]/editar, treino/[id]/executar, sessao/[id]
├── components/
│   ├── ui/           componentes reutilizáveis (Tela, Botao, Campo, Chip, GraficoLinha, EstadoLista...)
│   ├── treinos/      ResumoSemana, CartaoTreino, LinhaExercicio, FormularioTreino, SeletorExercicio
│   ├── execucao/     TabelaSeries, CartaoDescanso
│   └── historico/    CartaoSessao
├── contextos/        Context API: autenticação, preferências e treino em andamento
├── armazenamento/    AsyncStorage (ler/gravar JSON com tratamento de falhas)
├── api/              cliente HTTP, serviços (uma função por rota) e hooks do TanStack Query
├── regras/           regras puras com testes (cargas, datas, histórico, evolução, execução, rascunho)
├── hooks/            hooks de interface (useAgora)
├── types/            tipos que espelham a API
└── tema/             cores e espaçamentos do protótipo
```

Convenções do projeto: [AGENTS.md](AGENTS.md).
