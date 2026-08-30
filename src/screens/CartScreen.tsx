// /**
//  * Tela do CARRINHO (SEMANA 3).
//  * O login é GLOBAL (guarda de rotas). O botão "Finalizar" agora leva ao CHECKOUT.
//  * useCart + mutations otimistas seguem iguais à Semana 2.
//  */
// import { FlatList, StyleSheet, Text, View } from 'react-native';
// import type { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { useCart } from '@/hooks/useCart';
// import { useCartMutations } from '@/hooks/useCartMutations';
// import { useSession } from '@/session/session';
// import { money } from '@/lib/format';
// import { Button, ErrorState, Loading } from '@/components/ui';
// import type { RootStackParamList } from '@/navigation';
// import type { ApiError } from '@/types/api';

// type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

// export function CartScreen({ navigation }: Props) {
//   const { data: cart, isLoading, isError, error, refetch } = useCart();

//   const { setQuantity, removeItem } = useCartMutations();
//   const { customer, signOut } = useSession();

//   if (isLoading) return <Loading label="Carregando carrinho…" />;
//   if (isError) return <ErrorState message={(error as ApiError).message} onRetry={() => refetch()} />;

//   const items = cart?.items ?? [];

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={items}
//         keyExtractor={(it) => it.variantId}
//         contentContainerStyle={styles.list}
//         ListHeaderComponent={
//           <Text style={styles.hi}>
//             Olá, {customer?.name}. {items.length ? '' : 'Seu carrinho está vazio.'}
//           </Text>
//         }
//         renderItem={({ item }) => (
//           <View style={styles.row}>
//             <View style={styles.info}>
//               <Text style={styles.name} numberOfLines={2}>
//                 {item.name}
//               </Text>
//               <Text style={styles.sub}>
//                 {money(item.unitPrice)} · subtotal {money(item.subtotal)}
//               </Text>
//             </View>
//             <View style={styles.qtyBox}>
//               {/* Cada toque dispara mutation otimista: o número muda na hora. */}
//               <Text
//                 style={styles.qtyBtn}
//                 onPress={() => setQuantity.mutate({ variantId: item.variantId, quantity: item.quantity - 1 })}
//               >
//                 −
//               </Text>
//               <Text style={styles.qty}>{item.quantity}</Text>
//               <Text
//                 style={styles.qtyBtn}
//                 onPress={() => setQuantity.mutate({ variantId: item.variantId, quantity: item.quantity + 1 })}
//               >
//                 +
//               </Text>
//             </View>
//             <Text style={styles.remove} onPress={() => removeItem.mutate(item.variantId)}>
//               remover
//             </Text>
//           </View>
//         )}
//         ListFooterComponent={
//           items.length ? (
//             <View style={styles.footer}>
//               <Text style={styles.total}>Total: {money(cart?.total ?? 0)}</Text>
//               <Button label="Finalizar compra" onPress={() => navigation.navigate('Checkout')} />
//             </View>
//           ) : null
//         }
//       />
//       <View style={styles.signout}>
//         <Button label="Sair" variant="ghost" onPress={signOut} />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   list: { padding: 12, gap: 10 },
//   hi: { fontSize: 14, color: '#374151', marginBottom: 6 },
//   row: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#f9fafb', borderRadius: 12, padding: 10 },
//   info: { flex: 1, gap: 2 },
//   name: { fontSize: 14, fontWeight: '600', color: '#111827' },
//   sub: { fontSize: 12, color: '#6b7280' },
//   qtyBox: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   qtyBtn: { fontSize: 20, fontWeight: '700', color: '#111827', paddingHorizontal: 6 },
//   qty: { fontSize: 15, fontWeight: '700', minWidth: 20, textAlign: 'center' },
//   remove: { fontSize: 12, color: '#b91c1c', marginLeft: 6 },
//   footer: { marginTop: 16, gap: 10 },
//   total: { fontSize: 18, fontWeight: '800', color: '#111827', textAlign: 'right' },
//   signout: { padding: 12 },
// });

import { FlatList, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCart, useCartMutations } from '@/hooks/useCart';
import { money } from '@/lib/format';
import { Button, ErrorState, Loading } from '@/components/ui';
import type { RootStackParamList } from '@/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

export function CartScreen({ navigation }: Props) {
  const { data: cart, isLoading, isError, error, refetch } = useCart();
  const { update, remove } = useCartMutations();

  if (isLoading) return <Loading label="Carregando carrinho..." />;
  if (isError) return <ErrorState message={(error as Error).message} onRetry={() => refetch()} />;

  const items = cart?.items ?? [];

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.variantId}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Seu carrinho está vazio.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.unit}>{money(item.unitPrice)} un.</Text>
            </View>
            <View style={styles.controls}>
              <Button label="-" variant="ghost" onPress={() => update.mutate({ variantId: item.variantId, quantity: item.quantity - 1 })} />
              <Text style={styles.qty}>{item.quantity}</Text>
              <Button label="+" variant="ghost" onPress={() => update.mutate({ variantId: item.variantId, quantity: item.quantity + 1 })} />
              <Button label="Remover" variant="ghost" onPress={() => remove.mutate(item.variantId)} />
            </View>
          </View>
        )}
      />

      {items.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{money(cart?.total ?? 0)}</Text>
          </View>
          <Button label="Ir para Checkout" onPress={() => navigation.navigate('Checkout')} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  list: { padding: 12, gap: 10 },
  card: { backgroundColor: '#1e293b', padding: 12, borderRadius: 8, gap: 8 },
  info: { gap: 2 },
  name: { fontSize: 14, color: '#f8fafc', fontWeight: '600' },
  unit: { fontSize: 12, color: '#94a3b8' },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qty: { color: '#f8fafc', fontWeight: '700', paddingHorizontal: 8 },
  footer: { backgroundColor: '#1e293b', padding: 16, borderTopWidth: 1, borderColor: '#334155', gap: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { color: '#f8fafc', fontSize: 16, fontWeight: '600' },
  totalValue: { color: '#dc2626', fontSize: 20, fontWeight: '700' },
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: 40 },
});