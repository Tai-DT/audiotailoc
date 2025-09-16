// API Client for Audio Tài Lộc Backend
import { ServiceFormData } from '@/types/service';
import { CreateBannerDto, UpdateBannerDto } from '@/types/banner';
import { UpdateSettingsDto } from '@/types/settings';
const API_BASE_URL: string = (() => {
  const env = process.env.NEXT_PUBLIC_API_URL;
  if (env && env.trim().length > 0) return env;
  if (typeof window !== 'undefined') {
    const origin = `${window.location.protocol}//${window.location.hostname}`;
    // Fallback to common local backend port
    return `${origin}:3010/api/v1`;
  }
  // Server-side fallback (dev)
  return 'http://localhost:3010/api/v1';
})();

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
  path: string;
  method: string;
}

export interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
  status?: number;
}

// Generic data type for request bodies
export type RequestData = Record<string, unknown> | FormData | string;

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

    // Add admin API key for backend authentication
    const adminKey = process.env.ADMIN_API_KEY || process.env.NEXT_PUBLIC_ADMIN_API_KEY;
    if (adminKey) {
      headers['X-Admin-Key'] = adminKey;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    let response: Response;
    let responseText: string;

    try {
      response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      // First get the response as text to handle potential non-JSON responses
      responseText = await response.text();

      let data: Record<string, unknown>;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        console.error('Failed to parse response as JSON. Response text:', responseText);
        throw new Error(`Invalid JSON response: ${response.status} ${response.statusText}. Response: ${responseText.substring(0, 200)}`);
      }

      if (!response.ok) {
        const errorInfo = {
          status: response.status,
          statusText: response.statusText,
          url,
          requestBody: options.body ? JSON.parse(options.body.toString()) : null,
          responseHeaders: Object.fromEntries(response.headers.entries()),
          responseText: responseText.substring(0, 500) // First 500 chars of response
        };

        console.error('API Error Response:', errorInfo);

        const error = new Error(data?.message as string || `Request failed with status ${response.status}`) as ApiError;
        error.response = { data };
        error.status = response.status;
        throw error;
      }

      return data as unknown as ApiResponse<T>;
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

  async checkProductDeletable(id: string) {
    return this.request(`/catalog/products/${id}/deletable`);
  }

  async checkSkuExists(sku: string, excludeId?: string) {
    const query = new URLSearchParams();
    if (excludeId) query.append('excludeId', excludeId);
    return this.request(`/catalog/products/check-sku/${encodeURIComponent(sku)}?${query.toString()}`);
  }

  async generateUniqueSku(baseName?: string) {
    const query = new URLSearchParams();
    if (baseName) query.append('baseName', baseName);
    return this.request(`/catalog/generate-sku?${query.toString()}`);
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

  async getRealtimeSales() {
    return this.request('/analytics/realtime/sales');
  }

  async getRealtimeOrders() {
    return this.request('/analytics/realtime/orders');
  }

  // Services endpoints
  async getServices(params?: { page?: number; limit?: number; typeId?: string; isActive?: boolean }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('pageSize', params.limit.toString());
    if (params?.typeId) query.append('typeId', params.typeId.toString());
    if (params?.isActive !== undefined) query.append('isActive', params.isActive.toString());

    const queryString = query.toString();
    return this.request(`/services${queryString ? `?${queryString}` : ''}`);
  }

  async getService(id: string) {
    return this.request(`/services/${id}`);
  }

  async createService(serviceData: ServiceFormData) {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData)
    });
  }

  async updateService(id: string, serviceData: Partial<ServiceFormData>) {
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

  async getServiceTypes() {
    return this.request('/service-types');
  }

  async getServiceType(id: string) {
    return this.request(`/service-types/${id}`);
  }

  async createServiceType(serviceTypeData: { name: string; description?: string; isActive?: boolean }) {
    return this.request('/service-types', {
      method: 'POST',
      body: JSON.stringify(serviceTypeData)
    });
  }

  async updateServiceType(id: string, serviceTypeData: { name?: string; description?: string; isActive?: boolean }) {
    return this.request(`/service-types/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(serviceTypeData)
    });
  }

  async deleteServiceType(id: string) {
    return this.request(`/service-types/${id}`, {
      method: 'DELETE'
    });
  }

  async getServiceStats() {
    return this.request('/services/stats');
  }

  // Inventory endpoints
  async getInventory(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    lowStock?: boolean;
    outOfStock?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('pageSize', params.limit.toString());
    if (params?.search) query.append('search', params.search.toString());
    if (params?.categoryId) query.append('categoryId', params.categoryId.toString());
    if (params?.lowStock !== undefined) query.append('lowStockOnly', params.lowStock.toString());
    if (params?.outOfStock !== undefined) query.append('outOfStock', params.outOfStock.toString());
    if (params?.sortBy) query.append('sortBy', params.sortBy.toString());
    if (params?.sortOrder) query.append('sortOrder', params.sortOrder.toString());

    const queryString = query.toString();
    return this.request(`/inventory${queryString ? `?${queryString}` : ''}`);
  }

  async adjustInventory(productId: string, data: {
    stockDelta?: number;
    reservedDelta?: number;
    lowStockThreshold?: number;
    reason?: string;
    referenceId?: string;
    referenceType?: string;
    userId?: string;
    notes?: string;
  }) {
    return this.request(`/inventory/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Inventory Movements endpoints
  async getInventoryMovements(params?: {
    page?: number;
    limit?: number;
    productId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.productId) query.append('productId', params.productId.toString());
    if (params?.type) query.append('type', params.type.toString());
    if (params?.startDate) query.append('startDate', params.startDate.toString());
    if (params?.endDate) query.append('endDate', params.endDate.toString());
    if (params?.sortBy) query.append('sortBy', params.sortBy.toString());
    if (params?.sortOrder) query.append('sortOrder', params.sortOrder.toString());

    const queryString = query.toString();
    return this.request(`/inventory/movements${queryString ? `?${queryString}` : ''}`);
  }

  async getInventoryMovement(id: string) {
    return this.request(`/inventory/movements/${id}`);
  }

  async createInventoryMovement(data: {
    productId: string;
    type: 'IN' | 'OUT' | 'RESERVED' | 'UNRESERVED' | 'ADJUSTMENT';
    quantity: number;
    reason: string;
    referenceId?: string;
    referenceType?: string;
    userId?: string;
    notes?: string;
  }) {
    return this.request('/inventory/movements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getInventoryMovementsByProduct(productId: string, params?: {
    page?: number;
    limit?: number;
    type?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.type) query.append('type', params.type.toString());
    if (params?.startDate) query.append('startDate', params.startDate.toString());
    if (params?.endDate) query.append('endDate', params.endDate.toString());

    const queryString = query.toString();
    return this.request(`/inventory/movements/product/${productId}${queryString ? `?${queryString}` : ''}`);
  }

  async getInventoryMovementsSummary(params?: {
    startDate?: string;
    endDate?: string;
    productId?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.startDate) query.append('startDate', params.startDate.toString());
    if (params?.endDate) query.append('endDate', params.endDate.toString());
    if (params?.productId) query.append('productId', params.productId.toString());

    const queryString = query.toString();
    return this.request(`/inventory/movements/summary${queryString ? `?${queryString}` : ''}`);
  }

  // Inventory Alerts endpoints
  async getInventoryAlerts(params?: {
    page?: number;
    limit?: number;
    productId?: string;
    type?: string;
    isResolved?: boolean;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.productId) query.append('productId', params.productId.toString());
    if (params?.type) query.append('type', params.type.toString());
    if (params?.isResolved !== undefined) query.append('isResolved', params.isResolved.toString());
    if (params?.startDate) query.append('startDate', params.startDate.toString());
    if (params?.endDate) query.append('endDate', params.endDate.toString());
    if (params?.sortBy) query.append('sortBy', params.sortBy.toString());
    if (params?.sortOrder) query.append('sortOrder', params.sortOrder.toString());

    const queryString = query.toString();
    return this.request(`/inventory/alerts${queryString ? `?${queryString}` : ''}`);
  }

  async getInventoryAlert(id: string) {
    return this.request(`/inventory/alerts/${id}`);
  }

  async createInventoryAlert(data: {
    productId: string;
    type: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVERSTOCK' | 'EXPIRING';
    message: string;
    threshold?: number;
    currentStock?: number;
  }) {
    return this.request('/inventory/alerts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getInventoryAlertsByProduct(productId: string, params?: {
    page?: number;
    limit?: number;
    type?: string;
    isResolved?: boolean;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.type) query.append('type', params.type.toString());
    if (params?.isResolved !== undefined) query.append('isResolved', params.isResolved.toString());

    const queryString = query.toString();
    return this.request(`/inventory/alerts/product/${productId}${queryString ? `?${queryString}` : ''}`);
  }

  async getActiveInventoryAlerts(params?: {
    page?: number;
    limit?: number;
    type?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.type) query.append('type', params.type.toString());

    const queryString = query.toString();
    return this.request(`/inventory/alerts/active${queryString ? `?${queryString}` : ''}`);
  }

  async getInventoryAlertsSummary(params?: {
    startDate?: string;
    endDate?: string;
    productId?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.startDate) query.append('startDate', params.startDate.toString());
    if (params?.endDate) query.append('endDate', params.endDate.toString());
    if (params?.productId) query.append('productId', params.productId.toString());

    const queryString = query.toString();
    return this.request(`/inventory/alerts/summary${queryString ? `?${queryString}` : ''}`);
  }

  async resolveInventoryAlert(id: string, data?: {
    resolvedBy?: string;
    notes?: string;
  }) {
    return this.request(`/inventory/alerts/${id}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify(data || {}),
    });
  }

  async bulkResolveInventoryAlerts(data: {
    alertIds: string[];
    resolvedBy?: string;
    notes?: string;
  }) {
    return this.request('/inventory/alerts/bulk-resolve', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async checkAndCreateInventoryAlerts() {
    return this.request('/inventory/alerts/check', {
      method: 'POST',
    });
  }

  async deleteInventoryAlert(id: string) {
    return this.request(`/inventory/alerts/${id}`, {
      method: 'DELETE',
    });
  }

  async bulkDeleteInventoryAlerts(data: { alertIds: string[] }) {
    return this.request('/inventory/alerts/bulk-delete', {
      method: 'POST',
      body: JSON.stringify(data),
    });
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
  async get<T>(endpoint: string, options?: { params?: Record<string, string | number | boolean> }): Promise<ApiResponse<T>> {
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

  async post<T>(endpoint: string, data?: RequestData): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: RequestData): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: RequestData): Promise<ApiResponse<T>> {
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

  // Banner endpoints
  async getBanners(params?: {
    page?: string;
    active?: boolean;
    search?: string;
    skip?: number;
    take?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page);
    if (params?.active !== undefined) query.append('active', params.active.toString());
    if (params?.search) query.append('search', params.search);
    if (params?.skip !== undefined) query.append('skip', params.skip.toString());
    if (params?.take !== undefined) query.append('take', params.take.toString());
    return this.request(`/content/banners?${query.toString()}`);
  }

  async getBanner(id: string) {
    return this.request(`/content/banners/${id}`);
  }

  async createBanner(data: CreateBannerDto) {
    return this.request('/admin/banners', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBanner(id: string, data: UpdateBannerDto) {
    return this.request(`/admin/banners/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteBanner(id: string) {
    return this.request(`/admin/banners/${id}`, {
      method: 'DELETE',
    });
  }

  // Settings endpoints
  async getSiteSettings() {
    return this.request('/content/settings');
  }

  async getSiteSettingsSection(section: string) {
    return this.request(`/content/settings/${section}`);
  }

  async updateSiteSettings(data: UpdateSettingsDto) {
    return this.request('/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Bookings endpoints
  async getBookings(params?: {
    page?: number;
    limit?: number;
    status?: string;
    serviceTypeId?: string;
    technicianId?: string;
    customerName?: string;
    customerPhone?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.status) query.append('status', params.status.toString());
    if (params?.serviceTypeId) query.append('serviceTypeId', params.serviceTypeId.toString());
    if (params?.technicianId) query.append('technicianId', params.technicianId.toString());
    if (params?.customerName) query.append('customerName', params.customerName.toString());
    if (params?.customerPhone) query.append('customerPhone', params.customerPhone.toString());
    if (params?.startDate) query.append('startDate', params.startDate.toString());
    if (params?.endDate) query.append('endDate', params.endDate.toString());
    if (params?.sortBy) query.append('sortBy', params.sortBy.toString());
    if (params?.sortOrder) query.append('sortOrder', params.sortOrder.toString());

    const queryString = query.toString();
    return this.request(`/bookings${queryString ? `?${queryString}` : ''}`);
  }

  async getBooking(id: string) {
    return this.request(`/bookings/${id}`);
  }

  async createBooking(bookingData: {
    serviceTypeId: string;
    technicianId?: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerAddress: string;
    customerCoordinates?: { lat: number; lng: number };
    scheduledDate: string;
    scheduledTime: string;
    notes?: string;
    priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  }) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async updateBooking(id: string, bookingData: {
    serviceTypeId?: string;
    technicianId?: string;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    customerAddress?: string;
    customerCoordinates?: { lat: number; lng: number };
    scheduledDate?: string;
    scheduledTime?: string;
    notes?: string;
    priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  }) {
    return this.request(`/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(bookingData),
    });
  }

  async updateBookingStatus(id: string, status: string, notes?: string) {
    return this.request(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  }

  async assignTechnician(id: string, technicianId: string) {
    return this.request(`/bookings/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ technicianId }),
    });
  }

  async deleteBooking(id: string) {
    return this.request(`/bookings/${id}`, {
      method: 'DELETE',
    });
  }

  async getBookingStats() {
    return this.request('/bookings/stats');
  }

  // Technicians endpoints
  async getTechnicians(params?: {
    page?: number;
    limit?: number;
    serviceTypeId?: string;
    isActive?: boolean;
    search?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.serviceTypeId) query.append('serviceTypeId', params.serviceTypeId.toString());
    if (params?.isActive !== undefined) query.append('isActive', params.isActive.toString());
    if (params?.search) query.append('search', params.search.toString());

    const queryString = query.toString();
    return this.request(`/technicians${queryString ? `?${queryString}` : ''}`);
  }

  async getTechnician(id: string) {
    return this.request(`/technicians/${id}`);
  }

  async createTechnician(technicianData: {
    name: string;
    phone: string;
    email?: string;
    specialization?: string[];
    serviceTypeIds: string[];
    isActive?: boolean;
    notes?: string;
  }) {
    return this.request('/technicians', {
      method: 'POST',
      body: JSON.stringify(technicianData),
    });
  }

  async updateTechnician(id: string, technicianData: {
    name?: string;
    phone?: string;
    email?: string;
    specialization?: string[];
    serviceTypeIds?: string[];
    isActive?: boolean;
    notes?: string;
  }) {
    return this.request(`/technicians/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(technicianData),
    });
  }

  async deleteTechnician(id: string) {
    return this.request(`/technicians/${id}`, {
      method: 'DELETE',
    });
  }

  async getTechnicianAvailability(id: string, date: string) {
    return this.request(`/technicians/${id}/availability?date=${date}`);
  }

  // Notifications endpoints
  async getNotifications(params?: { userId?: string; read?: boolean; page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.userId) query.append('userId', params.userId);
    if (params?.read !== undefined) query.append('read', params.read.toString());
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    return this.request(`/notifications?${query.toString()}`);
  }

  async getNotificationSettings(userId?: string) {
    const query = userId ? `?userId=${userId}` : '';
    return this.request(`/notifications/settings${query}`);
  }

  async subscribeToNotifications(data: { userId: string; type: string; channel: 'email' | 'sms' | 'push' }) {
    return this.request('/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async unsubscribeFromNotifications(data: { userId: string; type: string; channel: 'email' | 'sms' | 'push' }) {
    return this.request('/notifications/unsubscribe', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async markNotificationAsRead(data: { notificationId: string; userId: string }) {
    return this.request('/notifications/mark-read', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async markAllNotificationsAsRead(userId: string) {
    return this.request('/notifications/mark-all-read', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async getNotificationStats(userId: string) {
    return this.request(`/notifications/stats?userId=${userId}`);
  }
}


// Create and export singleton instance

export const apiClient = new ApiClient(API_BASE_URL);

// Export types
export type { ApiClient };