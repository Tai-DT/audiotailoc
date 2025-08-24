// API Versioning Examples for Audio Tài Lộc Backend
// This file demonstrates how to use the comprehensive API versioning system

import { Controller, Get, Post, Put, Delete, Query, Body } from '@nestjs/common';
import {
  ApiVersions,
  ApiVersionMin,
  ApiVersionMax,
  ApiVersionDeprecated,
  ApiVersionExperimental,
  ApiVersionBreakingChanges,
  ApiVersionNewFeatures,
  ApiVersionReplacedBy,
  ApiVersionRequiresAuth,
} from './src/modules/api-versioning/api-versioning.decorators';
import { ApiVersioningGuard } from './src/modules/api-versioning/api-versioning.guard';
import { UseGuards } from '@nestjs/common';

// Example Controller showing API versioning in action
@Controller('products')
@UseGuards(ApiVersioningGuard)
export class ProductsController {
  // Available in all versions
  @Get()
  @ApiVersions('v1', 'v1.1', 'v2')
  getProducts(@Query('search') search?: string) {
    // In v1: Basic product listing
    // In v1.1+: Basic search support
    // In v2+: AI-powered semantic search
    return {
      products: [],
      searchType: search ? 'basic' : 'none',
    };
  }

  // New endpoint only in v2
  @Get('search')
  @ApiVersionMin('v2')
  @ApiVersionExperimental()
  @ApiVersionNewFeatures('v2', [
    'AI-powered semantic search',
    'Natural language processing',
    'Multi-language support'
  ])
  searchProducts(@Query('query') query: string) {
    // Only available in v2 with AI search
    return {
      results: [],
      aiPowered: true,
      query: query,
    };
  }

  // Create product - version constraints
  @Post()
  @ApiVersionMin('v1.1')
  @ApiVersionRequiresAuth('v1.1')
  createProduct(@Body() productData: any) {
    // Requires authentication from v1.1
    return {
      product: productData,
      created: true,
    };
  }

  // Update product - with deprecation
  @Put(':id')
  @ApiVersions('v1', 'v1.1')
  @ApiVersionDeprecated('v2', 'Use PATCH method instead')
  @ApiVersionReplacedBy('/api/v2/products/:id', 'v2')
  updateProduct() {
    // Deprecated in v2, replaced by PATCH
    return { updated: true };
  }

  // Enhanced update in v2
  @Put(':id')
  @ApiVersionMin('v2')
  @ApiVersionBreakingChanges('v2', [
    'PUT method now requires full object replacement',
    'Partial updates must use PATCH method'
  ])
  updateProductV2() {
    // Full replacement required in v2
    return {
      updated: true,
      method: 'full-replacement',
    };
  }

  // Delete with sunset date
  @Delete(':id')
  @ApiVersions('v1', 'v1.1', 'v2')
  deleteProduct() {
    return { deleted: true };
  }
}

// Order Management with complex versioning
@Controller('orders')
@UseGuards(ApiVersioningGuard)
export class OrdersController {
  // Order creation with payment integration changes
  @Post()
  @ApiVersionMin('v1.1')
  @ApiVersionBreakingChanges('v2', [
    'Payment processing now requires webhook URL',
    'Order status tracking is now real-time'
  ])
  @ApiVersionNewFeatures('v2', [
    'Real-time order tracking via WebSocket',
    'Automated payment reconciliation',
    'Multi-currency support'
  ])
  createOrder(@Body() orderData: any) {
    return {
      order: orderData,
      paymentRequired: true,
      trackingEnabled: true, // v2 feature
    };
  }

  // Order status - enhanced in v2
  @Get(':id/status')
  @ApiVersions('v1', 'v1.1', 'v2')
  getOrderStatus() {
    return {
      status: 'processing',
      // v2 adds real-time updates
      realTimeUpdates: true,
    };
  }
}

// Chat system with version evolution
@Controller('chat')
@UseGuards(ApiVersioningGuard)
export class ChatController {
  // Basic chat in v1
  @Post('message')
  @ApiVersions('v1')
  sendMessage(@Body() message: any) {
    return {
      message: message,
      aiResponse: false, // No AI in v1
    };
  }

