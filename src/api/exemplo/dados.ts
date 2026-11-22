import type { DiaSemana, Exercicio, SessaoTreino, Treino } from '../../types';
import { codigoDia } from '../../regras/datas';

/**
 * Dados fictícios usados enquanto a API não tem os módulos de treino (EXPO_PUBLIC_DADOS_EXEMPLO).
 * As sessões são geradas a partir da data de hoje, para o histórico e a evolução fazerem sentido.
 */

const ex = (id: number, nome: string, grupoMuscular: string): Exercicio => ({ id, nome, grupoMuscular, personalizado: false });

const EXERCICIOS = {
  supinoReto: ex(1, 'Supino reto com barra', 'Peito'),
  supinoInclinado: ex(2, 'Supino inclinado com halteres', 'Peito'),
  crucifixo: ex(3, 'Crucifixo na máquina', 'Peito'),
  tricepsCorda: ex(4, 'Tríceps na polia com corda', 'Tríceps'),
  tricepsTesta: ex(5, 'Tríceps testa', 'Tríceps'),
  puxada: ex(6, 'Puxada frontal', 'Costas'),
  remadaCurvada: ex(7, 'Remada curvada', 'Costas'),
  remadaBaixa: ex(8, 'Remada baixa', 'Costas'),
  roscaDireta: ex(9, 'Rosca direta com barra', 'Bíceps'),
  roscaMartelo: ex(10, 'Rosca martelo', 'Bíceps'),
  agachamento: ex(11, 'Agachamento livre', 'Pernas'),
  legPress: ex(12, 'Leg press 45°', 'Pernas'),
  cadeiraExtensora: ex(13, 'Cadeira extensora', 'Pernas'),
  mesaFlexora: ex(14, 'Mesa flexora', 'Pernas'),
  panturrilha: ex(15, 'Panturrilha em pé', 'Pernas'),
  desenvolvimento: ex(16, 'Desenvolvimento com halteres', 'Ombros'),
  elevacaoLateral: ex(17, 'Elevação lateral', 'Ombros'),
  prancha: ex(18, 'Prancha abdominal', 'Abdômen'),
};

type Plano = { exercicio: Exercicio; series: number; reps: number; cargaInicial: number | null; aumentoSemanal: number };

const PLANOS: { treino: Omit<Treino, 'exercicios'>; itens: Plano[] }[] = [
  {
    treino: { id: 1, letra: 'A', nome: 'Peito e Tríceps', diasDaSemana: ['SEG', 'QUI'], duracaoEstimadaMin: 55 },
    itens: [
      { exercicio: EXERCICIOS.supinoReto, series: 4, reps: 10, cargaInicial: 45, aumentoSemanal: 1.25 },
      { exercicio: EXERCICIOS.supinoInclinado, series: 3, reps: 12, cargaInicial: 16, aumentoSemanal: 0.5 },
      { exercicio: EXERCICIOS.crucifixo, series: 3, reps: 12, cargaInicial: 30, aumentoSemanal: 1 },
      { exercicio: EXERCICIOS.tricepsCorda, series: 4, reps: 12, cargaInicial: 20, aumentoSemanal: 0.5 },
      { exercicio: EXERCICIOS.tricepsTesta, series: 3, reps: 10, cargaInicial: 15, aumentoSemanal: 0.5 },
    ],
  },
  {
    treino: { id: 2, letra: 'B', nome: 'Costas e Bíceps', diasDaSemana: ['TER', 'SEX'], duracaoEstimadaMin: 52 },
    itens: [
      { exercicio: EXERCICIOS.puxada, series: 4, reps: 10, cargaInicial: 45, aumentoSemanal: 1 },
      { exercicio: EXERCICIOS.remadaCurvada, series: 4, reps: 10, cargaInicial: 40, aumentoSemanal: 1 },
      { exercicio: EXERCICIOS.remadaBaixa, series: 3, reps: 12, cargaInicial: 40, aumentoSemanal: 1 },
      { exercicio: EXERCICIOS.roscaDireta, series: 3, reps: 10, cargaInicial: 20, aumentoSemanal: 0.5 },
      { exercicio: EXERCICIOS.roscaMartelo, series: 3, reps: 12, cargaInicial: 10, aumentoSemanal: 0.25 },
    ],
  },
  {
    treino: { id: 3, letra: 'C', nome: 'Pernas', diasDaSemana: ['QUA'], duracaoEstimadaMin: 64 },
    itens: [
      { exercicio: EXERCICIOS.agachamento, series: 4, reps: 8, cargaInicial: 60, aumentoSemanal: 2.5 },
      { exercicio: EXERCICIOS.legPress, series: 4, reps: 12, cargaInicial: 140, aumentoSemanal: 5 },
      { exercicio: EXERCICIOS.cadeiraExtensora, series: 3, reps: 12, cargaInicial: 40, aumentoSemanal: 1 },
      { exercicio: EXERCICIOS.mesaFlexora, series: 3, reps: 12, cargaInicial: 30, aumentoSemanal: 1 },
      { exercicio: EXERCICIOS.panturrilha, series: 4, reps: 15, cargaInicial: 50, aumentoSemanal: 1 },
    ],
  },
  {
    treino: { id: 4, letra: 'D', nome: 'Ombros e Core', diasDaSemana: ['SAB'], duracaoEstimadaMin: 46 },
    itens: [
      { exercicio: EXERCICIOS.desenvolvimento, series: 4, reps: 10, cargaInicial: 14, aumentoSemanal: 0.5 },
      { exercicio: EXERCICIOS.elevacaoLateral, series: 3, reps: 12, cargaInicial: 6, aumentoSemanal: 0.25 },
      { exercicio: EXERCICIOS.prancha, series: 3, reps: 45, cargaInicial: null, aumentoSemanal: 0 },
    ],
  },
];

