// API Client for Audio Tài Lộc Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
  path: string;
  method: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  _correlationId?: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  shortDescription?: string;
  priceCents: number;
  originalPriceCents?: number;
  categoryId?: string;
  images?: string[];
  brand?: string;
  model?: string;
  sku?: string;
  specifications?: Record<string, unknown>;
  features?: string;
  warranty?: string;
  weight?: number;
  dimensions?: string;
  stockQuantity?: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  tags?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  featured?: boolean;
  isActive?: boolean;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  shortDescription?: string;
  priceCents?: number;
  originalPriceCents?: number;
  categoryId?: string;
  images?: string[];
  brand?: string;
  model?: string;
  sku?: string;
  specifications?: Record<string, unknown>;
  features?: string;
  warranty?: string;
  weight?: number;
  dimensions?: string;
  stockQuantity?: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  tags?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  featured?: boolean;
  isActive?: boolean;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response JSON:', parseError);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.ok) {
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data,
          url
        });
        throw data;
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', {
        endpoint,
        url,
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  // Health check
  async health(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request('/health');
  }

  // Users endpoints
  async getUsers(params?: { 
    page?: number; 
    limit?: number; 
    search?: string;
    role?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('search', params.search.toString());
    if (params?.role) query.append('role', params.role.toString());
    if (params?.status) query.append('status', params.status.toString());
    if (params?.startDate) query.append('startDate', params.startDate.toString());
    if (params?.endDate) query.append('endDate', params.endDate.toString());
    if (params?.sortBy) query.append('sortBy', params.sortBy.toString());
    if (params?.sortOrder) query.append('sortOrder', params.sortOrder.toString());

    return this.request(`/users?${query.toString()}`);
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  async createUser(userData: { email: string; password?: string; name: string; phone?: string; role?: string; generatePassword?: boolean }) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: { name?: string; phone?: string; role?: string }) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders endpoints
  async getOrders(params?: { page?: number; limit?: number; status?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.status) query.append('status', params.status.toString());

    return this.request(`/orders?${query.toString()}`);
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`);
  }

  async createOrder(orderData: {
    items: Array<{ productId: string; quantity: number }>;
    shippingAddress: string;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    notes?: string;
  }) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request(`/orders/${id}/status/${status}`, {
      method: 'PATCH',
    });
  }

  async updateOrder(id: string, orderData: {
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    shippingAddress?: string;
    shippingCoordinates?: { lat: number; lng: number };
    notes?: string;
    items?: Array<{ productId: string; quantity: number; unitPrice?: number; name?: string }>;
  }) {
    return this.request(`/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(orderData),
    });
  }

  async deleteOrder(id: string) {
    return this.request(`/orders/${id}`, {
      method: 'DELETE',
    });
  }

  // Maps endpoints
  async geocodeAddress(query: string) {
    return this.request(`/maps/geocode?query=${encodeURIComponent(query)}`);
  }

  // Products endpoints
  async getProducts(params?: { page?: number; limit?: number; category?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('pageSize', params.limit.toString());
    if (params?.category) query.append('categoryId', params.category.toString());
    if (params?.search) query.append('search', params.search.toString());

    const queryString = query.toString();
    return this.request(`/catalog/products${queryString ? `?${queryString}` : ''}`);
  }

  async getProduct(id: string) {
    return this.request(`/catalog/products/${id}`);
  }

  async deleteProduct(id: string) {
    return this.request(`/catalog/products/${id}`, {
      method: 'DELETE'
    });
  }

  async createProduct(productData: CreateProductData) {
    return this.request('/catalog/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  async updateProduct(id: string, productData: UpdateProductData) {
    return this.request(`/catalog/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(productData)
    });
  }

  async getCategories() {
    return this.request('/catalog/categories');
  }

  // Analytics endpoints
  async getAnalytics() {
    return this.request('/analytics/dashboard');
  }

  // Services endpoints
  async getServices(params?: { page?: number; limit?: number; category?: string; type?: string; isActive?: boolean }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('pageSize', params.limit.toString());
    if (params?.category) query.append('category', params.category.toString());
    if (params?.type) query.append('type', params.type.toString());
    if (params?.isActive !== undefined) query.append('isActive', params.isActive.toString());

    const queryString = query.toString();
    return this.request(`/services${queryString ? `?${queryString}` : ''}`);
  }

  async getService(id: string) {
    return this.request(`/services/${id}`);
  }

  async createService(serviceData: {
    name: string;
    description?: string;
    basePriceCents: number;
    price: number;
    duration: number;
    categoryId: string;
    typeId: string;
    requirements?: string;
    features?: string;
    imageUrl?: string;
  }) {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData)
    });
  }

  async updateService(id: string, serviceData: {
    name?: string;
    description?: string;
    basePriceCents?: number;
    price?: number;
    duration?: number;
    requirements?: string;
    features?: string;
    imageUrl?: string;
    isActive?: boolean;
  }) {
    return this.request(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData)
    });
  }

  async deleteService(id: string) {
    return this.request(`/services/${id}`, {
      method: 'DELETE'
    });
  }

  async getServiceCategories() {
    return this.request('/services/categories');
  }

  async getServiceTypes() {
    return this.request('/services/types');
  }

  async getServiceStats() {
    return this.request('/services/stats');
  }

  // File upload endpoints
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request('/files/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type, let browser set it with boundary for FormData
        ...Object.fromEntries(Object.entries(this.getHeaders()).filter(([key]) => key !== 'Content-Type')),
      },
    });
  }

  // Generic HTTP methods
  async get<T>(endpoint: string, options?: { params?: Record<string, any> }): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (options?.params) {
      const params = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = void>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export types
export type { ApiClient };
