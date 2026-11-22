import { router } from 'expo-router';
import { useMemo } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSessoes, useTreinos } from '../../api';
import { CartaoTreino } from '../../components/treinos/CartaoTreino';
import { ResumoSemana } from '../../components/treinos/ResumoSemana';
import { Botao, EstadoLista, Icone, Tela } from '../../components/ui';
import { formatarDataLonga, resumoDaSemana, treinoPlanejadoPara } from '../../regras';
import { cores, espaco } from '../../tema';

/** RF02 · Meus treinos. Protótipo: tela 02. */
export default function MeusTreinos() {
  const treinos = useTreinos();
  const sessoes = useSessoes();
  const hoje = useMemo(() => new Date(), []);

  const resumo = useMemo(
    () => resumoDaSemana(sessoes.data ?? [], (treinos.data ?? []).flatMap((t) => t.diasDaSemana), hoje),
    [sessoes.data, treinos.data, hoje],
  );

  return (
    <Tela
      subtitulo={formatarDataLonga(hoje)}
      titulo="Meus treinos"
      acao={
        <Pressable accessibilityRole="button" accessibilityLabel="Abrir perfil" onPress={() => router.navigate('/perfil')} style={estilos.avatar}>
          <Icone nome="usuario" />
        </Pressable>
      }
    >
      <ResumoSemana dias={resumo.dias} feitos={resumo.feitos} meta={resumo.meta} />

      <View style={{ gap: espaco.md }}>
        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>Seus treinos</Text>
          {treinos.data ? <Text style={estilos.contagem}>{treinos.data.length} treinos</Text> : null}
        </View>
        <EstadoLista
          carregando={treinos.isLoading}
          erro={treinos.error}
          vazio={treinos.data?.length === 0}
          mensagemVazio="Você ainda não tem treinos. Crie o primeiro."
          aoTentarDeNovo={() => treinos.refetch()}
        >
          <View style={{ gap: 10 }}>
            {treinos.data?.map((treino) => (
              <CartaoTreino
                key={treino.id}
                treino={treino}
                destaque={treinoPlanejadoPara(treino.diasDaSemana, hoje)}
                onPress={() => router.push(`/treino/${treino.id}`)}
              />
            ))}
          </View>
        </EstadoLista>
      </View>

      <Botao
        titulo="+  Novo treino"
        variante="secundario"
        onPress={() => Alert.alert('Novo treino', 'O cadastro de treinos entra junto com a API de treinos.')}
      />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: cores.cartaoElevado, alignItems: 'center', justifyContent: 'center' },
  secao: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tituloSecao: { fontSize: 17, fontWeight: '600', color: cores.texto },
  contagem: { fontSize: 13, color: cores.textoSecundario },
});
