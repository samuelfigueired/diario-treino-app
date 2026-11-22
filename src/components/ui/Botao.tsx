import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { ALVO_TOQUE, cores, espaco, raio } from '../../tema';

type Props = {
  titulo: string;
  onPress?: () => void;
  variante?: 'primario' | 'secundario';
  carregando?: boolean;
  desabilitado?: boolean;
};

export function Botao({ titulo, onPress, variante = 'primario', carregando, desabilitado }: Props) {
  const primario = variante === 'primario';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: desabilitado || carregando, busy: carregando }}
      disabled={desabilitado || carregando}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.base,
        { backgroundColor: primario ? cores.destaque : cores.cartaoElevado },
        (pressed || desabilitado) && { opacity: 0.7 },
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={primario ? cores.textoSobreDestaque : cores.texto} />
      ) : (
        <Text style={[estilos.texto, { color: primario ? cores.textoSobreDestaque : cores.texto }]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    minHeight: Math.max(ALVO_TOQUE, 52),
    borderRadius: raio.md + 2,
    paddingHorizontal: espaco.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: { fontSize: 16, fontWeight: '600' },
});
