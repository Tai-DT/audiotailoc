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
                if (Array.isArray(dataObj.items)) return dataObj.items;
                if (Array.isArray(dataObj.services)) return dataObj.services;
                if (Array.isArray(dataObj.products)) return dataObj.products;
            }
        }

        // Handle { items: [...] } directly
        if (Array.isArray(obj.items)) return obj.items;
        if (Array.isArray(obj.services)) return obj.services;
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
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010';
    const cleanBase = baseUrl.replace(/\/$/, '');

    // Ensure full path includes /api/v1
    let fullPath = path.startsWith('/') ? path : `/${path}`;
    if (!fullPath.startsWith('/api/v1')) {
        fullPath = `/api/v1${fullPath}`;
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

        const res = await fetch(url, {
            next: { revalidate: 300 },
            cache: 'force-cache',
        });
        if (!res.ok) {
            console.warn('New arrivals API returned non-OK status:', res.status);
            return [];
        }
        const data = await res.json();
        return extractData<Product>(data);
    } catch (error) {
        console.error('Error fetching new arrivals:', error);
        return [];
    }
}

export async function fetchBestSellers(limit: number = 8): Promise<Product[]> {
    try {
        const url = createUrl('/catalog/products/top-viewed', {
            limit: String(limit)
        });

        const res = await fetch(url, {
            next: { revalidate: 300 },
            cache: 'force-cache',
        });
        if (!res.ok) {
            console.warn('Best sellers API returned non-OK status:', res.status);
            return [];
        }
        const data = await res.json();
        return extractData<Product>(data);
    } catch (error) {
        console.error('Error fetching best sellers:', error);
        return [];
    }
}
