# Instruções para agentes

Estas orientações valem para todo o projeto **Diário de Treino**: o backend (`Backend/`, repositório `diario-treino-api`) e o aplicativo móvel (`Mobile/`, repositório `diario-treino-app`). Siga-as ao analisar, sugerir ou alterar código. O mesmo arquivo fica na raiz do workspace (`C:\Projetos\DiarioTreino`) e na raiz de cada repositório; ao mudar um, atualize os três.

## Idioma e comunicação

- Responda sempre em português do Brasil, inclusive em explicações, sugestões, mensagens de erro e textos de tela.
- Preserve nomes de APIs, identificadores, comandos e termos técnicos no idioma original quando isso melhorar a precisão; explique-os em português quando necessário.
- Mensagens para o usuário final (exceções de regra de negócio, alertas, textos de tela) são curtas, em português, e dizem o que fazer ("Informe a carga usada na série."), nunca detalhes técnicos.

## Projeto

### Visão geral

- Aplicativo móvel de diário de treino de musculação: o praticante cria e organiza seus treinos, associa exercícios, registra séries, repetições e cargas durante a execução e consulta o histórico e a evolução das cargas.
- Requisitos funcionais (fonte: proposta do projeto):

| ID | Requisito |
|---|---|
| RF01 | Cadastro e autenticação de usuários |
| RF02 | Criação e organização de treinos personalizados |
| RF03 | Cadastro de exercícios e associação aos treinos |
| RF04 | Registro de séries, repetições e cargas dos exercícios |
| RF05 | Consulta ao histórico de treinos realizados |
| RF06 | Informações sobre a evolução das cargas e o desempenho do usuário |

- Requisitos não funcionais: RNF01 (segurança: exige autenticação para dados pessoais e registros), RNF02 (integridade: usuários, treinos, exercícios e registros sempre associados corretamente), RNF03 (usabilidade: registro e consulta claros no celular), RNF04 (manutenibilidade: código organizado em componentes).
- **Isolamento por usuário**: toda entidade que pertence a alguém (treino, exercício personalizado, sessão, série) estende `EntidadeDoUsuario`, e o `usuarioId` vem do usuário logado (JWT), **nunca** do corpo da requisição.
- Protótipo das telas: arquivo "Diário de Treino — Protótipo" no Figma (login, meus treinos, detalhe do treino, registro de séries, histórico e evolução). Siga-o ao criar telas.
- Ambiente de desenvolvimento: Windows/cmd, pasta `C:\Projetos\DiarioTreino`.
- Produção: ainda não definida. Não presuma servidor, nuvem nem loja de aplicativos.

### Backend (`Backend/`)

- Spring Boot 3.5, Java 17 (`java.version` do `pom.xml`), MapStruct 1.6, JJWT 0.12, Maven (`mvn` instalado; não há wrapper). Banco: PostgreSQL em produção, H2 em memória nos testes e no desenvolvimento. API REST com JSON.
- Compilar e testar:

```cmd
cd Backend
mvn test
```

- Só um conjunto de testes:

```cmd
mvn test -Dtest="NomeDaClasse*Test" -Dsurefire.failIfNoSpecifiedTests=false
```

- Subir a API em desenvolvimento (porta 8080, H2 em memória): `mvn spring-boot:run`. Documentação da API: `http://localhost:8080/swagger-ui.html`. O banco de desenvolvimento é um H2 em arquivo (`Backend/dados/`), então os dados continuam depois de reiniciar. Dados fictícios só com `APP_DEMO=true` (usuária `mariana.rocha@exemplo.com.br` / `treino2026`); os testes ligam isso pelo perfil `test`.
- Postgres local opcional: `docker compose up -d` na pasta `Backend` e `mvn spring-boot:run -Dspring-boot.run.profiles=prod` com as variáveis `APP_DB_URL`, `APP_DB_USUARIO` e `APP_DB_SENHA`.
- Arquitetura e convenções de pastas: **leia `Backend/ARQUITETURA.md` antes de criar um módulo**. Ela vale sobre este arquivo em caso de conflito.

### Aplicativo (`Mobile/`)

- React Native com Expo (SDK atual do `package.json`), TypeScript, Expo Router (rotas por arquivo em `src/app/`) e TanStack Query.
- Comandos:

```cmd
cd Mobile
npm install
npx expo start
npm run typecheck
npm test
```

