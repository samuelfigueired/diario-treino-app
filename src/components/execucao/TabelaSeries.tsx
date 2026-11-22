import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { SerieEmEdicao } from '../../regras';
import { cores, espaco, raio } from '../../tema';
import { Icone } from '../ui';

type Props = {
  series: SerieEmEdicao[];
  indiceAtual: number;
  aoMudar: (indice: number, campo: 'carga' | 'repeticoes', valor: string) => void;
  aoAlternar: (indice: number) => void;
  aoAdicionar: () => void;
};

/** Tabela de séries do exercício atual: anterior, carga, repetições e confirmação. */
export function TabelaSeries({ series, indiceAtual, aoMudar, aoAlternar, aoAdicionar }: Props) {
  return (
    <View style={estilos.cartao}>
      <View style={estilos.linha}>
        <Text style={[estilos.cabecalho, estilos.colNumero]}>SÉRIE</Text>
        <Text style={[estilos.cabecalho, estilos.colAnterior]}>ANTERIOR</Text>
        <Text style={[estilos.cabecalho, estilos.colCampo]}>KG</Text>
        <Text style={[estilos.cabecalho, estilos.colCampo]}>REPS</Text>
        <Text style={[estilos.cabecalho, estilos.colOk]}>OK</Text>
      </View>
      {series.map((serie, i) => {
        const atual = i === indiceAtual;
        const futura = !serie.concluida && !atual;
        return (
          <View key={serie.numero} style={[estilos.linha, estilos.serie, serie.concluida && estilos.serieFeita]}>
            <Text style={[estilos.numero, estilos.colNumero, futura && { color: cores.textoSecundario }]}>{serie.numero}</Text>
            <Text style={[estilos.anterior, estilos.colAnterior]} numberOfLines={1}>
              {serie.anterior ?? '—'}
            </Text>
            {(['carga', 'repeticoes'] as const).map((campo) => (
              <TextInput
                key={campo}
                value={serie[campo]}
                onChangeText={(valor) => aoMudar(i, campo, valor)}
                editable={!serie.concluida}
                keyboardType={campo === 'carga' ? 'decimal-pad' : 'number-pad'}
                placeholder="—"
                placeholderTextColor={cores.textoSecundario}
                accessibilityLabel={`${campo === 'carga' ? 'Carga em kg' : 'Repetições'} da série ${serie.numero}`}
                selectTextOnFocus
                style={[
                  estilos.campo,
                  estilos.colCampo,
                  serie.concluida ? estilos.campoFeito : null,
                  atual ? estilos.campoAtual : null,
                ]}
              />
            ))}
            <View style={estilos.colOk}>
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: serie.concluida }}
                accessibilityLabel={`Série ${serie.numero} concluída`}
                onPress={() => aoAlternar(i)}
                hitSlop={8}
                style={[estilos.ok, serie.concluida ? estilos.okFeito : estilos.okPendente]}
              >
                {serie.concluida ? <Icone nome="check" tamanho={15} cor={cores.textoSobreDestaque} espessura={2.8} /> : null}
              </Pressable>
            </View>
          </View>
        );
      })}
      <Pressable accessibilityRole="button" onPress={aoAdicionar} style={estilos.adicionar}>
        <Icone nome="mais" tamanho={16} cor={cores.destaque} />
        <Text style={estilos.adicionarTexto}>Adicionar série</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: { backgroundColor: cores.cartao, borderRadius: raio.lg, padding: 10, paddingTop: espaco.md, gap: espaco.xs },
  linha: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm, paddingHorizontal: 6 },
  serie: { minHeight: 44, borderRadius: 10, paddingVertical: espaco.xs },
  serieFeita: { backgroundColor: 'rgba(200, 242, 90, 0.08)' },
  cabecalho: { fontSize: 10, fontWeight: '600', color: cores.textoSecundario },
  colNumero: { width: 32, textAlign: 'center' },
  colAnterior: { flex: 1 },
  colCampo: { width: 56, textAlign: 'center' },
  colOk: { width: 32, alignItems: 'center' },
  numero: { fontSize: 15, fontWeight: '600', color: cores.texto },
  anterior: { fontSize: 13, color: cores.textoSecundario },
  campo: {
    height: 36,
    borderRadius: raio.sm,
    backgroundColor: cores.cartaoElevado,
    color: cores.texto,
    fontSize: 15,
    fontWeight: '600',
    padding: 0,
  },
  campoFeito: { backgroundColor: 'transparent' },
  campoAtual: { borderWidth: 1.5, borderColor: cores.destaque },
  ok: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  okFeito: { backgroundColor: cores.destaque },
  okPendente: { borderWidth: 2, borderColor: cores.borda },
  adicionar: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, minHeight: 44 },
  adicionarTexto: { fontSize: 14, fontWeight: '600', color: cores.destaque },
});
