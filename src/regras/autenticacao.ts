const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const TAMANHO_MINIMO_SENHA = 8;

export type DadosAcesso = { nome?: string; email: string; senha: string };
export type ErrosAcesso = Partial<Record<keyof DadosAcesso, string>>;

/** Valida o formulário de login ou de criação de conta. Retorna só os campos com erro. */
export function validarAcesso(dados: DadosAcesso, criandoConta: boolean): ErrosAcesso {
  const erros: ErrosAcesso = {};
  if (criandoConta && (dados.nome ?? '').trim().length < 2) erros.nome = 'Informe seu nome.';
  if (!EMAIL_VALIDO.test(dados.email.trim())) erros.email = 'Informe um e-mail válido.';
  if (dados.senha.length < TAMANHO_MINIMO_SENHA) {
    erros.senha = `A senha precisa ter pelo menos ${TAMANHO_MINIMO_SENHA} caracteres.`;
  }
  return erros;
}
