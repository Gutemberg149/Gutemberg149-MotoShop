// import { http } from './http';
// import type { FavoriteItem } from '@/types/api';

// export async function getFavorites(): Promise<FavoriteItem[]> {
//   const { data } = await http.get<FavoriteItem[]>('/customers/me/favorites');
//   return data;
// }

// export async function addFavorite(variantId: string): Promise<void> {
//   await http.post('/customers/me/favorites', { variantId });
// }

// export async function removeFavorite(variantId: string): Promise<void> {
//   await http.delete(`/customers/me/favorites/${variantId}`);
// }

import { http } from './http';
import type { FavoriteItem } from '@/types/api';

export async function getFavorites(): Promise<FavoriteItem[]> {
  const { data } = await http.get<FavoriteItem[]>('/customers/me/favorites');
  return data;
}

export async function addFavorite(variantId: string): Promise<void> {
  await http.post('/customers/me/favorites', { variantId });
}

export async function removeFavorite(variantId: string): Promise<void> {
  await http.delete(`/customers/me/favorites/${variantId}`);
}