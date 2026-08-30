// // /**
// //  * Tela do PEDIDO (SEMANA 3) — status, pagamento simulado e linha do tempo.
// //  *
// //  * É aqui que a "máquina de estados" fica visível: PENDING -> (pagar) -> PAID,
// //  * ou PENDING -> (cancelar) -> CANCELLED. O switch "aprovar/recusar" existe de
// //  * propósito, para o aluno ver os DOIS caminhos e tratar os estados de UI.
// //  */
// // import { useState } from 'react';
// // import { ScrollView, StyleSheet, Text, View } from 'react-native';
// // import type { NativeStackScreenProps } from '@react-navigation/native-stack';
// // import { useOrder, useOrderTimeline } from '@/hooks/useOrders';
// // import { useCancelOrder, usePayOrder } from '@/hooks/useOrderActions';
// // import { statusColor, statusLabel } from '@/lib/orders';
// // import { money } from '@/lib/format';
// // import { Badge, Button, ErrorState, Loading } from '@/components/ui';
// // import type { RootStackParamList } from '@/navigation';
// // import type { ApiError, PaymentMethod } from '@/types/api';

// // type Props = NativeStackScreenProps<RootStackParamList, 'Order'>;

// // const METHODS: { key: PaymentMethod; label: string }[] = [
// //   { key: 'PIX', label: 'PIX' },
// //   { key: 'CREDIT_CARD', label: 'Cartão' },
// //   { key: 'BOLETO', label: 'Boleto' },
// // ];

// // export function OrderScreen({ route }: Props) {
// //   const { id } = route.params;
// //   const { data: order, isLoading, isError, error, refetch } = useOrder(id);
// //   const { data: timeline } = useOrderTimeline(id);
// //   const pay = usePayOrder();
// //   const cancel = useCancelOrder();

// //   const [method, setMethod] = useState<PaymentMethod>('PIX');
// //   const [simulate, setSimulate] = useState<'approve' | 'decline'>('approve');

// //   if (isLoading) return <Loading label="Carregando pedido…" />;
// //   if (isError || !order) return <ErrorState message={(error as ApiError)?.message ?? 'Falha'} onRetry={() => refetch()} />;

// //   const pending = order.status === 'PENDING';
// //   const paid = order.status === 'PAID';
// //   // Pagamento processou mas não aprovou (recusado): continua PENDING.
// //   const recusado = pay.isSuccess && pay.data?.status === 'PENDING';

// //   return (
// //     <ScrollView contentContainerStyle={styles.container}>
// //       <View style={styles.head}>
// //         <Text style={styles.pedido}>Pedido #{order.id.slice(-6)}</Text>
// //         <Badge label={statusLabel(order.status)} color={statusColor(order.status)} />
// //       </View>

// //       {order.items.map((it) => (
// //         <View key={it.variantId} style={styles.row}>
// //           <Text style={styles.name} numberOfLines={2}>
// //             {it.quantity}× {it.productName}
// //             {it.variantName ? ` (${it.variantName})` : ''}
// //           </Text>
// //           <Text style={styles.sub}>{money(it.subtotal)}</Text>
// //         </View>
// //       ))}

// //       <View style={styles.totalRow}>
// //         <Text style={styles.totalLabel}>Total</Text>
// //         <Text style={styles.total}>{money(order.total)}</Text>
// //       </View>

// //       {paid && <Text style={styles.ok}>✓ Pagamento aprovado. Obrigado!</Text>}

// //       {pending && (
// //         <View style={styles.pay}>
// //           <Text style={styles.section}>Pagamento</Text>

// //           <View style={styles.chips}>
// //             {METHODS.map((m) => (
// //               <Text
// //                 key={m.key}
// //                 onPress={() => setMethod(m.key)}
// //                 style={[styles.chip, method === m.key && styles.chipActive]}
// //               >
// //                 {m.label}
// //               </Text>
// //             ))}
// //           </View>

