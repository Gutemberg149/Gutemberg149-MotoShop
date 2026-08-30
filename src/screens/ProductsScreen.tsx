import { useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { listProducts } from "@/services/products";
import { queryKeys } from "@/lib/queryKeys";
import { money } from "@/lib/format";
import { Button, ErrorState, Loading, TextField } from "@/components/ui";
import { useSession } from "@/session/session";
import type { RootStackParamList } from "@/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Products">;

export function ProductsScreen({ navigation }: Props) {
  const { signOut } = useSession();
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: queryKeys.products.list({ search }),
    queryFn: () => listProducts({ search }),
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextField placeholder="Buscar peça de moto..." value={search} onChangeText={setSearch} />
        <View style={styles.actions}>
          <Button label="Favoritos" variant="ghost" onPress={() => navigation.navigate("Favorites")} />
          <Button label="Pedidos" variant="ghost" onPress={() => navigation.navigate("Orders")} />
          <Button label="Carrinho" variant="ghost" onPress={() => navigation.navigate("Cart")} />
          <Button label="Sair" variant="ghost" onPress={signOut} />
        </View>
      </View>

      {isLoading ? (
        <Loading label="Buscando peças..." />
      ) : isError ? (
        <ErrorState message={(error as Error).message} onRetry={() => refetch()} />
      ) : (
        <FlatList
          data={data?.data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={() => refetch()} tintColor="#38bdf8" />}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => navigation.navigate("ProductDetail", { id: item.id, name: item.name })}
            >
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="cog-outline" size={32} color="#38bdf8" />
              </View>

              <View style={styles.info}>
                <Text style={styles.brand}>{item.brand ?? "Peça Multimarca"}</Text>
                <Text style={styles.title} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.price}>{money(item.priceFrom)}</Text>
              </View>

              <View style={styles.chevronContainer}>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#64748b" />
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  header: {
    padding: 16,
    gap: 12,
    backgroundColor: "#1e293b",
    borderBottomWidth: 1,
    borderColor: "#334155",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardPressed: {
    opacity: 0.8,
    backgroundColor: "#334155",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  brand: {
    fontSize: 11,
    color: "#38bdf8",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 15,
    color: "#f8fafc",
    fontWeight: "600",
    lineHeight: 20,
  },
  price: {
    fontSize: 16,
    color: "#38bdf8",
    fontWeight: "800",
    marginTop: 6,
  },
  chevronContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
