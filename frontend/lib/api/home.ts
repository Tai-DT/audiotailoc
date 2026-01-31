import { Banner, Category, Product, Service } from '@/lib/types';

/**
 * Extract data from API response
 * Backend returns: { success: true, data: [...] } or { success: true, data: { items: [...] } }
 */
function extractData<T>(responseData: unknown): T[] {
    if (!responseData) return [];

    // If it's already an array
    if (Array.isArray(responseData)) return responseData;

    // If it's an object with data property
    if (typeof responseData === 'object' && responseData !== null) {
        const obj = responseData as Record<string, unknown>;

        // Handle { success: true, data: [...] }
        if (obj.data) {
            if (Array.isArray(obj.data)) return obj.data;

            // Handle { success: true, data: { items: [...], services: [...] } }
            if (typeof obj.data === 'object' && obj.data !== null) {
                const dataObj = obj.data as Record<string, unknown>;
                // Prioritize 'services' if present, then 'items', then 'products'
                if (Array.isArray(dataObj.services)) return dataObj.services;
                if (Array.isArray(dataObj.items)) return dataObj.items;
                if (Array.isArray(dataObj.products)) return dataObj.products;
            }
        }

        // Handle { items: [...] } directly
        // Prioritize 'services' if present, then 'items'
        if (Array.isArray(obj.services)) return obj.services;
        if (Array.isArray(obj.items)) return obj.items;
    }

    return [];
}


// Helper to construct URL safely - handles both relative and absolute paths
function createUrl(path: string, params: Record<string, string> = {}): string {
    // For browser-side, use relative URLs to leverage Next.js API routes
    if (typeof window !== 'undefined') {
        // In browser, use the path directly with /api/v1 prefix
        const fullPath = path.startsWith('/api/v1') ? path : `/api/v1${path.startsWith('/') ? path : `/${path}`}`;

        // Add query params
        if (Object.keys(params).length > 0) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                searchParams.set(key, value);
            });
            return `${fullPath}?${searchParams.toString()}`;
        }
        return fullPath;
    }

    // Server-side: use absolute URL with backend API
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';
    const cleanBase = baseUrl.replace(/\/$/, '');

    // Check if base URL already includes /api/v1
    const hasApiPrefix = cleanBase.includes('/api/v1');

    // Normalize the path
    let fullPath = path.startsWith('/') ? path : `/${path}`;

    // Only add /api/v1 if base URL doesn't have it and path doesn't have it
    if (!hasApiPrefix && !fullPath.startsWith('/api/v1')) {
        fullPath = `/api/v1${fullPath}`;
    }

    // If path already has /api/v1 and base also has it, remove from path
    if (hasApiPrefix && fullPath.startsWith('/api/v1')) {
        fullPath = fullPath.replace('/api/v1', '');
    }

    let fullUrl = `${cleanBase}${fullPath}`;

    // Add query params
    if (Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            searchParams.set(key, value);
        });
        fullUrl = `${fullUrl}?${searchParams.toString()}`;
    }

    return fullUrl;
}

// --- Banners ---
export async function fetchBanners(page: string = 'home'): Promise<Banner[]> {
    try {
        const url = createUrl('/content/banners', {
            page,
            active: 'true'
        });

        console.log('[fetchBanners] Fetching from:', url);

        const res = await fetch(url, {
            next: { revalidate: 0 },
            cache: 'no-store',
        });
        if (!res.ok) {
            console.warn('[fetchBanners] API returned non-OK status:', res.status);
            return [];
        }

        const data = await res.json();
        const banners = extractData<Banner>(data);

        console.log('[fetchBanners] Extracted banners:', banners.length, banners.map(b => ({
            title: b.title,
            imageUrl: b.imageUrl,
            darkImageUrl: b.darkImageUrl
        })));

        return banners;
    } catch (error) {
        console.error('Error fetching banners:', error);
        return [];
    }
}

// --- Categories ---
export async function fetchFeaturedCategories(): Promise<Category[]> {
    try {
        // Use createUrl here too for consistency, or just fetch directly if it supported relative
        // Using correct absolute URL is safer for SSR
        const url = createUrl('/catalog/categories');

        const res = await fetch(url, {
            next: { revalidate: 300 }, // 5 minutes
            cache: 'no-store',
        });

        if (!res.ok) {
            console.warn('Categories API returned non-OK status:', res.status);
            return [];
        }
        const data = await res.json();
        const categories = extractData<Category>(data);

        // Filter out test categories and take top 6
        const filtered = categories
            .filter(cat =>
                !cat.name.toLowerCase().includes('test') &&
                !cat.name.toLowerCase().includes('temp') &&
                !cat.name.toLowerCase().includes('updated')
            )
            .slice(0, 12);

        return filtered;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

// --- Services ---
export async function fetchFeaturedServices(): Promise<Service[]> {
    try {
        const url = createUrl('/services', {
            isFeatured: 'true',
            isActive: 'true',
            pageSize: '4'
        });

        const res = await fetch(url, {
            next: { revalidate: 600 },
            cache: 'force-cache',
        });
        if (!res.ok) {
            console.warn('Services API returned non-OK status:', res.status);
            return [];
        }
        const data = await res.json();
        return extractData<Service>(data);
    } catch (error) {
        console.error('Error fetching services:', error);
        return [];
    }
}

// --- Products ---
export async function fetchNewArrivals(limit: number = 8): Promise<Product[]> {
    try {
        const url = createUrl('/catalog/products/recent', {
            limit: String(limit)
        });

        console.log('[fetchNewArrivals] Fetching from:', url);

        const res = await fetch(url, {
            next: { revalidate: 0 },
            cache: 'no-store',
        });
        if (!res.ok) {
            console.warn('[fetchNewArrivals] API returned non-OK status:', res.status);
            return [];
        }
        const data = await res.json();
        console.log('[fetchNewArrivals] Raw response keys:', Object.keys(data));
        const products = extractData<Product>(data);
        console.log('[fetchNewArrivals] Extracted products count:', products.length);
        return products;
    } catch (error) {
        console.error('[fetchNewArrivals] Error:', error);
        return [];
    }
}

export async function fetchBestSellers(limit: number = 8): Promise<Product[]> {
    try {
        const url = createUrl('/catalog/products/top-viewed', {
            limit: String(limit)
        });

        console.log('[fetchBestSellers] Fetching from:', url);

        const res = await fetch(url, {
            next: { revalidate: 0 },
            cache: 'no-store',
        });
        if (!res.ok) {
            console.warn('[fetchBestSellers] API returned non-OK status:', res.status);
            return [];
        }
        const data = await res.json();
        console.log('[fetchBestSellers] Raw response keys:', Object.keys(data));
        const products = extractData<Product>(data);
        console.log('[fetchBestSellers] Extracted products count:', products.length);
        return products;
    } catch (error) {
        console.error('[fetchBestSellers] Error:', error);
        return [];
    }
}
