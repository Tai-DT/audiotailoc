import { useMutation } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';
import { ApiResponse } from '../types';

export const useSubscribeNewsletter = () => {
  return useMutation({
    mutationFn: async (data: { email: string; name?: string }) => {
      const response = await apiClient.post('/newsletter/subscribe', data);
      return handleApiResponse<ApiResponse<void>>(response);
    },
  });
};

export const useUnsubscribeNewsletter = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await apiClient.post('/newsletter/unsubscribe', { email });
      return handleApiResponse<ApiResponse<void>>(response);
    },
  });
};