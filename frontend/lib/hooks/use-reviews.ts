import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';
import { ProductReview, PaginatedResponse } from '../types';

interface ReviewFilters {
  productId?: string;
  userId?: string;
  rating?: number;
  page?: number;
  pageSize?: number;
}

export const reviewQueryKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewQueryKeys.all, 'list'] as const,
  list: (filters: ReviewFilters) => [...reviewQueryKeys.lists(), filters] as const,
  product: (productId: string) => [...reviewQueryKeys.all, 'product', productId] as const,
};

export const useProductReviews = (productId: string, params: { page?: number; pageSize?: number } = {}) => {
  return useQuery({
    queryKey: [...reviewQueryKeys.product(productId), params],
    queryFn: async () => {
      const response = await apiClient.get(`/products/${productId}/reviews`, { params });
      return handleApiResponse<PaginatedResponse<ProductReview>>(response);
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      productId: string;
      rating: number;
      title?: string;
      comment?: string;
      images?: string[];
    }) => {
      const response = await apiClient.post('/reviews', data);
      return handleApiResponse<ProductReview>(response);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: reviewQueryKeys.product(variables.productId) });
      queryClient.invalidateQueries({ queryKey: ['products', 'detail', variables.productId] });
    },
  });
};

export const useVoteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewId, type }: { reviewId: string; type: 'up' | 'down' }) => {
      const response = await apiClient.post(`/reviews/${reviewId}/vote`, { type });
      return handleApiResponse<{ upvotes: number; downvotes: number }>(response);
    },
    onSuccess: () => {
      // Invalidate reviews lists to update vote counts
      queryClient.invalidateQueries({ queryKey: reviewQueryKeys.all });
    },
  });
};

export const useMarkReviewHelpful = () => {
  const voteMutation = useVoteReview();
  return useMutation({
    mutationFn: async (reviewId: string) => {
      return voteMutation.mutateAsync({ reviewId, type: 'up' });
    },
  });
};