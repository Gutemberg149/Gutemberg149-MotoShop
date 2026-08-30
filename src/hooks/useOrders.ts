import { useQuery } from "@tanstack/react-query";
import { getOrder, listOrders, getOrderTimeline } from "@/services/orders";
import { queryKeys } from "@/lib/queryKeys";
import { useSession } from "@/session/session";

// 1. Hook para listar todos os pedidos do usuário
export function useOrders() {
  const { isLoggedIn } = useSession();

  return useQuery({
    queryKey: queryKeys.orders.all,
    queryFn: async () => {
      const response = await listOrders();

      let rawOrders: any[] = [];
      if (Array.isArray(response)) {
        rawOrders = response;
      } else if (response && typeof response === "object") {
        if (Array.isArray((response as any).orders)) {
          rawOrders = (response as any).orders;
        } else if (Array.isArray((response as any).data)) {
          rawOrders = (response as any).data;
        }
      }

      if (!rawOrders || rawOrders.length === 0) return [];

      return rawOrders.map((order) => normalizeOrder(order));
    },
    enabled: Boolean(isLoggedIn),
  });
}

// 2. Hook para buscar detalhes de um único pedido pelo ID
export function useOrder(id: string) {
  const { isLoggedIn } = useSession();

  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: async () => {
      const response = await getOrder(id);
      return normalizeOrder(response);
    },
    enabled: Boolean(isLoggedIn) && Boolean(id),
  });
}

// 3. Hook para buscar a linha do tempo (histórico) do pedido
export function useOrderTimeline(id: string) {
  const { isLoggedIn } = useSession();

  return useQuery({
    queryKey: [...queryKeys.orders.detail(id), "timeline"],
    queryFn: async () => {
      try {
        const response = await getOrderTimeline(id);
        if (Array.isArray(response)) return response;
        return (response as any)?.timeline || (response as any)?.data || [];
      } catch {
        return [];
      }
    },
    enabled: Boolean(isLoggedIn) && Boolean(id),
  });
}

// Função auxiliar para padronizar os nomes dos produtos e itens do pedido
function normalizeOrder(order: any) {
  if (!order) return null;

  const items = Array.isArray(order.items) ? order.items : [];

  const normalizedItems = items.map((item: any) => {
    const extractedTitle =
      (typeof item?.product === "string" ? item.product : item?.product?.name) ||
      item?.productName ||
      item?.name ||
      item?.title ||
      "Peça sem título";

    const extractedImage =
      item?.image ||
      item?.product?.images?.[0]?.url ||
      item?.product?.imageUrl ||
      item?.imageUrl ||
      null;

    return {
      ...item,
      variantId: item?.variantId || item?.id || String(Math.random()),
      productName: extractedTitle,
      variantName: item?.variantName || item?.variant?.label || item?.sku || null,
      image: extractedImage,
      price: item?.price ?? item?.unitPrice ?? 0,
      subtotal: item?.subtotal ?? (item?.price ?? 0) * (item?.quantity ?? 1),
      quantity: item?.quantity ?? 1,
    };
  });

  return {
    ...order,
    id: order.id || "",
    status: order.status || "PENDING",
    total: order.total ?? order.amount ?? 0,
    items: normalizedItems,
  };
}