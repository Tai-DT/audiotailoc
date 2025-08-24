// API Client Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
const API_DOCS_URL = process.env.NEXT_PUBLIC_API_DOCS_URL || 'http://localhost:8000/docs'
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'

// API Client Class
export class ApiClient {
  private baseUrl: string
  private headers: Record<string, string>

  constructor() {
    this.baseUrl = API_BASE_URL
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }

  // Set authentication token if available
  setAuthToken(token: string) {
    this.headers['Authorization'] = `Bearer ${token}`
  }

  // Remove authentication token
  clearAuthToken() {
    delete this.headers['Authorization']
  }

  // Generic GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key].toString())
        }
      })
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.headers,
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Generic POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.headers,
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Generic PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.headers,
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Generic DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Health check endpoint
  async healthCheck() {
    return this.get('/shutdown/health')
  }

  // Get system metrics
  async getSystemMetrics() {
    return this.get('/monitoring/metrics')
  }

  // Get users with pagination and filters
  async getUsers(params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
    status?: string
  }) {
    return this.get('/users', params)
  }

  // Get single user
  async getUser(id: string) {
    return this.get(`/users/${id}`)
  }

  // Create user
  async createUser(userData: any) {
    return this.post('/users', userData)
  }

  // Update user
  async updateUser(id: string, userData: any) {
    return this.put(`/users/${id}`, userData)
  }

  // Delete user
  async deleteUser(id: string) {
    return this.delete(`/users/${id}`)
  }

  // Get products with pagination and filters
  async getProducts(params?: {
    page?: number
    limit?: number
    search?: string
    category?: string
    status?: string
  }) {
    return this.get('/products', params)
  }

  // Get single product
  async getProduct(id: string) {
    return this.get(`/products/${id}`)
  }

  // Create product
  async createProduct(productData: any) {
    return this.post('/products', productData)
  }

  // Update product
  async updateProduct(id: string, productData: any) {
    return this.put(`/products/${id}`, productData)
  }

  // Delete product
  async deleteProduct(id: string) {
    return this.delete(`/products/${id}`)
  }

  // Get orders with pagination and filters
  async getOrders(params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    paymentStatus?: string
    dateFrom?: string
    dateTo?: string
  }) {
    return this.get('/orders', params)
  }

  // Get single order
  async getOrder(id: string) {
    return this.get(`/orders/${id}`)
  }

  // Update order status
  async updateOrderStatus(id: string, status: string) {
    return this.put(`/orders/${id}/status`, { status })
  }

  // Get backup information
  async getBackupInfo() {
    return this.get('/backup/info')
  }

  // Create backup
  async createBackup(type: 'full' | 'incremental' = 'full') {
    return this.post('/backup/create', { type })
  }

  // Get backup history
  async getBackupHistory() {
    return this.get('/backup/history')
  }

  // Restore from backup
  async restoreBackup(backupId: string) {
    return this.post('/backup/restore', { backupId })
  }

  // Get security events
  async getSecurityEvents(params?: {
    page?: number
    limit?: number
    severity?: string
    type?: string
    dateFrom?: string
    dateTo?: string
  }) {
    return this.get('/security/events', params)
  }

  // Get security statistics
  async getSecurityStats() {
    return this.get('/security/stats')
  }

  // Get system logs
  async getSystemLogs(params?: {
    page?: number
    limit?: number
    level?: string
    service?: string
    dateFrom?: string
    dateTo?: string
  }) {
    return this.get('/logs', params)
  }

  // Get API documentation info
  async getApiDocs() {
    return this.get('/docs')
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Configuration object for easy access
export const apiConfig = {
  baseUrl: API_BASE_URL,
  docsUrl: API_DOCS_URL,
  wsUrl: WS_URL,
}

// Error handling utility
export class ApiError extends Error {
  public status: number
  public data?: any

  constructor(status: number, message: string, data?: any) {
    super(message)
    this.status = status
    this.data = data
    this.name = 'ApiError'
  }
}

// Response type helpers
export interface ApiResponse<T> {
  data: T
  meta?: {
    total?: number
    page?: number
    limit?: number
    totalPages?: number
  }
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
