# diario-treino-app

Aplicativo móvel do **Diário de Treino**: registro e acompanhamento de treinos de musculação.

- React Native · Expo · TypeScript · Expo Router · TanStack Query
- API: [diario-treino-api](../Backend)

## Rodando

```cmd
npm install
copy .env.example .env
npx expo start
```

Abra o Expo Go no celular (mesma rede Wi-Fi do computador) e leia o QR code. No `.env`, `EXPO_PUBLIC_API_URL` deve apontar para o IP do computador, não para `localhost`.

## Verificações

```cmd
npm run typecheck
npm test
```

## Estrutura

```
src/
├── app/              rotas (Expo Router): login, (tabs)/treinos|historico|evolucao|perfil, treino/[id]
├── components/ui/    Tela, Botao, Campo, Cartao
├── api/              cliente HTTP, token e chaves do TanStack Query
├── regras/           regras puras com testes (cargas, volume, datas)
├── types/            tipos que espelham a API
└── tema/             cores e espaçamentos do protótipo
```

Convenções: [AGENTS.md](AGENTS.md).
