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