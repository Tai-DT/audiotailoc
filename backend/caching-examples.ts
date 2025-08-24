// Caching System Examples for Audio Tài Lộc Backend
// This file demonstrates comprehensive caching strategies

import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { Cache, InvalidateCacheByTags, CacheWithKey, CacheWithDynamicTTL } from './src/modules/caching/cache.decorators';
import { productTags, userTags, categoryTags, orderTags } from './src/modules/caching/cache.decorators';
import { CacheService } from './src/modules/caching/cache.service';

// Example 1: Product Service with Comprehensive Caching
export class ProductService {
  constructor(private cacheService: CacheService) {}

  // Basic caching with automatic key generation
  @Cache(3600, 'products') // Cache for 1 hour
  async getProductById(productId: string) {
    console.log(`Fetching product ${productId} from database`);
    // Simulate database query
    return {
      id: productId,
      name: `Product ${productId}`,
      price: 100,
      category: 'electronics',
      inStock: true,
    };
  }

  // Custom cache key based on query parameters
  @CacheWithKey((filters) => {
    return `products:filtered:${JSON.stringify(filters)}`;
  }, {
    ttl: 1800, // 30 minutes
    tags: ['products', 'filtered']
  })
  async getFilteredProducts(filters: any) {
    console.log('Fetching filtered products from database');
    // Simulate complex database query
    return {
      products: [],
      total: 0,
      filters: filters,
    };
  }

  // Dynamic TTL based on product popularity
  @CacheWithDynamicTTL((product) => {
    // Popular products cache longer
    return product.views > 100 ? 7200 : 1800; // 2 hours vs 30 minutes
  }, {
    keyPrefix: 'products',
    tags: (product) => productTags(product.id)
  })
  async getProductWithAnalytics(productId: string) {
    const product = await this.getProductById(productId);
    // Simulate view count from analytics
    product.views = Math.floor(Math.random() * 200);
    return product;
  }

  // Cache invalidation when product is updated
  @InvalidateCacheByTags((productId, data) => [
    ...productTags(productId),
    'products',
    `category:${data.category}`
  ])
  async updateProduct(productId: string, data: any) {
    console.log(`Updating product ${productId}`);
    // Simulate database update
    await new Promise(resolve => setTimeout(resolve, 100));

    // Clear related caches
    return { success: true, productId };
  }

  // Bulk cache operation
  async getMultipleProducts(productIds: string[]) {
    const cacheKeys = productIds.map(id => `product:${id}`);

    // Try to get all from cache first
    const cachedProducts = await this.cacheService.mget(cacheKeys, { prefix: 'products' });

    // Find which products need to be fetched from database
    const missingProducts = productIds.filter((id, index) => !cachedProducts[index]);

    if (missingProducts.length > 0) {
      console.log(`Fetching ${missingProducts.length} products from database`);

      // Fetch missing products from database
      const freshProducts = await Promise.all(
        missingProducts.map(id => this.getProductById(id))
      );

      // Cache the fresh products
      const cacheEntries = freshProducts.map(product => ({
        key: `product:${product.id}`,
        value: product,
        options: {
          ttl: 3600,
          tags: productTags(product.id),
          keyPrefix: 'products'
        }
      }));

      await this.cacheService.mset(cacheEntries);
    }

    // Combine cached and fresh products
    const allProducts = await this.cacheService.mget(cacheKeys, { prefix: 'products' });
    return allProducts.filter(Boolean);
  }
}

// Example 2: User Service with Session Caching
export class UserService {
  constructor(private cacheService: CacheService) {}

  // Cache user profile with user-specific tags
  @Cache(1800, 'users', (userId) => userTags(userId))
  async getUserProfile(userId: string) {
    console.log(`Fetching user profile ${userId} from database`);
    return {
      id: userId,
      name: `User ${userId}`,
      email: `user${userId}@example.com`,
      preferences: {
        theme: 'dark',
        language: 'vi'
      }
    };
  }

  // Cache user session data
  async getUserSession(sessionId: string) {
    const sessionKey = `session:${sessionId}`;

    return await this.cacheService.getOrSet(
      sessionKey,
      async () => {
        console.log(`Fetching session ${sessionId} from database`);
        return {
          sessionId,
          userId: 'user123',
          expiresAt: Date.now() + 3600000, // 1 hour
          data: { lastActivity: new Date() }
        };
      },
      {
        ttl: 3600, // 1 hour
        tags: ['sessions', `user:session:user123`]
      }
    );
  }

