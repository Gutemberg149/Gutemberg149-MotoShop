import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavorite, getFavorites, removeFavorite } from "@/services/favorites";
import { getProduct } from "@/services/products";
import { queryKeys } from "@/lib/queryKeys";
import { useSession } from "@/session/session";
import { FavoriteItem } from "@/types/api";

export function useFavorites() {
  const { isLoggedIn } = useSession();

  return useQuery<FavoriteItem[]>({
    queryKey: queryKeys.favorites.all,
    queryFn: async () => {
      const response = await getFavorites();

      let rawFavorites: any[] = [];
      if (Array.isArray(response)) {
        rawFavorites = response;
      } else if (response && typeof response === "object") {
        if (Array.isArray((response as any).favorites)) {
          rawFavorites = (response as any).favorites;
        } else if (Array.isArray((response as any).data)) {
          rawFavorites = (response as any).data;
        }
      }

      if (!rawFavorites || rawFavorites.length === 0) return [];

      return Promise.all(
        rawFavorites.map(async (fav: any): Promise<FavoriteItem> => {
          const variantId = fav?.variantId || fav?.variant?.id || fav?.id || "";

          // Captura o nome da peça (a API do Mockmerce envia em fav.product como string)
          const extractedTitle =
            (typeof fav?.product === "string" ? fav.product : fav?.product?.name) ||
            fav?.productName ||
            fav?.variant?.product?.name ||
            fav?.name ||
            fav?.title ||
            "Peça sem título";

          const targetProductId = fav?.productId || fav?.product?.id || fav?.variant?.productId || "";
          const existingImage = fav?.image || fav?.product?.images?.[0]?.url || fav?.product?.imageUrl || fav?.imageUrl;
          const existingPrice = fav?.price ?? fav?.variant?.price ?? 0;
          const variantLabel = fav?.variantLabel || fav?.sku || fav?.variant?.sku || null;

          // Se já temos o productId, tentamos enriquecer para buscar a imagem
          if (targetProductId) {
            try {
              const product = await getProduct(targetProductId);
              const variant = Array.isArray(product?.variants) ? product.variants.find((v: any) => v?.id === variantId) : null;

              return {
                ...fav,
                variantId,
                productId: product?.id || targetProductId,
                productName: product?.name || extractedTitle,
                image: variant?.images?.[0]?.url ?? product?.images?.[0]?.url ?? existingImage ?? null,
                price: existingPrice || variant?.price || product?.variants?.[0]?.price || 0,
                variantLabel: variant?.label ?? variant?.sku ?? variantLabel,
              };
            } catch {
            
            }
          }

          return {
            ...fav,
            variantId,
            productId: targetProductId,
            productName: extractedTitle,
            image: existingImage || null,
            price: existingPrice,
            variantLabel,
          };
        })
      );
    },
    enabled: Boolean(isLoggedIn),
  });
}

export function useFavoriteMutations() {
  const queryClient = useQueryClient();

  const add = useMutation({
    mutationFn: (variantId: string) => addFavorite(variantId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all }),
  });

  const remove = useMutation({
    mutationFn: (variantId: string) => removeFavorite(variantId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all }),
  });

  return {
    addFavorite: add.mutate,
    removeFavorite: remove.mutate,
    addFavoriteAsync: add.mutateAsync,
    removeFavoriteAsync: remove.mutateAsync,
    isAdding: add.isPending,
    isRemoving: remove.isPending,
  };
}
