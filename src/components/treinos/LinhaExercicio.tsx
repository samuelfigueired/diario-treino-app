import { StyleSheet, Text, View } from 'react-native';
import { formatarCarga } from '../../regras';
import { cores, espaco, raio } from '../../tema';
import type { ExercicioDoTreino } from '../../types';
import { Distintivo, Icone } from '../ui';

type Props = { item: ExercicioDoTreino };

/** Exercício do treino com séries × repetições planejadas e a última carga usada. */
export function LinhaExercicio({ item }: Props) {
  const planejado = `${item.seriesPlanejadas} séries × ${item.repeticoesPlanejadas} reps`;
  const carga = item.ultimaCargaKg == null ? '—' : formatarCarga(item.ultimaCargaKg);
  return (
    <View
      style={estilos.raiz}
      accessible
      accessibilityLabel={`${item.ordem}. ${item.exercicio.nome}, ${planejado}, última carga ${carga}`}
    >
      <Icone nome="arrastar" tamanho={18} cor={cores.textoSecundario} />
      <Distintivo texto={String(item.ordem)} tamanho={32} />
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={estilos.nome}>{item.exercicio.nome}</Text>
        <Text style={estilos.detalhe}>{planejado}</Text>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 2 }}>
        <Text style={estilos.carga}>{carga}</Text>
        <Text style={estilos.rotuloCarga}>última carga</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
    backgroundColor: cores.cartao,
    borderRadius: raio.md + 2,
    padding: 14,
    paddingLeft: espaco.md,
  },
  nome: { fontSize: 15, fontWeight: '600', color: cores.texto },
  detalhe: { fontSize: 13, color: cores.textoSecundario },
  carga: { fontSize: 15, fontWeight: '600', color: cores.destaque },
  rotuloCarga: { fontSize: 11, color: cores.textoSecundario },
});