  // Update user preferences and invalidate cache
  @InvalidateCacheByTags((userId) => userTags(userId))
  async updateUserPreferences(userId: string, preferences: any) {
    console.log(`Updating preferences for user ${userId}`);
    // Simulate database update
    await new Promise(resolve => setTimeout(resolve, 50));

    return { success: true, preferences };
  }

  // Cache user permissions
  @Cache(300, 'permissions', (userId) => [`user:${userId}:permissions`, 'permissions'])
  async getUserPermissions(userId: string) {
    console.log(`Fetching permissions for user ${userId}`);
    return {
      userId,
      permissions: [
        'read:products',
        'write:orders',
        'admin:users'
      ],
      roles: ['user', 'premium']
    };
  }
}

// Example 3: Order Service with Complex Caching
export class OrderService {
  constructor(private cacheService: CacheService) {}

  // Cache order with order-specific tags
  @Cache(1800, 'orders', (orderId) => orderTags(orderId))
  async getOrderById(orderId: string) {
    console.log(`Fetching order ${orderId} from database`);
    return {
      id: orderId,
      userId: 'user123',
      products: [
        { productId: 'prod1', quantity: 2, price: 100 },
        { productId: 'prod2', quantity: 1, price: 200 }
      ],
      total: 400,
      status: 'pending',
      createdAt: new Date()
    };
  }

  // Cache order list for user
  @CacheWithKey((userId, status) => `user:${userId}:orders:status:${status || 'all'}`, {
    ttl: 600, // 10 minutes
    tags: (userId) => [`user:${userId}:orders`, 'orders']
  })
  async getUserOrders(userId: string, status?: string) {
    console.log(`Fetching orders for user ${userId}, status: ${status || 'all'}`);
    // Simulate database query with filters
    return {
      userId,
      orders: [],
      total: 0,
      status: status || 'all'
    };
  }

  // Create order and invalidate related caches
  @InvalidateCacheByTags((orderData) => [
    ...userTags(orderData.userId),
    ...orderTags(orderData.id),
    'orders'
  ])
  async createOrder(orderData: any) {
    console.log('Creating new order');
    const order = {
      id: `order_${Date.now()}`,
      ...orderData,
      status: 'pending',
      createdAt: new Date()
    };

    // Simulate database insert
    await new Promise(resolve => setTimeout(resolve, 100));

    // Cache the new order immediately
    await this.cacheService.set(
      `order:${order.id}`,
      order,
      {
        ttl: 1800,
        tags: orderTags(order.id),
        keyPrefix: 'orders'
      }
    );

    return order;
  }

  // Update order status with cache invalidation
  @InvalidateCacheByTags((orderId) => orderTags(orderId))
  async updateOrderStatus(orderId: string, status: string) {
    console.log(`Updating order ${orderId} status to ${status}`);
    // Simulate database update
    await new Promise(resolve => setTimeout(resolve, 50));

    // Update cached order if it exists
    const cachedOrder = await this.cacheService.get(`order:${orderId}`, { prefix: 'orders' });
    if (cachedOrder) {
      cachedOrder.status = status;
      await this.cacheService.set(
        `order:${orderId}`,
        cachedOrder,
        {
          ttl: 1800,
          tags: orderTags(orderId),
          keyPrefix: 'orders'
        }
      );
    }

    return { success: true, orderId, status };
  }
}

// Example 4: Category Service with Hierarchical Caching
export class CategoryService {
  constructor(private cacheService: CacheService) {}

  // Cache category tree (expensive operation)
  @Cache(3600, 'categories', ['categories', 'category_tree'])
  async getCategoryTree() {
    console.log('Building category tree from database');
    // Simulate expensive database query
    await new Promise(resolve => setTimeout(resolve, 200));

    return {
      categories: [
        {
          id: 'electronics',
          name: 'Electronics',
          children: [
            { id: 'phones', name: 'Phones' },
            { id: 'laptops', name: 'Laptops' }
          ]
        },
        {
          id: 'books',
          name: 'Books',
          children: [
            { id: 'fiction', name: 'Fiction' },
            { id: 'non-fiction', name: 'Non-Fiction' }
          ]
        }
      ]
    };
  }

  // Cache individual category
  @Cache(1800, 'categories', (categoryId) => categoryTags(categoryId))
  async getCategoryById(categoryId: string) {
    console.log(`Fetching category ${categoryId} from database`);
    return {
      id: categoryId,
      name: `Category ${categoryId}`,
      description: `Description for ${categoryId}`,
      parentId: null,
      children: []
    };
  }

