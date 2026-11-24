import { lerPreferencias, PREFERENCIAS_PADRAO, rotuloDescanso } from '../preferencias';

describe('lerPreferencias', () => {
  it('usa o padrão quando não há nada salvo', () => {
    expect(lerPreferencias(null)).toEqual(PREFERENCIAS_PADRAO);
  });

  it('mantém um descanso salvo que está entre as opções', () => {
    expect(lerPreferencias({ descansoSegundos: 120 })).toEqual({ descansoSegundos: 120 });
  });

  it('descarta um descanso fora das opções', () => {
    expect(lerPreferencias({ descansoSegundos: 7 })).toEqual(PREFERENCIAS_PADRAO);
    expect(lerPreferencias({ descansoSegundos: '90' })).toEqual(PREFERENCIAS_PADRAO);
  });
});

describe('rotuloDescanso', () => {
  it('formata segundos e minutos', () => {
    expect(rotuloDescanso(60)).toBe('1 min');
    expect(rotuloDescanso(90)).toBe('1 min 30 s');
    expect(rotuloDescanso(45)).toBe('45 s');
  });
});
