// /**
//  * useCart — lê o carrinho do cliente logado via useQuery.
//  * Fica desativado enquanto ninguém está logado (a rota exige token).
//  */
// import { useQuery } from '@tanstack/react-query';
// import { getCart } from '@/services/cart';
// import { queryKeys } from '@/lib/queryKeys';
// import { useSession } from '@/session/session';

// export function useCart() {
//   const { isLoggedIn } = useSession();

//   return useQuery({
//     queryKey: queryKeys.cart.all,
//     queryFn: getCart,
//     enabled: isLoggedIn,
//   });
// }

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addToCart, clearCart, getCart, removeFromCart, updateCartItem } from '@/services/cart';
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
    mutationFn: ({ variantId, quantity }: { variantId: string; quantity: number }) => addToCart(variantId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart.all }),
  });

  const update = useMutation({
    mutationFn: ({ variantId, quantity }: { variantId: string; quantity: number }) => updateCartItem(variantId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart.all }),
  });

  const remove = useMutation({
    mutationFn: (variantId: string) => removeFromCart(variantId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart.all }),
  });

  const clear = useMutation({
    mutationFn: clearCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart.all }),
  });

  return { add, update, remove, clear };
}