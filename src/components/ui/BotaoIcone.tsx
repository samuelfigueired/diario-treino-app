import { Pressable, StyleSheet } from 'react-native';
import { ALVO_TOQUE, cores } from '../../tema';
import { Icone, NomeIcone } from './Icone';

type Props = { icone: NomeIcone; rotulo: string; onPress?: () => void };

/** Botão redondo só com ícone (voltar, minimizar). O rótulo é lido pelo leitor de tela. */
export function BotaoIcone({ icone, rotulo, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [estilos.base, pressed && { opacity: 0.7 }]}
    >
      <Icone nome={icone} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    width: ALVO_TOQUE,
    height: ALVO_TOQUE,
    borderRadius: ALVO_TOQUE / 2,
    backgroundColor: cores.cartao,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
