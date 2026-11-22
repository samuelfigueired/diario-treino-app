import {
  adicionarSerie,
  indiceSerieAtual,
  paraSeriesRegistradas,
  podeConcluir,
  progressoDaSessao,
  seriesIniciais,
  volumeDasSeries,
} from '../execucao';
import { SUPINO_RETO } from '../__fixtures__/sessoes';

describe('séries da execução', () => {
  it('cria as séries planejadas com a carga e as repetições da última vez', () => {
    // given
    const quantidade = 4;

    // when
    const series = seriesIniciais(quantidade, 10, '57,5', '57,5 kg × 10');

    // then
    expect(series).toHaveLength(4);
    expect(series[3]).toEqual({ numero: 4, carga: '57,5', repeticoes: '10', concluida: false, anterior: '57,5 kg × 10' });
  });

  it('não permite concluir série sem repetições', () => {
    // given
    const [serie] = seriesIniciais(1, 10, '60', null);

    // when
    const pode = podeConcluir({ ...serie, repeticoes: '' });

    // then
    expect(pode).toBe(false);
  });

  it('permite concluir série sem carga, que vale como peso corporal', () => {
    // given
    const [serie] = seriesIniciais(1, 12, '', null);

    // when
    const pode = podeConcluir(serie);

    // then
    expect(pode).toBe(true);
  });

  it('aponta a primeira série ainda não concluída', () => {
    // given
    const series = seriesIniciais(3, 10, '60', null).map((s, i) => ({ ...s, concluida: i < 2 }));

    // when
    const indice = indiceSerieAtual(series);

    // then
    expect(indice).toBe(2);
  });

  it('acrescenta uma série copiando carga e repetições da última', () => {
    // given
    const series = seriesIniciais(2, 10, '60', null).map((s, i) => (i === 1 ? { ...s, repeticoes: '8' } : s));

    // when
    const novas = adicionarSerie(series);

    // then
    expect(novas[2]).toEqual({ numero: 3, carga: '60', repeticoes: '8', concluida: false, anterior: null });
  });

  it('conta o progresso somando as séries de todos os exercícios', () => {
    // given
    const supino = seriesIniciais(4, 10, '60', null).map((s, i) => ({ ...s, concluida: i < 2 }));
    const triceps = seriesIniciais(3, 12, '25', null);

    // when
    const progresso = progressoDaSessao([supino, triceps]);

    // then
    expect(progresso).toEqual({ concluidas: 2, total: 7 });
  });

  it('envia para a API só as séries concluídas, com a carga convertida', () => {
    // given
    const series = seriesIniciais(3, 10, '62,5', null).map((s, i) => ({ ...s, concluida: i === 0 }));

    // when
    const registradas = paraSeriesRegistradas(SUPINO_RETO, series);

    // then
    expect(registradas).toEqual([{ exercicioId: SUPINO_RETO, numero: 1, cargaKg: 62.5, repeticoes: 10, concluida: true }]);
    expect(volumeDasSeries(registradas)).toBe(625);
  });
});
