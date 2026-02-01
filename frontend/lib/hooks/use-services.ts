import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiResponse, API_ENDPOINTS } from '../api';
import { authStorage } from '../auth-storage';
import { Service, ServiceFilters, PaginatedResponse, ServiceType } from '../types';

export const serviceQueryKeys = {
  all: ['services'] as const,
  lists: () => [...serviceQueryKeys.all, 'list'] as const,
  list: (filters: ServiceFilters) => [...serviceQueryKeys.lists(), filters] as const,
  details: () => [...serviceQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...serviceQueryKeys.details(), id] as const,
  types: ['services', 'types'] as const,
};

// Helper to normalize backend services payload shape to PaginatedResponse<Service>
interface RawServiceRecord {
  id?: string | number;
  slug?: string;
  name?: string;
  description?: string;
  shortDescription?: string;
  price?: number;
  basePriceCents?: number;
  minPrice?: number | null;
  maxPrice?: number | null;
  minPriceDisplay?: number | null;
  maxPriceDisplay?: number | null;
  priceType?: string;
  duration?: number;
  typeId?: string;
  images?: string | string[];
  isActive?: boolean;
  isFeatured?: boolean;
  tags?: string | string[];
  features?: string | string[];
  requirements?: string | string[];
  viewCount?: number;
  createdAt?: string;
  updatedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  type?: { id?: string; name?: string; slug?: string } | null;
  serviceType?: { id?: string; name?: string; slug?: string } | null;
}

interface RawServicesPayload {
  total?: number;
  totalCount?: number;
  page?: number;
  pageSize?: number;
  limit?: number;
  services?: RawServiceRecord[];
  items?: RawServiceRecord[];
}

function mapServicesApiPayload(raw: RawServicesPayload): PaginatedResponse<Service> {
  // Backend returns { total, page, pageSize, services: [...] }
  // Frontend expects { items, totalPages, totalCount?, page, pageSize }
  if (!raw) return { items: [], totalPages: 0, page: 1, pageSize: 0 } as unknown as PaginatedResponse<Service>;
  const total: number = raw.total ?? raw.totalCount ?? 0;
  const page: number = raw.page ?? 1;
  const pageSize: number = raw.pageSize ?? raw.limit ?? (raw.services?.length || 0);
  const services: RawServiceRecord[] = (raw.services || raw.items || []) as RawServiceRecord[];

  const items: Service[] = services.map(s => {
    // Parse potential JSON string fields safely
    const parseArray = (val: unknown): string[] | undefined => {
      if (!val) return undefined;
      if (Array.isArray(val)) return val as string[];
      if (typeof val === 'string') {
        try { const parsed = JSON.parse(val); return Array.isArray(parsed) ? parsed : undefined; } catch { return undefined; }
      }
      return undefined;
    };

    const features = parseArray(s.features);
    const tags = parseArray(s.tags);
    const images = parseArray(s.images) || (typeof s.images === 'string' ? [s.images] : undefined);

    // Backend maps price: already provided as number (VND)
    // Range price display fields: minPriceDisplay / maxPriceDisplay
    const minPrice = s.minPriceDisplay ?? (typeof s.minPrice === 'number' ? s.minPrice : undefined);
    const maxPrice = s.maxPriceDisplay ?? (typeof s.maxPrice === 'number' ? s.maxPrice : undefined);

    const normalized: Service = {
      id: String(s.id ?? ''),
      slug: String(s.slug || s.id || ''),
      name: s.name || '(No name)',
      description: s.description || s.shortDescription,
      shortDescription: s.shortDescription,
      price: typeof s.price === 'number' ? s.price : (typeof s.basePriceCents === 'number' ? s.basePriceCents : 0),
      minPrice,
      maxPrice,
      priceType: ((): Service['priceType'] => {
        switch (s.priceType) {
          case 'RANGE':
          case 'NEGOTIABLE':
          case 'CONTACT':
          case 'FIXED':
            return s.priceType as Service['priceType'];
          default:
            return 'FIXED';
        }
      })(),
      duration: s.duration || 60,
      typeId: s.typeId,
      images,
      isActive: Boolean(s.isActive),
      isFeatured: Boolean(s.isFeatured),
      tags,
      features,
      requirements: parseArray(s.requirements),
      viewCount: s.viewCount ?? 0,
      createdAt: s.createdAt || new Date().toISOString(),
      updatedAt: s.updatedAt || s.createdAt || new Date().toISOString(),
      seoTitle: s.seoTitle,
      seoDescription: s.seoDescription,
      metaTitle: s.metaTitle,
      metaDescription: s.metaDescription,
      metaKeywords: s.metaKeywords,
      canonicalUrl: s.canonicalUrl,
      serviceType: ((): Service['serviceType'] => {
        const src = (s.type || s.serviceType) as { id?: string; name?: string; slug?: string } | null | undefined;
        if (!src) return undefined;
        return {
          id: src.id || '',
          name: src.name || 'Loại dịch vụ',
          slug: src.slug || '',
          description: undefined,
          icon: undefined,
          color: undefined,
          isActive: true,
          sortOrder: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          services: undefined,
        };
      })(),
    };
    return normalized;
  });

  const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  return {
    items,
    total: total,
    page,
    pageSize,
    totalPages,
    hasNext,
    hasPrev,
  };
}

