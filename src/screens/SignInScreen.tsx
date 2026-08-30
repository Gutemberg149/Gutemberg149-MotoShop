import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSession } from "@/session/session";
import { Button, TextField } from "@/components/ui";
import type { AuthStackParamList } from "@/navigation";
import { LogoIcon } from "@/components/LogoIcon";

type Props = NativeStackScreenProps<AuthStackParamList, "SignIn">;

export function SignInScreen({ navigation }: Props) {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await signIn(email, password);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <LogoIcon size={48} color="#38bdf8" />
          </View>
          <Text style={styles.title}>MotoShop</Text>
          <Text style={styles.subtitle}>Acesse sua conta para continuar</Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.error}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.formContainer}>
          <TextField placeholder="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <TextField placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />

          <View style={styles.actionContainer}>
            <Button label={loading ? "Entrando..." : "Entrar"} onPress={handleLogin} disabled={loading} />
          </View>
        </View>

        <View style={styles.footerContainer}>
          <Button label="Criar Conta" variant="ghost" onPress={() => navigation.navigate("SignUp")} />
          <Button label="Esqueci a Senha" variant="ghost" onPress={() => navigation.navigate("ForgotPassword")} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  brandContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#38bdf8",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 6,
  },
  errorContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  error: {
    color: "#ef4444",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  formContainer: {
    gap: 16,
  },
  actionContainer: {
    marginTop: 8,
  },
  footerContainer: {
    marginTop: 24,
    gap: 4,
  },
});
