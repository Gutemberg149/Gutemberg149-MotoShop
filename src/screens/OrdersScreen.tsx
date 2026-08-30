import { FlatList, Image, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useOrders } from "@/hooks/useOrders";
import { money } from "@/lib/format";
import { Button, ErrorState, Loading } from "@/components/ui";
import type { RootStackParamList } from "@/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Orders">;

export function OrdersScreen({ navigation }: Props) {
  const { data: orders, isLoading, isError, error, refetch, isFetching } = useOrders();

  if (isLoading) return <Loading label="Carregando seus pedidos..." />;
  if (isError) return <ErrorState message={(error as any)?.message ?? "Erro ao carregar pedidos"} onRetry={() => refetch()} />;

  return (
    <View style={styles.container}>
      {/* Cabeçalho com o botão de retorno */}
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Meus Pedidos</Text>
        <Button
          label="Início"
          variant="ghost"
          onPress={() => navigation.navigate("Products")}
        />
      </View>

      <FlatList
        data={orders ?? []}
        keyExtractor={(order, index) => order?.id || String(index)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={Boolean(isFetching && !isLoading)} onRefresh={() => refetch()} tintColor="#dc2626" />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.empty}>Você ainda não realizou nenhum pedido.</Text>
            <Button
              label="Explorar Produtos"
              onPress={() => navigation.navigate("Products")}
            />
          </View>
        }
        renderItem={({ item: order }) => (
          <Pressable
            style={styles.orderCard}
            onPress={() => navigation.navigate("Order", { id: order.id })}
          >
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>Pedido #{order.id?.slice(-6) || order.id}</Text>
              <Text style={styles.orderTotal}>{money(order.total ?? order.amount ?? 0)}</Text>
            </View>

            {order.items?.map((item: any, idx: number) => (
              <View key={item.variantId || item.id || String(idx)} style={styles.itemRow}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.thumb} />
                ) : (
                  <View style={[styles.thumb, styles.thumbEmpty]} />
                )}
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.productName}
                  </Text>
                  <Text style={styles.itemMeta}>
                    Qtd: {item.quantity} × {money(item.price)}
                  </Text>
                </View>
              </View>
            ))}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#f8fafc" },
  list: { padding: 12, gap: 12 },
  orderCard: { backgroundColor: "#1e293b", borderRadius: 8, padding: 12, gap: 12 },
  orderHeader: { flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#334155", paddingBottom: 8 },
  orderId: { fontSize: 14, fontWeight: "700", color: "#f8fafc" },
  orderTotal: { fontSize: 14, fontWeight: "700", color: "#ef4444" },
  itemRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  thumb: { width: 48, height: 48, borderRadius: 6, backgroundColor: "#334155" },
  thumbEmpty: { backgroundColor: "#334155" },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: "600", color: "#f8fafc" },
  itemMeta: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  emptyContainer: { alignItems: "center", gap: 16, marginTop: 40 },
  empty: { textAlign: "center", color: "#94a3b8" },
});