- Para testar no celular, use o Expo Go na mesma rede do computador e aponte `EXPO_PUBLIC_API_URL` (arquivo `.env`) para o IP do computador, não para `localhost`.
- Pastas:
  - `src/app/`: só rotas e composição de telas; nada de regra de negócio.
  - `src/types`: tipos que espelham a API.
  - `src/api`: cliente `criarApi` com `get/post/put/patch/del`; `servicos.ts` (uma função por chamada da API), `consultas.ts` (hooks do TanStack Query: `useTreinos`, `useSessoes`, `useRegistrarSessao`...) e `chaves.ts`. Telas usam só os hooks, nunca `fetch` nem `api` direto.
  - O app usa só dados reais da API (não há dados fictícios). Rota nova: função em `servicos.ts`, hook em `consultas.ts` e invalidação das chaves afetadas.
  - `src/regras`: regras puras (cargas, volume, datas, histórico, evolução, execução, validação), sempre com teste em `src/regras/__tests__`. Toda conta ou formatação sai das telas e vem para cá.
  - `src/components/ui`: componentes reutilizáveis (`Tela`, `Botao`, `BotaoIcone`, `Campo`, `Cartao`, `Chip`, `Segmentado`, `Indicador`, `Distintivo`, `Icone`, `GraficoLinha`, `EstadoLista`). Use-os antes de criar outros.
  - `src/components/<funcionalidade>` (`treinos`, `execucao`, `historico`): partes de tela específicas de uma funcionalidade (ex.: `FormularioTreino`, `SeletorExercicio`).
  - `src/contextos`: Context API do estado compartilhado (login, preferências, treino em andamento).
  - `src/armazenamento`: acesso ao `AsyncStorage` (ler, gravar e apagar JSON com tratamento de falhas).
  - `src/hooks`: hooks de interface sem regra de negócio (ex.: `useAgora` para cronômetros).
  - `src/tema`: cores, espaçamentos e tipografia do protótipo. Não use cor solta no código das telas.
- Instale dependências com `npx expo install <pacote>` (nunca `npm install <pacote>` direto), para manter as versões compatíveis com o SDK.
- **O Expo muda a cada SDK: não confie na memória.** Antes de usar uma API do Expo, React Native ou EAS, confira a versão de `expo` no `package.json` e leia a documentação dessa versão (`https://docs.expo.dev/versions/v<versão>.0.0/` e `https://docs.expo.dev/llms.txt`).
- As pastas `ios/` e `android/` são geradas (Continuous Native Generation): nunca as crie nem edite à mão; configure pelo `app.json` e por config plugins.
- O Expo Go só traz os módulos nativos do SDK. Biblioteca com código nativo fora dele exige development build (`npx expo run:android` ou `npx eas-cli@latest build --profile development`).
- Node 22.13 ou superior (exigência do SDK).

### Fluxo de entrega

- `testar.bat` (raiz do workspace): roda `mvn test` no backend, `npm run typecheck` e `npm test` no app e grava `resultado-testes.txt`.
- `publicar.bat "mensagem"` (raiz do workspace): commit e push dos dois repositórios com a mesma mensagem.
- Nunca rode push, deploy ou publicação na loja sem pedido explícito.

## Regras do backend

### Estrutura e camadas

- Siga `Backend/ARQUITETURA.md` (mesmo padrão do backend Wezt): cada módulo em `core/<modulo>/` com `controllers/`, `services/` (interface `<Modulo>Service`) e `services/impl/` (`<Modulo>ServicePadrao`), `domains/dtos/`, `domains/mappers/` e `repositorys/`.
- Controller só valida (`@Valid`) e delega; depende da interface do service. Regra de negócio no `ServicePadrao`.
- DTOs são **classes** Lombok (`@Data @NoArgsConstructor @AllArgsConstructor`), nunca `record`: `<Nome>InDTO` para entrada e `<Nome>OutDTO` para saída. Controller nunca recebe nem devolve entidade.
- Mappers MapStruct com `@Mapper(config = MapperConfigPadrao.class)` estendendo `BaseMapper<Entidade, InDTO, OutDTO>` (ou `SaidaMapper<Entidade, OutDTO>` quando só há saída). Dados de outras tabelas: método `default` no mapper chamado pelo service.
- Cadastro simples estende `CrudServicePadrao` e sobrescreve só `validar()`, `paraSaida()` ou `excluir()`.
- Repositório de entidade do usuário estende `RepositorioDoUsuario` e busca por `findByIdAndUsuarioId`. Nunca use `findById` em dado de usuário sem conferir o `usuarioId`: ver ou alterar o treino de outra pessoa é o defeito mais grave possível neste sistema.
- Erros: `BadRequestException` (400), `NotFoundException(recurso, id)` (404) e `MuitasTentativasException` (429), tratados no `GlobalExceptionHandler` como `ProblemDetail`. Recurso de outro usuário responde 404, não 403, para não revelar que existe.
- Um método `@Transactional` chamado de dentro da própria classe não abre transação.

