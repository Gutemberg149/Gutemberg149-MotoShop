import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSession } from "@/session/session";
import { Button, TextField } from "@/components/ui";
import type { AuthStackParamList } from "@/navigation";

type Props = NativeStackScreenProps<AuthStackParamList, "SignUp">;

export function SignUpScreen({ navigation }: Props) {
  const { signUp } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError("");
      await signUp(name, email, password);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextField placeholder="Nome Completo" value={name} onChangeText={setName} />
      <TextField placeholder="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextField placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
      <Button label={loading ? "Cadastrando..." : "Cadastrar"} onPress={handleRegister} disabled={loading} />
      <Button label="Já possui conta? Entrar" variant="ghost" onPress={() => navigation.navigate("SignIn")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: 24, fontWeight: "700", color: "#f8fafc", textAlign: "center", marginBottom: 12 },
  error: { color: "#ef4444", textAlign: "center" },
});
