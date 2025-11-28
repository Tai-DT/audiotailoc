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
    // Debug: Log API errors (only in development)
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      try {
        // Always start with a minimal valid error object
        const errorInfo: Record<string, unknown> = {
          timestamp: new Date().toISOString(),
          type: 'API_ERROR'
        };
        
        // Extract error name and code first
        if (error?.name) errorInfo.errorName = error.name;
        if (error?.code) errorInfo.errorCode = error.code;
        if (error?.message) errorInfo.errorMessage = error.message;
        
        // Extract request config information
        if (error?.config) {
          if (error.config.url) errorInfo.url = error.config.url;
          if (error.config.method) errorInfo.method = error.config.method.toUpperCase();
          if (error.config.baseURL) errorInfo.baseURL = error.config.baseURL;
          // Build full URL for easier debugging
          if (error.config.baseURL && error.config.url) {
            errorInfo.fullUrl = `${error.config.baseURL}${error.config.url}`;
          }
          // Add request data for debugging (be careful with sensitive data)
          if (error.config.data) {
            try {
              const requestData = typeof error.config.data === 'string' 
                ? JSON.parse(error.config.data) 
                : error.config.data;
              // Don't log passwords or tokens
              const sanitizedData = { ...requestData };
              if (sanitizedData.password) sanitizedData.password = '***';
              if (sanitizedData.token) sanitizedData.token = '***';
              errorInfo.requestData = sanitizedData;
            } catch {
              // Ignore parse errors
            }
          }
        }
        
        // Extract response information
        if (error?.response) {
          if (error.response.status) errorInfo.status = error.response.status;
          if (error.response.statusText) errorInfo.statusText = error.response.statusText;
          
          // Extract response data and message
          if (error.response.data) {
            if (typeof error.response.data === 'object') {
              if (error.response.data.message) {
                errorInfo.message = error.response.data.message;
              }
              // Include full response data for debugging
              errorInfo.responseData = error.response.data;
            } else {
              errorInfo.message = String(error.response.data);
            }
          }
        }
        
        // Use error message as fallback if no response message
        if (!errorInfo.message && error?.message) {
          errorInfo.message = error.message;
        }
        
        // Set default message if still empty
        if (!errorInfo.message) {
          errorInfo.message = 'Unknown API error';
        }
        
        // Log grouped error information with color coding based on status
        const statusCode = errorInfo.status as number;
        const logStyle = statusCode >= 500 ? 'background: #f44336; color: white; padding: 2px 5px; border-radius: 3px;'
                       : statusCode >= 400 ? 'background: #ff9800; color: white; padding: 2px 5px; border-radius: 3px;'
                       : 'background: #2196f3; color: white; padding: 2px 5px; border-radius: 3px;';
        
        console.groupCollapsed(
          `%c${errorInfo.method || 'REQUEST'} ${errorInfo.url || 'API'} - ${statusCode || 'ERROR'}`,
          logStyle
        );
        // Surface key fields first for quick debugging
        console.error('API Error message:', errorInfo.errorMessage || errorInfo.message || 'Unknown error');
        console.error('HTTP status:', statusCode);
        if (errorInfo.fullUrl) console.error('Request URL:', errorInfo.fullUrl);
        if (errorInfo.requestData) console.error('Request data:', errorInfo.requestData);
        // Prefer to show the response body if available (most useful)
        if (errorInfo.responseData) {
          console.error('Response body:', errorInfo.responseData);
        } else {
          // Fallback: show the structured errorInfo object
          console.error('Error Details:', errorInfo);
        }
        if (error && error.stack) {
          console.debug('Stack Trace:', error.stack);
        }
        console.groupEnd();
        
      } catch (logError) {
        // Fallback: log the original error if structured logging fails
        console.error('[API Client] Failed to process error:', logError);
        console.error('[API Client] Original error:', error);
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
  
  // Checkout
  CHECKOUT: {
    CREATE: '/checkout',
    CREATE_ORDER: '/checkout/create-order',
  },

  // Payments
  PAYMENTS: {
    METHODS: '/payments/methods',
    STATUS: '/payments/status',
    INTENTS: '/payments/intents',
    CREATE_PAYOS: '/payments/payos/create-payment',
    PAYOS_STATUS: (orderCode: string) => `/payments/payos/payment-status/${orderCode}`,
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

  // Chat
  CHAT: {
    CONVERSATIONS: '/chat/conversations',
    MESSAGES: '/chat/messages',
    CONVERSATION_MESSAGES: (id: string) => `/chat/conversations/${id}/messages`,
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