// //           {/* Simulação: aprovar x recusar — para exercitar os dois caminhos. */}
// //           <View style={styles.chips}>
// //             <Text
// //               onPress={() => setSimulate('approve')}
// //               style={[styles.chip, simulate === 'approve' && styles.chipActive]}
// //             >
// //               simular: aprovar
// //             </Text>
// //             <Text
// //               onPress={() => setSimulate('decline')}
// //               style={[styles.chip, simulate === 'decline' && styles.chipActive]}
// //             >
// //               simular: recusar
// //             </Text>
// //           </View>

// //           {recusado && <Text style={styles.erro}>Pagamento recusado. Tente outro método ou aprove a simulação.</Text>}
// //           {pay.isError && <Text style={styles.erro}>{(pay.error as ApiError).message}</Text>}

// //           <Button
// //             label={pay.isPending ? 'Processando…' : 'Pagar'}
// //             onPress={() => pay.mutate({ id: order.id, method, simulate })}
// //             disabled={pay.isPending}
// //           />
          
// //           <Button
// //             label={cancel.isPending ? 'Cancelando…' : 'Cancelar pedido'}
// //             variant="ghost"
// //             onPress={() => cancel.mutate(order.id)}
// //             disabled={cancel.isPending}
// //           />
// //         </View>
// //       )}

// //       {timeline && timeline.length > 0 && (
// //         <View style={styles.timeline}>
// //           <Text style={styles.section}>Linha do tempo</Text>
// //           {timeline.map((t, i) => (
// //             <View key={i} style={styles.tl}>
// //               <Text style={styles.tlDot}>•</Text>
// //               <Text style={styles.tlText}>
// //                 {statusLabel(t.to)}
// //                 {t.note ? ` — ${t.note}` : ''}
// //               </Text>
// //             </View>
// //           ))}
// //         </View>
// //       )}
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { padding: 16, gap: 8 },
// //   head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
// //   pedido: { fontSize: 18, fontWeight: '800', color: '#111827' },
// //   row: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
// //   name: { flex: 1, fontSize: 14, color: '#374151' },
// //   sub: { fontSize: 14, fontWeight: '600', color: '#111827' },
// //   totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
// //   totalLabel: { fontSize: 16, color: '#374151' },
// //   total: { fontSize: 20, fontWeight: '800', color: '#111827' },
// //   ok: { fontSize: 15, fontWeight: '700', color: '#15803d', marginTop: 8 },
// //   pay: { marginTop: 12, gap: 10 },
// //   section: { fontSize: 13, fontWeight: '700', color: '#6b7280', textTransform: 'uppercase' },
// //   chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
// //   chip: {
// //     borderWidth: 1,
// //     borderColor: '#d1d5db',
// //     borderRadius: 999,
// //     paddingHorizontal: 14,
// //     paddingVertical: 8,
// //     overflow: 'hidden',
// //     color: '#111827',
// //   },
// //   chipActive: { borderColor: '#111827', backgroundColor: '#111827', color: '#fff' },
// //   erro: { color: '#b91c1c', fontSize: 13 },
// //   timeline: { marginTop: 16, gap: 4 },
// //   tl: { flexDirection: 'row', gap: 8 },
// //   tlDot: { color: '#9ca3af' },
// //   tlText: { flex: 1, fontSize: 13, color: '#374151' },
// // });

// import { ScrollView, StyleSheet, Text, View } from 'react-native';
// import type { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { useOrder, useOrderTimeline } from '@/hooks/useOrders';
// import { money } from '@/lib/format';
// import { Badge, ErrorState, Loading } from '@/components/ui';
// import type { RootStackParamList } from '@/navigation';

// type Props = NativeStackScreenProps<RootStackParamList, 'Order'>;

// export function OrderScreen({ route }: Props) {
//   const { id } = route.params;
//   const { data: order, isLoading, isError, error } = useOrder(id);
//   const { data: timeline } = useOrderTimeline(id);

//   if (isLoading) return <Loading label="Carregando pedido..." />;
//   if (isError || !order) return <ErrorState message={(error as Error)?.message ?? 'Erro ao carregar.'} />;

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.content}>
//       <View style={styles.header}>
//         <Text style={styles.id}>Pedido #{order.id}</Text>
//         <Badge label={order.status} color="#dc2626" />
//       </View>

