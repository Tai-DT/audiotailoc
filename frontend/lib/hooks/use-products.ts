import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';
import { Product, ProductFilters, PaginatedResponse, ProductForm } from '../types';

// Product Analytics Interface
export interface ProductAnalytics {
  totalProducts: number;
  totalValue: number;
  lowStock: number;
  topCategories: Array<{ name: string; count: number }>;
}

export const productQueryKeys = {
  all: ['products'] as const,
  lists: () => [...productQueryKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productQueryKeys.lists(), filters] as const,
  details: () => [...productQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...productQueryKeys.details(), id] as const,
  analytics: ['products', 'analytics'] as const,
  topViewed: ['products', 'top-viewed'] as const,
  recent: ['products', 'recent'] as const,
};

export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: productQueryKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/catalog/products', { params: filters });
      const result = handleApiResponse<{
        data: Product[];
        pagination: { total: number; page: number; pageSize: number };
      }>(response);

      // Transform backend response to match PaginatedResponse interface
      return {
        items: result.data || [],
        total: result.pagination?.total || 0,
        page: result.pagination?.page || 1,
        pageSize: result.pagination?.pageSize || 20,
        totalPages: Math.ceil((result.pagination?.total || 0) / (result.pagination?.pageSize || 20)),
        hasNext: (result.pagination?.page || 1) < Math.ceil((result.pagination?.total || 0) / (result.pagination?.pageSize || 20)),
        hasPrev: (result.pagination?.page || 1) > 1,
      } as PaginatedResponse<Product>;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productQueryKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/catalog/products/${id}`);
      return handleApiResponse<Product>(response);
    },
    enabled: !!id,
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['products', 'slug', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/catalog/products/slug/${slug}`);
      return handleApiResponse<Product>(response);
    },
    enabled: !!slug,
  });
};

export const useProductSearch = (query: string, limit = 10) => {
  return useQuery({
    queryKey: ['products', 'search', query, limit],
    queryFn: async () => {
      const response = await apiClient.get('/catalog/products/search', {
        params: { q: query, limit },
      });
      const result = handleApiResponse<{ data: Product[]; pagination?: { total?: number; page?: number; pageSize?: number } }>(response);
      return result.data || [];
    },
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useProductAnalytics = () => {
  return useQuery({
    queryKey: productQueryKeys.analytics,
    queryFn: async () => {
      const response = await apiClient.get('/catalog/products/analytics/overview');
      return handleApiResponse<ProductAnalytics>(response);
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useTopViewedProducts = (limit = 10) => {
  return useQuery({
    queryKey: [...productQueryKeys.topViewed, limit],
    queryFn: async () => {
      const response = await apiClient.get('/catalog/products/analytics/top-viewed', {
        params: { limit },
      });
      const result = handleApiResponse<{ data: Product[]; pagination?: { total?: number; page?: number; pageSize?: number } }>(response);
      return result.data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useRecentProducts = (limit = 10) => {
  return useQuery({
    queryKey: [...productQueryKeys.recent, limit],
    queryFn: async () => {
      const response = await apiClient.get('/catalog/products/analytics/recent', {
        params: { limit },
      });
      const result = handleApiResponse<{ data: Product[]; pagination?: { total?: number; page?: number; pageSize?: number } }>(response);
      return result.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: ProductForm) => {
      const response = await apiClient.post('/catalog/products', data);
      return handleApiResponse<Product>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productQueryKeys.analytics });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProductForm> }) => {
      const response = await apiClient.put(`/catalog/products/${id}`, data);
      return handleApiResponse<Product>(response);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productQueryKeys.analytics });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/catalog/products/${id}`);
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productQueryKeys.analytics });
    },
  });
};