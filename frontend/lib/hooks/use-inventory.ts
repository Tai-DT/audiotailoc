import { useQuery } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';

export interface InventoryAnalytics {
  totalItems: number;
  lowStockCount: number;
  outOfStockCount: number;
  stockValueCents: number;
  topLowStockProducts: Array<{ id: string; name: string; stockQuantity: number }>;
}

export const useInventoryAnalytics = () => {
  return useQuery({
    queryKey: ['dashboard', 'inventory'], // Keeping consistent with dashboard keys if needed, or create new
    queryFn: async () => {
      const response = await apiClient.get('/analytics/inventory');
      return handleApiResponse<InventoryAnalytics>(response);
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};