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

export function useSiteStats() {
  return useQuery({
    queryKey: ['site-stats'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/homepage-stats');
        return handleApiResponse<SiteStat[]>(response);
      } catch (error) {
        console.error('Error fetching site stats:', error);
        throw error;
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Helper function removed as per dynamization plan - we want real data or error state

// Helper function to get default site stats
// End of hooks
