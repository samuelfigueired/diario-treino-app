import { converterCarga, formatarCarga, volumeDaSerie } from '../carga';

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

describe('formatarCarga', () => {
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
