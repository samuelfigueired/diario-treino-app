import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { cores, espaco, raio } from '../../tema';

type Props = { children: ReactNode; onPress?: () => void; rotuloAcessivel?: string };

export function Cartao({ children, onPress, rotuloAcessivel }: Props) {
  if (!onPress) return <View style={estilos.base}>{children}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={rotuloAcessivel}
      onPress={onPress}
      style={({ pressed }) => [estilos.base, pressed && { opacity: 0.8 }]}
    >
      {children}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: { backgroundColor: cores.cartao, borderRadius: raio.lg, padding: espaco.lg, gap: espaco.sm },
});