  // Update category and invalidate tree cache
  @InvalidateCacheByTags((categoryId) => [
    ...categoryTags(categoryId),
    'categories',
    'category_tree'
  ])
  async updateCategory(categoryId: string, data: any) {
    console.log(`Updating category ${categoryId}`);
    // Simulate database update
    await new Promise(resolve => setTimeout(resolve, 50));

    return { success: true, categoryId, data };
  }
}

// Example 5: Search Service with AI-Powered Caching
export class SearchService {
  constructor(private cacheService: CacheService) {}

  // Cache search results with semantic understanding
  @CacheWithKey((query, filters) => {
    const keyData = { query, filters };
    return `search:semantic:${JSON.stringify(keyData)}`;
  }, {
    ttl: 900, // 15 minutes
    tags: ['search', 'semantic_search']
  })
  async semanticSearch(query: string, filters?: any) {
    console.log(`Performing semantic search for: ${query}`);

    // Simulate AI-powered search
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      query,
      results: [],
      semantic: true,
      filters: filters,
      searchId: `search_${Date.now()}`
    };
  }

  // Cache autocomplete suggestions
  @Cache(300, 'search', ['search', 'autocomplete'])
  async getAutocompleteSuggestions(prefix: string, limit: number = 10) {
    console.log(`Getting autocomplete suggestions for: ${prefix}`);

    // Simulate fast autocomplete query
    await new Promise(resolve => setTimeout(resolve, 20));

    return {
      prefix,
      suggestions: [
        `${prefix} item 1`,
        `${prefix} item 2`,
        `${prefix} item 3`
      ].slice(0, limit),
      limit
    };
  }

  // Advanced search with multiple cache strategies
  async advancedSearch(searchCriteria: any) {
    const cacheKey = `search:advanced:${JSON.stringify(searchCriteria)}`;

    return await this.cacheService.getOrSet(
      cacheKey,
      async () => {
        console.log('Performing advanced search');

        // Simulate complex search operation
        const [textResults, semanticResults, filteredResults] = await Promise.all([
          this.performTextSearch(searchCriteria.text),
          this.performSemanticSearch(searchCriteria.semantic),
          this.applyFilters(searchCriteria.filters)
        ]);

        const combinedResults = this.combineSearchResults(
          textResults,
          semanticResults,
          filteredResults
        );

        return {
          searchCriteria,
          results: combinedResults,
          facets: this.generateFacets(combinedResults),
          searchId: `advanced_${Date.now()}`
        };
      },
      {
        ttl: 1200, // 20 minutes
        tags: ['search', 'advanced_search']
      }
    );
  }

  private async performTextSearch(query: string) {
    // Simulate text search
    await new Promise(resolve => setTimeout(resolve, 100));
    return { type: 'text', results: [] };
  }

  private async performSemanticSearch(query: string) {
    // Simulate semantic search
    await new Promise(resolve => setTimeout(resolve, 200));
    return { type: 'semantic', results: [] };
  }

  private async applyFilters(filters: any) {
    // Simulate filtering
    await new Promise(resolve => setTimeout(resolve, 50));
    return { type: 'filtered', results: [] };
  }

  private combineSearchResults(...results: any[]) {
    // Simulate result combination
    return [];
  }

  private generateFacets(results: any[]) {
    // Simulate facet generation
    return {};
  }
}

// Example 6: Analytics Service with Time-Based Caching
export class AnalyticsService {
  constructor(private cacheService: CacheService) {}

  // Cache analytics data with time-based invalidation
  @CacheWithDynamicTTL((data) => {
    // Cache recent data for shorter time
    const daysSince = (Date.now() - data.date.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince < 7 ? 3600 : 86400; // 1 hour vs 24 hours
  }, {
    keyPrefix: 'analytics'
  })
  async getDailyAnalytics(date: Date) {
    console.log(`Fetching analytics for ${date.toISOString()}`);
    // Simulate analytics calculation
    await new Promise(resolve => setTimeout(resolve, 150));

    return {
      date,
      metrics: {
        users: Math.floor(Math.random() * 1000),
        orders: Math.floor(Math.random() * 100),
        revenue: Math.floor(Math.random() * 10000)
      }
    };
  }

  // Cache real-time dashboard data
  @Cache(60, 'analytics', ['analytics', 'dashboard', 'realtime'])
  async getRealtimeDashboard() {
    console.log('Fetching real-time dashboard data');
    // Simulate real-time data aggregation
    await new Promise(resolve => setTimeout(resolve, 30));

    return {
      timestamp: new Date(),
      activeUsers: Math.floor(Math.random() * 100),
      activeOrders: Math.floor(Math.random() * 20),
      recentTransactions: [],
      alerts: []
    };
  }

  // Cache historical data with longer TTL
  @Cache(86400, 'analytics', ['analytics', 'historical'])
  async getHistoricalData(startDate: Date, endDate: Date) {
    console.log(`Fetching historical data from ${startDate} to ${endDate}`);
    // Simulate historical data aggregation
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      period: { startDate, endDate },
      data: [],
      summary: {
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0
      }
    };
  }
}

