// // import { useMutation, useQueryClient } from '@tanstack/react-query';
// // import { createOrder, type CreateOrderParams } from '@/services/orders';
// // import { queryKeys } from '@/lib/queryKeys';

// // export function useCheckout() {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: (params: CreateOrderParams) => createOrder(params),
// //     onSuccess: () => {
// //       // 1. Invalida o carrinho para que ele zere na UI
// //       queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      
// //       // 2. Invalida a lista de pedidos para que o novo pedido apareça
// //       queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
// //     },
// //   });
// // }

// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { createOrder, payOrder, type CreateOrderParams } from '@/services/orders';
// import { queryKeys } from '@/lib/queryKeys';

// export function useCheckout() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (params: CreateOrderParams) => {
//       // 1. Cria o pedido no backend
//       const order = await createOrder(params);
      
//       // 2. Processa o pagamento do pedido recém-criado
//       await payOrder(order.id, params.paymentMethod, 'approve');
      
//       return order;
//     },
//     onSuccess: () => {
//       // Esvazia o carrinho e atualiza o histórico de pedidos na interface
//       queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
//       queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
//     },
//   });
// }

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkout, payOrder } from '@/services/orders';
import { queryKeys } from '@/lib/queryKeys';
import type { PaymentMethod } from '@/types/api';

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { paymentMethod: PaymentMethod }) => {
      // 1. Cria o pedido a partir do carrinho ativo
      const order = await checkout();
      
      // 2. Liquida o pagamento do pedido
      const paidOrder = await payOrder(order.id, params.paymentMethod, 'approve');
      
      return paidOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}