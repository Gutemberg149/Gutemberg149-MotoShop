import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { forgotPassword } from '@/services/auth';
import { Button, TextField } from '@/components/ui';
import type { AuthStackParamList } from '@/navigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      setSent(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Senha</Text>
      {sent ? (
        <>
          <Text style={styles.text}>Se o e-mail existir, um código foi enviado para você.</Text>
          <Button label="Voltar ao Login" onPress={() => navigation.navigate('SignIn')} />
        </>
      ) : (
        <>
          <TextField placeholder="Seu e-mail cadastrado" value={email} onChangeText={setEmail} autoCapitalize="none" />
          <Button label="Enviar Instruções" onPress={handleSend} />
          <Button label="Cancelar" variant="ghost" onPress={() => navigation.navigate('SignIn')} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 24, fontWeight: '700', color: '#f8fafc', textAlign: 'center', marginBottom: 12 },
  text: { color: '#94a3b8', textAlign: 'center', marginVertical: 8 },
});