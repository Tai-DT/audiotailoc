import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
  path: string;
  method: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Error Types
export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
}

// API Client Configuration
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

class ApiClient {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create(API_CONFIG);
    this.setupInterceptors();
    this.loadAuthToken();
  }

  // Setup request/response interceptors
  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        
        // Add request timestamp
        config.metadata = { startTime: new Date() };
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        // Calculate response time
        const endTime = new Date();
        const startTime = response.config.metadata?.startTime;
        const responseTime = startTime ? endTime.getTime() - startTime.getTime() : 0;
        
        // Log successful requests in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ API ${response.config.method?.toUpperCase()} ${response.config.url} - ${responseTime}ms`);
        }
        
        return response;
      },
      (error) => {
        // Calculate response time for errors
        const endTime = new Date();
        const startTime = error.config?.metadata?.startTime;
        const responseTime = startTime ? endTime.getTime() - startTime.getTime() : 0;
        
        // Log errors in development
        if (process.env.NODE_ENV === 'development') {
          console.error(`❌ API Error ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${responseTime}ms`, error.response?.data);
        }
        
        // Handle specific error cases
        if (error.response?.status === 401) {
          this.handleUnauthorized();
        }
        
        return Promise.reject(this.formatError(error));
      }
    );
  }

  // Load auth token from localStorage
  private loadAuthToken() {
    if (typeof window !== 'undefined') {
      this.authToken = localStorage.getItem('auth_token');
    }
  }

  // Set auth token
  public setAuthToken(token: string | null) {
    this.authToken = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  // Handle unauthorized access
  private handleUnauthorized() {
    this.setAuthToken(null);
    if (typeof window !== 'undefined') {
      // Redirect to login page
      window.location.href = '/login';
    }
  }

  // Format error response
  private formatError(error: any): ApiError {
    if (error.response?.data) {
      return {
        statusCode: error.response.status,
        message: error.response.data.message || 'An error occurred',
        error: error.response.data.error || 'Unknown error',
        timestamp: error.response.data.timestamp || new Date().toISOString(),
        path: error.response.data.path || error.config?.url || '',
      };
    }
    
    return {
      statusCode: error.code === 'ECONNABORTED' ? 408 : 500,
      message: error.message || 'Network error',
      error: 'Network error',
      timestamp: new Date().toISOString(),
      path: error.config?.url || '',
    };
  }

  // Generic request methods
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  // Health check
  public async healthCheck(): Promise<ApiResponse> {
    return this.get('/health');
  }

  // Auth methods
  public async login(credentials: { email: string; password: string }): Promise<ApiResponse<{ token: string; user: any }>> {
    const response = await this.post('/auth/login', credentials);
    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
    }
    return response;
  }

  public async register(userData: { name: string; email: string; password: string }): Promise<ApiResponse<{ token: string; user: any }>> {
    const response = await this.post('/auth/register', userData);
    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
    }
    return response;
  }

  public async logout(): Promise<void> {
    try {
      await this.post('/auth/logout');
    } catch (error) {
      // Ignore logout errors
    } finally {
      this.setAuthToken(null);
    }
  }

  public async getCurrentUser(): Promise<ApiResponse<any>> {
    return this.get('/auth/me');
  }

  // Product methods
  public async getProducts(params?: {
    page?: number;
    pageSize?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return this.get(`/catalog/products?${queryParams.toString()}`);
  }

  public async getProduct(slug: string): Promise<ApiResponse<any>> {
    return this.get(`/catalog/products/${slug}`);
  }

  public async getCategories(): Promise<ApiResponse<any[]>> {
    return this.get('/catalog/categories');
  }

  // Cart methods
  public async getCart(guestId?: string): Promise<ApiResponse<any>> {
    const params = guestId ? `?cartId=${guestId}` : '';
    return this.get(`/cart${params}`);
  }

  public async addToCart(data: { productId: string; quantity: number }, guestId?: string): Promise<ApiResponse<any>> {
    const params = guestId ? `?cartId=${guestId}` : '';
    return this.post(`/cart/items${params}`, data);
  }

  public async updateCartItem(productId: string, quantity: number, guestId?: string): Promise<ApiResponse<any>> {
    const params = guestId ? `?cartId=${guestId}` : '';
    return this.put(`/cart/items/${productId}${params}`, { quantity });
  }

  public async removeFromCart(productId: string, guestId?: string): Promise<ApiResponse<any>> {
    const params = guestId ? `?cartId=${guestId}` : '';
    return this.delete(`/cart/items/${productId}${params}`);
  }

  // Order methods
  public async createOrder(orderData: any): Promise<ApiResponse<any>> {
    return this.post('/orders', orderData);
  }

  public async getOrders(): Promise<ApiResponse<any[]>> {
    return this.get('/orders');
  }

  public async getOrder(orderId: string): Promise<ApiResponse<any>> {
    return this.get(`/orders/${orderId}`);
  }

  // Search methods
  public async searchProducts(query: string): Promise<ApiResponse<any[]>> {
    return this.get(`/search/products?q=${encodeURIComponent(query)}`);
  }

  // SEO methods
  public async getSeoData(type: 'home' | 'product' | 'category' | 'page', id?: string): Promise<ApiResponse<any>> {
    const url = id ? `/seo/${type}/${id}` : `/seo/${type}`;
    return this.get(url);
  }

  public async getSitemap(): Promise<string> {
    const response = await this.client.get('/seo/sitemap.xml', { responseType: 'text' });
    return response.data;
  }

  public async getRobotsTxt(): Promise<string> {
    const response = await this.client.get('/seo/robots.txt', { responseType: 'text' });
    return response.data;
  }

  // i18n methods
  public async getLanguages(): Promise<ApiResponse<string[]>> {
    return this.get('/i18n/languages');
  }

  public async getTranslations(lang: string, namespace: string = 'common'): Promise<ApiResponse<any>> {
    return this.get(`/i18n/translations/${namespace}?lang=${lang}`);
  }

  public async getProductTranslations(productId: string, lang: string): Promise<ApiResponse<any>> {
    return this.get(`/i18n/products/${productId}?lang=${lang}`);
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;
export { ApiClient };
