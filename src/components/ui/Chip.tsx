import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cores, espaco } from '../../tema';

type Props = {
  texto: string;
  selecionado?: boolean;
  onPress?: () => void;
  /** "pilula" para filtros; "etiqueta" para informações (não clicável). */
  forma?: 'pilula' | 'etiqueta';
};

export function Chip({ texto, selecionado = false, onPress, forma = 'pilula' }: Props) {
  const estilo = [
    forma === 'pilula' ? estilos.pilula : estilos.etiqueta,
    { backgroundColor: selecionado ? cores.destaque : forma === 'pilula' ? cores.cartao : cores.cartaoElevado },
  ];
  const rotulo = (
    <Text style={[estilos.texto, { color: selecionado ? cores.textoSobreDestaque : cores.texto, fontWeight: selecionado ? '600' : '500' }]}>
      {texto}
    </Text>
  );
  if (!onPress) return <View style={estilo}>{rotulo}</View>;
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: selecionado }} onPress={onPress} style={estilo}>
      {rotulo}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  pilula: { minHeight: 36, paddingHorizontal: espaco.lg, borderRadius: 18, justifyContent: 'center' },
  etiqueta: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  texto: { fontSize: 13 },
});
