import type { DiaSemana, SessaoTreino } from '../types';
import { codigoDia, diasDaSemanaDe, isoData, rotuloDiaCurto } from './datas';

const ORDEM_DIAS: DiaSemana[] = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];
const NOMES_DIAS: Record<DiaSemana, string> = {
  SEG: 'Seg', TER: 'Ter', QUA: 'Qua', QUI: 'Qui', SEX: 'Sex', SAB: 'Sáb', DOM: 'Dom',
};

/** "Seg e Qui", "Seg, Qua e Sex", "Sem dia fixo". */
export function textoDiasDaSemana(dias: DiaSemana[]): string {
  const nomes = [...new Set(dias)]
    .sort((a, b) => ORDEM_DIAS.indexOf(a) - ORDEM_DIAS.indexOf(b))
    .map((d) => NOMES_DIAS[d]);
  if (nomes.length === 0) return 'Sem dia fixo';
  if (nomes.length === 1) return nomes[0];
  return `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}`;
}

/** "5 exercícios", "1 exercício". */
export function textoQuantidadeExercicios(quantidade: number): string {
  return `${quantidade} ${quantidade === 1 ? 'exercício' : 'exercícios'}`;
}

export type DiaDoResumo = {
  iso: string;
  rotulo: string;
  numero: number;
  treinou: boolean;
  hoje: boolean;
};

/**
 * Resumo da semana (segunda a domingo) de `hoje`: em quais dias houve sessão
 * e a meta, que é a soma dos dias planejados nos treinos.
 */
export function resumoDaSemana(sessoes: SessaoTreino[], diasPlanejados: DiaSemana[], hoje: Date) {
  const diasComTreino = new Set(sessoes.map((s) => isoData(new Date(s.inicio))));
  const dias: DiaDoResumo[] = diasDaSemanaDe(hoje).map((d) => ({
    iso: isoData(d),
    rotulo: rotuloDiaCurto(d),
    numero: d.getDate(),
    treinou: diasComTreino.has(isoData(d)),
    hoje: isoData(d) === isoData(hoje),
  }));
  const meta = new Set(diasPlanejados).size;
  return { dias, feitos: dias.filter((d) => d.treinou).length, meta };
}

/** Se o treino está planejado para o dia de `hoje`. */
export function treinoPlanejadoPara(dias: DiaSemana[], hoje: Date): boolean {
  return dias.includes(codigoDia(hoje));
}
