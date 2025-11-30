import { useQuery } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';
import { KnowledgeBaseArticle, PaginatedResponse } from '../types';

export const articleQueryKeys = {
  all: ['articles'] as const,
  lists: () => [...articleQueryKeys.all, 'list'] as const,
  list: (filters: { category?: string; tags?: string[]; page?: number; pageSize?: number; published?: boolean }) => [...articleQueryKeys.lists(), filters] as const,
  details: () => [...articleQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...articleQueryKeys.details(), id] as const,
  search: (query: string) => [...articleQueryKeys.all, 'search', query] as const,
};

export const useArticles = (filters: {
  category?: string;
  tags?: string[];
  page?: number;
  pageSize?: number;
  published?: boolean;
} = {}) => {
  return useQuery({
    queryKey: articleQueryKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/knowledge-base', { params: filters });
      return handleApiResponse<PaginatedResponse<KnowledgeBaseArticle>>(response);
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useArticle = (id: string) => {
  return useQuery({
    queryKey: articleQueryKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/knowledge-base/${id}`);
      return handleApiResponse<KnowledgeBaseArticle>(response);
    },
    enabled: !!id,
    staleTime: 15 * 60 * 1000,
  });
};

export const useSearchArticles = (query: string) => {
  return useQuery({
    queryKey: articleQueryKeys.search(query),
    queryFn: async () => {
      const response = await apiClient.get('/knowledge-base/search', { params: { q: query } });
      return handleApiResponse<KnowledgeBaseArticle[]>(response);
    },
    enabled: !!query,
    staleTime: 5 * 60 * 1000,
  });
};

export const useArticleCategories = () => {
  return useQuery({
    queryKey: [...articleQueryKeys.all, 'categories'],
    queryFn: async () => {
      const response = await apiClient.get('/knowledge-base/categories');
      return handleApiResponse<string[]>(response);
    },
    staleTime: 30 * 60 * 1000,
  });
};