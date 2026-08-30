
// import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
// import type { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { useOrders } from "@/hooks/useOrders";
// import { statusColor, statusLabel } from "@/lib/orders";
// import { money } from "@/lib/format";
// import { Badge, ErrorState, Loading } from "@/components/ui";
// import type { RootStackParamList } from "@/navigation";

// type Props = NativeStackScreenProps<RootStackParamList, "Orders">;

// export function OrdersScreen({ navigation }: Props) {
//   const { data: orders, isLoading, isError, error, refetch, isFetching } = useOrders();

//   if (isLoading) return <Loading label="Carregando histórico..." />;
//   if (isError) {
//     return <ErrorState message={(error as Error)?.message || "Erro ao carregar pedidos"} onRetry={() => refetch()} />;
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={orders ?? []}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.list}
//         refreshControl={<RefreshControl refreshing={isFetching && !isLoading} onRefresh={() => refetch()} tintColor="#38bdf8" />}
//         ListEmptyComponent={<Text style={styles.empty}>Você ainda não realizou nenhum pedido.</Text>}
//         renderItem={({ item }) => (
//           <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} onPress={() => navigation.navigate("Order", { id: item.id })}>
//             <View style={styles.row}>
//               <Text style={styles.id}>Pedido #{item.id.slice(-6)}</Text>
//               <Badge label={statusLabel ? statusLabel(item.status) : item.status} color={statusColor ? statusColor(item.status) : "#38bdf8"} />
//             </View>
//             <Text style={styles.sub}>
//               {item.items?.length ?? 0} {item.items?.length === 1 ? "item" : "itens"}
//             </Text>
//             <Text style={styles.total}>{money(item.total)}</Text>
//           </Pressable>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#0f172a" },
//   list: { padding: 12, gap: 10 },
//   card: { backgroundColor: "#1e293b", padding: 14, borderRadius: 8, gap: 6 },
//   cardPressed: { opacity: 0.8 },
//   row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//   id: { color: "#f8fafc", fontWeight: "700", fontSize: 15 },
//   sub: { color: "#94a3b8", fontSize: 13 },
//   total: { color: "#38bdf8", fontWeight: "700", fontSize: 16, marginTop: 4 },
//   empty: { textAlign: "center", color: "#94a3b8", marginTop: 40, fontSize: 14 },
// });

import { useLayoutEffect } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useOrders } from '@/hooks/useOrders';
import { statusColor, statusLabel } from '@/lib/orders';
import { money } from '@/lib/format';
import { Badge, Button, ErrorState, Loading } from '@/components/ui';
import type { RootStackParamList } from '@/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Orders'>;

export function OrdersScreen({ navigation }: Props) {
  const { data: orders, isLoading, isError, error, refetch, isFetching } = useOrders();

  const handleGoHome = () => {
    // Volta para a tela inicial limpando o histórico do checkout
    navigation.reset({
      index: 0,
      routes: [{ name: 'Products' }],
    });
  };

  // Adiciona o botão de acionamento rápido no cabeçalho do App
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleGoHome} hitSlop={8}>
          <Text style={styles.headerButton}>Início</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  if (isLoading) return <Loading label="Carregando histórico..." />;
  if (isError) {
    return (
      <ErrorState
        message={(error as Error)?.message || 'Erro ao carregar pedidos'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={() => refetch()}
            tintColor="#38bdf8"
          />
        }
        ListEmptyComponent={<Text style={styles.empty}>Você ainda não realizou nenhum pedido.</Text>}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => navigation.navigate('Order', { id: item.id })}
          >
            <View style={styles.row}>
              <Text style={styles.id}>Pedido #{item.id.slice(-6)}</Text>
              <Badge
                label={statusLabel ? statusLabel(item.status) : item.status}
                color={statusColor ? statusColor(item.status) : '#38bdf8'}
              />
            </View>
            <Text style={styles.sub}>
              {item.items?.length ?? 0} {item.items?.length === 1 ? 'item' : 'itens'}
            </Text>
            <Text style={styles.total}>{money(item.total)}</Text>
          </Pressable>
        )}
      />

      <View style={styles.footer}>
        <Button label="Voltar a home" onPress={handleGoHome} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  list: { padding: 12, gap: 10 },
  card: { backgroundColor: '#1e293b', padding: 14, borderRadius: 8, gap: 6 },
  cardPressed: { opacity: 0.8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  id: { color: '#f8fafc', fontWeight: '700', fontSize: 15 },
  sub: { color: '#94a3b8', fontSize: 13 },
  total: { color: '#38bdf8', fontWeight: '700', fontSize: 16, marginTop: 4 },
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: 40, fontSize: 14 },
  headerButton: { color: '#38bdf8', fontWeight: '600', fontSize: 16, marginRight: 8 },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#334155' },
});