'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS, handleApiResponse } from '@/lib/api';
import toast from 'react-hot-toast';

// Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  priceCents: number;
  originalPriceCents?: number;
  imageUrl?: string;
  images?: string[];
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
  brand?: string;
  model?: string;
  sku?: string;
  specifications?: Record<string, string>;
  features?: string;
  warranty?: string;
  weight?: number;
  dimensions?: string;
  stockQuantity: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  maxStock?: number;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  featured?: boolean;
  isActive: boolean;
  isDeleted?: boolean;
  viewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

interface ApiError {
  message: string;
  status?: number;
}

// Hooks
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, {
        params: filters,
      });
      const apiResponse = handleApiResponse<{
        products: Product[];
        total: number;
        page: number;
        totalPages: number;
      }>(response);

      // API always returns object with products array
      return apiResponse;
    },
  });
}

export function useProduct(idOrSlug: string) {
  return useQuery({
    queryKey: ['product', idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) throw new Error('Missing product identifier');

      // Patterns
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      // CUID / CUID2 style (simple heuristic: starts with c, length 25-32, alnum)
      const isCUID = /^c[a-z0-9]{15,}$/i.test(idOrSlug);

      // Allow slug forms like: some-product-name-cmg4t1xtc006vitfly0sjzja1
      let baseIdOrSlug = idOrSlug;
      const trailingIdMatch = idOrSlug.match(/(c[a-z0-9]{15,})$/i);
      if (!isUUID && !isCUID && trailingIdMatch) {
        baseIdOrSlug = trailingIdMatch[1];
      }

      const tryDetail = async (val: string) => {
        const res = await apiClient.get(API_ENDPOINTS.PRODUCTS.DETAIL(val));
        return handleApiResponse<Product>(res);
      };
      const trySlug = async (val: string) => {
        const res = await apiClient.get(API_ENDPOINTS.PRODUCTS.DETAIL_BY_SLUG(val));
        return handleApiResponse<Product>(res);
      };

      // Resolution strategy:
      // 1. If UUID or CUID -> attempt direct detail
      // 2. Else attempt slug; if 404 and trailing ID pattern -> fallback to detail
      // 3. If slug attempt first and fails non-404 -> throw

      try {
        if (isUUID || isCUID) {
          return await tryDetail(baseIdOrSlug);
        }

        // Try as slug first
        try {
          return await trySlug(baseIdOrSlug);
        } catch (err: unknown) {
          const status = typeof err === 'object' && err !== null && 'response' in err
            ? (err as { response?: { status?: number } }).response?.status
            : undefined;
          if (status === 404 && trailingIdMatch) {
            // Fallback to detail with extracted ID
            return await tryDetail(trailingIdMatch[1]);
          }
          throw err;
        }
      } catch (error) {
        // Final fallback: if raw looked like ID but failed slug earlier
        if (!isUUID && !isCUID && trailingIdMatch) {
          try {
            return await tryDetail(trailingIdMatch[1]);
          } catch {
            throw error;
          }
        }
        throw error;
      }
    },
    enabled: !!idOrSlug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductSearch(query: string) {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.SEARCH, {
        params: { q: query },
      });
      return handleApiResponse<Product[]>(response);
    },
    enabled: query.length > 2,
  });
}

type FeaturedProductsResponse = Product[] | { items?: Product[] } | { products?: Product[] };

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, {
        params: { featured: true, limit: 8 },
      });
      const apiResponse = handleApiResponse<FeaturedProductsResponse>(response);

      if (Array.isArray(apiResponse)) {
        return apiResponse;
      }

      if (apiResponse && 'items' in apiResponse) {
        return apiResponse.items ?? [];
      }

      if (apiResponse && 'products' in apiResponse) {
        return apiResponse.products ?? [];
      }

      return [];
    },
  });
}

export function useProductAnalytics() {
  return useQuery({
    queryKey: ['products', 'analytics'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.ANALYTICS);
      return handleApiResponse<{
        totalProducts: number;
        totalValue: number;
        lowStock: number;
        topCategories: Array<{ name: string; count: number }>;
      }>(response);
    },
  });
}

// Mutations
export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (product: Partial<Product>) => {
      const response = await apiClient.post(API_ENDPOINTS.PRODUCTS.CREATE, product);
      return handleApiResponse<Product>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Sản phẩm đã được tạo thành công!');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Có lỗi xảy ra khi tạo sản phẩm');
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...product }: Partial<Product> & { id: string }) => {
      const response = await apiClient.put(API_ENDPOINTS.PRODUCTS.UPDATE(id), product);
      return handleApiResponse<Product>(response);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', data.id] });
      toast.success('Sản phẩm đã được cập nhật thành công!');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật sản phẩm');
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
      return handleApiResponse<void>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Sản phẩm đã được xóa thành công!');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa sản phẩm');
    },
  });
}
