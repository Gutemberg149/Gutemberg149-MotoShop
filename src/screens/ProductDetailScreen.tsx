import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getProduct } from "@/services/products";
import { queryKeys } from "@/lib/queryKeys";
import { useCartMutations } from "@/hooks/useCart";
import { useFavoriteMutations, useFavorites } from "@/hooks/useFavorites";
import { money } from "@/lib/format";
import { Button, ErrorState, Loading } from "@/components/ui";
import type { RootStackParamList } from "@/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "ProductDetail">;

export function ProductDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => getProduct(id),
  });

  const { data: favorites } = useFavorites();
  const { addFavoriteAsync, removeFavoriteAsync, isAdding, isRemoving } = useFavoriteMutations();
  const { add: addToCartMutation } = useCartMutations();

  if (isLoading) return <Loading label="Carregando produto..." />;
  if (isError || !product) return <ErrorState message={(error as Error)?.message ?? "Não encontrado"} onRetry={() => refetch()} />;

  const activeVariant = product.variants[selectedVariantIndex] ?? product.variants[0];
  const isFav = favorites?.some((f) => f.variantId === activeVariant?.id);
  const imageUrl = activeVariant?.images[0]?.url ?? product.images[0]?.url;

  const toggleFav = async () => {
    if (!activeVariant || !product) return;
    try {
      if (isFav) {
        await removeFavoriteAsync(activeVariant.id);
        Alert.alert("Favoritos", `"${product.name}" foi removido dos favoritos.`);
      } else {
        await addFavoriteAsync(activeVariant.id);
        Alert.alert("Favoritos", `"${product.name}" foi adicionado aos favoritos!`);
      }
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar os favoritos.");
    }
  };

  const handleAddToCart = () => {
    if (!activeVariant) return;
    addToCartMutation.mutate({ variantId: activeVariant.id, quantity: 1 }, { onSuccess: () => navigation.navigate("Cart") });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.imageCard}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <MaterialCommunityIcons name="cog-outline" size={64} color="#38bdf8" />
          </View>
        )}
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.brand}>{product.brand?.name ?? "Peça Moto"}</Text>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>{money(activeVariant?.price ?? 0)}</Text>

        {product.variants.length > 1 && (
          <View style={styles.variantsSection}>
            <Text style={styles.label}>Selecione a variação:</Text>
            <View style={styles.variantList}>
              {product.variants.map((v, i) => {
                const isSelected = selectedVariantIndex === i;
                return (
                  <Pressable key={v.id} style={[styles.chip, isSelected && styles.chipSelected]} onPress={() => setSelectedVariantIndex(i)}>
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{v.label || v.sku}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.descSection}>
          <Text style={styles.label}>Descrição do Produto</Text>
          <Text style={styles.desc}>{product.description ?? "Sem descrição técnica do fabricante."}</Text>
        </View>

        <View style={styles.actions}>
          <Button label={isFav ? "Remover dos Favoritos" : "Salvar nos Favoritos"} variant="ghost" disabled={isAdding || isRemoving} onPress={toggleFav} />
          <Button label="Adicionar ao Carrinho" onPress={handleAddToCart} disabled={addToCartMutation.isPending} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  content: {
    padding: 16,
    gap: 16,
  },
  imageCard: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#334155",
  },
  image: {
    width: "100%",
    height: 260,
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f172a",
  },
  detailsCard: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  brand: {
    fontSize: 11,
    color: "#38bdf8",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f8fafc",
    lineHeight: 28,
  },
  price: {
    fontSize: 24,
    fontWeight: "800",
    color: "#38bdf8",
  },
  variantsSection: {
    gap: 8,
    marginTop: 4,
  },
  label: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
  },
  variantList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
  },
  chipSelected: {
    backgroundColor: "#38bdf8",
    borderColor: "#38bdf8",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#f8fafc",
  },
  chipTextSelected: {
    color: "#0f172a",
  },
  divider: {
    height: 1,
    backgroundColor: "#334155",
    marginVertical: 4,
  },
  descSection: {
    gap: 6,
  },
  desc: {
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 22,
  },
  actions: {
    gap: 10,
    marginTop: 12,
  },
});
