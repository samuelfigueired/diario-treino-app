import { StyleSheet, Text, View } from 'react-native';
import { textoDiasDaSemana, textoQuantidadeExercicios } from '../../regras';
import { cores, espaco } from '../../tema';
import type { Treino } from '../../types';
import { Cartao, Distintivo, Icone } from '../ui';

type Props = { treino: Treino; destaque: boolean; onPress: () => void };

/** Item da lista de treinos: letra, nome, quantidade de exercícios e dias. */
export function CartaoTreino({ treino, destaque, onPress }: Props) {
  const titulo = `Treino ${treino.letra} · ${treino.nome}`;
  const detalhe = `${textoQuantidadeExercicios(treino.exercicios.length)} · ${textoDiasDaSemana(treino.diasDaSemana)}`;
  return (
    <Cartao onPress={onPress} rotuloAcessivel={`${titulo}, ${detalhe}`}>
      <View style={estilos.linha}>
        <Distintivo texto={treino.letra} destaque={destaque} />
        <View style={{ flex: 1, gap: espaco.xs }}>
          <Text style={estilos.titulo} numberOfLines={1}>
            {titulo}
          </Text>
          <Text style={estilos.detalhe}>{detalhe}</Text>
        </View>
        <Icone nome="direita" cor={cores.textoSecundario} />
      </View>
    </Cartao>
  );
}

const estilos = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  titulo: { fontSize: 16, fontWeight: '600', color: cores.texto },
  detalhe: { fontSize: 13, color: cores.textoSecundario },
});
