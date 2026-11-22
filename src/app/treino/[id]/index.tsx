import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSessoes, useTreino } from '../../../api';
import { LinhaExercicio } from '../../../components/treinos/LinhaExercicio';
import { Botao, BotaoIcone, Chip, EstadoLista, Icone, Tela } from '../../../components/ui';
import {
  formatarDataCurta,
  formatarNumero,
  ordenarRecentes,
  resumoDaSessao,
  textoDiasDaSemana,
  textoQuantidadeExercicios,
} from '../../../regras';
import { cores, espaco, raio } from '../../../tema';

/** RF03 · Detalhe do treino e exercícios associados. Protótipo: tela 03. */
export default function DetalheTreino() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const treino = useTreino(Number(id));
  const sessoes = useSessoes();

  const ultimoRegistro = useMemo(() => {
    const ultima = ordenarRecentes(sessoes.data ?? []).find((s) => s.treinoId === Number(id));
    if (!ultima) return null;
    return `Último registro: ${formatarDataCurta(new Date(ultima.inicio))} · ${formatarNumero(resumoDaSessao(ultima).volumeKg, 0)} kg de volume`;
  }, [sessoes.data, id]);

  const t = treino.data;

  return (
    <Tela
      rodape={
        t && t.exercicios.length > 0 ? (
          <Botao titulo="Iniciar treino" onPress={() => router.push(`/treino/${t.id}/executar`)} />
        ) : undefined
      }
    >
      <View style={estilos.barra}>
        <BotaoIcone icone="esquerda" rotulo="Voltar" onPress={() => router.back()} />
        <Pressable accessibilityRole="button" onPress={() => router.push(`/treino/${id}/editar`)} style={estilos.acao}>
          <Text style={estilos.link}>Editar</Text>
        </Pressable>
      </View>

      <EstadoLista carregando={treino.isLoading} erro={treino.error} vazio={false} mensagemVazio="" aoTentarDeNovo={() => treino.refetch()}>
        {t ? (
          <>
            <View style={{ gap: espaco.sm }}>
              <Text style={estilos.letra}>TREINO {t.letra}</Text>
              <Text accessibilityRole="header" style={estilos.titulo}>
                {t.nome}
              </Text>
              <View style={estilos.chips}>
                <Chip forma="etiqueta" texto={textoQuantidadeExercicios(t.exercicios.length)} />
                {t.duracaoEstimadaMin ? <Chip forma="etiqueta" texto={`~${t.duracaoEstimadaMin} min`} /> : null}
                <Chip forma="etiqueta" texto={textoDiasDaSemana(t.diasDaSemana)} />
              </View>
              {ultimoRegistro ? <Text style={estilos.registro}>{ultimoRegistro}</Text> : null}
            </View>

            <View style={{ gap: espaco.sm }}>
              <View style={estilos.secao}>
                <Text style={estilos.tituloSecao}>Exercícios</Text>
              </View>
              {t.exercicios.length === 0 ? (
                <Text style={estilos.registro}>Este treino ainda não tem exercícios. Adicione para poder iniciar.</Text>
              ) : null}
              {t.exercicios.map((item) => (
                <LinhaExercicio key={item.id} item={item} />
              ))}
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push(`/treino/${id}/editar`)}
                style={estilos.adicionar}
              >
                <Icone nome="mais" tamanho={18} cor={cores.textoSecundario} />
                <Text style={estilos.adicionarTexto}>Adicionar exercício</Text>
              </Pressable>
            </View>
          </>
        ) : null}
      </EstadoLista>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  barra: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: -espaco.md },
  acao: { minHeight: 44, justifyContent: 'center' },
  link: { fontSize: 15, fontWeight: '600', color: cores.destaque },
  letra: { fontSize: 12, fontWeight: '600', color: cores.destaque, letterSpacing: 1 },
  titulo: { fontSize: 28, fontWeight: '700', color: cores.texto },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
  registro: { fontSize: 13, color: cores.textoSecundario },
  secao: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: espaco.xs },
  tituloSecao: { fontSize: 17, fontWeight: '600', color: cores.texto },
  adicionar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: espaco.sm,
    minHeight: 52,
    borderRadius: raio.md + 2,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: cores.borda,
  },
  adicionarTexto: { fontSize: 14, fontWeight: '500', color: cores.textoSecundario },
});
