import { router } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSessoes, useTreinos } from '../../api';
import { CartaoTreino } from '../../components/treinos/CartaoTreino';
import { ResumoSemana } from '../../components/treinos/ResumoSemana';
import { Botao, Cartao, EstadoLista, estiloConteudoLista, Icone, Tela } from '../../components/ui';
import { useTreinoEmAndamento } from '../../contextos';
import { formatarDataLonga, progressoDaSessao, resumoDaSemana, treinoPlanejadoPara } from '../../regras';
import { cores, espaco } from '../../tema';

/** Espaço entre os cartões da lista. */
function Separador() {
  return <View style={{ height: 10 }} />;
}

/** RF02 · Meus treinos. Protótipo: tela 02. */
export default function MeusTreinos() {
  const treinos = useTreinos();
  const sessoes = useSessoes();
  const { rascunho } = useTreinoEmAndamento();
  const hoje = useMemo(() => new Date(), []);

  const resumo = useMemo(
    () => resumoDaSemana(sessoes.data ?? [], (treinos.data ?? []).flatMap((t) => t.diasDaSemana), hoje),
    [sessoes.data, treinos.data, hoje],
  );

  const cabecalhoDaLista = (
    <View style={estilos.cabecalhoLista}>
      {rascunho ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Continuar treino ${rascunho.letraTreino} em andamento`}
          onPress={() => router.push(`/treino/${rascunho.treinoId}/executar`)}
        >
          <Cartao>
            <View style={estilos.andamento}>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={estilos.andamentoTitulo}>Treino {rascunho.letraTreino} em andamento</Text>
                <Text style={estilos.contagem}>
                  {progressoDaSessao(rascunho.series).concluidas} de {progressoDaSessao(rascunho.series).total} séries · toque para continuar
                </Text>
              </View>
              <Icone nome="direita" cor={cores.destaque} />
            </View>
          </Cartao>
        </Pressable>
      ) : null}
      <ResumoSemana dias={resumo.dias} feitos={resumo.feitos} meta={resumo.meta} />
      <View style={estilos.secao}>
        <Text style={estilos.tituloSecao}>Seus treinos</Text>
        {treinos.data ? <Text style={estilos.contagem}>{treinos.data.length} treinos</Text> : null}
      </View>
    </View>
  );

  return (
    <Tela
      rolagem={false}
      subtitulo={formatarDataLonga(hoje)}
      titulo="Meus treinos"
      acao={
        <Pressable accessibilityRole="button" accessibilityLabel="Abrir perfil" onPress={() => router.navigate('/perfil')} style={estilos.avatar}>
          <Icone nome="usuario" />
        </Pressable>
      }
    >
      <FlatList
        data={treinos.data ?? []}
        keyExtractor={(treino) => String(treino.id)}
        renderItem={({ item }) => (
          <CartaoTreino
            treino={item}
            destaque={treinoPlanejadoPara(item.diasDaSemana, hoje)}
            onPress={() => router.push(`/treino/${item.id}`)}
          />
        )}
        ItemSeparatorComponent={Separador}
        ListHeaderComponent={cabecalhoDaLista}
        ListEmptyComponent={
          <EstadoLista
            carregando={treinos.isLoading}
            erro={treinos.error}
            vazio={treinos.data?.length === 0}
            mensagemVazio="Você ainda não tem treinos. Toque em Novo treino para montar o primeiro."
            aoTentarDeNovo={() => treinos.refetch()}
          >
            {null}
          </EstadoLista>
        }
        ListFooterComponent={
          <View style={{ paddingTop: espaco.xl }}>
            <Botao titulo="+  Novo treino" variante="secundario" onPress={() => router.push('/treino/novo')} />
          </View>
        }
        refreshing={treinos.isRefetching}
        onRefresh={() => {
          treinos.refetch();
          sessoes.refetch();
        }}
        contentContainerStyle={estiloConteudoLista}
        showsVerticalScrollIndicator={false}
      />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: cores.cartaoElevado, alignItems: 'center', justifyContent: 'center' },
  cabecalhoLista: { gap: espaco.xl, paddingBottom: espaco.md },
  andamento: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
  andamentoTitulo: { fontSize: 15, fontWeight: '600', color: cores.destaque },
  secao: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tituloSecao: { fontSize: 17, fontWeight: '600', color: cores.texto },
  contagem: { fontSize: 13, color: cores.textoSecundario },
});
