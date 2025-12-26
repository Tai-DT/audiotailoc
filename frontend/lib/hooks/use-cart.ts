'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS, handleApiResponse } from '@/lib/api';
import toast from 'react-hot-toast';

// Types
export interface CartItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  updatedAt: string;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
}

// Query keys
export const cartQueryKeys = {
  all: ['cart'] as const,
  get: () => [...cartQueryKeys.all] as const,
};

// Hooks
export function useCart() {
  return useQuery({
    queryKey: cartQueryKeys.get(),
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.CART.GET);
      return handleApiResponse<Cart>(response);
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Mutations
export function useAddToCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: AddToCartData) => {
      const response = await apiClient.post(API_ENDPOINTS.CART.ADD_ITEM, data);
      return handleApiResponse<CartItem>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.get() });
      toast.success('Đã thêm sản phẩm vào giỏ hàng!');
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng');
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const response = await apiClient.put(API_ENDPOINTS.CART.UPDATE_ITEM(id), { quantity });
      return handleApiResponse<CartItem>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.get() });
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật giỏ hàng');
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(API_ENDPOINTS.CART.REMOVE_ITEM(id));
      return handleApiResponse<void>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng!');
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa khỏi giỏ hàng');
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete(API_ENDPOINTS.CART.CLEAR);
      return handleApiResponse<void>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Đã xóa toàn bộ giỏ hàng!');
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa giỏ hàng');
    },
  });
}