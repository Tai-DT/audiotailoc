import { useQuery } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';
import { BlogArticle, BlogCategory, PaginatedBlogResponse } from '../types';

export const blogQueryKeys = {
  all: ['blog'] as const,
  articles: {
    all: ['blog', 'articles'] as const,
    list: (params: { page?: number; limit?: number; categoryId?: string; tag?: string; search?: string; status?: string; published?: boolean }) => ['blog', 'articles', 'list', params] as const,
    detail: (slug: string) => ['blog', 'articles', 'detail', slug] as const,
    featured: (limit: number) => ['blog', 'articles', 'featured', limit] as const,
    related: (slug: string, limit: number) => ['blog', 'articles', 'related', slug, limit] as const,
  },
  categories: {
    all: ['blog', 'categories'] as const,
    list: ['blog', 'categories', 'list'] as const,
    detail: (slug: string) => ['blog', 'categories', 'detail', slug] as const,
  },
};

export const useBlogArticles = (params: {
  page?: number;
  limit?: number;
  categoryId?: string;
  tag?: string;
  search?: string;
  status?: string;
  published?: boolean;
} = {}) => {
  return useQuery({
    queryKey: blogQueryKeys.articles.list(params),
    queryFn: async () => {
      const response = await apiClient.get('/blog/articles', { params });
      return handleApiResponse<PaginatedBlogResponse<BlogArticle>>(response);
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useBlogArticle = (slug: string) => {
  return useQuery({
    queryKey: blogQueryKeys.articles.detail(slug),
    queryFn: async () => {
      const response = await apiClient.get(`/blog/articles/${slug}`);
      return handleApiResponse<BlogArticle>(response);
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
};

export const useFeaturedArticles = (limit: number = 5) => {
  return useQuery({
    queryKey: blogQueryKeys.articles.featured(limit),
    queryFn: async () => {
      const response = await apiClient.get('/blog/articles/featured', {
        params: { limit },
      });
      return handleApiResponse<BlogArticle[]>(response);
    },
    staleTime: 15 * 60 * 1000,
  });
};

export const useRelatedArticles = (slug: string, limit: number = 3) => {
  return useQuery({
    queryKey: blogQueryKeys.articles.related(slug, limit),
    queryFn: async () => {
      const response = await apiClient.get(`/blog/articles/${slug}/related`, {
        params: { limit },
      });
      return handleApiResponse<BlogArticle[]>(response);
    },
    enabled: !!slug,
    staleTime: 15 * 60 * 1000,
  });
};

export const useBlogCategories = (params: {
  published?: boolean;
  limit?: number;
} = {}) => {
  return useQuery({
    queryKey: [...blogQueryKeys.categories.list, params],
    queryFn: async () => {
      const response = await apiClient.get('/blog/categories', { params });
      return handleApiResponse<BlogCategory[]>(response);
    },
    staleTime: 30 * 60 * 1000, // Categories change infrequently
  });
};

export const useBlogCategory = (slug: string) => {
  return useQuery({
    queryKey: blogQueryKeys.categories.detail(slug),
    queryFn: async () => {
      const response = await apiClient.get(`/blog/categories/${slug}`);
      return handleApiResponse<BlogCategory>(response);
    },
    enabled: !!slug,
    staleTime: 30 * 60 * 1000,
  });
};

export const useBlogArticleBySlug = useBlogArticle;