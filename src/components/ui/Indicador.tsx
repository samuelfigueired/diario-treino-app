import { StyleSheet, Text, View } from 'react-native';
import { cores, espaco, raio } from '../../tema';

type Props = { rotulo: string; valor: string; unidade?: string };

/** Bloco de número com rótulo (Treinos 12, Volume 86,4 t). */
export function Indicador({ rotulo, valor, unidade }: Props) {
  return (
    <View style={estilos.raiz} accessible accessibilityLabel={`${rotulo}: ${valor}${unidade ? ` ${unidade}` : ''}`}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <View style={estilos.linha}>
        <Text style={estilos.valor}>{valor}</Text>
        {unidade ? <Text style={estilos.unidade}>{unidade}</Text> : null}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: cores.cartao, borderRadius: raio.md + 2, padding: 14, gap: 6 },
  rotulo: { fontSize: 12, fontWeight: '500', color: cores.textoSecundario },
  linha: { flexDirection: 'row', alignItems: 'baseline', gap: espaco.xs },
  valor: { fontSize: 20, fontWeight: '700', color: cores.texto },
  unidade: { fontSize: 12, fontWeight: '500', color: cores.textoSecundario },
});
