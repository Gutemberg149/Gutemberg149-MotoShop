// // // // /**
// // // //  * Queries de PEDIDOS (SEMANA 3). Mesmo padrão da Semana 2: useQuery + query keys.
// // // //  */
// // // // import { useQuery } from '@tanstack/react-query';
// // // // import { getOrder, getOrderTimeline, listOrders } from '@/services/orders';
// // // // import { queryKeys } from '@/lib/queryKeys';
// // // // import { useSession } from '@/session/session';

// // // // /** Histórico de pedidos do cliente logado. */
// // // // export function useOrders() {
// // // //   const { isLoggedIn } = useSession();
// // // //   return useQuery({
// // // //     queryKey: queryKeys.orders.list(),
// // // //     queryFn: listOrders,
// // // //     enabled: isLoggedIn,
// // // //   });
// // // // }

// // // // /** Detalhe de um pedido. */
// // // // export function useOrder(id: string) {
// // // //   return useQuery({
// // // //     queryKey: queryKeys.orders.detail(id),
// // // //     queryFn: () => getOrder(id),
// // // //     enabled: Boolean(id),
// // // //   });
// // // // }

// // // // /** Linha do tempo (transições de status) do pedido. */
// // // // export function useOrderTimeline(id: string) {
// // // //   return useQuery({
// // // //     queryKey: queryKeys.orders.timeline(id),
// // // //     queryFn: () => getOrderTimeline(id),
// // // //     enabled: Boolean(id),
// // // //   });
// // // // }

// // // import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// // // import { createOrder, getOrder, getOrderTimeline, listOrders } from '@/services/orders';
// // // import { queryKeys } from '@/lib/queryKeys';
// // // import { useSession } from '@/session/session';
// // // import type { PaymentMethod } from '@/types/api';

// // // export function useOrders() {
// // //   const { isLoggedIn } = useSession();
// // //   return useQuery({
// // //     queryKey: queryKeys.orders.list(),
// // //     queryFn: listOrders,
// // //     enabled: isLoggedIn,
// // //   });
// // // }

// // // export function useOrder(id: string) {
// // //   return useQuery({
// // //     queryKey: queryKeys.orders.detail(id),
// // //     queryFn: () => getOrder(id),
// // //     enabled: Boolean(id),
// // //   });
// // // }

// // // export function useOrderTimeline(id: string) {
// // //   return useQuery({
// // //     queryKey: queryKeys.orders.timeline(id),
// // //     queryFn: () => getOrderTimeline(id),
// // //     enabled: Boolean(id),
// // //   });
// // // }

// // // export function useCreateOrder() {
// // //   const queryClient = useQueryClient();

// // //   return useMutation({
// // //     mutationFn: (paymentMethod: PaymentMethod) => createOrder(paymentMethod),
// // //     onSuccess: () => {
// // //       queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
// // //       queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
// // //     },
// // //   });
// // // }

// // import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// // import { checkout, listOrders, payOrder } from '@/services/orders';
// // import { queryKeys } from '@/lib/queryKeys';
// // import type { PaymentMethod } from '@/types/api';

// // export function useOrders() {
// //   return useQuery({
// //     queryKey: queryKeys.orders.all,
// //     queryFn: listOrders,
// //   });
// // }

// // export function useProcessCheckout() {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: async (paymentMethod: PaymentMethod) => {
// //       // 1. Cria o pedido a partir do carrinho ativo
// //       const order = await checkout();

// //       // 2. Liquida o pagamento do pedido recém-criado
// //       const paidOrder = await payOrder(order.id, paymentMethod, 'approve');

// //       return paidOrder;
// //     },
// //     onSuccess: () => {
// //       // Invalida o carrinho (esvazia no front) e atualiza a lista de pedidos
// //       queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
// //       queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
// //     },
// //   });
// // }

// // // // /**
// // // //  * Queries de PEDIDOS (SEMANA 3). Mesmo padrão da Semana 2: useQuery + query keys.
// // // //  */
// // // // import { useQuery } from '@tanstack/react-query';
// // // // import { getOrder, getOrderTimeline, listOrders } from '@/services/orders';
// // // // import { queryKeys } from '@/lib/queryKeys';
// // // // import { useSession } from '@/session/session';

// // // // /** Histórico de pedidos do cliente logado. */
// // // // export function useOrders() {
// // // //   const { isLoggedIn } = useSession();
// // // //   return useQuery({
// // // //     queryKey: queryKeys.orders.list(),
// // // //     queryFn: listOrders,
// // // //     enabled: isLoggedIn,
// // // //   });
// // // // }