export const useServices = (filters: ServiceFilters = {}) => {
  return useQuery({
    queryKey: serviceQueryKeys.list(filters),
    queryFn: async () => {
      const useProxy = process.env.NEXT_PUBLIC_USE_API_PROXY === 'true';
      // Only send backend-accepted params
      const { page, pageSize, typeId, isActive, q, minPrice, maxPrice, isFeatured, sortBy, sortOrder } = filters as ServiceFilters;
      const params: Partial<Pick<ServiceFilters, 'page' | 'pageSize' | 'typeId' | 'q' | 'minPrice' | 'maxPrice' | 'isFeatured' | 'sortBy' | 'sortOrder'>> & { isActive?: boolean } = {
        page,
        pageSize,
        typeId,
        q,
        minPrice,
        maxPrice,
        isFeatured,
        sortBy,
        sortOrder,
      };
      if (typeof isActive === 'boolean') params.isActive = isActive;
      (Object.keys(params) as (keyof typeof params)[]).forEach(k => params[k] === undefined && delete params[k]);

      if (useProxy && typeof window !== 'undefined') {
        const search = new URLSearchParams(params as Record<string, string>).toString();
        const res = await fetch(`/api/proxy/services${search ? `?${search}` : ''}`);
        if (!res.ok) throw new Error('Proxy services request failed');
        const json = await res.json();
        const mapped = mapServicesApiPayload(json);
        return mapped;
      }
      const response = await apiClient.get('/services', { params });
      type RawServicesEnvelope = {
        total?: number;
        totalCount?: number;
        page?: number;
        pageSize?: number;
        limit?: number;
        services?: RawServiceRecord[];
        items?: RawServiceRecord[];
      };
      const payload = handleApiResponse<RawServicesEnvelope>(response);
      return mapServicesApiPayload(payload);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useService = (idOrSlug: string) => {
  return useQuery({
    queryKey: ['service', idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) throw new Error('Missing service identifier');

      // Check if it's a UUID or CUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      const isCUID = /^c[a-z0-9]{15,}$/i.test(idOrSlug);

      const tryDetail = async (val: string) => {
        const res = await apiClient.get(`/services/${val}`);
        return handleApiResponse<Service>(res);
      };
      const trySlug = async (val: string) => {
        const res = await apiClient.get(`/services/slug/${val}`);
        return handleApiResponse<Service>(res);
      };

      try {
        if (isUUID || isCUID) {
          return await tryDetail(idOrSlug);
        }

        // Try as slug first
        try {
          return await trySlug(idOrSlug);
        } catch (err: unknown) {
          const status = typeof err === 'object' && err !== null && 'response' in err
            ? (err as { response?: { status?: number } }).response?.status
            : undefined;
          if (status === 404) {
            // Fallback to detail
            return await tryDetail(idOrSlug);
          }
          throw err;
        }
      } catch (error) {
        throw error;
      }
    },
    enabled: !!idOrSlug,
    staleTime: 5 * 60 * 1000,
  });
};

export const useServiceBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['services', 'slug', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/services/slug/${slug}`);
      return handleApiResponse<Service>(response);
    },
    enabled: !!slug,
  });
};

export const useServiceTypes = () => {
  return useQuery({
    queryKey: serviceQueryKeys.types,
    queryFn: async () => {
      const response = await apiClient.get('/services/types');
      return handleApiResponse<ServiceType[]>(response);
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useServicesByType = () => {
  return useQuery({
    queryKey: ['services', 'by-type'],
    queryFn: async () => {
      const response = await apiClient.get('/services', {
        params: {
          isActive: true,
          page: 1,
          pageSize: 200,
          include: 'type',
        },
      });
      const data = handleApiResponse<PaginatedResponse<Service>>(response);

      return data.items.reduce<Record<string, Service[]>>((acc, service) => {
        const key = service.typeId ?? 'unclassified';
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(service);
        return acc;
      }, {});
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeaturedServices = (limit = 4) => {
  return useQuery({
    queryKey: ['services', 'featured', limit],
    queryFn: async () => {
      const response = await apiClient.get('/services', {
        params: {
          isFeatured: true,
          isActive: true,
          page: 1,
          pageSize: limit,
        },
      });
      const data = handleApiResponse<PaginatedResponse<Service>>(response);
      return data.items || [];
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useCreateServiceBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      serviceId: string;
      customerName: string;
      customerPhone: string;
      customerEmail?: string;
      customerAddress: string;
      scheduledDate: string;
      scheduledTime: string;
      notes?: string;
    }) => {
      const token = authStorage.getAccessToken();
      const hasValidToken = token && typeof token === 'string' && token.trim().length > 0;
      // Use explicit endpoint constant logic with safe fallback
      const guestEndpoint = API_ENDPOINTS.SERVICES.GUEST_BOOKING || '/bookings/guest';
      const endpoint = hasValidToken
        ? (API_ENDPOINTS.SERVICES.CREATE_BOOKING || '/bookings')
        : guestEndpoint;

      const payload = { ...data, address: data.customerAddress };

      const response = await apiClient.post(endpoint, payload);
      return handleApiResponse(response);
    },
    onSuccess: () => {
      // Invalidate relevant queries if needed
      queryClient.invalidateQueries({ queryKey: ['service-bookings'] });
    },
  });
};
