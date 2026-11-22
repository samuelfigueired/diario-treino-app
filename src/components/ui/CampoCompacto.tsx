import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { cores, raio } from '../../tema';

type Props = TextInputProps & { rotulo: string; erro?: boolean; largura?: number };

/** Campo numérico pequeno com rótulo em cima (séries, reps, kg). */
export function CampoCompacto({ rotulo, erro, largura = 64, style, ...props }: Props) {
  return (
    <View style={{ width: largura, gap: 4 }}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <TextInput
        accessibilityLabel={rotulo}
        placeholderTextColor={cores.textoSecundario}
        selectTextOnFocus
        style={[estilos.campo, erro ? { borderColor: cores.erro } : null, style]}
        {...props}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  rotulo: { fontSize: 10, fontWeight: '600', color: cores.textoSecundario, textAlign: 'center' },
  campo: {
    height: 40,
    borderRadius: raio.sm,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.cartaoElevado,
    color: cores.texto,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    padding: 0,
  },
});
