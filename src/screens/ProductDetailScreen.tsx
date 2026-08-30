// // // /**
// // //  * Tela de DETALHE do produto.
// // //  * Demonstra: useQuery de item único (useProduct), escolha de VARIANTE, e a
// // //  * MUTATION otimista de "adicionar ao carrinho" — o item aparece no carrinho
// // //  * antes da resposta do servidor.
// // //  */
// // // import { useMemo, useState } from 'react';
// // // import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
// // // import type { NativeStackScreenProps } from '@react-navigation/native-stack';
// // // import { useProduct } from '@/hooks/useProduct';
// // // import { useCartMutations } from '@/hooks/useCartMutations';
// // // import { useSession } from '@/session/session';
// // // import { money } from '@/lib/format';
// // // import { Button, ErrorState, Loading } from '@/components/ui';
// // // import type { RootStackParamList } from '@/navigation';
// // // import type { ApiError, ProductVariant } from '@/types/api';

// // // type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

// // // export function ProductDetailScreen({ route, navigation }: Props) {
// // //   const { id } = route.params;
// // //   const { data: product, isLoading, isError, error, refetch } = useProduct(id);
// // //   const { isLoggedIn } = useSession();
// // //   const { addItem } = useCartMutations();

// // //   const [variantId, setVariantId] = useState<string | null>(null);

// // //   // Variante escolhida (ou a default/primeira quando o produto chega).
// // //   const selected: ProductVariant | undefined = useMemo(() => {
// // //     if (!product) return undefined;
// // //     return (
// // //       product.variants.find((v) => v.id === variantId) ??
// // //       product.variants.find((v) => v.isDefault) ??
// // //       product.variants[0]
// // //     );
// // //   }, [product, variantId]);

// // //   if (isLoading) return <Loading label="Carregando produto…" />;
// // //   if (isError || !product) return <ErrorState message={(error as ApiError)?.message ?? 'Falha'} onRetry={() => refetch()} />;

// // //   const outOfStock = !selected || selected.stock <= 0;

// // //   function handleAdd() {
// // //     // Narrowing do early-return não entra em closures — reconferimos aqui.
// // //     if (!product || !selected) return;
// // //     addItem.mutate(
// // //       {
// // //         variantId: selected.id,
// // //         quantity: 1,
// // //         name: selected.label ? `${product.name} (${selected.label})` : product.name,
// // //         unitPrice: selected.price,
// // //       },
// // //       { onSuccess: () => navigation.navigate('Cart') },
// // //     );
// // //   }

// // //   return (
// // //     <ScrollView contentContainerStyle={styles.container}>
// // //       {product.images[0] && <Image source={{ uri: product.images[0].url }} style={styles.hero} />}
// // //       <Text style={styles.name}>{product.name}</Text>
// // //       {selected && <Text style={styles.price}>{money(selected.price)}</Text>}
// // //       {product.description && <Text style={styles.desc}>{product.description}</Text>}

// // //       {/* Produto VARIABLE: deixa escolher a variante. SIMPLE já usa a única. */}
// // //       {product.type === 'VARIABLE' && (
// // //         <View style={styles.variants}>
// // //           <Text style={styles.label}>Opções</Text>
// // //           <View style={styles.variantRow}>
// // //             {product.variants.map((v) => {
// // //               const active = v.id === selected?.id;
// // //               return (
// // //                 <Text
// // //                   key={v.id}
// // //                   onPress={() => setVariantId(v.id)}
// // //                   style={[styles.chip, active && styles.chipActive, v.stock <= 0 && styles.chipDisabled]}
// // //                 >
// // //                   {v.label ?? v.sku}
// // //                 </Text>
// // //               );
// // //             })}
// // //           </View>
// // //         </View>
// // //       )}

// // //       <Text style={styles.stock}>{outOfStock ? 'Sem estoque' : `${selected?.stock} em estoque`}</Text>

// // //       {!isLoggedIn && (
// // //         <Text style={styles.loginHint}>Você precisa estar logado para comprar (veja a tela do carrinho).</Text>
// // //       )}

