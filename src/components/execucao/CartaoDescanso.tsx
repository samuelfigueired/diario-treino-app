import { StyleSheet, Text, View } from 'react-native';
import { AJUSTE_DESCANSO_SEGUNDOS, formatarCronometro } from '../../regras';
import { cores, espaco, raio } from '../../tema';
import { Chip, Icone } from '../ui';

type Props = { segundosRestantes: number; aoAjustar: (deltaSegundos: number) => void; aoPular: () => void };

/** Contagem regressiva do descanso entre séries. */
export function CartaoDescanso({ segundosRestantes, aoAjustar, aoPular }: Props) {
  return (
    <View style={estilos.raiz} accessibilityLiveRegion="polite">
      <Icone nome="relogio" tamanho={22} cor={cores.destaque} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={estilos.rotulo}>Descanso</Text>
        <Text style={estilos.tempo}>{formatarCronometro(segundosRestantes)}</Text>
      </View>
      <Chip forma="etiqueta" texto={`−${AJUSTE_DESCANSO_SEGUNDOS}s`} onPress={() => aoAjustar(-AJUSTE_DESCANSO_SEGUNDOS)} />
      <Chip forma="etiqueta" texto={`+${AJUSTE_DESCANSO_SEGUNDOS}s`} onPress={() => aoAjustar(AJUSTE_DESCANSO_SEGUNDOS)} />
      <Chip forma="etiqueta" texto="Pular" onPress={aoPular} />
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: cores.destaque,
    borderRadius: raio.lg,
    padding: 14,
    paddingLeft: espaco.lg,
  },
  rotulo: { fontSize: 12, fontWeight: '500', color: cores.textoSecundario },
  tempo: { fontSize: 20, fontWeight: '700', color: cores.texto },
});
