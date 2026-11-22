import { validarAcesso } from '../autenticacao';

describe('validarAcesso', () => {
  it('aceita e-mail e senha válidos no login', () => {
    // given
    const dados = { email: 'mariana.rocha@exemplo.com.br', senha: 'treino2026' };

    // when
    const erros = validarAcesso(dados, false);

    // then
    expect(erros).toEqual({});
  });

  it('aponta e-mail inválido e senha curta', () => {
    // given
    const dados = { email: 'mariana.rocha@', senha: '1234' };

    // when
    const erros = validarAcesso(dados, false);

    // then
    expect(Object.keys(erros)).toEqual(['email', 'senha']);
  });

  it('exige o nome só ao criar conta', () => {
    // given
    const dados = { nome: ' ', email: 'mariana.rocha@exemplo.com.br', senha: 'treino2026' };

    // when
    const noLogin = validarAcesso(dados, false);
    const naCriacao = validarAcesso(dados, true);

    // then
    expect(noLogin.nome).toBeUndefined();
    expect(naCriacao.nome).toBe('Informe seu nome.');
  });
});
