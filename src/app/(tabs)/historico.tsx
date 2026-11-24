import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSessoes, useTreinos } from '../../api';
import { CartaoSessao } from '../../components/historico/CartaoSessao';
import { Chip, EstadoLista, estiloConteudoLista, Indicador, Tela } from '../../components/ui';
import {
  agruparPorSemana,
  emToneladas,
  formatarDuracao,
  ItemDoHistorico,
  itensDoHistorico,
  sessoesDosUltimosDias,
  totaisDasSessoes,
} from '../../regras';
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
  // Semanas e sessões numa lista só: a FlatList intercala o título da semana com os cartões.
  const itens = useMemo(() => itensDoHistorico(agruparPorSemana(filtradas, hoje)), [filtradas, hoje]);

  function renderizar({ item }: { item: ItemDoHistorico }) {
    if (item.tipo === 'semana') {
      return (
        <Text accessibilityRole="header" style={estilos.grupo}>
          {item.titulo.toUpperCase()}
        </Text>
      );
    }
    return <CartaoSessao sessao={item.sessao} onPress={() => router.push(`/sessao/${item.sessao.id}`)} />;
  }

  return (
    <Tela rolagem={false} subtitulo={`Últimos ${DIAS_DO_RESUMO} dias`} titulo="Histórico">
      <FlatList
        data={itens}
        keyExtractor={(item) => item.chave}
        renderItem={renderizar}
        ItemSeparatorComponent={() => <View style={{ height: espaco.sm }} />}
        ListHeaderComponent={
          <View style={estilos.cabecalhoLista}>
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
          </View>
        }
        ListEmptyComponent={
          <EstadoLista
            carregando={sessoes.isLoading}
            erro={sessoes.error}
            vazio={!sessoes.isLoading && itens.length === 0}
            mensagemVazio="Nenhum treino registrado ainda. Abra um treino e toque em Iniciar treino."
            aoTentarDeNovo={() => sessoes.refetch()}
          >
            {null}
          </EstadoLista>
        }
        refreshing={sessoes.isRefetching}
        onRefresh={() => sessoes.refetch()}
        contentContainerStyle={estiloConteudoLista}
        showsVerticalScrollIndicator={false}
      />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  cabecalhoLista: { gap: espaco.xl, paddingBottom: espaco.xl },
  filtros: { gap: espaco.sm },
  indicadores: { flexDirection: 'row', gap: 10 },
  grupo: { fontSize: 11, fontWeight: '600', color: cores.textoSecundario, letterSpacing: 0.5, paddingTop: espaco.sm },
});