  // Enhanced chat in v1.1+
  @Post('message')
  @ApiVersionMin('v1.1')
  @ApiVersionNewFeatures('v1.1', [
    'AI-powered responses',
    'Context awareness',
    'Multi-language support'
  ])
  sendMessageV11(@Body() message: any) {
    return {
      message: message,
      aiResponse: true,
      contextAware: true,
    };
  }

  // Advanced chat in v2
  @Post('conversation')
  @ApiVersionMin('v2')
  @ApiVersionExperimental()
  @ApiVersionNewFeatures('v2', [
    'Conversation context management',
    'Voice message support',
    'File attachment handling'
  ])
  startConversation(@Body() conversationData: any) {
    return {
      conversation: conversationData,
      advancedFeatures: true,
      voiceSupport: true,
    };
  }
}

// Analytics with access control changes
@Controller('analytics')
@UseGuards(ApiVersioningGuard)
export class AnalyticsController {
  // Basic analytics - deprecated
  @Get('sales')
  @ApiVersions('v1')
  @ApiVersionDeprecated('v1.1', 'Use enhanced analytics endpoint')
  getSalesAnalytics() {
    return {
      sales: [],
      basicMetrics: true,
    };
  }

  // Enhanced analytics
  @Get('sales')
  @ApiVersionMin('v1.1')
  @ApiVersionRequiresAuth('v1.1')
  getEnhancedSalesAnalytics(@Query('period') period?: string) {
    return {
      sales: [],
      enhancedMetrics: true,
      period: period || 'monthly',
    };
  }

  // Advanced analytics in v2
  @Get('comprehensive')
  @ApiVersionMin('v2')
  @ApiVersionNewFeatures('v2', [
    'Real-time analytics',
    'Advanced filtering',
    'Export capabilities',
    'Custom dashboards'
  ])
  getComprehensiveAnalytics(@Query('filters') filters?: any) {
    return {
      analytics: [],
      realTime: true,
      filters: filters,
      exportable: true,
    };
  }
}

// Example of version-specific middleware usage
@Controller('admin')
@UseGuards(ApiVersioningGuard)
export class AdminController {
  // Admin features that evolved across versions
  @Get('dashboard')
  @ApiVersionMin('v1.1')
  @ApiVersionNewFeatures('v1.1', [
    'Admin dashboard',
    'User management',
    'System monitoring'
  ])
  getDashboard() {
    return {
      dashboard: true,
      features: ['users', 'orders', 'system'],
    };
  }

  // Advanced admin features in v2
  @Get('advanced-dashboard')
  @ApiVersionMin('v2')
  @ApiVersionExperimental()
  getAdvancedDashboard() {
    return {
      dashboard: true,
      advanced: true,
      features: ['real-time-monitoring', 'ai-insights', 'predictive-analytics'],
    };
  }
}

// Example of how to handle version-specific routing
@Controller('search')
@UseGuards(ApiVersioningGuard)
export class SearchController {
  // Legacy search in v1
  @Get()
  @ApiVersions('v1')
  @ApiVersionDeprecated('v1.1', 'Use enhanced search')
  legacySearch(@Query('q') query: string) {
    return {
      results: [],
      method: 'basic',
      query: query,
    };
  }

  // Enhanced search in v1.1
  @Get()
  @ApiVersions('v1.1')
  enhancedSearch(@Query('q') query: string, @Query('filters') filters?: any) {
    return {
      results: [],
      method: 'enhanced',
      query: query,
      filters: filters,
    };
  }

  // AI-powered search in v2
  @Get()
  @ApiVersionMin('v2')
  @ApiVersionNewFeatures('v2', [
    'AI-powered semantic search',
    'Natural language understanding',
    'Context-aware results'
  ])
  aiSearch(@Query('query') query: string, @Query('context') context?: string) {
    return {
      results: [],
      method: 'ai-powered',
      query: query,
      context: context,
      semantic: true,
    };
  }
}
