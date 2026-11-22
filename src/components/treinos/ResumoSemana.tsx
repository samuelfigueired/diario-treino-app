import { StyleSheet, Text, View } from 'react-native';
import type { DiaDoResumo } from '../../regras';
import { cores, espaco, raio } from '../../tema';
import { Icone } from '../ui';

type Props = { dias: DiaDoResumo[]; feitos: number; meta: number };

/** Cartão "Esta semana" com os dias treinados (tela Meus treinos). */
export function ResumoSemana({ dias, feitos, meta }: Props) {
  return (
    <View style={estilos.cartao}>
      <View style={estilos.linha}>
        <Text style={estilos.titulo}>Esta semana</Text>
        <Text style={estilos.contagem}>
          {feitos} de {meta} treinos
        </Text>
      </View>
      <View style={estilos.linha}>
        {dias.map((dia) => (
          <View
            key={dia.iso}
            style={estilos.dia}
            accessible
            accessibilityLabel={`${dia.rotulo} ${dia.numero}${dia.treinou ? ', treinou' : ''}${dia.hoje ? ', hoje' : ''}`}
          >
            <Text style={estilos.rotulo}>{dia.rotulo}</Text>
            <View
              style={[
                estilos.circulo,
                { backgroundColor: dia.treinou ? cores.destaque : cores.cartaoElevado },
                dia.hoje && estilos.hoje,
              ]}
            >
              {dia.treinou ? (
                <Icone nome="check" tamanho={16} cor={cores.textoSobreDestaque} espessura={2.6} />
              ) : (
                <Text style={estilos.numero}>{dia.numero}</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: { backgroundColor: cores.cartao, borderRadius: raio.xl, padding: 18, gap: 14 },
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { fontSize: 15, fontWeight: '600', color: cores.texto },
  contagem: { fontSize: 13, fontWeight: '600', color: cores.destaque },
  dia: { alignItems: 'center', gap: 6 },
  rotulo: { fontSize: 11, fontWeight: '500', color: cores.textoSecundario },
  circulo: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  hoje: { borderWidth: 2, borderColor: cores.texto },
  numero: { fontSize: 13, fontWeight: '500', color: cores.textoSecundario },
});
