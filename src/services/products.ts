// /**
//  * Serviço de PRODUTOS (SEMANA 1). Funções puras que só falam com a API.
//  * Nada de React aqui — os hooks da Semana 2 (useProducts/useProduct) chamam isto.
//  */
// import { http } from './http';
// import type { Paginated, Product, ProductSummary } from '@/types/api';

// export interface ListProductsParams {
//   search?: string;
//   categoryId?: string;
//   page?: number;
//   pageSize?: number;
// }

// /** GET /products -> envelope paginado de resumos. */
// export async function listProducts(params: ListProductsParams = {}): Promise<Paginated<ProductSummary>> {
//   const { data } = await http.get<Paginated<ProductSummary>>('/products', { params });
//   return data;
// }

// /** GET /products/:id -> produto detalhado (traz as variantes). */
// export async function getProduct(id: string): Promise<Product> {
//   const { data } = await http.get<Product>(`/products/${id}`);
//   return data;
// }

/**
 * Serviço de PRODUTOS (SEMANA 1). Funções puras que só falam com a API.
 * Nada de React aqui — os hooks da Semana 2 (useProducts/useProduct) chamam isto.
 */
import { http } from './http';
import type { Paginated, Product, ProductSummary } from '@/types/api';

export interface ListProductsParams {
  search?: string;
  categoryId?: string;
  page?: number;
  pageSize?: number;
}

export interface EnrichedVariantDetail {
  id: string;
  productId: string;
  productName: string;
  price: number;
  image?: string;
  variantLabel?: string;
}

/** GET /products -> envelope paginado de resumos. */
export async function listProducts(params: ListProductsParams = {}): Promise<Paginated<ProductSummary>> {
  const { data } = await http.get<Paginated<ProductSummary>>('/products', { params });
  return data;
}

/** GET /products/:id -> produto detalhado (traz as variantes). */
export async function getProduct(id: string): Promise<Product> {
  const { data } = await http.get<Product>(`/products/${id}`);
  return data;
}

/**
 * GET /products/variant/:variantId -> busca os dados de produto a partir do ID da variante.
 * Resolve o problema do título vazio nas telas de Favoritos e Carrinho.
 */
export async function getProductByVariantId(variantId: string): Promise<EnrichedVariantDetail> {
  const { data } = await http.get<any>(`/products/variant/${variantId}`);

  return {
    id: data.id || variantId,
    productId: data.productId || data.product?.id || data.id,
    productName: data.productName || data.product?.name || data.name || 'Peça sem título',
    price: data.price ?? data.variant?.price ?? 0,
    image: data.image || data.images?.[0]?.url || data.product?.images?.[0]?.url,
    variantLabel: data.label || data.sku || data.variantLabel,
  };
}