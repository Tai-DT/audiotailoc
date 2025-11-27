import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';
import { Promotion, ApiResponse } from '../types';

export const promotionQueryKeys = {
  all: ['promotions'] as const,
  active: () => [...promotionQueryKeys.all, 'active'] as const,
  detail: (code: string) => [...promotionQueryKeys.all, 'detail', code] as const,
};

export const useActivePromotions = () => {
  return useQuery({
    queryKey: promotionQueryKeys.active(),
    queryFn: async () => {
      const response = await apiClient.get('/promotions/active');
      return handleApiResponse<Promotion[]>(response);
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useCheckPromotion = () => {
  return useMutation({
    mutationFn: async (code: string) => {
      const response = await apiClient.post('/promotions/check', { code });
      return handleApiResponse<Promotion>(response);
    },
  });
};

export const useApplyPromotion = () => {
  return useMutation({
    mutationFn: async (data: { code: string; orderId?: string; cartId?: string }) => {
      const response = await apiClient.post('/promotions/apply', data);
      return handleApiResponse<ApiResponse<void>>(response);
    },
  });
};

export const usePromotions = useActivePromotions;