import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';
import { Category, CategoryForm } from '../types';

export const categoryQueryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryQueryKeys.all, 'list'] as const,
  list: () => [...categoryQueryKeys.lists()] as const,
  details: () => [...categoryQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryQueryKeys.details(), id] as const,
};

export const useCategories = () => {
  return useQuery({
    queryKey: categoryQueryKeys.list(),
    queryFn: async () => {
      const response = await apiClient.get('/catalog/categories');
      const result = handleApiResponse<{ data: Category[] }>(response);
      return result.data || [];
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useCategory = (idOrSlug: string) => {
  return useQuery({
    queryKey: ['category', idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) throw new Error('Missing category identifier');

      // Check if it's a UUID or CUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      const isCUID = /^c[a-z0-9]{15,}$/i.test(idOrSlug);

      const tryDetail = async (val: string) => {
        const res = await apiClient.get(`/catalog/categories/${val}`);
        return handleApiResponse<Category>(res);
      };
      const trySlug = async (val: string) => {
        const res = await apiClient.get(`/catalog/categories/slug/${val}`);
        return handleApiResponse<Category>(res);
      };

      try {
        if (isUUID || isCUID) {
          return await tryDetail(idOrSlug);
        }

        // Try as slug first
        try {
          return await trySlug(idOrSlug);
        } catch (err: unknown) {
          const status = typeof err === 'object' && err !== null && 'response' in err
            ? (err as { response?: { status?: number } }).response?.status
            : undefined;
          if (status === 404) {
            // Fallback to detail
            return await tryDetail(idOrSlug);
          }
          throw err;
        }
      } catch (error) {
        throw error;
      }
    },
    enabled: !!idOrSlug,
    staleTime: 15 * 60 * 1000,
  });
};

export const useCategoryBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['categories', 'slug', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/catalog/categories/slug/${slug}`);
      return handleApiResponse<Category>(response);
    },
    enabled: !!slug,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CategoryForm) => {
      const response = await apiClient.post('/catalog/categories', data);
      return handleApiResponse<Category>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.lists() });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CategoryForm> }) => {
      const response = await apiClient.put(`/catalog/categories/${id}`, data);
      return handleApiResponse<Category>(response);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.detail(id) });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/catalog/categories/${id}`);
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.lists() });
    },
  });
};