'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS, handleApiResponse, handleApiError } from '@/lib/api';
import { authStorage } from '@/lib/auth-storage';
import toast from 'react-hot-toast';

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    priceCents: number;
    originalPriceCents?: number;
    imageUrl?: string;
    images?: string[];
    isActive: boolean;
    stockQuantity: number;
    category?: {
      id: string;
      name: string;
      slug: string;
    };
  };
  createdAt: string;
}

interface ApiError {
  message: string;
  status?: number;
}

interface WishlistResponse {
  items: WishlistItem[];
  total: number;
}

const hasSession = () =>
  typeof window !== 'undefined' ? Boolean(authStorage.getAccessToken()) : false;

// Hooks
export function useWishlist(options?: { enabled?: boolean }) {
  const enabled = (options?.enabled ?? true) && hasSession();

  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.WISHLIST.LIST);
      return handleApiResponse<WishlistResponse>(response);
    },
    enabled,
  });
}

export function useWishlistCount(options?: { enabled?: boolean }) {
  const enabled = (options?.enabled ?? true) && hasSession();

  return useQuery({
    queryKey: ['wishlist', 'count'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.WISHLIST.COUNT);
      return handleApiResponse<{ count: number }>(response);
    },
    enabled,
  });
}

export function useIsInWishlist(productId: string) {
  const enabled = !!productId && hasSession();

  return useQuery({
    queryKey: ['wishlist', 'check', productId],
    queryFn: async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.WISHLIST.CHECK(productId));
        return handleApiResponse<{ isInWishlist: boolean }>(response);
      } catch (error: unknown) {
        const status = (error as ApiError)?.status ?? (error as { response?: { status?: number } }).response?.status;
        if (status === 401 || status === 403) {
          return { isInWishlist: false };
        }
        throw error;
      }
    },
    enabled,
  });
}

// Mutations
export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiClient.post(API_ENDPOINTS.WISHLIST.ADD, { productId });
      return handleApiResponse<WishlistItem>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist', 'count'] });
      toast.success('Đã thêm sản phẩm vào danh sách yêu thích!');
    },
    onError: (error: unknown) => {
      const status = (error as ApiError)?.status ?? (error as { response?: { status?: number } }).response?.status;
      if (status === 401 || status === 403) {
        toast.error('Vui lòng đăng nhập để thêm vào danh sách yêu thích');
        window.location.href = '/auth/login';
        return;
      }
      const { message } = handleApiError(error as ApiError);
      toast.error(message);
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiClient.delete(API_ENDPOINTS.WISHLIST.REMOVE(productId));
      return handleApiResponse<void>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist', 'count'] });
      toast.success('Đã xóa sản phẩm khỏi danh sách yêu thích!');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa khỏi danh sách yêu thích');
    },
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();

  const toggleWishlist = async (productId: string, isInWishlist: boolean) => {
    // Optimistic update
    queryClient.setQueryData(['wishlist', 'check', productId], { isInWishlist: !isInWishlist });

    try {
      if (isInWishlist) {
        await removeMutation.mutateAsync(productId);
      } else {
        await addMutation.mutateAsync(productId);
      }

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist', 'check', productId] });
    } catch (error) {
      // Revert optimistic update on error
      queryClient.setQueryData(['wishlist', 'check', productId], { isInWishlist });
      console.error('Toggle wishlist error:', error);
      throw error;
    }
  };

  return {
    toggleWishlist,
    isLoading: addMutation.isPending || removeMutation.isPending,
  };
}
