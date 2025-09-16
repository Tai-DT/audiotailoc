#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:3010/api/v1';

// Test endpoints for each module
const testEndpoints = [
  // Health endpoints
  { path: '/health', method: 'GET', description: 'Basic Health Check' },
  { path: '/health/uptime', method: 'GET', description: 'Uptime Check' },
  { path: '/health/version', method: 'GET', description: 'Version Info' },
  
  // Root endpoint
  { path: '/', method: 'GET', description: 'Root Endpoint' },
  
  // Users endpoints
  { path: '/users', method: 'GET', description: 'List Users (Admin)' },
  { path: '/users/stats/overview', method: 'GET', description: 'User Stats' },
  
  // Catalog endpoints
  { path: '/catalog/products', method: 'GET', description: 'List Products' },
  { path: '/catalog/categories', method: 'GET', description: 'List Categories' },
  { path: '/catalog/featured', method: 'GET', description: 'Featured Products' },
  
  // Orders endpoints
  { path: '/orders', method: 'GET', description: 'List Orders' },
  { path: '/orders/stats', method: 'GET', description: 'Order Stats' },
  
  // Services endpoints
  { path: '/services', method: 'GET', description: 'List Services' },
  { path: '/services/categories', method: 'GET', description: 'Service Categories' },
  
  // Cart endpoints
  { path: '/cart', method: 'GET', description: 'Cart Info' },
  
  // Payments endpoints
  { path: '/payments/methods', method: 'GET', description: 'Payment Methods' },
  
  // Auth endpoints
  { path: '/auth/login', method: 'POST', description: 'Login', data: { email: 'test@example.com', password: 'password' } },
  
  // Search endpoints
  { path: '/search', method: 'GET', description: 'Search', params: { q: 'test' } },
  
  // Files endpoints
  { path: '/files', method: 'GET', description: 'List Files' },
  
  // Notifications endpoints
  { path: '/notifications', method: 'GET', description: 'List Notifications' },
  
  // Support endpoints
  { path: '/support/tickets', method: 'GET', description: 'Support Tickets' },
  
  // Analytics endpoints
  { path: '/analytics/overview', method: 'GET', description: 'Analytics Overview' },
  
  // Admin endpoints
  { path: '/admin/dashboard', method: 'GET', description: 'Admin Dashboard' },
  
  // Monitoring endpoints
  { path: '/monitoring/metrics', method: 'GET', description: 'Monitoring Metrics' },
  
  // Testing endpoints
  { path: '/testing/health', method: 'GET', description: 'Testing Health' },
  
  // Backup endpoints
  { path: '/backup/status', method: 'GET', description: 'Backup Status' },
  
  // Webhooks endpoints
  { path: '/webhooks', method: 'GET', description: 'Webhooks List' },
  
  // AI endpoints
  { path: '/ai/chat', method: 'POST', description: 'AI Chat', data: { message: 'Hello' } },
  
  // Maps endpoints
  { path: '/maps/locations', method: 'GET', description: 'Map Locations' },
  
  // Promotions endpoints
  { path: '/promotions', method: 'GET', description: 'List Promotions' },
  
  // Inventory endpoints
  { path: '/inventory', method: 'GET', description: 'Inventory Status' },
  
  // Technicians endpoints
  { path: '/technicians', method: 'GET', description: 'List Technicians' },
  
  // Projects endpoints
  { path: '/projects', method: 'GET', description: 'List Projects' },
  
  // Pages endpoints
  { path: '/pages', method: 'GET', description: 'List Pages' },
  
  // Chat endpoints
  { path: '/chat/sessions', method: 'GET', description: 'Chat Sessions' },
  
  // Customer endpoints
  { path: '/customer/profile', method: 'GET', description: 'Customer Profile' },
  
  // Checkout endpoints
  { path: '/checkout/cart', method: 'GET', description: 'Checkout Cart' },
  
  // Customer Insights endpoints
  { path: '/customer-insights/overview', method: 'GET', description: 'Customer Insights' },
  
  // Data Collection endpoints
  { path: '/data-collection/events', method: 'GET', description: 'Data Collection Events' },
  
  // Documentation endpoints
  { path: '/documentation', method: 'GET', description: 'API Documentation' },
  
  // Graceful Shutdown endpoints
  { path: '/graceful-shutdown/status', method: 'GET', description: 'Graceful Shutdown Status' },
  
  // API Versioning endpoints
  { path: '/api-versioning/info', method: 'GET', description: 'API Versioning Info' },
  
  // I18n endpoints
  { path: '/i18n/languages', method: 'GET', description: 'Available Languages' },
  
  // Integrations endpoints
  { path: '/integrations/status', method: 'GET', description: 'Integrations Status' },
  
  // Logger endpoints
  { path: '/logger/status', method: 'GET', description: 'Logger Status' },
  
  // Logging endpoints
  { path: '/logging/status', method: 'GET', description: 'Logging Status' },
  
  // Marketing endpoints
  { path: '/marketing/campaigns', method: 'GET', description: 'Marketing Campaigns' },
  
  // SEO endpoints
  { path: '/seo/meta', method: 'GET', description: 'SEO Meta Tags' },
  
  // Security endpoints
  { path: '/security/status', method: 'GET', description: 'Security Status' },
  
  // System endpoints
  { path: '/system/info', method: 'GET', description: 'System Information' },
  
  // Booking endpoints
  { path: '/booking/slots', method: 'GET', description: 'Booking Slots' },
  
  // Cache endpoints
  { path: '/cache/status', method: 'GET', description: 'Cache Status' },
  
  // Caching endpoints
  { path: '/caching/status', method: 'GET', description: 'Caching Status' },
];

async function testEndpoint(endpoint) {
  try {
    const config = {
      method: endpoint.method,
      url: `${BASE_URL}${endpoint.path}`,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (endpoint.params) {
      config.params = endpoint.params;
    }

    if (endpoint.data) {
      config.data = endpoint.data;
    }

    const response = await axios(config);
    
    return {
      success: true,
      status: response.status,
      description: endpoint.description,
      path: endpoint.path,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 'ERROR',
      description: endpoint.description,
      path: endpoint.path,
      error: error.response?.data?.message || error.message
    };
  }
}

async function testAllModules() {
  console.log('🚀 Testing all modules and endpoints...\n');
  console.log(`Base URL: ${BASE_URL}\n`);
  
  const results = [];
  
  for (const endpoint of testEndpoints) {
    console.log(`Testing: ${endpoint.description} (${endpoint.method} ${endpoint.path})`);
    const result = await testEndpoint(endpoint);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ ${result.status} - ${result.description}`);
    } else {
      console.log(`❌ ${result.status} - ${result.description}: ${result.error}`);
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Summary
  console.log('\n📊 Test Summary:');
  console.log('================');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  console.log(`📈 Success Rate: ${((successful.length / results.length) * 100).toFixed(1)}%`);
  
  if (failed.length > 0) {
    console.log('\n❌ Failed Endpoints:');
    failed.forEach(f => {
      console.log(`  - ${f.path}: ${f.error}`);
    });
  }
  
  console.log('\n✅ Working Endpoints:');
  successful.forEach(s => {
    console.log(`  - ${s.path} (${s.status})`);
  });
  
  return results;
}

// Run the tests
testAllModules().catch(console.error);
