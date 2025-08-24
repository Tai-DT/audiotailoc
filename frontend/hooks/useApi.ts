import { useState, useEffect, useCallback } from 'react';

interface UseApiOptions {
  revalidate?: number; // seconds
  enabled?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  isValidating: boolean;
}

export function useApi<T>(
  url: string,
  options: UseApiOptions = {}
): UseApiResult<T> {
  const {
    revalidate = 300,
    enabled = true,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const fetchData = useCallback(async (isRefetch = false) => {
    if (!enabled || !url) return;

    try {
      if (isRefetch) {
        setIsValidating(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: revalidate > 0 ? { revalidate } : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
      setIsValidating(false);
    }
  }, [url, enabled, revalidate, onSuccess, onError]);

  const refetch = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    isValidating,
  };
}

// Hook for POST requests
export function useApiMutation<TData, TVariables = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (
    url: string,
    variables?: TVariables,
    options: {
      method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
      onSuccess?: (data: TData) => void;
      onError?: (error: Error) => void;
    } = {}
  ): Promise<TData | null> => {
    const { method = 'POST', onSuccess, onError } = options;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: variables ? JSON.stringify(variables) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    mutate,
    loading,
    error,
  };
}

