import { cargaMaximaPorDia, filtrarPeriodo, recordesDesde, resumoDaEvolucao } from '../evolucao';
import { serie, sessao, SUPINO_RETO, TRICEPS_CORDA } from '../__fixtures__/sessoes';

describe('cargaMaximaPorDia', () => {
  it('pega a maior carga do exercício em cada dia, em ordem cronológica', () => {
    // given
    const sessoes = [
      sessao(2, [2026, 11, 3], [serie(SUPINO_RETO, 1, 60, 10), serie(SUPINO_RETO, 2, 62.5, 8), serie(TRICEPS_CORDA, 1, 30, 12)]),
      sessao(1, [2026, 10, 29], [serie(SUPINO_RETO, 1, 57.5, 10)]),
    ];

    // when
    const pontos = cargaMaximaPorDia(sessoes, SUPINO_RETO);

    // then
    expect(pontos).toEqual([
      { data: '2026-10-29', cargaMaximaKg: 57.5 },
      { data: '2026-11-03', cargaMaximaKg: 62.5 },
    ]);
  });

  it('ignora séries sem carga e séries não concluídas', () => {
    // given
    const sessoes = [
      sessao(1, [2026, 11, 3], [serie(SUPINO_RETO, 1, null, 10), { ...serie(SUPINO_RETO, 2, 70, 3), concluida: false }]),
    ];

    // when
    const pontos = cargaMaximaPorDia(sessoes, SUPINO_RETO);

    // then
    expect(pontos).toEqual([]);
  });
});

describe('período e resumo da evolução', () => {
  const pontos = [
    { data: '2026-07-01', cargaMaximaKg: 45 },
    { data: '2026-09-08', cargaMaximaKg: 50 },
    { data: '2026-10-06', cargaMaximaKg: 55 },
    { data: '2026-11-03', cargaMaximaKg: 62.5 },
  ];

  it('mantém só os pontos dentro dos últimos 3 meses', () => {
    // given
    const hoje = new Date(2026, 10, 3);

    // when
    const filtrados = filtrarPeriodo(pontos, '3M', hoje);

    // then
    expect(filtrados.map((p) => p.data)).toEqual(['2026-09-08', '2026-10-06', '2026-11-03']);
  });

  it('calcula a carga máxima, a variação e as semanas do período', () => {
    // given
    const periodo = pontos.slice(1);

    // when
    const resumo = resumoDaEvolucao(periodo);

    // then
    expect(resumo).toEqual({ cargaMaximaKg: 62.5, variacaoKg: 12.5, semanas: 8 });
  });

  it('não gera resumo sem pontos', () => {
    // given
    const vazio: never[] = [];

    // when
    const resumo = resumoDaEvolucao(vazio);

    // then
    expect(resumo).toBeNull();
  });

  it('conta como recorde cada carga maior que todas as anteriores a partir da data', () => {
    // given
    const desde = '2026-10-01';

    // when
    const recordes = recordesDesde(pontos, desde);

    // then
    expect(recordes).toBe(2);
  });
});
