import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { criarConta, entrar, salvarToken } from '../api';
import { Botao, Campo, Icone, Segmentado, Tela } from '../components/ui';
import { ErrosAcesso, validarAcesso } from '../regras';
import { cores, espaco } from '../tema';

type Modo = 'entrar' | 'criar';
const MODOS = [
  { valor: 'entrar', rotulo: 'Entrar' },
  { valor: 'criar', rotulo: 'Criar conta' },
] as const;

/** RF01 · Login e criação de conta. Protótipo: tela 01. */
export default function Login() {
  const [modo, setModo] = useState<Modo>('entrar');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState<ErrosAcesso>({});
  const criando = modo === 'criar';

  const acesso = useMutation({
    mutationFn: () => (criando ? criarConta(nome.trim(), email.trim(), senha) : entrar(email.trim(), senha)),
    onSuccess: async (sessao) => {
      await salvarToken(sessao.token);
      router.replace('/');
    },
  });

  function enviar() {
    const encontrados = validarAcesso({ nome, email, senha }, criando);
    setErros(encontrados);
    if (Object.keys(encontrados).length === 0) acesso.mutate();
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Tela>
        <View style={estilos.marca}>
          <View style={estilos.logo}>
            <Icone nome="haltere" tamanho={28} cor={cores.textoSobreDestaque} espessura={2.2} />
          </View>
          <Text accessibilityRole="header" style={estilos.titulo}>
            Diário de Treino
          </Text>
          <Text style={estilos.descricao}>Registre seus treinos e acompanhe a evolução das suas cargas.</Text>
        </View>

        <Segmentado opcoes={MODOS} valor={modo} onChange={(m) => { setModo(m); setErros({}); }} />

        <View style={{ gap: espaco.lg }}>
          {criando ? (
            <Campo rotulo="Nome" value={nome} onChangeText={setNome} erro={erros.nome} autoComplete="name" textContentType="name" />
          ) : null}
          <Campo
            rotulo="E-mail"
            value={email}
            onChangeText={setEmail}
            erro={erros.email}
            placeholder="voce@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
          />
          <Campo
            rotulo="Senha"
            value={senha}
            onChangeText={setSenha}
            erro={erros.senha}
            secureTextEntry
            autoComplete={criando ? 'new-password' : 'current-password'}
            textContentType={criando ? 'newPassword' : 'password'}
            onSubmitEditing={enviar}
          />
          {!criando ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => Alert.alert('Recuperar senha', 'A recuperação de senha ainda não está disponível.')}
              style={estilos.esqueci}
            >
              <Text style={estilos.link}>Esqueci minha senha</Text>
            </Pressable>
          ) : null}
        </View>

        {acesso.error ? <Text style={estilos.erro}>{acesso.error.message}</Text> : null}
        <Botao titulo={criando ? 'Criar conta' : 'Entrar'} onPress={enviar} carregando={acesso.isPending} />
        <Text style={estilos.rodape}>Ao entrar, seus treinos ficam salvos na sua conta.</Text>
      </Tela>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  marca: { gap: espaco.md, marginTop: espaco.xxl },
  logo: { width: 56, height: 56, borderRadius: 16, backgroundColor: cores.destaque, alignItems: 'center', justifyContent: 'center', marginBottom: espaco.sm },
  titulo: { fontSize: 30, fontWeight: '700', color: cores.texto },
  descricao: { fontSize: 15, lineHeight: 22, color: cores.textoSecundario },
  esqueci: { alignSelf: 'flex-end', minHeight: 44, justifyContent: 'center' },
  link: { fontSize: 13, fontWeight: '500', color: cores.destaque },
  erro: { fontSize: 14, color: cores.erro, textAlign: 'center' },
  rodape: { fontSize: 12, color: cores.textoSecundario, textAlign: 'center' },
});
