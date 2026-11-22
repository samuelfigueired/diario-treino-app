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
├── app/              rotas (Expo Router): login, (tabs)/index|historico|evolucao|perfil, treino/novo, treino/[id], treino/[id]/editar, treino/[id]/executar, sessao/[id]
├── components/
│   ├── ui/           componentes reutilizáveis (Tela, Botao, Campo, CampoCompacto, Chip, GraficoLinha...)
│   ├── treinos/      ResumoSemana, CartaoTreino, LinhaExercicio, FormularioTreino, SeletorExercicio
│   ├── execucao/     TabelaSeries, CartaoDescanso
│   └── historico/    CartaoSessao
├── api/              cliente HTTP, serviços (uma função por rota) e hooks do TanStack Query
├── regras/           regras puras com testes (cargas, datas, histórico, evolução, execução)
├── hooks/            hooks de interface (useAgora)
├── types/            tipos que espelham a API
└── tema/             cores e espaçamentos do protótipo
```

O app usa os dados reais da API: suba o backend antes (`mvn spring-boot:run` na pasta Backend).

Convenções: [AGENTS.md](AGENTS.md).
