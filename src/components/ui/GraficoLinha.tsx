import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { cores } from '../../tema';

type Ponto = { valor: number; rotulo: string };

type Props = {
  pontos: Ponto[];
  altura?: number;
  /** Texto lido pelo leitor de tela no lugar do gráfico. */
  descricao: string;
};

const MARGEM = 8;
const MAXIMO_ROTULOS = 5;

/** Gráfico de linha com área preenchida e destaque no último ponto (tela de evolução). */
export function GraficoLinha({ pontos, altura = 140, descricao }: Props) {
  const [largura, setLargura] = useState(0);
  const aoMedir = (e: LayoutChangeEvent) => setLargura(e.nativeEvent.layout.width);

  const valores = pontos.map((p) => p.valor);
  const minimo = Math.min(...valores);
  const maximo = Math.max(...valores);
  const faixa = maximo - minimo || 1;
  const coordenadas = pontos.map((p, i) => ({
    x: MARGEM + (pontos.length === 1 ? 0.5 : i / (pontos.length - 1)) * (largura - 2 * MARGEM),
    y: MARGEM + (1 - (p.valor - minimo) / faixa) * (altura - 2 * MARGEM),
  }));
  const linha = coordenadas.map((c, i) => `${i ? 'L' : 'M'}${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
  const area = coordenadas.length
    ? `${linha} L${coordenadas[coordenadas.length - 1].x.toFixed(1)} ${altura} L${coordenadas[0].x.toFixed(1)} ${altura} Z`
    : '';
  const passo = Math.max(1, Math.ceil(pontos.length / MAXIMO_ROTULOS));
  const rotulos = pontos.filter((_, i) => i % passo === 0 || i === pontos.length - 1);

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={descricao}>
      <View onLayout={aoMedir} style={{ height: altura }}>
        {largura > 0 && pontos.length > 0 ? (
          <Svg width={largura} height={altura}>
            {[0.25, 0.5, 0.75].map((f) => (
              <Line key={f} x1={0} x2={largura} y1={altura * f} y2={altura * f} stroke={cores.borda} strokeDasharray="3 4" />
            ))}
            <Path d={area} fill={cores.destaque} fillOpacity={0.12} />
            <Path d={linha} stroke={cores.destaque} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {coordenadas.map((c, i) =>
              i === coordenadas.length - 1 ? (
                <Circle key={i} cx={c.x} cy={c.y} r={5.5} fill={cores.destaque} />
              ) : (
                <Circle key={i} cx={c.x} cy={c.y} r={3.5} fill={cores.cartao} stroke={cores.destaque} strokeWidth={2} />
              ),
            )}
          </Svg>
        ) : null}
      </View>
      <View style={estilos.eixo}>
        {rotulos.map((r, i) => (
          <Text key={`${r.rotulo}-${i}`} style={estilos.rotulo}>
            {r.rotulo}
          </Text>
        ))}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  eixo: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  rotulo: { fontSize: 11, color: cores.textoSecundario },
});
