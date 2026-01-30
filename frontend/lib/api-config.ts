/**
 * Centralized API Configuration
 * Use this instead of hardcoding localhost URLs
 */

// API Base URLs
const isBrowser = typeof window !== 'undefined';

export const API_CONFIG = {
  // Backend API base URL
  // Use relative path in browser to leverage Next.js rewrites and avoid CORS
  baseUrl: isBrowser ? '/api/v1' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1'),

  // Backend base (without /api/v1)
  backendUrl: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1').replace(/\/api\/v1\/?$/, ''),

  // WebSocket URL
  wsUrl: process.env.NEXT_PUBLIC_WS_URL ||
    (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010').replace(/\/api\/v1\/?$/, '').replace('http', 'ws'),
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
    refresh: '/auth/refresh',
  },

  // Products
  products: {
    list: '/catalog/products',
    detail: (id: string) => `/catalog/products/${id}`,
    bySlug: (slug: string) => `/catalog/products/slug/${slug}`,
    search: '/catalog/products/search',
  },

  // Services
  services: {
    list: '/services',
    detail: (id: string) => `/services/${id}`,
    bySlug: (slug: string) => `/services/slug/${slug}`,
    types: '/service-types',
  },

  // Cart
  cart: {
    get: '/cart',
    add: '/cart/add',
    update: '/cart/update',
    remove: '/cart/remove',
    clear: '/cart/clear',
  },

  // Orders
  orders: {
    list: '/orders',
    detail: (id: string) => `/orders/${id}`,
    create: '/orders',
  },

  // Payments
  payments: {
    create: '/payments/create',
    status: (id: string) => `/payments/${id}/status`,
    webhook: '/payments/webhook',
  },

  // Blog
  blog: {
    articles: '/blog/articles',
    articleBySlug: (slug: string) => `/blog/articles/slug/${slug}`,
    categories: '/blog/categories',
  },

  // Site
  site: {
    settings: '/site/settings',
    contactInfo: '/site/contact-info',
    banners: '/banners',
  },

  // Support
  support: {
    tickets: '/support/tickets',
    kb: '/support/kb/articles',
  },

  // Maps
  maps: {
    geocode: '/maps/geocode',
    reverse: '/maps/reverse',
    directions: '/maps/directions',
    placeDetail: '/maps/place-detail',
  },

  // AI
  ai: {
    chat: '/ai/chat',
  },
} as const;

// Helper function to build full URL
export function buildApiUrl(endpoint: string): string {
  const base = API_CONFIG.baseUrl.replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}

// Helper for backend URL (without /api/v1)
export function buildBackendUrl(path: string): string {
  const base = API_CONFIG.backendUrl.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

// Export type for better intellisense
export type ApiEndpoint = typeof API_ENDPOINTS;
