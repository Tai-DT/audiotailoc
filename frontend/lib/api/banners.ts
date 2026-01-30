import { Banner } from '@/lib/types';
import { buildApiUrl } from '@/lib/api-config';

/**
 * Fetch active banners from the API on the server side.
 * This allows us to prefetch banner data and improve LCP by avoiding
 * client-side data fetching waterfall.
 */
export async function fetchHomeBanners(): Promise<Banner[]> {
  try {
    const url = new URL(buildApiUrl('/content/banners/active'));
    url.searchParams.set('page', 'home');
    const response = await fetch(url.toString(), {
      next: {
        // Cache for 5 minutes - banners don't change often
        revalidate: 300,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[fetchHomeBanners] API error:', response.status);
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
    console.error('[fetchHomeBanners] Failed to fetch banners:', error);
    return [];
  }
}