// // // // /** Detalhe de um pedido. */
// // // // export function useOrder(id: string) {
// // // //   return useQuery({
// // // //     queryKey: queryKeys.orders.detail(id),
// // // //     queryFn: () => getOrder(id),
// // // //     enabled: Boolean(id),
// // // //   });
// // // // }

// // // // /** Linha do tempo (transições de status) do pedido. */
// // // // export function useOrderTimeline(id: string) {
// // // //   return useQuery({
// // // //     queryKey: queryKeys.orders.timeline(id),
// // // //     queryFn: () => getOrderTimeline(id),
// // // //     enabled: Boolean(id),
// // // //   });
// // // // }

// // // import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// // // import { createOrder, getOrder, getOrderTimeline, listOrders } from '@/services/orders';
// // // import { queryKeys } from '@/lib/queryKeys';
// // // import { useSession } from '@/session/session';
// // // import type { PaymentMethod } from '@/types/api';

// // // export function useOrders() {
// // //   const { isLoggedIn } = useSession();
// // //   return useQuery({
// // //     queryKey: queryKeys.orders.list(),
// // //     queryFn: listOrders,
// // //     enabled: isLoggedIn,
// // //   });
// // // }

// // // export function useOrder(id: string) {
// // //   return useQuery({
// // //     queryKey: queryKeys.orders.detail(id),
// // //     queryFn: () => getOrder(id),
// // //     enabled: Boolean(id),
// // //   });
// // // }

// // // export function useOrderTimeline(id: string) {
// // //   return useQuery({
// // //     queryKey: queryKeys.orders.timeline(id),
// // //     queryFn: () => getOrderTimeline(id),
// // //     enabled: Boolean(id),
// // //   });
// // // }

// // // export function useCreateOrder() {
// // //   const queryClient = useQueryClient();

// // //   return useMutation({
// // //     mutationFn: (paymentMethod: PaymentMethod) => createOrder(paymentMethod),
// // //     onSuccess: () => {
// // //       queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
// // //       queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
// // //     },
// // //   });
// // // }

// // import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// // import { checkout, listOrders, payOrder } from '@/services/orders';
// // import { queryKeys } from '@/lib/queryKeys';
// // import type { PaymentMethod } from '@/types/api';

// // export function useOrders() {
// //   return useQuery({
// //     queryKey: queryKeys.orders.all,
// //     queryFn: listOrders,
// //   });
// // }

// // export function useProcessCheckout() {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: async (paymentMethod: PaymentMethod) => {
// //       // 1. Cria o pedido a partir do carrinho ativo
// //       const order = await checkout();

// //       // 2. Liquida o pagamento do pedido recém-criado
// //       const paidOrder = await payOrder(order.id, paymentMethod, 'approve');

// //       return paidOrder;
// //     },
// //     onSuccess: () => {
// //       // Invalida o carrinho (esvazia no front) e atualiza a lista de pedidos
// //       queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
// //       queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
// //     },
// //   });
// // }

// import { useQuery } from "@tanstack/react-query";
// import { getOrder, getOrderTimeline } from "@/services/orders";
// import { queryKeys } from "@/lib/queryKeys";

// export function useOrder(id: string) {
//   return useQuery({
//     queryKey: queryKeys.orders.detail(id),
//     queryFn: () => getOrder(id),
//     enabled: Boolean(id),
//   });
// }

// export function useOrderTimeline(id: string) {
//   return useQuery({
//     queryKey: queryKeys.orders.timeline(id),
//     queryFn: () => getOrderTimeline(id),
//     enabled: Boolean(id),
//   });
// }

import { useQuery } from '@tanstack/react-query';
import { getOrder, getOrderTimeline, listOrders } from '@/services/orders';
import { queryKeys } from '@/lib/queryKeys';

// Hook para LISTAR TODOS os pedidos
export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders.all,
    queryFn: listOrders,
  });
}

// Hook para BUSCAR UM pedido específico por ID
export function useOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => getOrder(id),
    enabled: Boolean(id),
  });
}

// Hook para BUSCAR A TIMELINE do pedido por ID
export function useOrderTimeline(id: string) {
  return useQuery({
    queryKey: queryKeys.orders.timeline(id),
    queryFn: () => getOrderTimeline(id),
    enabled: Boolean(id),
  });
}