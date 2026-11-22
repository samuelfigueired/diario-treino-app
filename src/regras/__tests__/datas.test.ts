import { inicioDaSemana, isoData } from '../datas';

describe('isoData', () => {
  it('gera a data local no formato da API, com zeros à esquerda', () => {
    // given
    const data = new Date(2026, 10, 3, 23, 30);

    // when
    const texto = isoData(data);

    // then
    expect(texto).toBe('2026-11-03');
  });
});

describe('inicioDaSemana', () => {
  it('volta para a segunda-feira quando a data é uma terça', () => {
    // given
    const terca = new Date(2026, 10, 3);

    // when
    const segunda = inicioDaSemana(terca);

    // then
    expect(isoData(segunda)).toBe('2026-11-02');
  });

  it('considera domingo como o último dia da semana', () => {
    // given
    const domingo = new Date(2026, 10, 8);

    // when
    const segunda = inicioDaSemana(domingo);

    // then
    expect(isoData(segunda)).toBe('2026-11-02');
  });

  it('volta para o ano anterior quando a semana começa em dezembro', () => {
    // given
    const sexta = new Date(2027, 0, 1);

    // when
    const segunda = inicioDaSemana(sexta);

    // then
    expect(isoData(segunda)).toBe('2026-12-28');
  });
});
