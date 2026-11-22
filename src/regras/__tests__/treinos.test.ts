import { isoData } from '../datas';
import { resumoDaSemana, textoDiasDaSemana, textoQuantidadeExercicios } from '../treinos';
import { serie, sessao, SUPINO_RETO } from '../__fixtures__/sessoes';

describe('textoDiasDaSemana', () => {
  it('ordena os dias de segunda a domingo e junta com "e"', () => {
    // given
    const dias = ['QUI', 'SEG'] as const;

    // when
    const texto = textoDiasDaSemana([...dias]);

    // then
    expect(texto).toBe('Seg e Qui');
  });

  it('separa com vírgula quando há mais de dois dias', () => {
    // given
    const dias = ['SEX', 'SEG', 'QUA'] as const;

    // when
    const texto = textoDiasDaSemana([...dias]);

    // then
    expect(texto).toBe('Seg, Qua e Sex');
  });

  it('avisa quando o treino não tem dia fixo', () => {
    // given
    const dias: never[] = [];

    // when
    const texto = textoDiasDaSemana(dias);

    // then
    expect(texto).toBe('Sem dia fixo');
  });
});

describe('textoQuantidadeExercicios', () => {
  it('usa singular para um exercício', () => {
    // given
    const quantidades = [1, 5];

    // when
    const textos = quantidades.map(textoQuantidadeExercicios);

    // then
    expect(textos).toEqual(['1 exercício', '5 exercícios']);
  });
});

describe('resumoDaSemana', () => {
  it('marca os dias treinados da semana e conta a meta pelos dias planejados', () => {
    // given
    const hoje = new Date(2026, 10, 3);
    const sessoes = [
      sessao(1, [2026, 11, 2], [serie(SUPINO_RETO, 1, 60, 10)]),
      sessao(2, [2026, 11, 3], [serie(SUPINO_RETO, 1, 60, 10)]),
      sessao(3, [2026, 10, 31], [serie(SUPINO_RETO, 1, 60, 10)]),
    ];

    // when
    const resumo = resumoDaSemana(sessoes, ['SEG', 'TER', 'QUI', 'SAB', 'SEG'], hoje);

    // then
    expect(resumo.feitos).toBe(2);
    expect(resumo.meta).toBe(4);
    expect(resumo.dias.filter((d) => d.treinou).map((d) => d.iso)).toEqual(['2026-11-02', '2026-11-03']);
    expect(resumo.dias.find((d) => d.hoje)?.iso).toBe(isoData(hoje));
  });
});
