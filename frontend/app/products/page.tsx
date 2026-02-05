import ProductsPageClient from './products-page-client';
import type { Category, PaginatedResponse, Product } from '@/lib/types';
import { buildApiUrl } from '@/lib/api-config';
import { handleApiResponse } from '@/lib/api';

export const dynamic = 'force-dynamic';

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

type ProductSort = 'createdAt-desc' | 'price-asc' | 'price-desc' | 'viewCount-desc';

function parseSort(sort?: string): { sortBy: string; sortOrder: string; sortValue: ProductSort } {
  const normalized = (sort as ProductSort | undefined) ?? 'createdAt-desc';
  const [sortBy, sortOrder] = normalized.split('-');
  return { sortBy, sortOrder, sortValue: normalized };
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(buildApiUrl('/catalog/categories'), {
      next: { revalidate: 600 },
      cache: 'force-cache',
    });
    if (!res.ok) return [];
    const json = await res.json();
    const data = handleApiResponse<Category[]>({ data: json });
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function fetchProducts(params: {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
  q?: string;
  categoryId?: string;
}): Promise<PaginatedResponse<Product>> {
  try {
    const url = new URL(buildApiUrl('/catalog/products'));
    url.searchParams.set('page', String(params.page));
    url.searchParams.set('pageSize', String(params.pageSize));
    url.searchParams.set('sortBy', params.sortBy);
    url.searchParams.set('sortOrder', params.sortOrder);
    if (params.q) url.searchParams.set('q', params.q);
    if (params.categoryId) url.searchParams.set('categoryId', params.categoryId);

    const res = await fetch(url.toString(), {
      next: { revalidate: 120 },
      cache: 'force-cache',
    });
    if (!res.ok) {
      return {
        items: [],
        total: 0,
        page: params.page,
        pageSize: params.pageSize,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      };
    }

    const json = await res.json();
    return handleApiResponse<PaginatedResponse<Product>>({ data: json });
  } catch {
    return {
      items: [],
      total: 0,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    };
  }
}

interface ProductsPageProps {
  searchParams?: Promise<SearchParams>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};

  const categorySlug = first(resolvedSearchParams.category);
  const q = first(resolvedSearchParams.q);
  const sort = first(resolvedSearchParams.sort);

  const categories = await fetchCategories();
  const categoryId = categorySlug ? categories.find((cat) => cat.slug === categorySlug)?.id : undefined;
  const { sortBy, sortOrder, sortValue } = parseSort(sort);

  const productsResponse = await fetchProducts({
    page: 1,
    pageSize: 20,
    sortBy,
    sortOrder,
    q,
    categoryId,
  });

  return (
    <ProductsPageClient
      products={productsResponse.items || []}
      total={productsResponse.total || 0}
      categories={categories}
      initialSearchParams={{
        category: categorySlug,
        q: q ?? undefined,
        sort: sortValue,
        view: resolvedSearchParams.view,
      }}
    />
  );
}

