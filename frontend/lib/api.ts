import axios from 'axios';
import { authStorage, AUTH_EVENTS } from '@/lib/auth-storage';

const configuredBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
const API_BASE_URL = configuredBaseUrl && configuredBaseUrl.length > 0
  ? configuredBaseUrl
  : 'http://localhost:3010/api/v1';

// Debug: Log the API base URL (only in development)
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  console.log('[API Client] Base URL:', API_BASE_URL);
  console.log('[API Client] NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
}

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Debug: Log the full request URL
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      const fullUrl = config.baseURL + (config.url || '');
      console.log('[API Client] Request:', config.method?.toUpperCase(), fullUrl);
    }
    
    const token = authStorage.getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If PUBLIC_ORDER_API_KEY is configured, and the request is to orders endpoints,
    // attach the x-order-key header so backend can validate public order requests.
    try {
      const publicOrderKey = process.env.PUBLIC_ORDER_API_KEY || process.env.NEXT_PUBLIC_ORDER_API_KEY || process.env.NEXT_PUBLIC_PUBLIC_ORDER_API_KEY || process.env.NEXT_PUBLIC_PUBLIC_ORDER;
      const url = config.url || '';
      if (publicOrderKey && url && url.startsWith('/orders')) {
        config.headers = config.headers || {};
        config.headers['x-order-key'] = publicOrderKey;
      }
    } catch {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Debug: Log API errors
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      try {
        // Check if error exists and is an object
        if (!error || typeof error !== 'object') {
          console.error('[API Client] Error: Invalid error object', error);
          return Promise.reject(error);
        }
        
        // Safely extract error properties
        const errorInfo = {
          url: (error.config && typeof error.config === 'object') ? error.config.url : 'unknown',
          method: (error.config && typeof error.config === 'object') ? error.config.method : 'unknown',
          status: (error.response && typeof error.response === 'object') ? error.response.status : 'unknown',
          message: 'Unknown error',
          fullResponse: null,
          errorName: 'Unknown',
          errorCode: 'Unknown',
        };
        
        // Safely extract message
        if (error.response && typeof error.response === 'object' && error.response.data && typeof error.response.data === 'object') {
          errorInfo.message = error.response.data.message || 'Unknown error';
          errorInfo.fullResponse = error.response.data;
        } else if (error.message && typeof error.message === 'string') {
          errorInfo.message = error.message;
        }
        
        // Safely extract error name and code
        if (error.name && typeof error.name === 'string') {
          errorInfo.errorName = error.name;
        }
        
        if (error.code && typeof error.code === 'string') {
          errorInfo.errorCode = error.code;
        }
        
        console.error('[API Client] Error:', errorInfo);
      } catch (logError) {
        // Fallback logging if serialization fails
        console.error('[API Client] Error (fallback):',
          (error && typeof error === 'object' && error.message) ? error.message : 'Unknown error');
      }
    }
    
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      const hadSession = Boolean(authStorage.getAccessToken());

      if (hadSession) {
        authStorage.clearSession();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGOUT));
          if (!window.location.pathname.startsWith('/login')) {
            window.location.href = '/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    PROFILE: '/users/profile',
  },
  
  // Products
  PRODUCTS: {
    LIST: '/catalog/products',
    DETAIL: (id: string) => `/catalog/products/${id}`,
    DETAIL_BY_SLUG: (slug: string) => `/catalog/products/slug/${slug}`,
    SEARCH: '/catalog/products/search',
    CREATE: '/catalog/products',
    UPDATE: (id: string) => `/catalog/products/${id}`,
    DELETE: (id: string) => `/catalog/products/${id}`,
    ANALYTICS: '/catalog/products/analytics/overview',
    TOP_VIEWED: '/catalog/products/analytics/top-viewed',
    RECENT: '/catalog/products/analytics/recent',
  },
  
  // Categories
  CATEGORIES: {
    LIST: '/catalog/categories',
    DETAIL: (id: string) => `/catalog/categories/${id}`,
    DETAIL_BY_SLUG: (slug: string) => `/catalog/categories/slug/${slug}`,
    CREATE: '/catalog/categories',
    UPDATE: (id: string) => `/catalog/categories/${id}`,
    DELETE: (id: string) => `/catalog/categories/${id}`,
  },
  
  // Cart
  CART: {
    GET: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: (id: string) => `/cart/items/${id}`,
    REMOVE_ITEM: (id: string) => `/cart/items/${id}`,
    CLEAR: '/cart/clear',
  },
  
  // Orders
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CREATE: '/orders',
    UPDATE: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
  },
  
  // Services
  SERVICES: {
    LIST: '/services',
    DETAIL: (id: string) => `/services/${id}`,
    DETAIL_BY_SLUG: (slug: string) => `/services/slug/${slug}`,
    TYPES: '/service-types',
    BOOKINGS: '/booking',
    CREATE_BOOKING: '/booking',
  },

  // Projects
  PROJECTS: {
    LIST: '/projects',
    FEATURED: '/projects/featured',
    DETAIL: (id: string) => `/projects/${id}`,
    DETAIL_BY_SLUG: (slug: string) => `/projects/by-slug/${slug}`,
  },

  // Admin Dashboard
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    STATS_USERS: '/admin/stats/users',
    STATS_ORDERS: '/admin/stats/orders',
    STATS_PRODUCTS: '/admin/stats/products',
    BULK_ACTION: '/admin/bulk-action',
    SYSTEM_STATUS: '/admin/system/status',
    ACTIVITY_LOGS: '/admin/logs/activity',
  },
  
  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    SALES: '/analytics/sales',
    INVENTORY: '/analytics/inventory',
    KPIS: '/analytics/kpis',
    REALTIME_SALES: '/analytics/realtime/sales',
    REALTIME_ORDERS: '/analytics/realtime/orders',
  },

  // Health
  HEALTH: {
    BASIC: '/health',
    DETAILED: '/health/detailed',
    DATABASE: '/health/database',
  },

  // Content & CMS (banners, etc.)
  CONTENT: {
    BANNERS: '/content/banners',
  },

  // Policies
  POLICIES: {
    LIST: '/policies',
    DETAIL_BY_TYPE: (type: string) => `/policies/type/${type}`,
    DETAIL_BY_SLUG: (slug: string) => `/policies/slug/${slug}`,
  },

  // Wishlist
  WISHLIST: {
    LIST: '/wishlist',
    ADD: '/wishlist',
    REMOVE: (productId: string) => `/wishlist/${productId}`,
    CHECK: (productId: string) => `/wishlist/check/${productId}`,
    COUNT: '/wishlist/count',
    CLEAR: '/wishlist',
  },
} as const;

// Helper function to handle API responses
export const handleApiResponse = <T>(response: { data?: unknown }): T => {
  const payload = response?.data;

  if (payload === undefined || payload === null) {
    throw new Error('API request failed');
  }

  if (typeof payload === 'object') {
    const payloadWithStatus = payload as { success?: boolean; data?: unknown; message?: string };

    if (payloadWithStatus.success === true) {
      if (payloadWithStatus.data !== undefined) {
        return payloadWithStatus.data as T;
      }
      return payloadWithStatus as T;
    }

    if (payloadWithStatus.success === false) {
      throw new Error(payloadWithStatus.message || 'API request failed');
    }

    if ('data' in payloadWithStatus && payloadWithStatus.data !== undefined) {
      return payloadWithStatus.data as T;
    }
  }

  return payload as T;
};

// Helper function to handle API errors
export const handleApiError = (error: { response?: { data?: { message?: string }; status?: number }; message?: string }) => {
  const message = error.response?.data?.message || error.message || 'An error occurred';
  const status = error.response?.status;
  return { message, status };
};