### Banco e esquema

- O esquema é gerado pelo Hibernate (`ddl-auto=update`), sem Flyway por enquanto. Por isso:
  - coluna nova em tabela que já tem dados deve aceitar nulo: use tipos wrapper (`Boolean`, `Integer`) em vez de primitivos;
  - renomear ou apagar coluna não é feito pelo Hibernate: avise e proponha o script.
- Cargas em `BigDecimal` (escala 2, em kg); repetições e séries em `Integer`. Nunca use `double` para carga.
- Evite nomes de campo com uma letra minúscula seguida de maiúscula (`kCarga`, `nReps`): o getter gerado pelo Lombok confunde o Jackson. Prefira `cargaKg`, `repeticoes`.

### Segurança

- Rotas novas em `/api/**` exigem login (JWT no cabeçalho `Authorization: Bearer`). Só `/api/auth/login`, `/api/auth/cadastro`, `/api/saude` e a documentação da API são públicas, listadas no `SecurityConfig`.
- Senhas com `BCryptPasswordEncoder`; nunca devolva hash de senha pela API.
- Rota pública nova (login, cadastro, recuperação de senha) precisa de limite de tentativas.
- Segredos só por variável de ambiente (`APP_*`), nunca no `application.yml` versionado.

### Dados pessoais e LGPD

- E-mail, nome, peso, medidas e histórico de treino são dados pessoais. Não os registre em log nem os envie para serviços de terceiros.
- O usuário deve poder excluir a conta e todos os seus registros.

## Regras do aplicativo

- Telas seguem o protótipo do Figma: tema escuro, destaque verde-limão, alvos de toque com pelo menos 44 px.
- Estado do servidor com TanStack Query (`useQuery`/`useMutation`), com chaves em `src/api/chaves.ts`. Não duplique dados da API em estado local.
- Token de acesso guardado com `expo-secure-store`, nunca em `AsyncStorage`.
- `AsyncStorage` (via `src/armazenamento/local.ts`) só para dados do aparelho que não vão para o banco: preferências (descanso entre séries) e o rascunho do treino em andamento. Todo valor lido passa por uma validação de `src/regras` antes de ser usado.
- Estado compartilhado entre telas com Context API em `src/contextos` (`useAutenticacao`, `usePreferencias`, `useTreinoEmAndamento`). Dados da API continuam no TanStack Query, não em contexto.
- Listas de tamanho variável com `FlatList` (com `<Tela rolagem={false}>`), nunca `.map()` dentro de `ScrollView`.
- Todo campo numérico de carga aceita vírgula decimal (`62,5`) e é convertido por função de `src/regras`.
- Textos de tela em português, sem jargão técnico. Estados de carregando, vazio e erro em toda lista.

## Textos reutilizados

- Ao criar textos fixos usados em mais de um ponto (mensagens, rótulos, descrições), extraia-os para uma constante com nome claro, em vez de repetir literais.
- Mantenha a constante no escopo mais restrito que permita o reuso. Em Java, prefira `private static final String`; use uma classe compartilhada apenas quando houver reuso real entre classes. No app, rótulos de status ficam em `src/regras`.
- Não extraia para constantes textos usados uma única vez nem valores dinâmicos.

## Logs

- Use SLF4J (`@Slf4j` do Lombok), nunca `System.out` ou `System.err`. No app, não deixe `console.log` no código entregue.
- Níveis: `INFO` para eventos relevantes do fluxo normal, `WARN` para situações inesperadas que permitem continuidade, `ERROR` para falhas que exigem atenção.
- Inclua contexto útil (ids de usuário, treino, sessão), mas nunca senhas, tokens, e-mails ou outros dados pessoais.
- Não adicione dependências de logging.

