import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAtualizarSessao, useExcluirSessao, useExercicios, useSessao } from '../../api';
import { Botao, BotaoIcone, CampoCompacto, EstadoLista, Icone, Tela } from '../../components/ui';
import {
  formatarDataLonga,
  formatarDuracao,
  minutosEntre,
  paraSeriesRegistradas,
  podeConcluir,
  removerSerie,
  SerieEmEdicao,
  seriesParaEdicao,
} from '../../regras';
import { cores, espaco, raio } from '../../tema';

type Grupo = { exercicioId: number; series: SerieEmEdicao[] };

const MENSAGEM_SERIE_INVALIDA = 'Confira as séries: toda série precisa de repetições e a carga deve ser um número.';

/** RF05 · Detalhe de um treino realizado, com correção de cargas e repetições. */
export default function DetalheSessao() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const sessaoId = Number(id);
  const sessao = useSessao(sessaoId);
  const exercicios = useExercicios();
  const atualizar = useAtualizarSessao(sessaoId);
  const excluir = useExcluirSessao();
  const [grupos, setGrupos] = useState<Grupo[] | null>(null);

  useEffect(() => {
    if (sessao.data && !grupos) setGrupos(seriesParaEdicao(sessao.data.series));
  }, [sessao.data, grupos]);

  const nomes = useMemo(() => new Map((exercicios.data ?? []).map((e) => [e.id, e.nome])), [exercicios.data]);
  const s = sessao.data;

  function mudar(g: number, i: number, campo: 'carga' | 'repeticoes', valor: string) {
    setGrupos((atual) =>
      atual && atual.map((grupo, gi) => (gi !== g ? grupo : { ...grupo, series: grupo.series.map((serie, si) => (si === i ? { ...serie, [campo]: valor } : serie)) })),
    );
  }

  function remover(g: number, i: number) {
    setGrupos((atual) => atual && atual.map((grupo, gi) => (gi !== g ? grupo : { ...grupo, series: removerSerie(grupo.series, i) })).filter((grupo) => grupo.series.length > 0));
  }

  function salvar() {
    if (!s || !grupos) return;
    if (grupos.some((g) => g.series.some((serie) => !podeConcluir(serie)))) {
      Alert.alert('Séries incompletas', MENSAGEM_SERIE_INVALIDA);
      return;
    }
    atualizar.mutate(
      {
        treinoId: s.treinoId,
        nomeTreino: s.nomeTreino,
        letraTreino: s.letraTreino,
        inicio: s.inicio,
        fim: s.fim,
        series: grupos.flatMap((g) => paraSeriesRegistradas(g.exercicioId, g.series.map((serie) => ({ ...serie, concluida: true })))),
      },
      { onSuccess: () => router.back() },
    );
  }

  function confirmarExclusao() {
    Alert.alert('Excluir este treino do histórico?', 'Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => excluir.mutate(sessaoId, { onSuccess: () => router.back() }) },
    ]);
  }

  return (
    <Tela
      rodape={
        s && grupos ? (
          <View style={{ gap: espaco.sm }}>
            {atualizar.error || excluir.error ? <Text style={estilos.erro}>{(atualizar.error ?? excluir.error)?.message}</Text> : null}
            <Botao titulo="Salvar correções" onPress={salvar} carregando={atualizar.isPending} />
          </View>
        ) : undefined
      }
    >
      <View style={estilos.barra}>
        <BotaoIcone icone="esquerda" rotulo="Voltar" onPress={() => router.back()} />
        <Pressable accessibilityRole="button" onPress={confirmarExclusao} style={estilos.acao}>
          <Text style={estilos.excluir}>Excluir</Text>
        </Pressable>
      </View>

      <EstadoLista carregando={sessao.isLoading || (!!s && !grupos)} erro={sessao.error} vazio={false} mensagemVazio="" aoTentarDeNovo={() => sessao.refetch()}>
        {s && grupos ? (
          <>
            <View style={{ gap: espaco.xs }}>
              <Text style={estilos.letra}>TREINO {s.letraTreino}</Text>
              <Text accessibilityRole="header" style={estilos.titulo}>
                {s.nomeTreino}
              </Text>
              <Text style={estilos.legenda}>
                {formatarDataLonga(new Date(s.inicio))} · {formatarDuracao(minutosEntre(s.inicio, s.fim))}
              </Text>
            </View>
            {grupos.map((grupo, g) => (
              <View key={grupo.exercicioId} style={estilos.cartao}>
                <Text style={estilos.nome}>{nomes.get(grupo.exercicioId) ?? `Exercício ${grupo.exercicioId}`}</Text>
                {grupo.series.map((serie, i) => (
                  <View key={serie.numero} style={estilos.linha}>
                    <Text style={estilos.numero}>{serie.numero}ª</Text>
                    <CampoCompacto rotulo="KG" largura={80} value={serie.carga} onChangeText={(v) => mudar(g, i, 'carga', v)} keyboardType="decimal-pad" placeholder="—" />
                    <CampoCompacto rotulo="REPS" value={serie.repeticoes} onChangeText={(v) => mudar(g, i, 'repeticoes', v)} keyboardType="number-pad" />
                    <Pressable accessibilityRole="button" accessibilityLabel={`Remover série ${serie.numero}`} onPress={() => remover(g, i)} hitSlop={6} style={estilos.remover}>
                      <Icone nome="lixeira" tamanho={18} cor={cores.erro} />
                    </Pressable>
                  </View>
                ))}
              </View>
            ))}
          </>
        ) : null}
      </EstadoLista>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  barra: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: -espaco.md },
  acao: { minHeight: 44, justifyContent: 'center' },
  excluir: { fontSize: 15, fontWeight: '600', color: cores.erro },
  letra: { fontSize: 12, fontWeight: '600', color: cores.destaque, letterSpacing: 1 },
  titulo: { fontSize: 28, fontWeight: '700', color: cores.texto },
  legenda: { fontSize: 13, color: cores.textoSecundario },
  cartao: { backgroundColor: cores.cartao, borderRadius: raio.lg, padding: espaco.lg, gap: espaco.md },
  nome: { fontSize: 15, fontWeight: '600', color: cores.texto },
  linha: { flexDirection: 'row', alignItems: 'flex-end', gap: espaco.md },
  numero: { width: 28, fontSize: 14, fontWeight: '600', color: cores.textoSecundario, paddingBottom: 10 },
  remover: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  erro: { fontSize: 14, color: cores.erro, textAlign: 'center' },
});
