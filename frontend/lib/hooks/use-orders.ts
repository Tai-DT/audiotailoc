import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';
import { Order, OrderFilters, PaginatedResponse } from '../types';
import { cartQueryKeys } from './use-cart';

export interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice?: number;
    name?: string;
  }>;
  shippingAddress?: string;
  promotionCode?: string;
}

export interface UpdateOrderData {
  status?: Order['status'];
  shippingAddress?: string;
  promotionCode?: string;
}

export const orderQueryKeys = {
  all: ['orders'] as const,
  lists: () => [...orderQueryKeys.all, 'list'] as const,
  list: (filters: OrderFilters) => [...orderQueryKeys.lists(), filters] as const,
  details: () => [...orderQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderQueryKeys.details(), id] as const,
};

export const useOrders = (filters: OrderFilters = {}) => {
  return useQuery({
    queryKey: orderQueryKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/orders', { params: filters });
      return handleApiResponse<PaginatedResponse<Order>>(response);
    },
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: orderQueryKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/orders/${id}`);
      return handleApiResponse<Order>(response);
    },
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOrderData) => {
      const response = await apiClient.post('/orders/create', {
        ...data,
        items: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          name: item.name,
        })),
      });
      return handleApiResponse<Order>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.get() });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateOrderData }) => {
      const response = await apiClient.put(`/orders/${id}`, data);
      return handleApiResponse<Order>(response);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.detail(id) });
    },
  });
};