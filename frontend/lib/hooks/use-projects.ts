'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS, handleApiResponse } from '@/lib/api';
import type { Project } from '@/lib/types';

export interface ProjectFilters {
  page?: number;
  limit?: number;
  status?: string;
  featured?: boolean;
  category?: string;
}

export function useProjects(filters: ProjectFilters = {}) {
  const { page = 1, limit = 12, status, featured, category } = filters;

  return useQuery({
    queryKey: ['projects', { page, limit, status, featured, category }],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.PROJECTS.LIST, {
        params: {
          page,
          limit,
          status,
          featured,
          category,
        },
      });

      const payload = handleApiResponse<{ data?: Project[]; meta?: { total?: number; page?: number; limit?: number } }>(response);

      const projects = payload?.data ?? [];
      const meta = payload?.meta ?? {};

      return {
        items: projects,
        total: meta.total ?? projects.length,
        page: meta.page ?? page,
        pageSize: meta.limit ?? limit,
      };
    },
  });
}

export function useFeaturedProjects(limit = 6) {
  return useQuery({
    queryKey: ['projects', 'featured', limit],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.PROJECTS.FEATURED, {
        params: { limit },
      });
      return handleApiResponse<Project[]>(response);
    },
  });
}

export function useProject(idOrSlug: string) {
  return useQuery({
    queryKey: ['project', idOrSlug],
    queryFn: async () => {
      // Check if it's a UUID or slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

      const endpoint = isUUID
        ? API_ENDPOINTS.PROJECTS.DETAIL(idOrSlug)
        : API_ENDPOINTS.PROJECTS.DETAIL_BY_SLUG(idOrSlug);

      const response = await apiClient.get(endpoint);
      return handleApiResponse<Project>(response);
    },
    enabled: !!idOrSlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