//       <View style={styles.box}>
//         <Text style={styles.sectionTitle}>Itens</Text>
//         {order.items.map((item) => (
//           <Text key={item.variantId} style={styles.itemText}>
//             {item.quantity}x {item.productName} — {money(item.subtotal)}
//           </Text>
//         ))}
//         <Text style={styles.total}>Total: {money(order.total)}</Text>
//       </View>

//       {timeline && (
//         <View style={styles.box}>
//           <Text style={styles.sectionTitle}>Linha do Tempo</Text>
//           {timeline.map((entry, index) => (
//             <View key={index} style={styles.timelineEntry}>
//               <Text style={styles.timelineText}>{entry.to}</Text>
//               <Text style={styles.timelineDate}>{new Date(entry.at).toLocaleString()}</Text>
//             </View>
//           ))}
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#0f172a' },
//   content: { padding: 16, gap: 12 },
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   id: { color: '#f8fafc', fontWeight: '700', fontSize: 16 },
//   box: { backgroundColor: '#1e293b', padding: 12, borderRadius: 8, gap: 6 },
//   sectionTitle: { color: '#f8fafc', fontWeight: '700', fontSize: 14, marginBottom: 4 },
//   itemText: { color: '#94a3b8', fontSize: 13 },
//   total: { color: '#dc2626', fontWeight: '700', marginTop: 8 },
//   timelineEntry: { borderLeftWidth: 2, borderColor: '#dc2626', paddingLeft: 8, marginVertical: 4 },
//   timelineText: { color: '#f8fafc', fontWeight: '600' },
//   timelineDate: { color: '#64748b', fontSize: 11 },
// });

import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useOrder, useOrderTimeline } from '@/hooks/useOrders';
import { useCancelOrder, usePayOrder } from '@/hooks/useOrderActions';
import { statusColor, statusLabel } from '@/lib/orders';
import { money } from '@/lib/format';
import { Badge, Button, ErrorState, Loading } from '@/components/ui';
import type { RootStackParamList } from '@/navigation';
import type { ApiError, PaymentMethod } from '@/types/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Order'>;

const METHODS: { key: PaymentMethod; label: string }[] = [
  { key: 'PIX', label: 'PIX' },
  { key: 'CREDIT_CARD', label: 'Cartão' },
  { key: 'BOLETO', label: 'Boleto' },
];

