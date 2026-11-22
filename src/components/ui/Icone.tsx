import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { cores } from '../../tema';

type Forma =
  | { tipo: 'path'; d: string }
  | { tipo: 'circle'; cx: number; cy: number; r: number }
  | { tipo: 'rect'; x: number; y: number; width: number; height: number; rx: number };

const p = (d: string): Forma => ({ tipo: 'path', d });
const c = (cx: number, cy: number, r: number): Forma => ({ tipo: 'circle', cx, cy, r });

/** Ícones de traço (24×24) usados no protótipo. */
const ICONES = {
  inicio: [p('M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z')],
  relogio: [c(12, 12, 9), p('M12 7v5l3 2')],
  grafico: [p('M3 3v18h18'), p('m7 15 4-4 3 3 5-6')],
  usuario: [c(12, 8, 4), p('M4 21c0-4 4-6 8-6s8 2 8 6')],
  mais: [p('M12 5v14M5 12h14')],
  direita: [p('m9 18 6-6-6-6')],
  esquerda: [p('m15 18-6-6 6-6')],
  baixo: [p('m6 9 6 6 6-6')],
  check: [p('M20 6 9 17l-5-5')],
  arrastar: [c(9, 6, 1), c(15, 6, 1), c(9, 12, 1), c(15, 12, 1), c(9, 18, 1), c(15, 18, 1)],
  haltere: [p('M6.5 6.5l11 11M21 21l-1-1M3 3l1 1M18 22l4-4M2 6l4-4M3 10l7-7M14 21l7-7')],
  sair: [p('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'), p('m16 17 5-5-5-5'), p('M21 12H9')],
  email: [{ tipo: 'rect', x: 3, y: 5, width: 18, height: 14, rx: 2 }, p('m3 7 9 6 9-6')],
} satisfies Record<string, Forma[]>;

export type NomeIcone = keyof typeof ICONES;

type Props = { nome: NomeIcone; tamanho?: number; cor?: string; espessura?: number };

export function Icone({ nome, tamanho = 20, cor = cores.texto, espessura = 2 }: Props) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" accessibilityElementsHidden importantForAccessibility="no">
      {ICONES[nome].map((forma: Forma, i: number) => {
        const traco = { stroke: cor, strokeWidth: espessura, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
        if (forma.tipo === 'circle') return <Circle key={i} cx={forma.cx} cy={forma.cy} r={forma.r} {...traco} />;
        if (forma.tipo === 'rect') {
          return <Rect key={i} x={forma.x} y={forma.y} width={forma.width} height={forma.height} rx={forma.rx} {...traco} />;
        }
        return <Path key={i} d={forma.d} {...traco} />;
      })}
    </Svg>
  );
}
