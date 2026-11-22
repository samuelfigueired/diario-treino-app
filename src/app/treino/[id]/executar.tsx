import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRegistrarSessao, useTreino } from '../../../api';
import { CartaoDescanso } from '../../../components/execucao/CartaoDescanso';
import { TabelaSeries } from '../../../components/execucao/TabelaSeries';
import { Botao, BotaoIcone, EstadoLista, Tela } from '../../../components/ui';
import { useAgora } from '../../../hooks/useAgora';
import {
  adicionarSerie,
  cargaParaCampo,
  DESCANSO_PADRAO_SEGUNDOS,
  formatarCarga,
  formatarCronometro,
  indiceSerieAtual,
  paraSeriesRegistradas,
  podeConcluir,
  progressoDaSessao,
  SerieEmEdicao,
  seriesIniciais,
} from '../../../regras';
import { cores, espaco } from '../../../tema';

const MENSAGEM_SERIE_INCOMPLETA = 'Informe as repetições (e a carga, se houver) antes de concluir a série.';

/** RF04 · Registro de séries, repetições e cargas durante o treino. Protótipo: tela 04. */
export default function ExecutarTreino() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const treino = useTreino(Number(id));
  const registrar = useRegistrarSessao();
  const agora = useAgora();

  const [inicio] = useState(() => new Date());
  const [indiceExercicio, setIndiceExercicio] = useState(0);
  const [series, setSeries] = useState<SerieEmEdicao[][] | null>(null);
  const [descansoAte, setDescansoAte] = useState<number | null>(null);

  const t = treino.data;

  useEffect(() => {
    if (!t || series) return;
    setSeries(
      t.exercicios.map((item) =>
        seriesIniciais(
          item.seriesPlanejadas,
          item.repeticoesPlanejadas,
          cargaParaCampo(item.ultimaCargaKg),
          item.ultimaCargaKg == null ? null : `${formatarCarga(item.ultimaCargaKg)} × ${item.repeticoesPlanejadas}`,
        ),
      ),
    );
  }, [t, series]);

  const atual = t?.exercicios[indiceExercicio];
  const seriesAtuais = series?.[indiceExercicio] ?? [];
  const progresso = progressoDaSessao(series ?? []);
  const segundosDescanso = descansoAte == null ? 0 : Math.ceil((descansoAte - agora) / 1000);
  const ultimoExercicio = t ? indiceExercicio === t.exercicios.length - 1 : false;

  function atualizarSeries(transformar: (lista: SerieEmEdicao[]) => SerieEmEdicao[]) {
    setSeries((todas) => todas && todas.map((lista, i) => (i === indiceExercicio ? transformar(lista) : lista)));
  }

  function alternarSerie(indice: number) {
    const serie = seriesAtuais[indice];
    if (!serie.concluida && !podeConcluir(serie)) {
      Alert.alert('Série incompleta', MENSAGEM_SERIE_INCOMPLETA);
      return;
    }
    atualizarSeries((lista) => lista.map((s, i) => (i === indice ? { ...s, concluida: !s.concluida } : s)));
    if (!serie.concluida) setDescansoAte(Date.now() + DESCANSO_PADRAO_SEGUNDOS * 1000);
  }

  function salvar() {
    if (!t || !series) return;
    registrar.mutate(
      {
        treinoId: t.id,
        nomeTreino: t.nome,
        letraTreino: t.letra,
        inicio: inicio.toISOString(),
        fim: new Date().toISOString(),
        series: t.exercicios.flatMap((item, i) => paraSeriesRegistradas(item.exercicio.id, series[i])),
      },
      {
        onSuccess: () => {
          router.dismissAll();
          router.navigate('/historico');
        },
      },
    );
  }

  function finalizar() {
    if (progresso.concluidas === 0) {
      Alert.alert('Sair do treino?', 'Nenhuma série foi concluída, então nada será salvo.', [
        { text: 'Continuar treinando', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => router.back() },
      ]);
      return;
    }
    Alert.alert('Finalizar treino?', `${progresso.concluidas} de ${progresso.total} séries concluídas.`, [
      { text: 'Continuar treinando', style: 'cancel' },
      { text: 'Finalizar e salvar', onPress: salvar },
    ]);
  }

  return (
    <Tela
      rodape={
        t ? (
          <View style={{ gap: espaco.sm }}>
            {registrar.error ? <Text style={estilos.erro}>{registrar.error.message}</Text> : null}
            <Botao
              titulo={ultimoExercicio ? 'Finalizar treino' : 'Próximo exercício  →'}
              variante={ultimoExercicio ? 'primario' : 'secundario'}
              carregando={registrar.isPending}
              onPress={() => (ultimoExercicio ? finalizar() : setIndiceExercicio((i) => i + 1))}
            />
          </View>
        ) : undefined
      }
    >
      <View style={estilos.barra}>
        <BotaoIcone icone="baixo" rotulo="Minimizar treino" onPress={() => router.back()} />
        <View style={{ alignItems: 'center' }}>
          <Text style={estilos.legenda}>{t ? `Treino ${t.letra} · em andamento` : 'Treino em andamento'}</Text>
          <Text style={estilos.cronometro} accessibilityLabel={`Tempo de treino ${formatarCronometro((agora - inicio.getTime()) / 1000)}`}>
            {formatarCronometro((agora - inicio.getTime()) / 1000)}
          </Text>
        </View>
        <Pressable accessibilityRole="button" onPress={finalizar} style={estilos.finalizar}>
          <Text style={estilos.finalizarTexto}>Finalizar</Text>
        </Pressable>
      </View>

      <EstadoLista carregando={treino.isLoading || (!!t && !series)} erro={treino.error} vazio={false} mensagemVazio="">
        {t && atual ? (
          <>
            <View style={{ gap: espaco.sm }}>
              <View style={estilos.linha}>
                <Text style={estilos.legenda}>
                  Exercício {indiceExercicio + 1} de {t.exercicios.length}
                </Text>
                <Text style={estilos.legenda}>
                  {progresso.concluidas} de {progresso.total} séries
                </Text>
              </View>
              <View style={estilos.trilho} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: progresso.total, now: progresso.concluidas }}>
                <View style={[estilos.barraProgresso, { width: `${(progresso.concluidas / Math.max(1, progresso.total)) * 100}%` }]} />
              </View>
            </View>

            <View style={{ gap: 6 }}>
              <Text accessibilityRole="header" style={estilos.nomeExercicio}>
                {atual.exercicio.nome}
              </Text>
              <Text style={estilos.legenda}>
                Meta {atual.seriesPlanejadas} × {atual.repeticoesPlanejadas}
                {atual.ultimaCargaKg != null ? `  ·  Última vez ${formatarCarga(atual.ultimaCargaKg)}` : ''}
              </Text>
            </View>

            <TabelaSeries
              series={seriesAtuais}
              indiceAtual={indiceSerieAtual(seriesAtuais)}
              aoMudar={(i, campo, valor) => atualizarSeries((lista) => lista.map((s, j) => (j === i ? { ...s, [campo]: valor } : s)))}
              aoAlternar={alternarSerie}
              aoAdicionar={() => atualizarSeries(adicionarSerie)}
            />

            {segundosDescanso > 0 ? (
              <CartaoDescanso
                segundosRestantes={segundosDescanso}
                aoAjustar={(delta) => setDescansoAte((fim) => (fim == null ? fim : fim + delta * 1000))}
                aoPular={() => setDescansoAte(null)}
              />
            ) : null}

            {indiceExercicio > 0 ? (
              <Pressable accessibilityRole="button" onPress={() => setIndiceExercicio((i) => i - 1)} style={estilos.anterior}>
                <Text style={estilos.legenda}>← Exercício anterior</Text>
              </Pressable>
            ) : null}
          </>
        ) : null}
      </EstadoLista>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  barra: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: -espaco.md },
  linha: { flexDirection: 'row', justifyContent: 'space-between' },
  legenda: { fontSize: 13, fontWeight: '500', color: cores.textoSecundario },
  cronometro: { fontSize: 20, fontWeight: '700', color: cores.texto, fontVariant: ['tabular-nums'] },
  finalizar: { minHeight: 44, paddingHorizontal: 14, borderRadius: 22, backgroundColor: cores.destaque, justifyContent: 'center' },
  finalizarTexto: { fontSize: 13, fontWeight: '600', color: cores.textoSobreDestaque },
  trilho: { height: 6, borderRadius: 3, backgroundColor: cores.cartaoElevado, overflow: 'hidden' },
  barraProgresso: { height: 6, borderRadius: 3, backgroundColor: cores.destaque },
  nomeExercicio: { fontSize: 24, fontWeight: '700', color: cores.texto },
  anterior: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  erro: { fontSize: 14, color: cores.erro, textAlign: 'center' },
});
