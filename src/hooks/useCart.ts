import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addCartItem, getCart, removeCartItem, updateCartItem } from '@/services/cart';
import { queryKeys } from '@/lib/queryKeys';
import { useSession } from '@/session/session';

export function useCart() {
  const { isLoggedIn } = useSession();

  return useQuery({
    queryKey: queryKeys.cart.all,
    queryFn: getCart,
    enabled: isLoggedIn,
  });
}

export function useCartMutations() {
  const queryClient = useQueryClient();

  const add = useMutation({
    mutationFn: ({ variantId, quantity }: { variantId: string; quantity: number }) =>
      addCartItem(variantId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart.all }),
  });

  const update = useMutation({
    mutationFn: ({ variantId, quantity }: { variantId: string; quantity: number }) =>
      updateCartItem(variantId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart.all }),
  });

  const remove = useMutation({
    mutationFn: (variantId: string) => removeCartItem(variantId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart.all }),
  });


  const clear = useMutation({
    mutationFn: async () => {
      const cart = queryClient.getQueryData<Awaited<ReturnType<typeof getCart>>>(queryKeys.cart.all);
      if (!cart?.items) return;
      await Promise.all(cart.items.map((item) => removeCartItem(item.variantId)));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart.all }),
  });

  return { add, update, remove, clear };
}