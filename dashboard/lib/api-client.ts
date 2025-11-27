// API Client for Audio Tài Lộc Backend
import { ServiceFormData } from '@/types/service';
import { CreateBannerDto, UpdateBannerDto } from '@/types/banner';
import { UpdateSettingsDto } from '@/types/settings';
const API_BASE_URL: string = (() => {
  const env = process.env.NEXT_PUBLIC_API_URL;
  if (env && env.trim().length > 0) return env;

  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;

    // If running on localhost, default to backend port 3010
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//${hostname}:3010/api/v1`;
    }

    // In production (e.g. Vercel), if a port is present use it, otherwise use origin without custom port
    if (port && port.trim().length > 0) {
      return `${protocol}//${hostname}:${port}/api/v1`;
    }

    // Default to same origin (no port) for production deployments
    return `${protocol}//${hostname}/api/v1`;
  }

  // Server-side fallback
  // Check if we are in a containerized environment or specific deployment
  if (process.env.API_URL) return process.env.API_URL;

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
  statusCode?: number;
  error?: string;
  timestamp?: string;
  path?: string;
  _correlationId?: string;
}

// Generic data type for request bodies
export type RequestData = Record<string, unknown> | FormData | string;

export type UnknownApiResponse = ApiResponse<unknown>;

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
  stockQuantity?: number; // Used for initial stock creation
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  tags?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  featured?: boolean;
  isActive?: boolean;
  slug?: string;
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
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  tags?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  featured?: boolean;
  isActive?: boolean;
  slug?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  private onUnauthorized: (() => void) | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Initialize token from localStorage if available (client-side only)
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('accessToken');
    }
  }

  setUnauthorizedHandler(handler: () => void) {
    this.onUnauthorized = handler;
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Add admin API key for backend authentication
    // Try both server and client side env vars
    const adminKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || process.env.ADMIN_API_KEY;
    if (adminKey) {
      headers['X-Admin-Key'] = adminKey;
    } else if (typeof window !== 'undefined') {
      console.warn('⚠️ ADMIN_API_KEY not found in environment variables');
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
      const defaultHeaders = this.getHeaders();

      // If body is FormData, let the browser set Content-Type with boundary
      // Otherwise, defaultHeaders includes 'Content-Type': 'application/json'
      if (options.body instanceof FormData) {
        delete (defaultHeaders as any)['Content-Type'];
      }

      response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      // First get the response as text to handle potential non-JSON responses
      responseText = await response.text();

      let data: Record<string, unknown>;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error(`Invalid JSON response: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        // More descriptive error messages
        let errorMessage = data?.message as string || `Request failed with status ${response.status}`;

        if (response.status === 401) {
          // Check if this is a login attempt
          if (endpoint.includes('/auth/login')) {
            errorMessage = data?.message as string || 'Invalid email or password. Please check your credentials and try again.';
          } else {
            // Use backend's specific error message for better UX
            const backendMessage = data?.message as string || '';
            if (backendMessage.toLowerCase().includes('expired')) {
              errorMessage = 'Your session has expired. Please login again.';
            } else if (backendMessage.toLowerCase().includes('invalid')) {
              errorMessage = 'Invalid authentication token. Please login again.';
            } else {
              errorMessage = backendMessage || 'Unauthorized: Your session has expired. Please login again';
            }
          }
          // Clear tokens on 401
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
          // Trigger unauthorized handler if set (but not for login failures)
          if (this.onUnauthorized && !endpoint.includes('/auth/login')) {
            this.onUnauthorized();
          }
        } else if (response.status === 403) {
          errorMessage = 'Access Denied: You do not have permission to access this resource. Please check your credentials.';
        } else if (response.status === 404) {
          errorMessage = 'Not Found: The requested resource does not exist';
        } else if (response.status === 429) {
          errorMessage = data?.message as string || 'Too many requests. Please wait a moment and try again.';
        } else if (response.status >= 500) {
          errorMessage = data?.message as string || 'Server Error: Please try again later';
        }

        const error = new Error(errorMessage) as ApiError;
        error.response = { data };
        error.status = response.status;
        throw error;
      }

      return data as unknown as ApiResponse<T>;
    } catch (error) {
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
    if (params?.limit) query.append('pageSize', params.limit.toString());
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

  async sendInvoice(id: string) {
    return this.request(`/orders/${id}/invoice`, {
      method: 'POST',
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

  async getCategory(id: string) {
    return this.request(`/catalog/categories/${id}`);
  }

  async createCategory(categoryData: {
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    parentId?: string;
    isActive?: boolean;
  }) {
    return this.request('/catalog/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: string, categoryData: {
    name?: string;
    slug?: string;
    description?: string;
    imageUrl?: string;
    parentId?: string;
    isActive?: boolean;
  }) {
    return this.request(`/catalog/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: string) {
    return this.request(`/catalog/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Support endpoints
  async getTickets(params?: {
    userId?: string;
    status?: string;
    priority?: string;
    assignedTo?: string;
    page?: number;
    pageSize?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.userId) query.append('userId', params.userId);
    if (params?.status) query.append('status', params.status);
    if (params?.priority) query.append('priority', params.priority);
    if (params?.assignedTo) query.append('assignedTo', params.assignedTo);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.pageSize) query.append('pageSize', params.pageSize.toString());

    return this.request(`/support/tickets?${query.toString()}`);
  }

  async createTicket(data: {
    subject: string;
    description: string;
    email: string;
    name: string;
    userId?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  }) {
    return this.request('/support/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTicketStatus(id: string, status: string, assignedTo?: string) {
    return this.request(`/support/tickets/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, assignedTo }),
    });
  }

  // Marketing endpoints
  async getCampaigns(status?: string) {
    const query = new URLSearchParams();
    if (status) query.append('status', status);
    return this.request(`/marketing/campaigns?${query.toString()}`);
  }

  async createCampaign(data: {
    name: string;
    description?: string;
    type?: string;
    targetAudience?: string;
    subject?: string;
    content?: string;
  }) {
    return this.request('/marketing/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCampaign(id: string, data: {
    name?: string;
    description?: string;
    type?: string;
    targetAudience?: string;
    subject?: string;
    content?: string;
    status?: string;
    scheduledAt?: string;
  }) {
    return this.request(`/marketing/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCampaign(id: string) {
    return this.request(`/marketing/campaigns/${id}`, {
      method: 'DELETE',
    });
  }

  async sendCampaign(id: string) {
    return this.request(`/marketing/campaigns/${id}/send`, {
      method: 'POST',
    });
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

  // Maps endpoints
  async searchPlaces(query: string) {
    return this.request(`/maps/geocode?query=${encodeURIComponent(query)}`);
  }

  async getPlaceDetail(placeId: string) {
    return this.request(`/maps/place-detail?placeId=${placeId}`);
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
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 Attempting login for:', credentials.email);
    }
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

  async createNotification(data: {
    title: string;
    message: string;
    type: string;
    target: string;
    channels: string[];
  }) {
    return this.request('/notifications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
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

  // Analytics endpoints
  async getRevenue(period: string = 'month') {
    return this.request(`/analytics/revenue?period=${period}`);
  }

  async getRevenueChart(days: number = 7) {
    return this.request(`/analytics/revenue/chart?days=${days}`);
  }

  async getTopSellingProductsReal(limit: number = 5) {
    return this.request(`/analytics/products/top-selling-real?limit=${limit}`);
  }

  async getGrowthMetrics() {
    return this.request('/analytics/growth-metrics');
  }

  async getBookingsTodayReal() {
    return this.request('/analytics/services/bookings-today-real');
  }

  // ==================== Chat Endpoints ====================
  async getConversations(params?: { status?: string; userId?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.userId) query.append('userId', params.userId);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    return this.request(`/chat/conversations?${query.toString()}`);
  }

  async getChatMessages(conversationId: string, params?: { page?: number; limit?: number; guestId?: string; guestToken?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.guestId) query.append('guestId', params.guestId);
    if (params?.guestToken) query.append('guestToken', params.guestToken);
    return this.request(`/chat/conversations/${conversationId}/messages?${query.toString()}`);
  }

  async sendChatMessage(data: { conversationId: string; content: string; senderId?: string; senderType?: string; guestToken?: string }) {
    return this.request('/chat/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async startConversation(data: { userId?: string; guestId?: string; guestName?: string; guestPhone?: string; initialMessage: string }) {
    return this.request('/chat/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==================== Reports Export Endpoints ====================

  // ===========================
  // Reviews API
  // ===========================

  async getReviews(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    productId?: string;
    rating?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.productId) query.append('productId', params.productId);
    if (params?.rating) query.append('rating', params.rating.toString());

    return this.request(`/reviews?${query.toString()}`);
  }

  async getReviewStats() {
    return this.request('/reviews/stats/summary');
  }

  async updateReviewStatus(id: string, status: string) {
    return this.request(`/reviews/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async respondToReview(id: string, response: string) {
    return this.request(`/reviews/${id}/response`, {
      method: 'POST',
      body: JSON.stringify({ response }),
    });
  }

  async deleteReview(id: string) {
    return this.request(`/reviews/${id}`, {
      method: 'DELETE',
    });
  }

  // ===========================
  // Promotions API
  // ===========================

  /**
   * Get all promotions with optional filters
   */
  async getPromotions(filters?: {
    isActive?: boolean;
    type?: string;
    search?: string;
  }): Promise<UnknownApiResponse> {
    const params = new URLSearchParams();
    if (filters?.isActive !== undefined) {
      params.append('isActive', String(filters.isActive));
    }
    if (filters?.type) {
      params.append('type', filters.type);
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }

    const queryString = params.toString();
    return this.get<unknown>(`/promotions${queryString ? '?' + queryString : ''}`);
  }

  /**
   * Get promotion by ID
   */
  async getPromotion(id: string): Promise<UnknownApiResponse> {
    return this.get<unknown>(`/promotions/${id}`);
  }

  /**
   * Get promotion by code
   */
  async getPromotionByCode(code: string): Promise<UnknownApiResponse> {
    return this.get<unknown>(`/promotions/code/${code}`);
  }

  /**
   * Validate promotion code
   */
  async validatePromotionCode(code: string, orderAmount?: number): Promise<UnknownApiResponse> {
    return this.post('/promotions/validate', { code, orderAmount });
  }

  /**
   * Get promotion statistics
   */
  async getPromotionStats(): Promise<UnknownApiResponse> {
    return this.get('/promotions/stats/public');
  }

  /**
   * Create new promotion
   */
  async createPromotion(data: {
    code: string;
    name: string;
    description?: string;
    type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING' | 'BUY_X_GET_Y';
    value: number;
    minOrderAmount?: number;
    maxDiscount?: number;
    usageLimit?: number;
    isActive?: boolean;
    startsAt?: Date;
    expiresAt?: Date;
    categories?: string[];
    products?: string[];
    customerSegments?: string[];
  }): Promise<UnknownApiResponse> {
    return this.post('/promotions', data);
  }

  /**
   * Update promotion
   */
  async updatePromotion(id: string, data: {
    code?: string;
    name?: string;
    description?: string;
    type?: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING' | 'BUY_X_GET_Y';
    value?: number;
    minOrderAmount?: number;
    maxDiscount?: number;
    usageLimit?: number;
    isActive?: boolean;
    startsAt?: Date;
    expiresAt?: Date;
    categories?: string[];
    products?: string[];
    customerSegments?: string[];
  }): Promise<UnknownApiResponse> {
    return this.put(`/promotions/${id}`, data);
  }

  /**
   * Delete promotion
   */
  async deletePromotion(id: string): Promise<UnknownApiResponse> {
    return this.delete(`/promotions/${id}`);
  }

  /**
   * Duplicate promotion
   */
  async duplicatePromotion(id: string): Promise<UnknownApiResponse> {
    return this.post(`/promotions/${id}/duplicate`, {});
  }

  /**
   * Toggle promotion active status
   */
  async togglePromotionStatus(id: string): Promise<UnknownApiResponse> {
    return this.put(`/promotions/${id}/toggle`, {});
  }

  /**
   * Apply promotion to cart with product/category filtering
   */
  async applyPromotionToCart(code: string, items: Array<{
    productId: string;
    categoryId?: string;
    quantity: number;
    priceCents: number;
  }>): Promise<UnknownApiResponse> {
    return this.post('/promotions/apply-to-cart', { code, items });
  }

  /**
   * Get promotions for specific product
   */
  async getPromotionsForProduct(productId: string, categoryId?: string): Promise<UnknownApiResponse> {
    const params = categoryId ? `?categoryId=${categoryId}` : '';
    return this.get(`/promotions/product/${productId}${params}`);
  }

  /**
   * Check if product is eligible for promotion
   */
  async checkProductEligibility(promotionId: string, productId: string, categoryId?: string): Promise<UnknownApiResponse> {
    const params = categoryId ? `?categoryId=${categoryId}` : '';
    return this.get(`/promotions/${promotionId}/eligible/${productId}${params}`);
  }

  // ===========================
  // Reports Export API
  // ===========================

  /**
   * Export sales report
   */
  async exportSalesReport(
    format: 'pdf' | 'excel' | 'csv',
    startDate?: string,
    endDate?: string
  ): Promise<Blob> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const queryString = params.toString();
    const url = `/reports/export/sales/${format}${queryString ? '?' + queryString : ''}`;

    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to export sales report: ${response.statusText}`);
    }

    return response.blob();
  }

  /**
   * Export inventory report
   */
  async exportInventoryReport(format: 'pdf' | 'excel' | 'csv'): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/reports/export/inventory/${format}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to export inventory report: ${response.statusText}`);
    }

    return response.blob();
  }

  /**
   * Export customers report
   */
  async exportCustomersReport(format: 'pdf' | 'excel' | 'csv'): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/reports/export/customers/${format}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to export customers report: ${response.statusText}`);
    }

    return response.blob();
  }

  /**
   * Export comprehensive report (Excel with multiple sheets)
   */
  async exportComprehensiveReport(): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/reports/export/comprehensive`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to export comprehensive report: ${response.statusText}`);
    }

    return response.blob();
  }

  /**
   * Download blob as file
   */
  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}


// Create and export singleton instance

export const apiClient = new ApiClient(API_BASE_URL);

// Export types
export type { ApiClient };

// Log the resolved API base URL in browser runtime to help debugging deployments
if (typeof window !== 'undefined') {
  console.info('[api-client] Resolved API_BASE_URL ->', API_BASE_URL);
}