## Fusos horários

- O fuso da operação é `America/Sao_Paulo` (IANA), na constante `Fusos.SAO_PAULO`. Use-o no cálculo de "hoje", da semana corrente e em textos de data. Nunca use abreviações (BRT) nem deslocamentos fixos (`-03:00`) para calcular datas.
- Instantes (início e fim da sessão de treino, criação) são `Instant`, em UTC. Datas de calendário (dia do treino, nascimento) são `LocalDate`.
- Na API, use ISO 8601 com deslocamento explícito (ex.: `2026-11-19T07:15:00-03:00`). No app, `isoData` de `src/regras` gera a data no fuso local, sem passar por UTC.

## Testes

### Regras obrigatórias para testes novos

- Backend: JUnit 5 (`org.junit.jupiter.api.Test` e `org.junit.jupiter.api.DisplayName`) e AssertJ.
- **Todo teste novo tem `@DisplayName`** com descrição objetiva, em português, que reflita exatamente o cenário. Quando valida regra de negócio, o `@DisplayName` descreve a regra e o cenário em que ela se aplica.
- **Todo teste novo tem os blocos `// given`, `// when` e `// then`**, mesmo quando a lógica for simples.
- Nomes de métodos em português, específicos: `deveXxxQuandoYyy` ou `aoFazerX_deveY`.
- App: Jest (`jest-expo`), com `describe`/`it` em português e os mesmos blocos `// given`, `// when`, `// then`.
- Prefira testes focados em comportamento, com asserts claros e casos de borda relevantes (carga zerada, série sem repetições, virada de semana e de ano, treino de outro usuário).

### Padrão técnico

- **Regra pura** (cálculo de volume, carga máxima, conversão): teste unitário sem Spring, chamando o método estático ou a classe diretamente.
- **Service com dependências**: `@ExtendWith(MockitoExtension.class)`, `@Mock` / `@InjectMocks`, fixtures com `new` + setters.
- **Fluxo pela API**: estenda `ApiTestBase` (`@SpringBootTest` + MockMvc, com `tokenDemo()` e `tokenNovoUsuario()`). Sempre teste também o acesso sem login e o acesso de outro usuário quando a rota for nova.
- O H2 dos testes é **compartilhado** entre as classes: não dependa da ordem dos testes, use `tokenNovoUsuario()` para criar ou alterar dados e deixe a usuária de demonstração só para leitura.
- **App**: regras de `src/regras` com Jest em `src/regras/__tests__/*.test.ts`.

### Dados de teste

- Não use valores genéricos ("Fulano", "teste", "abc", `42L`, `new Date(0L)`).
- Use dados fictícios no formato real do domínio, por exemplo:
  - usuária "Mariana Alves Rocha", e-mail `mariana.rocha@exemplo.com.br`;
  - treino "Treino A · Peito e Tríceps", exercício "Supino reto com barra";
  - série com `4` séries de `10` repetições e carga `62.5` kg; descanso de `90` segundos;
  - datas reais no fuso de São Paulo (`2026-11-03`).
- **Nunca** use dados de pessoas reais.
- O nulo testado deve ser `null` de fato; texto vazio e só espaços são outros ramos.

### Exemplo

```java
@Test
@DisplayName("O volume da série é a carga multiplicada pelas repetições")
void deveCalcularVolumeQuandoSerieTemCargaERepeticoes() {
    // given
    var carga = new BigDecimal("62.50");
    var repeticoes = 10;

    // when
    var volume = CalculoVolume.daSerie(carga, repeticoes);

    // then
    assertThat(volume).isEqualByComparingTo("625.00");
}
```

## Mensagens de commit

### Formato

```
<emoji> <tipo>: [#<número_do_card>] <descrição curta da alteração>
```

- Toda mensagem de commit tem **um** emoji principal. Nunca sugira mensagem sem emoji.
- A palavra-chave vem logo após o emoji, seguida de `:`.
- Descrição curta, objetiva, em português do Brasil, com verbo no presente (adiciona, corrige, ajusta, remove, atualiza, refatora, implementa).
- Não termine com ponto.
- Não use mensagens genéricas como "ajustes", "alterações", "correções" ou "update".
- Com mais de uma alteração, escolha o tipo da mudança principal.
- Inclua o número do card/issue quando houver; sem card, omita o `#`.
- O `publicar.bat` usa a mesma mensagem nos dois repositórios: escreva-a pensando nos dois lados quando a mudança for de ponta a ponta.
- Ao sugerir um commit, apresente de preferência só a mensagem pronta.