// // //       <Button
// // //         label={addItem.isPending ? 'Adicionando…' : 'Adicionar ao carrinho'}
// // //         onPress={handleAdd}
// // //         disabled={outOfStock || !isLoggedIn || addItem.isPending}
// // //       />
// // //     </ScrollView>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: { padding: 16, gap: 10 },
// // //   hero: { width: '100%', height: 260, borderRadius: 14, backgroundColor: '#e5e7eb' },
// // //   name: { fontSize: 20, fontWeight: '700', color: '#111827' },
// // //   price: { fontSize: 20, fontWeight: '800', color: '#111827' },
// // //   desc: { fontSize: 14, color: '#374151', lineHeight: 20 },
// // //   variants: { gap: 6, marginTop: 4 },
// // //   label: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
// // //   variantRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
// // //   chip: {
// // //     borderWidth: 1,
// // //     borderColor: '#d1d5db',
// // //     borderRadius: 999,
// // //     paddingHorizontal: 14,
// // //     paddingVertical: 8,
// // //     overflow: 'hidden',
// // //     color: '#111827',
// // //   },
// // //   chipActive: { borderColor: '#111827', backgroundColor: '#111827', color: '#fff' },
// // //   chipDisabled: { opacity: 0.4 },
// // //   stock: { fontSize: 13, color: '#6b7280' },
// // //   loginHint: { fontSize: 13, color: '#b45309' },
// // // });

// // import { useMemo, useState } from 'react';
// // import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
// // import type { NativeStackScreenProps } from '@react-navigation/native-stack';
// // import { useProduct } from '@/hooks/useProduct';
// // import { useCartMutations } from '@/hooks/useCartMutations';
// // import { useFavoriteMutations, useFavorites } from '@/hooks/useFavorites';
// // import { useSession } from '@/session/session';
// // import { money } from '@/lib/format';
// // import { Button, ErrorState, Loading } from '@/components/ui';
// // import type { RootStackParamList } from '@/navigation';
// // import type { ApiError, ProductVariant } from '@/types/api';

// // type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

// // export function ProductDetailScreen({ route, navigation }: Props) {
// //   const { id } = route.params;
// //   const { data: product, isLoading, isError, error, refetch } = useProduct(id);
// //   const { isLoggedIn } = useSession();
// //   const { addItem } = useCartMutations();
// //   const { data: favorites } = useFavorites();
// //   const { add: addFav, remove: removeFav } = useFavoriteMutations();

// //   const [variantId, setVariantId] = useState<string | null>(null);

// //   const selected: ProductVariant | undefined = useMemo(() => {
// //     if (!product) return undefined;
// //     return (
// //       product.variants.find((v) => v.id === variantId) ??
// //       product.variants.find((v) => v.isDefault) ??
// //       product.variants[0]
// //     );
// //   }, [product, variantId]);

// //   const isFavorited = useMemo(() => {
// //     if (!selected || !favorites) return false;
// //     return favorites.some((f) => f.variantId === selected.id);
// //   }, [selected, favorites]);

// //   if (isLoading) return <Loading label="Buscando detalhes da peça..." />;
// //   if (isError || !product) return <ErrorState message={(error as ApiError)?.message ?? 'Falha'} onRetry={() => refetch()} />;

// //   const outOfStock = !selected || selected.stock <= 0;

// //   function handleAdd() {
// //     if (!product || !selected) return;
// //     addItem.mutate(
// //       {
// //         variantId: selected.id,
// //         quantity: 1,
// //         name: selected.label ? `${product.name} (${selected.label})` : product.name,
// //         unitPrice: selected.price,
// //       },
// //       { onSuccess: () => navigation.navigate('Cart') },
// //     );
// //   }

// //   function toggleFavorite() {
// //     if (!selected) return;
// //     if (isFavorited) {
// //       removeFav.mutate(selected.id);
// //     } else {
// //       addFav.mutate(selected.id);
// //     }
// //   }

// //   return (
// //     <ScrollView contentContainerStyle={styles.container}>
// //       {product.images[0] && <Image source={{ uri: product.images[0].url }} style={styles.hero} />}
// //       <Text style={styles.name}>{product.name}</Text>
// //       {selected && <Text style={styles.price}>{money(selected.price)}</Text>}
// //       {product.description && <Text style={styles.desc}>{product.description}</Text>}

// //       {product.type === 'VARIABLE' && (
// //         <View style={styles.variants}>
// //           <Text style={styles.label}>Modelos e Compatibilidades</Text>
// //           <View style={styles.variantRow}>
// //             {product.variants.map((v) => {
// //               const active = v.id === selected?.id;
// //               return (
// //                 <Text
// //                   key={v.id}
// //                   onPress={() => setVariantId(v.id)}
// //                   style={[styles.chip, active && styles.chipActive, v.stock <= 0 && styles.chipDisabled]}
// //                 >
// //                   {v.label ?? v.sku}
// //                 </Text>
// //               );
// //             })}
// //           </View>
// //         </View>
// //       )}

// //       <Text style={styles.stock}>{outOfStock ? 'Sem estoque disponível' : `${selected?.stock} unidades em estoque`}</Text>

