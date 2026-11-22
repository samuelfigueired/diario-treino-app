import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cores, espaco, raio } from '../../tema';

type Props<T extends string> = {
  opcoes: readonly { valor: T; rotulo: string }[];
  valor: T;
  onChange: (valor: T) => void;
};

/** Controle segmentado (Entrar | Criar conta, 1M | 3M | 6M | 1A). */
export function Segmentado<T extends string>({ opcoes, valor, onChange }: Props<T>) {
  return (
    <View accessibilityRole="tablist" style={estilos.raiz}>
      {opcoes.map((opcao) => {
        const ativo = opcao.valor === valor;
        return (
          <Pressable
            key={opcao.valor}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativo }}
            onPress={() => onChange(opcao.valor)}
            style={[estilos.opcao, ativo && estilos.opcaoAtiva]}
          >
            <Text style={[estilos.texto, { color: ativo ? cores.texto : cores.textoSecundario }]}>{opcao.rotulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: { flexDirection: 'row', backgroundColor: cores.cartao, borderRadius: raio.md, padding: espaco.xs, gap: espaco.xs },
  opcao: { flex: 1, minHeight: 40, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  opcaoAtiva: { backgroundColor: cores.cartaoElevado },
  texto: { fontSize: 14, fontWeight: '600' },
});