export function OrderScreen({ route }: Props) {
  const { id } = route.params;
  const { data: order, isLoading, isError, error, refetch } = useOrder(id);
  const { data: timeline } = useOrderTimeline(id);
  const pay = usePayOrder();
  const cancel = useCancelOrder();

  const [method, setMethod] = useState<PaymentMethod>('PIX');
  const [simulate, setSimulate] = useState<'approve' | 'decline'>('approve');

  if (isLoading) return <Loading label="Carregando pedido..." />;
  if (isError || !order) return <ErrorState message={(error as ApiError)?.message ?? 'Erro ao carregar.'} onRetry={() => refetch()} />;

  const pending = order.status === 'PENDING';
  const paid = order.status === 'PAID';
  const recusado = pay.isSuccess && pay.data?.status === 'PENDING';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Cabecalho */}
      <View style={styles.header}>
        <Text style={styles.id}>Pedido #{order.id.slice(-6)}</Text>
        <Badge
          label={statusLabel ? statusLabel(order.status) : order.status}
          color={statusColor ? statusColor(order.status) : '#38bdf8'}
        />
      </View>

      {/* Lista de Itens */}
      <View style={styles.box}>
        <Text style={styles.sectionTitle}>Itens do Pedido</Text>
        {order.items.map((it) => (
          <View key={it.variantId} style={styles.itemRow}>
            <Text style={styles.itemName} numberOfLines={2}>
              {it.quantity}× {it.productName}
              {it.variantName ? ` (${it.variantName})` : ''}
            </Text>
            <Text style={styles.itemSub}>{money(it.subtotal)}</Text>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{money(order.total)}</Text>
        </View>
      </View>

      {paid && (
        <View style={styles.successCard}>
          <Text style={styles.ok}>✓ Pagamento aprovado com sucesso!</Text>
        </View>
      )}

      {/* Seção de Pagamento */}
      {pending && (
        <View style={styles.box}>
          <Text style={styles.sectionTitle}>Forma de Pagamento</Text>

          <View style={styles.chipsContainer}>
            {METHODS.map((m) => (
              <Text
                key={m.key}
                onPress={() => setMethod(m.key)}
                style={[styles.chip, method === m.key && styles.chipActive]}
              >
                {m.label}
              </Text>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Simulação de Resultado</Text>
          <View style={styles.chipsContainer}>
            <Text
              onPress={() => setSimulate('approve')}
              style={[styles.chip, simulate === 'approve' && styles.chipActive]}
            >
              Simular: Aprovar
            </Text>
            <Text
              onPress={() => setSimulate('decline')}
              style={[styles.chip, simulate === 'decline' && styles.chipActive]}
            >
              Simular: Recusar
            </Text>
          </View>

          {recusado && (
            <Text style={styles.erro}>
              Pagamento recusado. Altere o modo de simulação para aprovar ou tente novamente.
            </Text>
          )}
          {pay.isError && <Text style={styles.erro}>{(pay.error as ApiError).message}</Text>}

          <View style={styles.actions}>
            <Button
              label={pay.isPending ? 'Processando...' : 'Pagar Agora'}
              onPress={() => pay.mutate({ id: order.id, method, simulate })}
              disabled={pay.isPending || cancel.isPending}
            />

            <Button
              label={cancel.isPending ? 'Cancelando...' : 'Cancelar Pedido'}
              variant="ghost"
              onPress={() => cancel.mutate(order.id)}
              disabled={pay.isPending || cancel.isPending}
            />
          </View>
        </View>
      )}

      {/* Linha do Tempo */}
      {timeline && timeline.length > 0 && (
        <View style={styles.box}>
          <Text style={styles.sectionTitle}>Histórico</Text>
          {timeline.map((t, i) => (
            <View key={i} style={styles.timelineEntry}>
              <View style={styles.dot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineText}>
                  {statusLabel ? statusLabel(t.to) : t.to}
                  {t.note ? ` — ${t.note}` : ''}
                </Text>
                {t.at && <Text style={styles.timelineDate}>{new Date(t.at).toLocaleString('pt-BR')}</Text>}
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 16, gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  id: { color: '#f8fafc', fontWeight: '700', fontSize: 18 },
  box: { backgroundColor: '#1e293b', padding: 14, borderRadius: 8, gap: 10 },
  sectionTitle: { color: '#94a3b8', fontWeight: '700', fontSize: 12, textTransform: 'uppercase' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  itemName: { flex: 1, fontSize: 14, color: '#cbd5e1' },
  itemSub: { fontSize: 14, fontWeight: '600', color: '#f8fafc' },
  divider: { height: 1, backgroundColor: '#334155' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 16, color: '#f8fafc', fontWeight: '600' },
  totalValue: { fontSize: 20, fontWeight: '800', color: '#38bdf8' },
  successCard: { backgroundColor: '#064e3b', padding: 12, borderRadius: 8 },
  ok: { fontSize: 14, fontWeight: '700', color: '#34d399', textAlign: 'center' },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0f172a',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    overflow: 'hidden',
    color: '#94a3b8',
    fontSize: 13,
  },
  chipActive: { borderColor: '#38bdf8', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: '700' },
  erro: { color: '#f87171', fontSize: 13 },
  actions: { gap: 8, marginTop: 4 },
  timelineEntry: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginVertical: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#38bdf8', marginTop: 5 },
  timelineContent: { flex: 1 },
  timelineText: { color: '#f8fafc', fontSize: 13, fontWeight: '600' },
  timelineDate: { color: '#64748b', fontSize: 11 },
});