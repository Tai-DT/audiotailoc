import { useQuery } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';
import { Payment, Order } from '../types';
import { authStorage } from '../auth-storage';
import { useOrders } from './use-orders';

export interface PaymentFilters {
  status?: 'PENDING' | 'SUCCEEDED' | 'FAILED';
  startDate?: string;
  endDate?: string;
}

export const paymentQueryKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentQueryKeys.all, 'list'] as const,
  list: (filters?: PaymentFilters) => [...paymentQueryKeys.lists(), filters] as const,
};

// Extract payments from orders
export const usePayments = (filters: PaymentFilters = {}) => {
  const hasToken = Boolean(authStorage.getAccessToken());
  const { data: ordersData, isLoading, error } = useOrders();
  
  return useQuery({
    queryKey: paymentQueryKeys.list(filters),
    queryFn: async () => {
      // Extract all payments from orders
      const allPayments: Payment[] = [];
      
      if (ordersData?.items) {
        ordersData.items.forEach((order: Order) => {
          if (order.payments && order.payments.length > 0) {
            order.payments.forEach((payment) => {
              // Apply filters
              if (filters.status && payment.status !== filters.status) {
                return;
              }
              
              if (filters.startDate && new Date(payment.createdAt) < new Date(filters.startDate)) {
                return;
              }
              
              if (filters.endDate && new Date(payment.createdAt) > new Date(filters.endDate)) {
                return;
              }
              
              allPayments.push(payment);
            });
          }
        });
      }
      
      // Sort by createdAt descending
      allPayments.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      return {
        items: allPayments,
        total: allPayments.length,
      };
    },
    enabled: hasToken && !isLoading && !!ordersData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

