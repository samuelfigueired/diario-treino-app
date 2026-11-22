import { router } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';
import { Botao, Campo, Tela } from '../components/ui';
import { cores } from '../tema';

/** RF01 · Login. Protótipo: tela 01. A chamada à API entra quando o módulo de autenticação existir. */
export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <Tela titulo="Diário de Treino">
      <Text style={{ color: cores.textoSecundario, fontSize: 15, lineHeight: 22 }}>
        Registre seus treinos e acompanhe a evolução das suas cargas.
      </Text>
      <Campo rotulo="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
      <Campo rotulo="Senha" value={senha} onChangeText={setSenha} secureTextEntry autoComplete="password" />
      <Botao titulo="Entrar" onPress={() => router.replace('/(tabs)')} />
    </Tela>
  );
}
