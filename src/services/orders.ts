// // // /**
// // //  * Serviço de PEDIDOS (SEMANA 3). Exige comprador logado (o interceptor já injeta
// // //  * o Authorization). É o fecho do fluxo de compra: carrinho -> pedido -> pagamento.
// // //  */
// // // import { http } from './http';
// // // import type { Order, PaymentMethod, TimelineEntry } from '@/types/api';

// // // /** POST /orders/checkout — cria o pedido a partir do carrinho ativo (status PENDING). */
// // // export async function checkout(): Promise<Order> {
// // //   const { data } = await http.post<Order>('/orders/checkout');
// // //   return data;
// // // }

// // // /** GET /orders — histórico do cliente logado. */
// // // export async function listOrders(): Promise<Order[]> {
// // //   const { data } = await http.get<Order[]>('/orders');
// // //   return data;
// // // }

// // // /** GET /orders/:id */
// // // export async function getOrder(id: string): Promise<Order> {
// // //   const { data } = await http.get<Order>(`/orders/${id}`);
// // //   return data;
// // // }

// // // /** POST /orders/:id/pay — pagamento SIMULADO (approve/decline). */
// // // export async function payOrder(
// // //   id: string,
// // //   method: PaymentMethod,
// // //   simulate: 'approve' | 'decline',
// // // ): Promise<Order> {
// // //   const { data } = await http.post<Order>(`/orders/${id}/pay`, { method, simulate });
// // //   return data;
// // // }

// // // /** POST /orders/:id/cancel — cancela um pedido pendente e libera a reserva. */
// // // export async function cancelOrder(id: string): Promise<Order> {
// // //   const { data } = await http.post<Order>(`/orders/${id}/cancel`);
// // //   return data;
// // // }

// // // /** GET /orders/:id/timeline — transições de status do pedido. */
// // // export async function getOrderTimeline(id: string): Promise<TimelineEntry[]> {
// // //   const { data } = await http.get<TimelineEntry[]>(`/orders/${id}/timeline`);
// // //   return data;
// // // }

// // import { http } from './http';
// // import type { Order, PaymentMethod, TimelineEntry } from '@/types/api';

// // export async function createOrder(paymentMethod: PaymentMethod): Promise<Order> {
// //   const { data } = await http.post<Order>('/orders', { paymentMethod });
// //   return data;
// // }

// // export async function listOrders(): Promise<Order[]> {
// //   const { data } = await http.get<Order[]>('/orders');
// //   return data;
// // }

// // export async function getOrder(id: string): Promise<Order> {
// //   const { data } = await http.get<Order>(`/orders/${id}`);
// //   return data;
// // }

// // export async function getOrderTimeline(id: string): Promise<TimelineEntry[]> {
// //   const { data } = await http.get<TimelineEntry[]>(`/orders/${id}/timeline`);
// //   return data;
// // }

// /**
//  * Serviço de PEDIDOS. Exige comprador logado.
//  * Fluxo de compra: carrinho -> criar pedido / checkout -> pagar.
//  */
// import { http } from './http';
// import type { Order, PaymentMethod, TimelineEntry } from '@/types/api';

// export interface CreateOrderParams {
//   paymentMethod: PaymentMethod;
//   shippingAddressId?: string;
// }

// export interface PayOrderParams {
//   id: string;
//   method: PaymentMethod;
//   simulate?: 'approve' | 'decline';
// }

// /** POST /orders/checkout — cria o pedido a partir do carrinho ativo. */
// export async function checkout(): Promise<Order> {
//   const { data } = await http.post<Order>('/orders/checkout');
//   return data;
// }

// /** POST /orders — cria o pedido informando o método de pagamento. */
// export async function createOrder(params: CreateOrderParams | PaymentMethod): Promise<Order> {
//   let payload: CreateOrderParams;

//   if (typeof params === 'object' && params !== null) {
//     payload = params;
//   } else {
//     payload = { paymentMethod: params };
//   }

//   const { data } = await http.post<Order>('/orders', payload);
//   return data;
// }

// /** POST /orders/:id/pay — liquida/confirma o pagamento do pedido. */
// export async function payOrder(
//   id: string,
//   method: PaymentMethod,
//   simulate: 'approve' | 'decline' = 'approve'
// ): Promise<Order> {
//   const { data } = await http.post<Order>(`/orders/${id}/pay`, { method, simulate });
//   return data;
// }

// /** GET /orders — histórico de pedidos do cliente logado. */
// export async function listOrders(): Promise<Order[]> {
//   const { data } = await http.get<Order[]>('/orders');
//   return data;
// }

// /** GET /orders/:id — busca detalhes de um pedido por ID. */
// export async function getOrder(id: string): Promise<Order> {
//   const { data } = await http.get<Order>(`/orders/${id}`);
//   return data;
// }

// /** POST /orders/:id/cancel — cancela um pedido pendente. */
// export async function cancelOrder(id: string): Promise<Order> {
//   const { data } = await http.post<Order>(`/orders/${id}/cancel`);
//   return data;
// }

// /** GET /orders/:id/timeline — histórico de status e auditoria do pedido. */
// export async function getOrderTimeline(id: string): Promise<TimelineEntry[]> {
//   const { data } = await http.get<TimelineEntry[]>(`/orders/${id}/timeline`);
//   return data;
// }

/**
 * Serviço de PEDIDOS. Exige comprador logado.
 * Fluxo de compra: carrinho -> criar pedido / checkout -> pagar.
 */
import { http } from './http';
import type { Order, PaymentMethod, TimelineEntry } from '@/types/api';

export interface CreateOrderParams {
  paymentMethod: PaymentMethod;
  shippingAddressId?: string;
}

export interface PayOrderParams {
  id: string;
  method: PaymentMethod;
  simulate?: 'approve' | 'decline';
}

/** POST /orders/checkout — cria o pedido a partir do carrinho ativo (status PENDING). */
export async function checkout(): Promise<Order> {
  const { data } = await http.post<Order>('/orders/checkout');
  return data;
}

/** POST /orders — cria o pedido informando o método de pagamento e dados de envio. */
export async function createOrder(params: CreateOrderParams | PaymentMethod): Promise<Order> {
  const payload: CreateOrderParams =
    typeof params === 'object' && params !== null
      ? params
      : { paymentMethod: params };

  const { data } = await http.post<Order>('/orders', payload);
  return data;
}

/** POST /orders/:id/pay — liquida/confirma o pagamento do pedido. */
export async function payOrder(
  id: string,
  method: PaymentMethod,
  simulate: 'approve' | 'decline' = 'approve'
): Promise<Order> {
  const { data } = await http.post<Order>(`/orders/${id}/pay`, { method, simulate });
  return data;
}

/** GET /orders — histórico de pedidos do cliente logado. */
export async function listOrders(): Promise<Order[]> {
  const { data } = await http.get<Order[]>('/orders');
  return data;
}

/** GET /orders/:id — busca detalhes de um pedido por ID. */
export async function getOrder(id: string): Promise<Order> {
  const { data } = await http.get<Order>(`/orders/${id}`);
  return data;
}

/** POST /orders/:id/cancel — cancela um pedido pendente e libera a reserva. */
export async function cancelOrder(id: string): Promise<Order> {
  const { data } = await http.post<Order>(`/orders/${id}/cancel`);
  return data;
}

/** GET /orders/:id/timeline — histórico de transições de status do pedido. */
export async function getOrderTimeline(id: string): Promise<TimelineEntry[]> {
  const { data } = await http.get<TimelineEntry[]>(`/orders/${id}/timeline`);
  return data;
}