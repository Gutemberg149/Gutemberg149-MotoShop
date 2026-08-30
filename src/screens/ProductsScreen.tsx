// import { useState } from 'react';
// import { FlatList, Image, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
// import { useQuery } from '@tanstack/react-query';
// import type { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { listProducts } from '@/services/products';
// import { queryKeys } from '@/lib/queryKeys';
// import { money } from '@/lib/format';
// import { Button, ErrorState, Loading, TextField } from '@/components/ui';
// import { useSession } from '@/session/session';
// import type { RootStackParamList } from '@/navigation';

// type Props = NativeStackScreenProps<RootStackParamList, 'Products'>;

// export function ProductsScreen({ navigation }: Props) {
//   const { signOut } = useSession();
//   const [search, setSearch] = useState('');

//   const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
//     queryKey: queryKeys.products.list({ search }),
//     queryFn: () => listProducts({ search }),
//   });

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TextField
//           placeholder="Buscar peça de moto..."
//           value={search}
//           onChangeText={setSearch}
//         />
//         <View style={styles.actions}>
//           <Button label="Favoritos" variant="ghost" onPress={() => navigation.navigate('Favorites')} />
//           <Button label="Pedidos" variant="ghost" onPress={() => navigation.navigate('Orders')} />
//           <Button label="Carrinho" variant="ghost" onPress={() => navigation.navigate('Cart')} />
//           <Button label="Sair" variant="ghost" onPress={signOut} />
//         </View>
//       </View>

//       {isLoading ? (
//         <Loading label="Buscando peças..." />
//       ) : isError ? (
//         <ErrorState message={(error as Error).message} onRetry={() => refetch()} />
//       ) : (
//         <FlatList
//           data={data?.data ?? []}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.list}
//           refreshControl={<RefreshControl refreshing={isFetching} onRefresh={() => refetch()} tintColor="#dc2626" />}
//           renderItem={({ item }) => (
//             <Pressable
//               style={styles.card}
//               onPress={() => navigation.navigate('ProductDetail', { id: item.id, name: item.name })}
//             >
//               {item.image ? (
//                 <Image source={{ uri: item.image }} style={styles.image} />
//               ) : (
//                 <View style={[styles.image, styles.imageEmpty]} />
//               )}
//               <View style={styles.info}>
//                 <Text style={styles.brand}>{item.brand ?? 'Peça Multimarca'}</Text>
//                 <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
//                 <Text style={styles.price}>{money(item.priceFrom)}</Text>
//               </View>
//             </Pressable>
//           )}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#0f172a' },
//   header: { padding: 12, gap: 10, backgroundColor: '#1e293b' },
//   actions: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
//   list: { padding: 12, gap: 10 },
//   card: { backgroundColor: '#1e293b', borderRadius: 8, padding: 12, flexDirection: 'row', gap: 12 },
//   image: { width: 80, height: 80, borderRadius: 6, backgroundColor: '#334155' },
//   imageEmpty: { backgroundColor: '#334155' },
//   info: { flex: 1, justifyContent: 'center' },
//   brand: { fontSize: 11, color: '#dc2626', fontWeight: '700', textTransform: 'uppercase' },
//   title: { fontSize: 14, color: '#f8fafc', fontWeight: '600' },
//   price: { fontSize: 16, color: '#38bdf8', fontWeight: '700', marginTop: 4 },
// });

import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { listProducts } from '@/services/products';
import { queryKeys } from '@/lib/queryKeys';
import { money } from '@/lib/format';
import { Button, ErrorState, Loading, TextField } from '@/components/ui';
import { useSession } from '@/session/session';
import type { RootStackParamList } from '@/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Products'>;

export function ProductsScreen({ navigation }: Props) {
  const { signOut } = useSession();
  const [search, setSearch] = useState('');

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: queryKeys.products.list({ search }),
    queryFn: () => listProducts({ search }),
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextField
          placeholder="Buscar peça de moto..."
          value={search}
          onChangeText={setSearch}
        />
        <View style={styles.actions}>
          <Button label="Favoritos" variant="ghost" onPress={() => navigation.navigate('Favorites')} />
          <Button label="Pedidos" variant="ghost" onPress={() => navigation.navigate('Orders')} />
          <Button label="Carrinho" variant="ghost" onPress={() => navigation.navigate('Cart')} />
          <Button label="Sair" variant="ghost" onPress={signOut} />
        </View>
      </View>

      {isLoading ? (
        <Loading label="Buscando peças..." />
      ) : isError ? (
        <ErrorState message={(error as Error).message} onRetry={() => refetch()} />
      ) : (
        <FlatList
          data={data?.data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={() => refetch()} tintColor="#dc2626" />}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => navigation.navigate('ProductDetail', { id: item.id, name: item.name })}
            >
              <View style={[styles.image, styles.iconContainer]}>
                <MaterialCommunityIcons name="cog-outline" size={36} color="#94a3b8" />
              </View>
              <View style={styles.info}>
                <Text style={styles.brand}>{item.brand ?? 'Peça Multimarca'}</Text>
                <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.price}>{money(item.priceFrom)}</Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { padding: 12, gap: 10, backgroundColor: '#1e293b' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
  list: { padding: 12, gap: 10 },
  card: { backgroundColor: '#1e293b', borderRadius: 8, padding: 12, flexDirection: 'row', gap: 12 },
  image: { width: 80, height: 80, borderRadius: 6, backgroundColor: '#334155' },
  imageEmpty: { backgroundColor: '#334155' },
  iconContainer: { justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1, justifyContent: 'center' },
  brand: { fontSize: 11, color: '#dc2626', fontWeight: '700', textTransform: 'uppercase' },
  title: { fontSize: 14, color: '#f8fafc', fontWeight: '600' },
  price: { fontSize: 16, color: '#38bdf8', fontWeight: '700', marginTop: 4 },
});