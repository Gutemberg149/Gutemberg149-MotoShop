import { Alert, FlatList, Image, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFavoriteMutations, useFavorites } from "@/hooks/useFavorites";
import { money } from "@/lib/format";
import { Button, ErrorState, Loading } from "@/components/ui";
import type { RootStackParamList } from "@/navigation";
import type { ApiError } from "@/types/api";

type Props = NativeStackScreenProps<RootStackParamList, "Favorites">;

export function FavoritesScreen({ navigation }: Props) {
  const { data, isLoading, isError, error, refetch, isFetching } = useFavorites();
  const { removeFavoriteAsync, isRemoving } = useFavoriteMutations();

  const handleRemove = async (variantId: string, title: string) => {
    try {
      await removeFavoriteAsync(variantId);
      Alert.alert("Favoritos", `"${title}" foi removido dos favoritos.`);
    } catch {
      Alert.alert("Erro", "Não foi possível remover o item dos favoritos.");
    }
  };

  if (isLoading) return <Loading label="Carregando lista de peças salvas..." />;
  if (isError) return <ErrorState message={(error as ApiError)?.message ?? "Erro ao carregar favoritos"} onRetry={() => refetch()} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={data ?? []}
        keyExtractor={(item, index) => item?.variantId || (item as any)?.id || String(index)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={Boolean(isFetching && !isLoading)} onRefresh={() => refetch()} tintColor="#dc2626" />}
        ListEmptyComponent={<Text style={styles.empty}>Você não tem peças salvas nos favoritos.</Text>}
        renderItem={({ item }: { item: any }) => {
          const displayTitle = item?.productName || item?.product?.name || item?.variant?.product?.name || item?.name || item?.title || "Peça sem título";
          const imageUri = item?.image || item?.product?.images?.[0]?.url || item?.product?.imageUrl || item?.imageUrl;
          const productId = item?.productId || item?.product?.id || item?.variant?.productId;

          return (
            <View style={styles.card}>
              <Pressable
                style={styles.cardInfo}
                onPress={() => {
                  if (productId) {
                    navigation.navigate("ProductDetail", { id: productId, name: displayTitle });
                  }
                }}
              >
                {imageUri ? <Image source={{ uri: imageUri }} style={styles.thumb} /> : <View style={[styles.thumb, styles.thumbEmpty]} />}
                <View style={styles.details}>
                  <Text style={styles.name} numberOfLines={2}>
                    {displayTitle}
                  </Text>
                  {item?.variantLabel && <Text style={styles.variant}>{item.variantLabel}</Text>}
                  <Text style={styles.price}>{money(item?.price ?? 0)}</Text>
                </View>
              </Pressable>
              <Button label="Remover" variant="ghost" disabled={isRemoving} onPress={() => handleRemove(item?.variantId || item?.id, displayTitle)} />
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  list: { padding: 12, gap: 10 },
  card: { backgroundColor: "#1e293b", borderRadius: 8, padding: 10, gap: 10 },
  cardInfo: { flexDirection: "row", gap: 12 },
  thumb: { width: 64, height: 64, borderRadius: 6, backgroundColor: "#334155" },
  thumbEmpty: { backgroundColor: "#334155" },
  details: { flex: 1, justifyContent: "center" },
  name: { fontSize: 14, fontWeight: "600", color: "#f8fafc" },
  variant: { fontSize: 12, color: "#94a3b8" },
  price: { fontSize: 14, fontWeight: "700", color: "#ef4444", marginTop: 2 },
  empty: { textAlign: "center", color: "#94a3b8", marginTop: 40 },
});
