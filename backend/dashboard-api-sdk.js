/**
 * Audio Tài Lộc Dashboard API SDK
 * JavaScript/TypeScript SDK for easy integration with dashboard APIs
 * 
 * Usage:
 * import { DashboardAPI } from './dashboard-api-sdk.js';
 * 
 * const api = new DashboardAPI({
 *   baseURL: 'https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/api/v1',
 *   token: 'your-jwt-token'
 * });
 * 
 * const dashboard = await api.admin.getDashboard();
 */

class DashboardAPI {
  constructor(config = {}) {
    this.baseURL = config.baseURL || 'https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/api/v1';
    this.token = config.token;
    this.timeout = config.timeout || 30000;
    
    // Initialize endpoint groups
    this.admin = new AdminEndpoints(this);
    this.analytics = new AnalyticsEndpoints(this);
    this.health = new HealthEndpoints(this);
  }

  /**
   * Set authentication token
   * @param {string} token - JWT token
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * Generic HTTP request method
   * @param {string} method - HTTP method
   * @param {string} path - API path
   * @param {object} options - Request options
   */
  async request(method, path, options = {}) {
    const url = `${this.baseURL}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token && options.requireAuth !== false) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      method,
      headers,
      ...options.fetchOptions
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    if (options.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(`${key}[]`, v));
        } else if (value !== undefined && value !== null) {
          searchParams.append(key, value);
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      config.signal = controller.signal;
      
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new APIError(data.error?.message || 'Request failed', response.status, data.error?.code);
      }
      
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new APIError('Request timeout', 408, 'TIMEOUT');
      }
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(path, params = {}, options = {}) {
    return this.request('GET', path, { params, ...options });
  }

  /**
   * POST request
   */
  async post(path, body = {}, options = {}) {
    return this.request('POST', path, { body, ...options });
  }

  /**
   * PUT request
   */
  async put(path, body = {}, options = {}) {
    return this.request('PUT', path, { body, ...options });
  }

  /**
   * DELETE request
   */
  async delete(path, options = {}) {
    return this.request('DELETE', path, options);
  }
}

/**
 * Admin Dashboard Endpoints
 */
class AdminEndpoints {
  constructor(api) {
    this.api = api;
  }

  /**
   * Get admin dashboard overview
   * @param {object} options - Query options
   * @param {string} options.startDate - Start date (ISO format)
   * @param {string} options.endDate - End date (ISO format)
   */
  async getDashboard(options = {}) {
    return this.api.get('/admin/dashboard', options);
  }

  /**
   * Get user statistics
   * @param {number} days - Number of days to analyze (default: 30)
   */
  async getUserStats(days = 30) {
    return this.api.get('/admin/stats/users', { days });
  }

  /**
   * Get order statistics  
   * @param {number} days - Number of days to analyze (default: 30)
   */
  async getOrderStats(days = 30) {
    return this.api.get('/admin/stats/orders', { days });
  }

  /**
   * Get product statistics
   */
  async getProductStats() {
    return this.api.get('/admin/stats/products');
  }

  /**
   * Perform bulk action on entities
   * @param {string} action - Action to perform (delete, activate, deactivate, export)
   * @param {string[]} ids - Array of entity IDs
   * @param {string} type - Entity type (users, products, orders)
   */
  async bulkAction(action, ids, type) {
    return this.api.post('/admin/bulk-action', { action, ids, type });
  }

  /**
   * Get system status
   */
  async getSystemStatus() {
    return this.api.get('/admin/system/status');
  }

  /**
   * Get activity logs
   * @param {object} options - Query options
   * @param {string} options.type - Log type filter
   * @param {number} options.limit - Number of logs to retrieve (default: 100)
   */
  async getActivityLogs(options = {}) {
    return this.api.get('/admin/logs/activity', options);
  }
}

/**
 * Analytics Endpoints
 */
class AnalyticsEndpoints {
  constructor(api) {
    this.api = api;
  }

  /**
   * Get analytics dashboard data
   * @param {object} filters - Analytics filters
   */
  async getDashboard(filters = {}) {
    return this.api.get('/analytics/dashboard', filters);
  }

  /**
   * Get sales metrics
   * @param {object} filters - Analytics filters
   */
  async getSales(filters = {}) {
    return this.api.get('/analytics/sales', filters);
  }

  /**
   * Get customer metrics
   * @param {object} filters - Analytics filters
   */
  async getCustomers(filters = {}) {
    return this.api.get('/analytics/customers', filters);
  }

  /**
   * Get inventory metrics
   * @param {object} filters - Analytics filters
   */
  async getInventory(filters = {}) {
    return this.api.get('/analytics/inventory', filters);
  }

  /**
   * Get business KPIs
   * @param {object} filters - Analytics filters
   */
  async getKPIs(filters = {}) {
    return this.api.get('/analytics/kpis', filters);
  }

  /**
   * Export analytics data
   * @param {string} type - Export type (sales, customers, inventory, all)
   * @param {string} format - Export format (csv, excel, pdf)
   * @param {object} filters - Analytics filters
   */
  async export(type, format = 'csv', filters = {}) {
    return this.api.get(`/analytics/export/${type}`, { format, ...filters });
  }

  /**
   * Get real-time sales data
   */
  async getRealTimeSales() {
    return this.api.get('/analytics/realtime/sales');
  }

  /**
   * Get real-time orders data
   */
  async getRealTimeOrders() {
    return this.api.get('/analytics/realtime/orders');
  }
}

/**
 * Health Monitoring Endpoints
 */
class HealthEndpoints {
  constructor(api) {
    this.api = api;
  }

  /**
   * Basic health check
   */
  async basic() {
    return this.api.get('/health', {}, { requireAuth: false });
  }

  /**
   * Detailed health check
   */
  async detailed() {
    return this.api.get('/health/detailed', {}, { requireAuth: false });
  }

  /**
   * Database health check
   */
  async database() {
    return this.api.get('/health/database', {}, { requireAuth: false });
  }

  /**
   * Performance metrics
   */
  async performance() {
    return this.api.get('/health/performance', {}, { requireAuth: false });
  }

  /**
   * System information
   */
  async system() {
    return this.api.get('/health/system', {}, { requireAuth: false });
  }

  /**
   * Memory usage
   */
  async memory() {
    return this.api.get('/health/memory', {}, { requireAuth: false });
  }

  /**
   * Uptime information
   */
  async uptime() {
    return this.api.get('/health/uptime', {}, { requireAuth: false });
  }

  /**
   * Application metrics
   */
  async metrics() {
    return this.api.get('/health/metrics', {}, { requireAuth: false });
  }

  /**
   * Active alerts
   */
  async alerts() {
    return this.api.get('/health/alerts', {}, { requireAuth: false });
  }
}

/**
 * Custom API Error class
 */
class APIError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
  }
}

/**
 * Dashboard Widget Manager
 * Utility class to manage dashboard widgets with automatic refresh
 */
class DashboardWidgetManager {
  constructor(api) {
    this.api = api;
    this.widgets = new Map();
    this.intervals = new Map();
  }

  /**
   * Register a widget with auto-refresh
   * @param {string} id - Widget ID
   * @param {string} endpoint - API endpoint
   * @param {function} callback - Callback function to handle data
   * @param {number} refreshInterval - Refresh interval in ms (default: 5 minutes)
   * @param {object} params - API parameters
   */
  registerWidget(id, endpoint, callback, refreshInterval = 300000, params = {}) {
    this.widgets.set(id, {
      endpoint,
      callback,
      params,
      refreshInterval
    });

    // Initial load
    this.refreshWidget(id);

    // Setup auto-refresh
    if (refreshInterval > 0) {
      const intervalId = setInterval(() => {
        this.refreshWidget(id);
      }, refreshInterval);
      this.intervals.set(id, intervalId);
    }
  }

  /**
   * Refresh a specific widget
   * @param {string} id - Widget ID
   */
  async refreshWidget(id) {
    const widget = this.widgets.get(id);
    if (!widget) return;

    try {
      let data;
      const { endpoint, params } = widget;

      // Route to appropriate API method
      if (endpoint.startsWith('/admin/')) {
        if (endpoint === '/admin/dashboard') {
          data = await this.api.admin.getDashboard(params);
        } else if (endpoint === '/admin/stats/users') {
          data = await this.api.admin.getUserStats(params.days);
        } else if (endpoint === '/admin/stats/orders') {
          data = await this.api.admin.getOrderStats(params.days);
        } else if (endpoint === '/admin/stats/products') {
          data = await this.api.admin.getProductStats();
        } else if (endpoint === '/admin/system/status') {
          data = await this.api.admin.getSystemStatus();
        }
      } else if (endpoint.startsWith('/analytics/')) {
        if (endpoint === '/analytics/dashboard') {
          data = await this.api.analytics.getDashboard(params);
        } else if (endpoint === '/analytics/sales') {
          data = await this.api.analytics.getSales(params);
        } else if (endpoint === '/analytics/customers') {
          data = await this.api.analytics.getCustomers(params);
        } else if (endpoint === '/analytics/inventory') {
          data = await this.api.analytics.getInventory(params);
        } else if (endpoint === '/analytics/kpis') {
          data = await this.api.analytics.getKPIs(params);
        } else if (endpoint === '/analytics/realtime/sales') {
          data = await this.api.analytics.getRealTimeSales();
        } else if (endpoint === '/analytics/realtime/orders') {
          data = await this.api.analytics.getRealTimeOrders();
        }
      }

      // Call the callback with the data
      widget.callback(data, null);
    } catch (error) {
      console.error(`Error refreshing widget ${id}:`, error);
      widget.callback(null, error);
    }
  }

  /**
   * Unregister a widget and stop auto-refresh
   * @param {string} id - Widget ID
   */
  unregisterWidget(id) {
    const intervalId = this.intervals.get(id);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete(id);
    }
    this.widgets.delete(id);
  }

  /**
   * Stop all auto-refresh intervals
   */
  destroy() {
    this.intervals.forEach(intervalId => clearInterval(intervalId));
    this.intervals.clear();
    this.widgets.clear();
  }
}

/**
 * Analytics Filter Builder
 * Utility class to build analytics filters
 */
class AnalyticsFilterBuilder {
  constructor() {
    this.filters = {};
  }

  /**
   * Set date range
   * @param {string|Date} startDate - Start date
   * @param {string|Date} endDate - End date
   */
  dateRange(startDate, endDate) {
    if (startDate) {
      this.filters.startDate = startDate instanceof Date ? startDate.toISOString() : startDate;
    }
    if (endDate) {
      this.filters.endDate = endDate instanceof Date ? endDate.toISOString() : endDate;
    }
    return this;
  }

  /**
   * Filter by products
   * @param {string[]} productIds - Array of product IDs
   */
  products(productIds) {
    this.filters.productIds = productIds;
    return this;
  }

  /**
   * Filter by categories
   * @param {string[]} categoryIds - Array of category IDs
   */
  categories(categoryIds) {
    this.filters.categoryIds = categoryIds;
    return this;
  }

  /**
   * Filter by customer segment
   * @param {string} segment - Customer segment
   */
  customerSegment(segment) {
    this.filters.customerSegment = segment;
    return this;
  }

  /**
   * Filter by region
   * @param {string} region - Region
   */
  region(region) {
    this.filters.region = region;
    return this;
  }

  /**
   * Filter by channel
   * @param {string} channel - Sales channel
   */
  channel(channel) {
    this.filters.channel = channel;
    return this;
  }

  /**
   * Build the filters object
   */
  build() {
    return { ...this.filters };
  }

  /**
   * Reset all filters
   */
  reset() {
    this.filters = {};
    return this;
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS
  module.exports = {
    DashboardAPI,
    DashboardWidgetManager,
    AnalyticsFilterBuilder,
    APIError
  };
} else if (typeof define === 'function' && define.amd) {
  // AMD
  define([], function() {
    return {
      DashboardAPI,
      DashboardWidgetManager,
      AnalyticsFilterBuilder,
      APIError
    };
  });
} else {
  // Browser globals
  window.DashboardAPI = DashboardAPI;
  window.DashboardWidgetManager = DashboardWidgetManager;
  window.AnalyticsFilterBuilder = AnalyticsFilterBuilder;
  window.APIError = APIError;
}

// TypeScript definitions (if using TypeScript)
/*
interface APIConfig {
  baseURL?: string;
  token?: string;
  timeout?: number;
}

interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  productIds?: string[];
  categoryIds?: string[];
  customerSegment?: string;
  region?: string;
  channel?: string;
}

interface BulkActionPayload {
  action: 'delete' | 'activate' | 'deactivate' | 'export';
  ids: string[];
  type: 'users' | 'products' | 'orders';
}

interface DashboardOverview {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  newUsers: number;
  newOrders: number;
  pendingOrders: number;
  lowStockProducts: number;
}
*/
