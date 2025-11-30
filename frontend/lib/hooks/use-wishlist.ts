import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';
import { Wishlist, WishlistItem, CreateWishlistItemDto } from '../types';
import { authStorage } from '../auth-storage';

export const wishlistQueryKeys = {
  all: ['wishlist'] as const,
  details: () => [...wishlistQueryKeys.all, 'detail'] as const,
};

export const useWishlist = () => {
  const hasToken = Boolean(authStorage.getAccessToken());
  
  return useQuery({
    queryKey: wishlistQueryKeys.details(),
    queryFn: async () => {
      const response = await apiClient.get('/wishlist');
      return handleApiResponse<Wishlist>(response);
    },
    enabled: hasToken, // Only run query if token exists
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const data: CreateWishlistItemDto = { productId };
      // Backend uses POST /wishlist
      const response = await apiClient.post('/wishlist', data);
      return handleApiResponse<WishlistItem>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistQueryKeys.all });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      // Backend uses DELETE /wishlist/:productId
      const response = await apiClient.delete(`/wishlist/${productId}`);
      return handleApiResponse<{ success: boolean }>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistQueryKeys.all });
    },
  });
};

export const useCheckWishlist = (productId: string) => {
  const { data: wishlist, isLoading } = useWishlist();
  
  const isInWishlist = wishlist?.items?.some(item => item.productId === productId) ?? false;
  
  return { isInWishlist, isLoading };
};

export const useIsInWishlist = useCheckWishlist;

export const useWishlistCount = () => {
  const { data: wishlist } = useWishlist();
  return wishlist?.items?.length || 0;
};

export const useToggleWishlist = () => {
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { data: wishlist } = useWishlist();

  return useMutation({
    mutationFn: async (productId: string) => {
      const isInWishlist = wishlist?.items?.some(item => item.productId === productId);
      if (isInWishlist) {
        return removeFromWishlist.mutateAsync(productId);
      } else {
        return addToWishlist.mutateAsync(productId);
      }
    },
    onSuccess: () => {
      // Invalidate queries handled by individual mutations
    },
  });
};