import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSessoes, useTreinos } from '../../api';
import { CartaoSessao } from '../../components/historico/CartaoSessao';
import { Chip, EstadoLista, Indicador, Tela } from '../../components/ui';
import { agruparPorSemana, emToneladas, formatarDuracao, sessoesDosUltimosDias, totaisDasSessoes } from '../../regras';
import { cores, espaco } from '../../tema';

const DIAS_DO_RESUMO = 30;

/** RF05 · Histórico de treinos realizados. Protótipo: tela 05. */
export default function Historico() {
  const sessoes = useSessoes();
  const treinos = useTreinos();
  const [filtro, setFiltro] = useState<number | null>(null);
  const hoje = useMemo(() => new Date(), []);

  const filtradas = useMemo(
    () => (sessoes.data ?? []).filter((s) => filtro == null || s.treinoId === filtro),
    [sessoes.data, filtro],
  );
  const totais = totaisDasSessoes(sessoesDosUltimosDias(filtradas, DIAS_DO_RESUMO, hoje));
  const grupos = useMemo(() => agruparPorSemana(filtradas, hoje), [filtradas, hoje]);

  return (
    <Tela subtitulo={`Últimos ${DIAS_DO_RESUMO} dias`} titulo="Histórico">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.filtros}>
        <Chip texto="Todos" selecionado={filtro == null} onPress={() => setFiltro(null)} />
        {treinos.data?.map((t) => (
          <Chip key={t.id} texto={`Treino ${t.letra}`} selecionado={filtro === t.id} onPress={() => setFiltro(t.id)} />
        ))}
      </ScrollView>

      <View style={estilos.indicadores}>
        <Indicador rotulo="Treinos" valor={String(totais.treinos)} />
        <Indicador rotulo="Tempo" valor={formatarDuracao(totais.minutos)} />
        <Indicador rotulo="Volume" valor={emToneladas(totais.volumeKg)} unidade="t" />
      </View>

      <EstadoLista
        carregando={sessoes.isLoading}
        erro={sessoes.error}
        vazio={grupos.length === 0}
        mensagemVazio="Nenhum treino registrado ainda. Abra um treino e toque em Iniciar treino."
        aoTentarDeNovo={() => sessoes.refetch()}
      >
        {grupos.map((grupo) => (
          <View key={grupo.titulo} style={{ gap: espaco.sm }}>
            <Text accessibilityRole="header" style={estilos.grupo}>
              {grupo.titulo.toUpperCase()}
            </Text>
            {grupo.sessoes.map((s) => (
              <CartaoSessao key={s.id} sessao={s} onPress={() => router.push(`/sessao/${s.id}`)} />
            ))}
          </View>
        ))}
      </EstadoLista>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  filtros: { gap: espaco.sm },
  indicadores: { flexDirection: 'row', gap: 10 },
  grupo: { fontSize: 11, fontWeight: '600', color: cores.textoSecundario, letterSpacing: 0.5 },
});