const SEMANAS_DE_HISTORICO = 12;
const arredondar = (kg: number) => Math.round(kg / 2.5) * 2.5 || Math.round(kg * 4) / 4;

const SEMANAS_POR_AUMENTO = 3;

/** A carga sobe a cada três semanas, como numa progressão de treino comum. */
function cargaNaSemana(plano: Plano, semana: number): number | null {
  if (plano.cargaInicial == null) return null;
  const semanasComAumento = Math.floor(semana / SEMANAS_POR_AUMENTO) * SEMANAS_POR_AUMENTO;
  return arredondar(plano.cargaInicial + plano.aumentoSemanal * semanasComAumento);
}

/** Gera as sessões das últimas semanas, pulando alguns dias para parecer uma rotina real. */
function gerarSessoes(hoje: Date): SessaoTreino[] {
  const sessoes: SessaoTreino[] = [];
  let id = 1;
  for (let diasAtras = SEMANAS_DE_HISTORICO * 7; diasAtras >= 0; diasAtras--) {
    const dia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - diasAtras);
    const codigo: DiaSemana = codigoDia(dia);
    const plano = PLANOS.find((p) => p.treino.diasDaSemana.includes(codigo));
    if (!plano || diasAtras % 9 === 4) continue;
    const semana = SEMANAS_DE_HISTORICO - Math.floor(diasAtras / 7);
    const inicio = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), 7, 10 + (diasAtras % 4) * 5);
    const duracao = (plano.treino.duracaoEstimadaMin ?? 50) + ((diasAtras % 5) - 2) * 3;
    sessoes.push({
      id: id++,
      treinoId: plano.treino.id,
      nomeTreino: plano.treino.nome,
      letraTreino: plano.treino.letra,
      inicio: inicio.toISOString(),
      fim: new Date(inicio.getTime() + duracao * 60000).toISOString(),
      series: plano.itens.flatMap((item) =>
        Array.from({ length: item.series }, (_, i) => ({
          exercicioId: item.exercicio.id,
          numero: i + 1,
          cargaKg: cargaNaSemana(item, semana),
          repeticoes: item.reps - (i === item.series - 1 && diasAtras % 3 === 0 ? 2 : 0),
          concluida: true,
        })),
      ),
    });
  }
  return sessoes;
}

function montarTreinos(sessoes: SessaoTreino[]): Treino[] {
  return PLANOS.map(({ treino, itens }) => ({
    ...treino,
    exercicios: itens.map((item, i) => {
      const ultimaCarga = [...sessoes]
        .reverse()
        .flatMap((s) => s.series)
        .find((s) => s.exercicioId === item.exercicio.id)?.cargaKg ?? null;
      return {
        id: treino.id * 100 + i,
        ordem: i + 1,
        exercicio: item.exercicio,
        seriesPlanejadas: item.series,
        repeticoesPlanejadas: item.reps,
        ultimaCargaKg: ultimaCarga,
      };
    }),
  }));
}

export function criarDadosExemplo(hoje = new Date()) {
  const sessoes = gerarSessoes(hoje);
  return { sessoes, treinos: montarTreinos(sessoes), exercicios: Object.values(EXERCICIOS) };
}