// //       {isLoggedIn && selected && (
// //         <Button
// //           label={isFavorited ? 'Remover dos Favoritos' : 'Favoritar Peça'}
// //           variant="ghost"
// //           onPress={toggleFavorite}
// //           disabled={addFav.isPending || removeFav.isPending}
// //         />
// //       )}

// //       <Button
// //         label={addItem.isPending ? 'Adicionando...' : 'Adicionar ao carrinho'}
// //         onPress={handleAdd}
// //         disabled={outOfStock || !isLoggedIn || addItem.isPending}
// //       />
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { padding: 16, gap: 12, backgroundColor: '#0f172a', flexGrow: 1 },
// //   hero: { width: '100%', height: 240, borderRadius: 8, backgroundColor: '#1e293b' },
// //   name: { fontSize: 20, fontWeight: '700', color: '#f8fafc' },
// //   price: { fontSize: 22, fontWeight: '800', color: '#ef4444' },
// //   desc: { fontSize: 14, color: '#94a3b8', lineHeight: 20 },
// //   variants: { gap: 6, marginTop: 4 },
// //   label: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
// //   variantRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
// //   chip: {
// //     borderWidth: 1,
// //     borderColor: '#334155',
// //     backgroundColor: '#1e293b',
// //     borderRadius: 6,
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //     overflow: 'hidden',
// //     color: '#f8fafc',
// //   },
// //   chipActive: { borderColor: '#ef4444', backgroundColor: '#ef4444', color: '#ffffff' },
// //   chipDisabled: { opacity: 0.4 },
// //   stock: { fontSize: 13, color: '#94a3b8' },
// // });

// import { useState } from 'react';
// import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
// import { useQuery } from '@tanstack/react-query';
// import type { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { getProduct } from '@/services/products';
// import { queryKeys } from '@/lib/queryKeys';
// import { useCartMutations } from '@/hooks/useCart';
// import { useFavoriteMutations, useFavorites } from '@/hooks/useFavorites';
// import { money } from '@/lib/format';
// import { Button, ErrorState, Loading } from '@/components/ui';
// import type { RootStackParamList } from '@/navigation';

// type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

// export function ProductDetailScreen({ route, navigation }: Props) {
//   const { id } = route.params;
//   const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

//   const { data: product, isLoading, isError, error, refetch } = useQuery({
//     queryKey: queryKeys.products.detail(id),
//     queryFn: () => getProduct(id),
//   });

//   const { data: favorites } = useFavorites();
//   const { addFavorite, removeFavorite } = useFavoriteMutations();
//   const { add: addToCartMutation } = useCartMutations();

//   if (isLoading) return <Loading label="Carregando produto..." />;
//   if (isError || !product) return <ErrorState message={(error as Error)?.message ?? 'Não encontrado'} onRetry={() => refetch()} />;

//   const activeVariant = product.variants[selectedVariantIndex] ?? product.variants[0];
//   const isFav = favorites?.some((f) => f.variantId === activeVariant?.id);

//   const toggleFav = () => {
//     if (!activeVariant) return;
//     if (isFav) {
//       removeFavorite(activeVariant.id);
//     } else {
//       addFavorite(activeVariant.id);
//     }
//   };

//   const handleAddToCart = () => {
//     if (!activeVariant) return;
//     addToCartMutation.mutate(
//       { variantId: activeVariant.id, quantity: 1 },
//       { onSuccess: () => navigation.navigate('Cart') }
//     );
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.content}>
//       <Image
//         source={{ uri: activeVariant?.images[0]?.url ?? product.images[0]?.url }}
//         style={styles.image}
//       />
//       <View style={styles.details}>
//         <Text style={styles.brand}>{product.brand?.name ?? 'Peça Moto'}</Text>
//         <Text style={styles.title}>{product.name}</Text>
//         <Text style={styles.price}>{money(activeVariant?.price ?? 0)}</Text>

//         {product.variants.length > 1 && (
//           <View style={styles.variants}>
//             <Text style={styles.label}>Selecione a variação:</Text>
//             <View style={styles.variantList}>
//               {product.variants.map((v, i) => (
//                 <Button
//                   key={v.id}
//                   label={v.label || v.sku}
//                   variant={selectedVariantIndex === i ? 'primary' : 'ghost'}
//                   onPress={() => setSelectedVariantIndex(i)}
//                 />
//               ))}
//             </View>
//           </View>
//         )}

//         <Text style={styles.desc}>{product.description ?? 'Sem descrição técnica do fabricante.'}</Text>

