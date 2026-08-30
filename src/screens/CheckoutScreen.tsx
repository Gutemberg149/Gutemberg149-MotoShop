import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCheckout } from "@/hooks/useCheckout";
import { Button } from "@/components/ui";
import type { RootStackParamList } from "@/navigation";
import type { PaymentMethod } from "@/types/api";

type Props = NativeStackScreenProps<RootStackParamList, "Checkout">;

export function CheckoutScreen({ navigation }: Props) {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("PIX" as PaymentMethod);
  const checkoutMutation = useCheckout();

  const handleConfirmPayment = () => {
    if (!selectedPayment) {
      Alert.alert("Atenção", "Selecione um método de pagamento.");
      return;
    }

    checkoutMutation.mutate(
      { paymentMethod: selectedPayment },
      {
        onSuccess: () => {
          Alert.alert("Sucesso!", "Seu pedido foi realizado com sucesso.", [
            {
              text: "Ver Meus Pedidos",
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Orders" as any }],
                });
              },
            },
          ]);
        },
        onError: (error: any) => {
          Alert.alert("Erro no Pagamento", error?.response?.data?.message || "Não foi possível finalizar o pedido.");
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Método de Pagamento</Text>

      <View style={styles.methods}>
        <Button
          label="PIX"
          variant={selectedPayment === ("PIX" as PaymentMethod) ? "primary" : "ghost"}
          onPress={() => setSelectedPayment("PIX" as PaymentMethod)}
        />
        <Button
          label="Cartão de Crédito"
          variant={selectedPayment === ("CREDIT_CARD" as PaymentMethod) ? "primary" : "ghost"}
          onPress={() => setSelectedPayment("CREDIT_CARD" as PaymentMethod)}
        />
      </View>

      <Button
        label={checkoutMutation.isPending ? "Finalizando..." : "Confirmar e Finalizar Pedido"}
        onPress={handleConfirmPayment}
        disabled={checkoutMutation.isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0f172a", justifyContent: "space-between" },
  title: { fontSize: 18, fontWeight: "700", color: "#f8fafc", marginBottom: 12 },
  methods: { gap: 10, flex: 1 },
});
