import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSession } from '@/session/session';
import { Button, TextField } from '@/components/ui';
import type { AuthStackParamList } from '@/navigation';
import { LogoIcon } from '@/components/LogoIcon';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;

export function SignInScreen({ navigation }: Props) {
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await signIn(email, password);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
     <View style={styles.brandContainer}>
        <LogoIcon size={56} color="#38bdf8" />
        <Text style={styles.title}>MotoShop</Text>

      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextField placeholder="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextField placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
      <Button label={loading ? 'Entrando...' : 'Entrar'} onPress={handleLogin} disabled={loading} />
      <Button label="Criar Conta" variant="ghost" onPress={() => navigation.navigate('SignUp')} />
      <Button label="Esqueci a Senha" variant="ghost" onPress={() => navigation.navigate('ForgotPassword')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 28, fontWeight: '700', color: '#dc2626', textAlign: 'center', marginBottom: 12 },
  error: { color: '#ef4444', textAlign: 'center' },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
});