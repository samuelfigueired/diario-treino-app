import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { cores, espaco, raio } from '../../tema';

type Props = TextInputProps & {
  rotulo: string;
  erro?: string;
};

export function Campo({ rotulo, erro, style, ...props }: Props) {
  return (
    <View style={estilos.raiz}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <TextInput
        accessibilityLabel={rotulo}
        placeholderTextColor={cores.textoSecundario}
        style={[estilos.campo, erro ? { borderColor: cores.erro } : null, style]}
        {...props}
      />
      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: { gap: espaco.sm },
  rotulo: { fontSize: 13, fontWeight: '500', color: cores.textoSecundario },
  campo: {
    minHeight: 50,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.cartao,
    paddingHorizontal: espaco.lg,
    color: cores.texto,
    fontSize: 15,
  },
  erro: { fontSize: 13, color: cores.erro },
});
