import { Product } from '@/lib/types';
import { buildApiUrl } from '@/lib/api-config';

/**
 * Fetch top viewed products from the API on the server side.
 * This allows us to prefetch product data and reduce client-side JS execution.
 */
export async function fetchFeaturedProducts(limit: number = 8): Promise<Product[]> {
  try {
    const url = new URL(buildApiUrl('/catalog/products/top-viewed'));
    url.searchParams.set('limit', String(limit));
    const response = await fetch(url.toString(), {
      next: {
        // Cache for 10 minutes
        revalidate: 600,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[fetchFeaturedProducts] API error:', response.status);
      return [];
    }

    const data = await response.json();
    
    // Handle both array and paginated response formats
    if (Array.isArray(data)) {
      return data;
    }
    
    if (data.items && Array.isArray(data.items)) {
      return data.items;
    }
    
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    }

    return [];
  } catch (error) {
    console.error('[fetchFeaturedProducts] Failed to fetch products:', error);
    return [];
  }
}