// Example 7: External API Service with Fallback Caching
export class ExternalAPIService {
  constructor(private cacheService: CacheService) {}

  // Cache external API responses with fallback
  @CacheWithFallback(
    { error: 'Weather service unavailable', data: null }, // Fallback value
    { ttl: 300 } // Cache fallback for 5 minutes
  )
  async getWeatherData(city: string) {
    const response = await fetch(`https://api.weather.com/city/${city}`);

    if (!response.ok) {
      throw new Error('Weather service error');
    }

    const data = await response.json();

    // Cache successful response with weather-specific TTL
    const weatherTTL = data.weather === 'sunny' ? 3600 : 1800; // Longer for good weather

    await this.cacheService.set(
      `weather:${city}`,
      data,
      {
        ttl: weatherTTL,
        tags: ['weather', `city:${city}`]
      }
    );

    return data;
  }

  // Cache payment gateway responses
  @Cache(300, 'payments', ['payments', 'gateway'])
  async getPaymentMethods() {
    console.log('Fetching payment methods from gateway');
    // Simulate payment gateway API call
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      methods: ['VNPAY', 'MOMO', 'BANK_TRANSFER'],
      lastUpdated: new Date()
    };
  }

  // Cache currency exchange rates with short TTL
  @Cache(300, 'currency', ['currency', 'exchange'])
  async getExchangeRates() {
    console.log('Fetching exchange rates');
    // Simulate currency API call
    await new Promise(resolve => setTimeout(resolve, 50));

    return {
      rates: {
        USD: 1.0,
        VND: 24000,
        EUR: 0.85
      },
      lastUpdated: new Date()
    };
  }
}

// Example 8: Cache Warming and Maintenance
export class CacheMaintenanceService {
  constructor(private cacheService: CacheService) {}

  // Warm up cache with popular data
  async warmUpCache() {
    console.log('Starting cache warmup');

    const popularProducts = [
      { id: 'prod1', views: 150 },
      { id: 'prod2', views: 120 },
      { id: 'prod3', views: 200 }
    ];

    const cacheEntries = popularProducts.map(product => ({
      key: `product:${product.id}`,
      value: {
        id: product.id,
        name: `Popular Product ${product.id}`,
        views: product.views,
        price: Math.floor(Math.random() * 1000)
      },
      options: {
        ttl: 3600,
        tags: productTags(product.id)
      }
    }));

    const warmed = await this.cacheService.warmUp(cacheEntries);
    console.log(`Cache warmup completed: ${warmed} entries`);

    return { warmed };
  }

  // Clean up expired entries
  async cleanupExpiredEntries() {
    // Redis automatically handles expiration, but we can implement custom cleanup
    const stats = this.cacheService.getStats();
    console.log('Cache stats:', stats);

    // Clean up old correlation contexts if using logging system
    // This would integrate with the correlation service

    return { stats };
  }

  // Get cache performance report
  async getCachePerformanceReport() {
    const stats = this.cacheService.getStats();
    const analytics = await this.cacheService.getAnalytics();

    const report = {
      performance: {
        hitRate: stats.hitRate,
        totalRequests: stats.totalRequests,
        hits: stats.hits,
        misses: stats.misses
      },
      redis: analytics?.redis || {},
      cache: analytics?.cache || {},
      recommendations: this.generateRecommendations(stats)
    };

    return report;
  }

  private generateRecommendations(stats: any) {
    const recommendations = [];

    if (stats.hitRate < 70) {
      recommendations.push('Consider increasing cache TTL for frequently accessed data');
    }

    if (stats.hitRate > 95) {
      recommendations.push('Cache hit rate is excellent, consider optimizing cache memory usage');
    }

    if (stats.totalRequests < 100) {
      recommendations.push('Low cache usage, ensure caching is properly implemented');
    }

    return recommendations;
  }
}
