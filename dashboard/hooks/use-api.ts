"use client"

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient, ApiResponse, ApiError } from '@/lib/api-client';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const apiCallRef = useRef(apiCall);

  useEffect(() => {
    apiCallRef.current = apiCall;
  }, [apiCall]);

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });

    try {
      const response = await apiCallRef.current();
      setState({ data: response.data, loading: false, error: null });
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err as ApiError
      });
    }
  }, []);

  useEffect(() => {
    execute();
  }, [execute]);

  return {
    ...state,
    refetch: execute,
  };
}

// Hook for health check
export function useHealth() {
  return useApi(() => apiClient.health());
}

// Hook for users
export function useUsers(params?: { page?: number; limit?: number; search?: string }) {
  return useApi(() => apiClient.getUsers(params));
}

// Hook for orders
export function useOrders(params?: { page?: number; limit?: number; status?: string }) {
  return useApi(() => apiClient.getOrders(params));
}

// Hook for products
export function useProducts(params?: { page?: number; limit?: number; category?: string; search?: string }) {
  return useApi(() => apiClient.getProducts(params));
}

// Hook for analytics
export function useAnalytics() {
  return useApi(() => apiClient.getAnalytics());
}