### Exemplos

```
✨ feat: adiciona cadastro de treinos personalizados
✨ feat: implementa registro de séries durante o treino
🐛 fix: corrige cálculo da carga máxima na evolução
✅ test: adiciona testes do isolamento de treinos entre usuários
🔒️ fix: limita tentativas de login por e-mail
♻️ refactor: separa o cálculo de volume em regra pura
💄 feat: aplica o tema escuro do protótipo na tela de histórico
📚 docs: adiciona instruções para agentes
🔧 chore: ajusta variáveis de ambiente do banco
📦 build: adiciona dependência do TanStack Query
```

### Tipos

| Tipo | Emoji | Palavra-chave |
|---|---|---|
| Acessibilidade | ♿ | |
| Adicionando um teste | ✅ | test |
| Adicionando dependência | ➕ | build |
| Alterações de revisão de código | 👌 | style |
| Animações e transições | 💫 | |
| Bugfix | 🐛 | fix |
| Comentários | 💡 | docs |
| Commit inicial | 🎉 | init |
| Configuração | 🔧 | chore |
| Deploy | 🚀 | |
| Documentação | 📚 | docs |
| Em progresso | 🚧 | |
| Estilização de interface | 💄 | feat |
| Infraestrutura | 🧱 | ci |
| Lista de ideias / tasks | 🔜 | |
| Mover/Renomear | 🚚 | chore |
| Novo recurso | ✨ | feat |
| Package.json / build | 📦 | build |
| Performance | ⚡ | perf |
| Refatoração | ♻️ | refactor |
| Limpeza de código | 🧹 | cleanup |
| Removendo arquivo | 🗑️ | remove |
| Removendo dependência | ➖ | build |
| Responsividade | 📱 | |
| Revertendo mudanças | 💥 | fix |
| Segurança | 🔒️ | |
| Tag de versão | 🔖 | |
| Testes | 🧪 | test |
| Texto | 📝 | |
| Tipagem | 🏷️ | |
| Tratamento de erros | 🥅 | fix |
| Dados | 🗃️ | raw |

## Análise de demandas

Use esta seção quando for pedida a avaliação de uma demanda antes da implementação.

### Papel

Você é um Analista de Sistemas Sênior e Desenvolvedor Full Stack (Java/Spring Boot e React Native/TypeScript) que conhece a rotina de quem treina musculação. A tarefa é avaliar se a demanda está pronta para implementação, antes de qualquer código ser escrito.

### Regras da análise

- Escopo: backend, banco, regras de negócio, telas do app e testes.
- Considere sempre: isolamento entre usuários, uso no celular durante o treino (pouco tempo, uma mão, conexão instável), integridade dos registros já feitos e LGPD.
- Não presuma regras ausentes. Toda informação necessária que não estiver na demanda deve ser registrada como **[A ESCLARECER]**, com a pergunta objetiva a ser feita.
- Não invente nomes de classes, métodos ou tabelas. Indique apenas o TIPO de componente a investigar (ex.: "consultas que calculam a carga máxima").
- Separe sempre: **(D)** definido na demanda, **(T)** consequência técnica provável, **(E)** a esclarecer.
- Seja direto. Priorize o que bloqueia ou arrisca a implementação.

### Estrutura da resposta

1. **Resumo** (máx. 10 linhas): problema, nova regra, o que é afetado e o que não é.
2. **Matriz de clareza**: tabela `Requisito | Status (✅ Claro / ⚠️ Parcial / ❌ Não definido) | O que falta definir`.
3. **Impacto nos dados existentes**: treinos, exercícios, sessões e séries já registrados; o que muda no histórico e na evolução.
4. **Isolamento entre usuários**: onde a mudança pode expor ou alterar dados de outra pessoa.
5. **Impacto técnico**: listas separadas de **Backend**, **Banco** e **App**, com o que verificar e o risco de cada item.
6. **Estratégia de testes**: cenários por regra nova, não regressão, isolamento entre usuários e fluxo de ponta a ponta.
7. **Conclusão**: veredito (Pronta / Pronta com ressalvas / Não pronta), perguntas [A ESCLARECER] priorizadas e principais riscos (máx. 5).
