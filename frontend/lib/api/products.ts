import { Product } from '@/lib/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.audiotailoc.com/api/v1';

/**
 * Fetch top viewed products from the API on the server side.
 * This allows us to prefetch product data and reduce client-side JS execution.
 */
export async function fetchFeaturedProducts(limit: number = 8): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE}/catalog/products/top-viewed?limit=${limit}`, {
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
