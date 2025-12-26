import axios from 'axios';
import { authStorage, AUTH_EVENTS } from '@/lib/auth-storage';
import { logger } from '@/lib/logger';

const configuredBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
const API_BASE_URL = configuredBaseUrl && configuredBaseUrl.length > 0
  ? configuredBaseUrl
  : 'http://localhost:3010/api/v1';

// Debug: Log the API base URL (only in development)
if ( process.env.NODE_ENV === 'development' && typeof window !== 'undefined' )
{
  logger.debug( '[API Client] Base URL', { API_BASE_URL, NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL } );
}

// Create axios instance with default config
export const apiClient = axios.create( {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
} );

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  ( config ) =>
  {
    // Debug: Log the full request URL
    if ( process.env.NODE_ENV === 'development' && typeof window !== 'undefined' )
    {
      const fullUrl = config.baseURL + ( config.url || '' );
      logger.debug( '[API Client] Request', { method: config.method?.toUpperCase(), url: fullUrl } );
    }

    const token = authStorage.getAccessToken();

    // Don't add Authorization header to auth endpoints (login, register, refresh)
    // These endpoints don't require authentication
    const isAuthEndpoint = config.url?.includes( '/auth/login' ) ||
      config.url?.includes( '/auth/register' ) ||
      config.url?.includes( '/auth/refresh' );

    if ( token && !isAuthEndpoint )
    {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${ token }`;
    }
    // If PUBLIC_ORDER_API_KEY is configured, and the request is to orders endpoints,
    // attach the x-order-key header so backend can validate public order requests.
    try
    {
      const publicOrderKey = process.env.PUBLIC_ORDER_API_KEY || process.env.NEXT_PUBLIC_ORDER_API_KEY || process.env.NEXT_PUBLIC_PUBLIC_ORDER_API_KEY || process.env.NEXT_PUBLIC_PUBLIC_ORDER;
      const url = config.url || '';
      if ( publicOrderKey && url && url.startsWith( '/orders' ) )
      {
        config.headers = config.headers || {};
        config.headers[ 'x-order-key' ] = publicOrderKey;
      }
    } catch
    {
      // ignore
    }
    return config;
  },
  ( error ) => Promise.reject( error )
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  ( response ) => response,
  ( error ) =>
  {
    // Debug: Log API errors with better error handling
    if ( process.env.NODE_ENV === 'development' && typeof window !== 'undefined' )
    {
      const errorInfo: Record<string, unknown> = {};

      // Handle axios errors
      if ( error.config )
      {
        errorInfo.url = error.config.url || 'unknown';
        errorInfo.method = error.config.method?.toUpperCase() || 'unknown';
        errorInfo.baseURL = error.config.baseURL;
      }

      // Handle response errors
      if ( error.response )
      {
        errorInfo.status = error.response.status;
        errorInfo.statusText = error.response.statusText;
        errorInfo.data = error.response.data;
        errorInfo.message = error.response.data?.message || error.response.statusText || 'Request failed';
      } else if ( error.request )
      {
        // Network error or timeout
        errorInfo.type = 'network_error';
        errorInfo.message = error.message || 'Network error - unable to reach server';
      } else
      {
        // Other error - ensure we always have some info
        errorInfo.type = 'unknown_error';
        errorInfo.message = error.message || String( error ) || 'An unknown error occurred';
      }

      // Include full error for debugging
      if ( error.stack )
      {
        errorInfo.stack = error.stack;
      }

      // Always include error object for debugging if available
      if ( error && typeof error === 'object' )
      {
        const originalError: Record<string, unknown> = {};
        if ( error.name ) originalError.name = error.name;
        if ( error.message ) originalError.message = error.message;
        if ( ( error as { code?: string } ).code ) originalError.code = ( error as { code?: string } ).code;

        // Only add originalError if it has at least one property
        if ( Object.keys( originalError ).length > 0 )
        {
          errorInfo.originalError = originalError;
        }
      }

      // Don't log 429 errors as errors, they're expected during rate limiting
      // Don't log 404 errors for known missing endpoints (like /testimonials)
      const isKnownMissingEndpoint = error.config?.url?.includes( '/testimonials' );
      if ( error.response?.status !== 429 && !( error.response?.status === 404 && isKnownMissingEndpoint ) )
      {
        // Only log if errorInfo has meaningful content
        // Check for actual values, not just existence of keys
        const hasType = errorInfo.type && typeof errorInfo.type === 'string' && errorInfo.type.trim() !== '';
        const hasMessage = errorInfo.message && typeof errorInfo.message === 'string' && errorInfo.message.trim() !== '';
        const hasStatus = typeof errorInfo.status === 'number' && errorInfo.status > 0;
        const hasData = errorInfo.data !== undefined && errorInfo.data !== null &&
          ( typeof errorInfo.data !== 'object' || Object.keys( errorInfo.data as object ).length > 0 );
        const hasUrl = errorInfo.url && typeof errorInfo.url === 'string' && errorInfo.url !== 'unknown';
        const hasStack = errorInfo.stack && typeof errorInfo.stack === 'string';

        const hasInfo = hasType || hasMessage || hasStatus || hasData || hasUrl || hasStack;

        if ( hasInfo )
        {
          logger.error( '[API Client] Error', error, errorInfo );
        } else
        {
          // Only log fallback if we're in development and error has some meaningful content
          if ( process.env.NODE_ENV === 'development' && ( error.message || error.name || error.stack ) )
          {
            logger.warn( '[API Client] Error (minimal info)', {
              name: error.name,
              message: error.message,
              url: error.config?.url,
              status: error.response?.status
            } );
          }
        }
      }
    }

    const status = error.response?.status;

    // Handle rate limiting (429)
    if ( status === 429 )
    {
      const retryAfter = error.response?.headers?.[ 'retry-after' ] || error.response?.headers?.[ 'Retry-After' ];
      const retrySeconds = retryAfter ? parseInt( retryAfter, 10 ) : 60;
      const retryMinutes = Math.ceil( retrySeconds / 60 );

      // Don't log 429 errors as regular errors, they're expected during rate limiting
      logger.warn( '[API Client] Rate limited (429)', { retrySeconds, retryMinutes } );

      // Add retry-after info to error for better error messages
      if ( error.response )
      {
        error.response.data = {
          ...error.response.data,
          message: `Quá nhiều yêu cầu. Vui lòng thử lại sau ${ retryMinutes } phút.`,
          retryAfter: retrySeconds,
        };
      }
    }

    if ( status === 401 || status === 403 )
    {
      const hadSession = Boolean( authStorage.getAccessToken() );
      const requestUrl = error.config?.url || '';

      // Only clear session if the error is from an auth endpoint
      // This prevents clearing session when other endpoints return 401/403
      // (e.g., when user doesn't have permission or endpoint doesn't exist)
      const isAuthEndpoint = requestUrl.includes( '/auth/profile' ) ||
        requestUrl.includes( '/auth/me' ) ||
        requestUrl.includes( '/auth/refresh' );

      if ( hadSession && isAuthEndpoint )
      {
        authStorage.clearSession();
        if ( typeof window !== 'undefined' )
        {
          window.dispatchEvent( new CustomEvent( AUTH_EVENTS.LOGOUT ) );
          if ( !window.location.pathname.startsWith( '/auth/login' ) )
          {
            window.location.href = '/auth/login';
          }
        }
      }
    }
    return Promise.reject( error );
  }
);

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },

  // Products
  PRODUCTS: {
    LIST: '/catalog/products',
    DETAIL: ( id: string ) => `/catalog/products/${ id }`,
    DETAIL_BY_SLUG: ( slug: string ) => `/catalog/products/slug/${ slug }`,
    SEARCH: '/catalog/products/search',
    CREATE: '/catalog/products',
    UPDATE: ( id: string ) => `/catalog/products/${ id }`,
    DELETE: ( id: string ) => `/catalog/products/${ id }`,
    ANALYTICS: '/catalog/products/analytics/overview',
    TOP_VIEWED: '/catalog/products/top-viewed',
    RECENT: '/catalog/products/analytics/recent',
  },

  // Categories
  CATEGORIES: {
    LIST: '/catalog/categories',
    DETAIL: ( id: string ) => `/catalog/categories/${ id }`,
    DETAIL_BY_SLUG: ( slug: string ) => `/catalog/categories/slug/${ slug }`,
    CREATE: '/catalog/categories',
    UPDATE: ( id: string ) => `/catalog/categories/${ id }`,
    DELETE: ( id: string ) => `/catalog/categories/${ id }`,
  },

  // Cart
  CART: {
    GET: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: ( id: string ) => `/cart/items/${ id }`,
    REMOVE_ITEM: ( id: string ) => `/cart/items/${ id }`,
    CLEAR: '/cart/clear',
  },

  // Orders
  ORDERS: {
    LIST: '/orders',
    DETAIL: ( id: string ) => `/orders/${ id }`,
    CREATE: '/orders',
    UPDATE: ( id: string ) => `/orders/${ id }`,
    CANCEL: ( id: string ) => `/orders/${ id }/cancel`,
  },

  // Services
  SERVICES: {
    LIST: '/services',
    DETAIL: ( id: string ) => `/services/${ id }`,
    DETAIL_BY_SLUG: ( slug: string ) => `/services/slug/${ slug }`,
    TYPES: '/service-types',
    BOOKINGS: '/booking',
    CREATE_BOOKING: '/booking',
  },

  // Projects
  PROJECTS: {
    LIST: '/projects',
    FEATURED: '/projects/featured',
    DETAIL: ( id: string ) => `/projects/${ id }`,
    DETAIL_BY_SLUG: ( slug: string ) => `/projects/by-slug/${ slug }`,
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
    DETAIL_BY_TYPE: ( type: string ) => `/policies/type/${ type }`,
    DETAIL_BY_SLUG: ( slug: string ) => `/policies/slug/${ slug }`,
  },

  // Wishlist
  WISHLIST: {
    LIST: '/wishlist',
    ADD: '/wishlist',
    REMOVE: ( productId: string ) => `/wishlist/${ productId }`,
    CHECK: ( productId: string ) => `/wishlist/check/${ productId }`,
    COUNT: '/wishlist/count',
    CLEAR: '/wishlist',
  },

  // Chat
  CHAT: {
    CONVERSATIONS: '/chat/conversations',
    CONVERSATION_MESSAGES: ( conversationId: string ) => `/chat/conversations/${ conversationId }/messages`,
    MESSAGES: '/chat/messages',
  },
} as const;

// Helper function to handle API responses
export const handleApiResponse = <T> ( response: { data?: unknown } ): T =>
{
  const payload = response?.data;

  if ( payload === undefined || payload === null )
  {
    throw new Error( 'API request failed' );
  }

  if ( typeof payload === 'object' )
  {
    const payloadWithStatus = payload as { success?: boolean; data?: unknown; message?: string };

    if ( payloadWithStatus.success === true )
    {
      if ( payloadWithStatus.data !== undefined )
      {
        return payloadWithStatus.data as T;
      }
      return payloadWithStatus as T;
    }

    if ( payloadWithStatus.success === false )
    {
      throw new Error( payloadWithStatus.message || 'API request failed' );
    }

    if ( 'data' in payloadWithStatus && payloadWithStatus.data !== undefined )
    {
      return payloadWithStatus.data as T;
    }
  }

  return payload as T;
};

// Helper function to handle API errors
export const handleApiError = ( error: { response?: { data?: { message?: string }; status?: number }; message?: string } ) =>
{
  const message = error.response?.data?.message || error.message || 'An error occurred';
  const status = error.response?.status;
  return { message, status };
};

