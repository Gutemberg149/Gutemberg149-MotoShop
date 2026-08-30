// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { addFavorite, getFavorites, removeFavorite } from '@/services/favorites';
// import { getProduct, listProducts } from '@/services/products';
// import { queryKeys } from '@/lib/queryKeys';
// import { useSession } from '@/session/session';

// export function useFavorites() {
//   const { isLoggedIn } = useSession();

//   return useQuery({
//     queryKey: queryKeys.favorites.all,
//     queryFn: async () => {
//       // 1. Busca os favoritos crus da API
//       const rawFavorites = await getFavorites();
//       if (!Array.isArray(rawFavorites) || rawFavorites.length === 0) return [];

//       // 2. Busca a lista de produtos (acessando a propriedade paginada correta)
//       const paginatedData = await listProducts({ pageSize: 50 });
//       const productSummaries = (paginatedData as any).data || (paginatedData as any).items || [];

//       // 3. Busca o detalhe dos produtos em paralelo para acessar as variantes
//       const fullProducts = await Promise.all(
//         productSummaries.map(async (summary: any) => {
//           try {
//             return await getProduct(summary.id);
//           } catch {
//             return null;
//           }
//         })
//       );

//       const validProducts = fullProducts.filter(Boolean);

//       // 4. Mapeia os favoritos cruzando o variantId com as variantes do produto
//       return rawFavorites.map((fav: any) => {
//         if (fav.productName || fav.product?.name) return fav;

//         const targetVariantId = fav.variantId || fav.id;

//         const matchingProduct = validProducts.find((prod) =>
//           prod?.variants?.some((v: any) => v.id === targetVariantId)
//         );

//         if (matchingProduct) {
//           const matchingVariant = matchingProduct.variants?.find((v: any) => v.id === targetVariantId);

//           return {
//             ...fav,
//             productId: matchingProduct.id,
//             productName: matchingProduct.name,
//             image: matchingVariant?.images?.[0]?.url || matchingProduct.images?.[0]?.url,
//             price: matchingVariant?.price ?? fav.price ?? 0,
//             variantLabel: matchingVariant?.label || matchingVariant?.sku,
//           };
//         }

//         return fav;
//       });
//     },
//     enabled: isLoggedIn,
//   });
// }

// export function useFavoriteMutations() {
//   const queryClient = useQueryClient();

//   const add = useMutation({
//     mutationFn: (variantId: string) => addFavorite(variantId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all });
//     },
//   });

//   const remove = useMutation({
//     mutationFn: (variantId: string) => removeFavorite(variantId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all });
//     },
//   });

//   return {
//     addFavorite: add.mutate,
//     removeFavorite: remove.mutate,
//     addFavoriteAsync: add.mutateAsync,
//     removeFavoriteAsync: remove.mutateAsync,
//     isAdding: add.isPending,
//     isRemoving: remove.isPending,
//   };
// }

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addFavorite, getFavorites, removeFavorite } from '@/services/favorites';
import { getProduct } from '@/services/products';
import { queryKeys } from '@/lib/queryKeys';
import { useSession } from '@/session/session';
import { FavoriteItem } from '@/types/api';

export function useFavorites() {
  const { isLoggedIn } = useSession();

  return useQuery<FavoriteItem[]>({
    queryKey: queryKeys.favorites.all,
    queryFn: async () => {
      const rawFavorites = await getFavorites();
      if (!Array.isArray(rawFavorites) || rawFavorites.length === 0) return [];

      return Promise.all(
        rawFavorites.map(async (fav: FavoriteItem): Promise<FavoriteItem> => {
          if (fav.productName || (fav as Record<string, any>).product?.name) {
            return fav;
          }

          const targetProductId = fav.productId || (fav as Record<string, any>).product?.id;

          if (!targetProductId) return fav;

          try {
            const product = await getProduct(targetProductId);
            const variant = product.variants?.find((v: any) => v.id === fav.variantId);

            return {
              ...fav,
              productId: product.id,
              productName: product.name,
              image: variant?.images?.[0]?.url ?? product.images?.[0]?.url ?? fav.image ?? null,
              price: fav.price ?? variant?.price ?? 0,
              variantLabel: variant?.label ?? variant?.sku ?? fav.variantLabel ?? null,
            };
          } catch {
            return fav;
          }
        })
      );
    },
    enabled: isLoggedIn,
  });
}

export function useFavoriteMutations() {
  const queryClient = useQueryClient();

  const add = useMutation({
    mutationFn: (variantId: string) => addFavorite(variantId),
    onMutate: async (variantId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites.all });
      const previousFavorites = queryClient.getQueryData<FavoriteItem[]>(queryKeys.favorites.all) || [];

      queryClient.setQueryData<FavoriteItem[]>(queryKeys.favorites.all, (old = []) => [
        ...old,
        { variantId } as FavoriteItem,
      ]);

      return { previousFavorites };
    },
    onError: (_err, _variantId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(queryKeys.favorites.all, context.previousFavorites);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all });
    },
  });

  const remove = useMutation({
    mutationFn: (variantId: string) => removeFavorite(variantId),
    onMutate: async (variantId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites.all });
      const previousFavorites = queryClient.getQueryData<FavoriteItem[]>(queryKeys.favorites.all) || [];

      queryClient.setQueryData<FavoriteItem[]>(queryKeys.favorites.all, (old = []) =>
        old.filter((item) => item.variantId !== variantId && item.id !== variantId)
      );

      return { previousFavorites };
    },
    onError: (_err, _variantId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(queryKeys.favorites.all, context.previousFavorites);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all });
    },
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