//         <View style={styles.actions}>
//           <Button
//             label={isFav ? 'Remover dos Favoritos' : 'Salvar nos Favoritos'}
//             variant="ghost"
//             onPress={toggleFav}
//           />
//           <Button
//             label="Adicionar ao Carrinho"
//             onPress={handleAddToCart}
//             disabled={addToCartMutation.isPending}
//           />
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#0f172a' },
//   content: { padding: 16, gap: 16 },
//   image: { width: '100%', height: 260, borderRadius: 8, backgroundColor: '#1e293b' },
//   details: { gap: 12 },
//   brand: { fontSize: 12, color: '#dc2626', fontWeight: '700', textTransform: 'uppercase' },
//   title: { fontSize: 20, fontWeight: '700', color: '#f8fafc' },
//   price: { fontSize: 22, fontWeight: '700', color: '#38bdf8' },
//   variants: { gap: 6 },
//   label: { color: '#94a3b8', fontSize: 13 },
//   variantList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
//   desc: { color: '#94a3b8', fontSize: 14, lineHeight: 20 },
//   actions: { gap: 10, marginTop: 12 },
// });

import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getProduct } from '@/services/products';
import { queryKeys } from '@/lib/queryKeys';
import { useCartMutations } from '@/hooks/useCart';
import { useFavoriteMutations, useFavorites } from '@/hooks/useFavorites';
import { money } from '@/lib/format';
import { Button, ErrorState, Loading } from '@/components/ui';
import type { RootStackParamList } from '@/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

export function ProductDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const { data: product, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => getProduct(id),
  });

  const { data: favorites } = useFavorites();
  const { addFavoriteAsync, removeFavoriteAsync, isAdding, isRemoving } = useFavoriteMutations();
  const { add: addToCartMutation } = useCartMutations();

  if (isLoading) return <Loading label="Carregando produto..." />;
  if (isError || !product) return <ErrorState message={(error as Error)?.message ?? 'Não encontrado'} onRetry={() => refetch()} />;

  const activeVariant = product.variants[selectedVariantIndex] ?? product.variants[0];
  const isFav = favorites?.some((f) => f.variantId === activeVariant?.id);

  const toggleFav = async () => {
    if (!activeVariant || !product) return;
    try {
      if (isFav) {
        await removeFavoriteAsync(activeVariant.id);
        Alert.alert('Favoritos', `"${product.name}" foi removido dos favoritos.`);
      } else {
        await addFavoriteAsync(activeVariant.id);
        Alert.alert('Favoritos', `"${product.name}" foi adicionado aos favoritos!`);
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar os favoritos.');
    }
  };

  const handleAddToCart = () => {
    if (!activeVariant) return;
    addToCartMutation.mutate(
      { variantId: activeVariant.id, quantity: 1 },
      { onSuccess: () => navigation.navigate('Cart') }
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image
        source={{ uri: activeVariant?.images[0]?.url ?? product.images[0]?.url }}
        style={styles.image}
      />
      <View style={styles.details}>
        <Text style={styles.brand}>{product.brand?.name ?? 'Peça Moto'}</Text>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>{money(activeVariant?.price ?? 0)}</Text>

        {product.variants.length > 1 && (
          <View style={styles.variants}>
            <Text style={styles.label}>Selecione a variação:</Text>
            <View style={styles.variantList}>
              {product.variants.map((v, i) => (
                <Button
                  key={v.id}
                  label={v.label || v.sku}
                  variant={selectedVariantIndex === i ? 'primary' : 'ghost'}
                  onPress={() => setSelectedVariantIndex(i)}
                />
              ))}
            </View>
          </View>
        )}

        <Text style={styles.desc}>{product.description ?? 'Sem descrição técnica do fabricante.'}</Text>

        <View style={styles.actions}>
          <Button
            label={isFav ? 'Remover dos Favoritos' : 'Salvar nos Favoritos'}
            variant="ghost"
            disabled={isAdding || isRemoving}
            onPress={toggleFav}
          />
          <Button
            label="Adicionar ao Carrinho"
            onPress={handleAddToCart}
            disabled={addToCartMutation.isPending}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 16, gap: 16 },
  image: { width: '100%', height: 260, borderRadius: 8, backgroundColor: '#1e293b' },
  details: { gap: 12 },
  brand: { fontSize: 12, color: '#dc2626', fontWeight: '700', textTransform: 'uppercase' },
  title: { fontSize: 20, fontWeight: '700', color: '#f8fafc' },
  price: { fontSize: 22, fontWeight: '700', color: '#38bdf8' },
  variants: { gap: 6 },
  label: { color: '#94a3b8', fontSize: 13 },
  variantList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  desc: { color: '#94a3b8', fontSize: 14, lineHeight: 20 },
  actions: { gap: 10, marginTop: 12 },
});