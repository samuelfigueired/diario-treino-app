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
├── app/              rotas (Expo Router): login, (tabs)/index|historico|evolucao|perfil, treino/[id], treino/[id]/executar
├── components/
│   ├── ui/           componentes reutilizáveis (Tela, Botao, Campo, Chip, GraficoLinha...)
│   ├── treinos/      ResumoSemana, CartaoTreino, LinhaExercicio
│   ├── execucao/     TabelaSeries, CartaoDescanso
│   └── historico/    CartaoSessao
├── api/              cliente HTTP, serviços, hooks do TanStack Query e dados de exemplo
├── regras/           regras puras com testes (cargas, datas, histórico, evolução, execução)
├── hooks/            hooks de interface (useAgora)
├── types/            tipos que espelham a API
└── tema/             cores e espaçamentos do protótipo
```

Enquanto o backend não tem os módulos de treino, o app usa dados fictícios (`EXPO_PUBLIC_DADOS_EXEMPLO=true`, padrão).

Convenções: [AGENTS.md](AGENTS.md).
