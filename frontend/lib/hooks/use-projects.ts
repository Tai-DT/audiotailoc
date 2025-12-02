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
      try {
        const response = await apiClient.get(API_ENDPOINTS.PROJECTS.FEATURED, {
          params: { limit },
        });
        const data = handleApiResponse<Project[] | { items?: Project[]; data?: Project[] }>(response);
        // Handle both array and paginated responses
        if (Array.isArray(data)) {
          return data;
        }
        if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
          return data.items;
        }
        if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
          return data.data;
        }
        return [];
      } catch (error: unknown) {
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status === 404) {
          console.warn('[useFeaturedProjects] Endpoint not found (404). Returning empty array.');
          return [];
        }
        throw error;
      }
    },
    retry: (failureCount, error) => {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 404) {
        return false;
      }
      return failureCount < 2;
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
