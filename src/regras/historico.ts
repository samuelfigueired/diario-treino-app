import type { SessaoTreino } from '../types';
import { minutosEntre, rotuloSemana } from './datas';
import { volumeDasSeries } from './execucao';

export type GrupoDeSessoes = { titulo: string; sessoes: SessaoTreino[] };

/** Sessões da mais recente para a mais antiga. */
export function ordenarRecentes(sessoes: SessaoTreino[]): SessaoTreino[] {
  return [...sessoes].sort((a, b) => b.inicio.localeCompare(a.inicio));
}

/** Agrupa as sessões por semana ("Esta semana", "Semana passada"...), mais recentes primeiro. */
export function agruparPorSemana(sessoes: SessaoTreino[], hoje: Date): GrupoDeSessoes[] {
  const grupos: GrupoDeSessoes[] = [];
  for (const sessao of ordenarRecentes(sessoes)) {
    const titulo = rotuloSemana(new Date(sessao.inicio), hoje);
    const grupo = grupos.find((g) => g.titulo === titulo);
    if (grupo) grupo.sessoes.push(sessao);
    else grupos.push({ titulo, sessoes: [sessao] });
  }
  return grupos;
}

/** Sessões que começaram nos últimos `dias` dias (contando hoje). */
export function sessoesDosUltimosDias(sessoes: SessaoTreino[], dias: number, hoje: Date): SessaoTreino[] {
  const limite = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - (dias - 1)).getTime();
  return sessoes.filter((s) => new Date(s.inicio).getTime() >= limite);
}

/** Totais de um conjunto de sessões: quantidade, minutos e volume (kg). */
export function totaisDasSessoes(sessoes: SessaoTreino[]) {
  return {
    treinos: sessoes.length,
    minutos: sessoes.reduce((t, s) => t + minutosEntre(s.inicio, s.fim), 0),
    volumeKg: Math.round(sessoes.reduce((t, s) => t + volumeDasSeries(s.series), 0) * 100) / 100,
  };
}

/** Resumo de uma sessão para o cartão do histórico. */
export function resumoDaSessao(sessao: SessaoTreino) {
  return {
    minutos: minutosEntre(sessao.inicio, sessao.fim),
    series: sessao.series.filter((s) => s.concluida).length,
    volumeKg: volumeDasSeries(sessao.series),
  };
}

/** Linha da lista do histórico: cabeçalho de semana ou cartão de sessão. */
export type ItemDoHistorico =
  | { tipo: 'semana'; chave: string; titulo: string }
  | { tipo: 'sessao'; chave: string; sessao: SessaoTreino };

/** Achata os grupos por semana em uma única lista para a FlatList. */
export function itensDoHistorico(grupos: GrupoDeSessoes[]): ItemDoHistorico[] {
  return grupos.flatMap((grupo) => [
    { tipo: 'semana' as const, chave: `semana-${grupo.titulo}`, titulo: grupo.titulo },
    ...grupo.sessoes.map((sessao) => ({ tipo: 'sessao' as const, chave: `sessao-${sessao.id}`, sessao })),
  ]);
}
