import {
  cargaParaCampo,
  converterCarga,
  converterRepeticoes,
  emToneladas,
  formatarCarga,
  formatarNumero,
  volumeDaSerie,
} from '../carga';

describe('converterCarga', () => {
  it('aceita vírgula decimal digitada no teclado brasileiro', () => {
    // given
    const texto = '62,5';

    // when
    const carga = converterCarga(texto);

    // then
    expect(carga).toBe(62.5);
  });

  it('retorna nulo quando o campo está vazio ou só com espaços', () => {
    // given
    const textos = ['', '   '];

    // when
    const cargas = textos.map(converterCarga);

    // then
    expect(cargas).toEqual([null, null]);
  });

  it('retorna nulo para carga negativa ou texto inválido', () => {
    // given
    const textos = ['-20', '20kg', '1,2,3'];

    // when
    const cargas = textos.map(converterCarga);

    // then
    expect(cargas).toEqual([null, null, null]);
  });
});

describe('converterRepeticoes', () => {
  it('aceita só números inteiros maiores que zero', () => {
    // given
    const textos = ['10', ' 8 ', '0', '7,5', ''];

    // when
    const repeticoes = textos.map(converterRepeticoes);

    // then
    expect(repeticoes).toEqual([10, 8, null, null, null]);
  });
});

describe('formatação de números e cargas', () => {
  it('usa ponto como separador de milhar e vírgula decimal', () => {
    // given
    const valores = [7840, 12350.5, 57.5];

    // when
    const textos = valores.map((v) => formatarNumero(v));

    // then
    expect(textos).toEqual(['7.840', '12.350,5', '57,5']);
  });

  it('mostra a carga com vírgula e a unidade', () => {
    // given
    const kg = 57.5;

    // when
    const texto = formatarCarga(kg);

    // then
    expect(texto).toBe('57,5 kg');
  });

  it('mostra "Peso corporal" quando a série não tem carga', () => {
    // given
    const kg = null;

    // when
    const texto = formatarCarga(kg);

    // then
    expect(texto).toBe('Peso corporal');
  });

  it('prepara a carga para o campo de edição sem separador de milhar', () => {
    // given
    const cargas = [57.5, 1200, null];

    // when
    const textos = cargas.map(cargaParaCampo);

    // then
    expect(textos).toEqual(['57,5', '1200', '']);
  });

  it('converte o volume para toneladas com uma casa decimal', () => {
    // given
    const kg = 86420;

    // when
    const texto = emToneladas(kg);

    // then
    expect(texto).toBe('86,4');
  });
});

describe('volumeDaSerie', () => {
  it('multiplica a carga pelas repetições', () => {
    // given
    const kg = 62.5;
    const repeticoes = 10;

    // when
    const volume = volumeDaSerie(kg, repeticoes);

    // then
    expect(volume).toBe(625);
  });

  it('é zero quando a série não tem repetições', () => {
    // given
    const kg = 40;

    // when
    const volume = volumeDaSerie(kg, 0);

    // then
    expect(volume).toBe(0);
  });
});
