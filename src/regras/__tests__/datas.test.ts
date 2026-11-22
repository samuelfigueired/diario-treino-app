import {
  dataDeIso,
  diasDaSemanaDe,
  formatarCronometro,
  formatarDataLonga,
  formatarDuracao,
  inicioDaSemana,
  isoData,
  rotuloSemana,
} from '../datas';

describe('isoData', () => {
  it('gera a data local no formato da API, com zeros à esquerda', () => {
    // given
    const data = new Date(2026, 10, 3, 23, 30);

    // when
    const texto = isoData(data);

    // then
    expect(texto).toBe('2026-11-03');
  });

  it('volta a ser a mesma data local quando convertida com dataDeIso', () => {
    // given
    const texto = '2026-11-03';

    // when
    const data = dataDeIso(texto);

    // then
    expect(isoData(data)).toBe(texto);
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

describe('diasDaSemanaDe', () => {
  it('devolve os sete dias de segunda a domingo', () => {
    // given
    const terca = new Date(2026, 10, 3);

    // when
    const dias = diasDaSemanaDe(terca).map(isoData);

    // then
    expect(dias).toEqual([
      '2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06', '2026-11-07', '2026-11-08',
    ]);
  });
});

describe('rotuloSemana', () => {
  const hoje = new Date(2026, 10, 3);

  it('chama de "Esta semana" um treino da segunda-feira da mesma semana', () => {
    // given
    const segunda = new Date(2026, 10, 2);

    // when
    const rotulo = rotuloSemana(segunda, hoje);

    // then
    expect(rotulo).toBe('Esta semana');
  });

  it('chama de "Semana passada" o domingo anterior', () => {
    // given
    const domingo = new Date(2026, 10, 1);

    // when
    const rotulo = rotuloSemana(domingo, hoje);

    // then
    expect(rotulo).toBe('Semana passada');
  });

  it('usa a data da segunda-feira para semanas mais antigas', () => {
    // given
    const quinta = new Date(2026, 9, 22);

    // when
    const rotulo = rotuloSemana(quinta, hoje);

    // then
    expect(rotulo).toBe('Semana de 19/10');
  });
});

describe('formatação de tempo', () => {
  it('mostra o cronômetro em minutos e segundos', () => {
    // given
    const segundos = 32 * 60 + 15;

    // when
    const texto = formatarCronometro(segundos);

    // then
    expect(texto).toBe('32:15');
  });

  it('inclui as horas no cronômetro a partir de uma hora de treino', () => {
    // given
    const segundos = 3600 + 4 * 60 + 9;

    // when
    const texto = formatarCronometro(segundos);

    // then
    expect(texto).toBe('1:04:09');
  });

  it('não mostra tempo negativo quando o descanso já acabou', () => {
    // given
    const segundos = -12;

    // when
    const texto = formatarCronometro(segundos);

    // then
    expect(texto).toBe('00:00');
  });

  it('mostra a duração em horas e minutos a partir de 60 minutos', () => {
    // given
    const minutos = [58, 64];

    // when
    const textos = minutos.map(formatarDuracao);

    // then
    expect(textos).toEqual(['58 min', '1h 04']);
  });

  it('escreve a data longa em português', () => {
    // given
    const data = new Date(2026, 10, 3);

    // when
    const texto = formatarDataLonga(data);

    // then
    expect(texto).toBe('Terça, 3 de novembro');
  });
});
