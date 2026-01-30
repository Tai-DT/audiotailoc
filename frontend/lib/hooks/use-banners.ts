'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS, handleApiResponse } from '@/lib/api';
import type { Banner } from '@/lib/types';

export interface UseBannersParams {
  page?: string;
  activeOnly?: boolean;
}

export function useBanners(params: UseBannersParams = {}) {
  const { page = 'home', activeOnly = true } = params;

  return useQuery({
    queryKey: ['banners', page, activeOnly],
    queryFn: async () => {
      const endpoint = activeOnly ? `${API_ENDPOINTS.CONTENT.BANNERS}/active` : API_ENDPOINTS.CONTENT.BANNERS;
      const response = await apiClient.get(endpoint, {
        params: {
          page,
        },
      });
      const data = handleApiResponse<Banner[] | { items: Banner[] }>(response);
      return Array.isArray(data) ? data : data.items;
    },
    staleTime: 5 * 60 * 1000,
  });
}
