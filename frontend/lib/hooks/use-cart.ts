import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';
import { Cart } from '../types';

export const cartQueryKeys = {
  all: ['cart'] as const,
  get: () => [...cartQueryKeys.all, 'get'] as const,
};

export const useCart = () => {
  return useQuery({
    queryKey: cartQueryKeys.get(),
    queryFn: async () => {
      const response = await apiClient.get('/cart');
      return handleApiResponse<Cart>(response);
    },
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { productId: string; quantity: number }) => {
      const response = await apiClient.post('/cart/items', data);
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.get() });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const response = await apiClient.put(`/cart/items/${id}`, { quantity });
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.get() });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/cart/items/${id}`);
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.get() });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete('/cart/clear');
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.get() });
    },
  });
};