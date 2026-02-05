import BlogPageClient from './blog-page-client';
import type { BlogArticle, BlogCategory, PaginatedBlogResponse } from '@/lib/types';
import { buildApiUrl } from '@/lib/api-config';
import { handleApiResponse } from '@/lib/api';

export const dynamic = 'force-dynamic';

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

async function fetchBlogCategories(): Promise<BlogCategory[]> {
  try {
    const res = await fetch(buildApiUrl('/blog/categories?published=true'), {
      next: { revalidate: 1800 },
      cache: 'force-cache',
    });
    if (!res.ok) return [];
    const json = await res.json();
    const data = handleApiResponse<BlogCategory[]>({ data: json });
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function fetchBlogArticles(params: {
  categoryId?: string;
  search?: string;
  page: number;
  limit: number;
}): Promise<PaginatedBlogResponse<BlogArticle>> {
  try {
    const url = new URL(buildApiUrl('/blog/articles'));
    url.searchParams.set('published', 'true');
    url.searchParams.set('page', String(params.page));
    url.searchParams.set('limit', String(params.limit));
    if (params.categoryId) url.searchParams.set('categoryId', params.categoryId);
    if (params.search) url.searchParams.set('search', params.search);

    const res = await fetch(url.toString(), {
      next: { revalidate: 300 },
      cache: 'force-cache',
    });
    if (!res.ok) {
      return {
        data: [],
        pagination: { page: params.page, limit: params.limit, total: 0, totalPages: 1 },
      };
    }

    const json = await res.json();
    return handleApiResponse<PaginatedBlogResponse<BlogArticle>>({ data: json });
  } catch {
    return {
      data: [],
      pagination: { page: params.page, limit: params.limit, total: 0, totalPages: 1 },
    };
  }
}

interface BlogPageProps {
  searchParams?: Promise<SearchParams>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};

  const categorySlug = first(resolvedSearchParams.category);
  const q = first(resolvedSearchParams.q);

  const categories = await fetchBlogCategories();
  const categoryId = categorySlug ? categories.find((cat) => cat.slug === categorySlug)?.id : undefined;

  const articlesData = await fetchBlogArticles({
    page: 1,
    limit: 20,
    categoryId,
    search: q,
  });

  return (
    <BlogPageClient
      articles={articlesData.data || []}
      pagination={articlesData.pagination}
      categories={categories}
      initialSearchParams={{
        category: categorySlug,
        q: q ?? undefined,
      }}
    />
  );
}
