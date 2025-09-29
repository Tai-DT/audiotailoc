import { useQuery } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';

export interface SiteStat {
  id: string;
  key: string;
  value: string;
  label: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const useSiteStats = () => {
  return useQuery({
    queryKey: ['site-stats'],
    queryFn: async () => {
      const response = await apiClient.get('/homepage-stats');
      return handleApiResponse<SiteStat[]>(response);
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};
