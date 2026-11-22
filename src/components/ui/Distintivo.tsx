import { StyleSheet, Text, View } from 'react-native';
import { cores } from '../../tema';

type Props = { texto: string; destaque?: boolean; tamanho?: number };

/** Quadrado com letra ou número (letra do treino, número do exercício). */
export function Distintivo({ texto, destaque = false, tamanho = 48 }: Props) {
  return (
    <View
      style={[
        estilos.raiz,
        { width: tamanho, height: tamanho, borderRadius: tamanho / 4, backgroundColor: destaque ? cores.destaque : cores.cartaoElevado },
      ]}
    >
      <Text style={{ fontSize: tamanho * 0.4, fontWeight: '700', color: destaque ? cores.textoSobreDestaque : cores.texto }}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({ raiz: { alignItems: 'center', justifyContent: 'center' } });
