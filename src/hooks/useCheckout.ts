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