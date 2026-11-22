import { agruparPorSemana, resumoDaSessao, sessoesDosUltimosDias, totaisDasSessoes } from '../historico';
import { serie, sessao, SUPINO_RETO, TRICEPS_CORDA } from '../__fixtures__/sessoes';

const hoje = new Date(2026, 10, 3);

describe('agruparPorSemana', () => {
  it('agrupa por semana com as sessões mais recentes primeiro', () => {
    // given
    const sessoes = [
      sessao(1, [2026, 10, 27], []),
      sessao(2, [2026, 11, 3], []),
      sessao(3, [2026, 10, 31], []),
      sessao(4, [2026, 11, 2], []),
    ];

    // when
    const grupos = agruparPorSemana(sessoes, hoje);

    // then
    expect(grupos.map((g) => g.titulo)).toEqual(['Esta semana', 'Semana passada']);
    expect(grupos[0].sessoes.map((s) => s.id)).toEqual([2, 4]);
    expect(grupos[1].sessoes.map((s) => s.id)).toEqual([3, 1]);
  });

  it('não cria grupos quando não há sessões', () => {
    // given
    const sessoes: never[] = [];

    // when
    const grupos = agruparPorSemana(sessoes, hoje);

    // then
    expect(grupos).toEqual([]);
  });
});

describe('totais do histórico', () => {
  it('soma treinos, minutos e volume das sessões dos últimos 30 dias', () => {
    // given
    const sessoes = [
      sessao(1, [2026, 11, 3], [serie(SUPINO_RETO, 1, 60, 10), serie(TRICEPS_CORDA, 1, 25, 12)], 58),
      sessao(2, [2026, 10, 10], [serie(SUPINO_RETO, 1, 55, 10)], 46),
      sessao(3, [2026, 9, 1], [serie(SUPINO_RETO, 1, 50, 10)], 50),
    ];

    // when
    const totais = totaisDasSessoes(sessoesDosUltimosDias(sessoes, 30, hoje));

    // then
    expect(totais).toEqual({ treinos: 2, minutos: 104, volumeKg: 600 + 300 + 550 });
  });

  it('resume a sessão com duração, séries concluídas e volume', () => {
    // given
    const s = sessao(1, [2026, 11, 3], [serie(SUPINO_RETO, 1, 60, 10), { ...serie(SUPINO_RETO, 2, 60, 10), concluida: false }]);

    // when
    const resumo = resumoDaSessao(s);

    // then
    expect(resumo).toEqual({ minutos: 58, series: 1, volumeKg: 600 });
  });
});
