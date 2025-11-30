import { useQuery } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';
import { Project, PaginatedResponse } from '../types';

export interface ProjectFilters {
  q?: string;
  category?: string;
  featured?: boolean;
  status?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const projectQueryKeys = {
  all: ['projects'] as const,
  lists: () => [...projectQueryKeys.all, 'list'] as const,
  list: (filters: ProjectFilters) => [...projectQueryKeys.lists(), filters] as const,
  details: () => [...projectQueryKeys.all, 'detail'] as const,
  detail: (idOrSlug: string) => [...projectQueryKeys.details(), idOrSlug] as const,
  featured: (limit: number) => [...projectQueryKeys.all, 'featured', limit] as const,
};

export const useProjects = (filters: ProjectFilters = {}) => {
  return useQuery({
    queryKey: projectQueryKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/projects', { params: filters });
      return handleApiResponse<PaginatedResponse<Project>>(response);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProject = (idOrSlug: string) => {
  return useQuery({
    queryKey: projectQueryKeys.detail(idOrSlug),
    queryFn: async () => {
      if (!idOrSlug) throw new Error('Project identifier is required');
      const response = await apiClient.get(`/projects/${idOrSlug}`);
      return handleApiResponse<Project>(response);
    },
    enabled: !!idOrSlug,
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeaturedProjects = (limit = 3) => {
  return useQuery({
    queryKey: projectQueryKeys.featured(limit),
    queryFn: async () => {
      try {
        const response = await apiClient.get('/projects', {
          params: {
            featured: true,
            isActive: true,
            page: 1,
            pageSize: limit,
          },
        });
        const data = handleApiResponse<PaginatedResponse<Project>>(response);
        // Ensure we always return an array, never undefined
        return Array.isArray(data?.items) ? data.items : [];
      } catch (error) {
        // Return empty array on error to prevent undefined
        console.error('Failed to fetch featured projects:', error);
        return [];
      }
    },
    staleTime: 15 * 60 * 1000,
  });
};