#!/usr/bin/env node

/**
 * 🧪 API Endpoints Test Script
 * Tests all available API endpoints for stability and functionality
 */

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:8000/api/v1';

// Test endpoints configuration
const endpoints = [
  // Core endpoints
  { path: '/', method: 'GET', name: 'API Root' },
  { path: '/health', method: 'GET', name: 'Health Check' },
  { path: '/auth/status', method: 'GET', name: 'Auth Status' },
  
  // Authentication endpoints
  { path: '/auth/register', method: 'POST', name: 'User Registration', body: { email: 'test@example.com', password: 'test123', name: 'Test User' } },
  { path: '/auth/login', method: 'POST', name: 'User Login', body: { email: 'test@example.com', password: 'test123' } },
  { path: '/auth/me', method: 'GET', name: 'Current User' },
  
  // User management endpoints
  { path: '/users', method: 'GET', name: 'List Users' },
  { path: '/users/profile', method: 'GET', name: 'User Profile' },
  { path: '/users/stats/overview', method: 'GET', name: 'User Stats Overview' },
  { path: '/users/stats/activity', method: 'GET', name: 'User Activity Stats' },
  
  // AI endpoints
  { path: '/ai/health', method: 'GET', name: 'AI Health Check' },
  { path: '/ai/capabilities', method: 'GET', name: 'AI Capabilities' },
  { path: '/ai/chat', method: 'POST', name: 'AI Chat', body: { message: 'Hello, how are you?' } },
  { path: '/ai/search', method: 'GET', name: 'AI Search' },
  { path: '/ai/chat-sessions', method: 'GET', name: 'Chat Sessions' },
  
  // Catalog endpoints
  { path: '/catalog/products', method: 'GET', name: 'List Products' },
  { path: '/catalog/categories', method: 'GET', name: 'List Categories' },
  
  // Search endpoints
  { path: '/search/products', method: 'GET', name: 'Search Products' },
  { path: '/search/services', method: 'GET', name: 'Search Services' },
  { path: '/search/global', method: 'GET', name: 'Global Search' },
  { path: '/search/suggestions', method: 'GET', name: 'Search Suggestions' },
  { path: '/search/popular', method: 'GET', name: 'Popular Searches' },
  { path: '/search/history', method: 'GET', name: 'Search History' },
  { path: '/search/filters', method: 'GET', name: 'Available Filters' },
  
  // File management endpoints
  { path: '/files', method: 'GET', name: 'List Files' },
  
  // Support endpoints
  { path: '/support/kb/articles', method: 'GET', name: 'Knowledge Base Articles' },
  { path: '/support/kb/categories', method: 'GET', name: 'KB Categories' },
  { path: '/support/faq', method: 'GET', name: 'FAQ List' },
  { path: '/support/tickets', method: 'GET', name: 'Support Tickets' },
];

// Test results storage
const results = {
  passed: 0,
  failed: 0,
  errors: [],
  details: []
};

/**
 * Test a single endpoint
 */
async function testEndpoint(endpoint) {
  const url = `${API_BASE}${endpoint.path}`;
  const options = {
    method: endpoint.method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  if (endpoint.body) {
    options.body = JSON.stringify(endpoint.body);
  }

  try {
    const startTime = Date.now();
    const response = await fetch(url, options);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const result = {
      endpoint: endpoint.name,
      path: endpoint.path,
      method: endpoint.method,
      status: response.status,
      statusText: response.statusText,
      responseTime: `${responseTime}ms`,
      success: response.ok,
      url: url
    };

    if (response.ok) {
      try {
        const data = await response.json();
        result.data = data;
      } catch (e) {
        result.data = 'Non-JSON response';
      }
    } else {
      result.error = `HTTP ${response.status}: ${response.statusText}`;
    }

    return result;
  } catch (error) {
    return {
      endpoint: endpoint.name,
      path: endpoint.path,
      method: endpoint.method,
      status: 'ERROR',
      statusText: error.message,
      responseTime: 'N/A',
      success: false,
      url: url,
      error: error.message
    };
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🧪 API Endpoints Test Script');
  console.log('============================\n');
  console.log(`Testing ${endpoints.length} endpoints...\n`);

  for (const endpoint of endpoints) {
    console.log(`Testing: ${endpoint.name} (${endpoint.method} ${endpoint.path})`);
    const result = await testEndpoint(endpoint);
    
    if (result.success) {
      console.log(`  ✅ ${result.status} - ${result.responseTime}`);
      results.passed++;
    } else {
      console.log(`  ❌ ${result.status} - ${result.error || result.statusText}`);
      results.failed++;
      results.errors.push(result);
    }
    
    results.details.push(result);
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Print summary
  console.log('\n📊 Test Results Summary');
  console.log('=======================');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / endpoints.length) * 100).toFixed(1)}%`);

  if (results.failed > 0) {
    console.log('\n❌ Failed Endpoints:');
    results.errors.forEach(error => {
      console.log(`  - ${error.endpoint}: ${error.error || error.statusText}`);
    });
  }

  // Save detailed results
  const fs = require('fs');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFile = `api-endpoints-test-report-${timestamp}.json`;
  
  fs.writeFileSync(reportFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      total: endpoints.length,
      passed: results.passed,
      failed: results.failed,
      successRate: ((results.passed / endpoints.length) * 100).toFixed(1) + '%'
    },
    details: results.details,
    errors: results.errors
  }, null, 2));

  console.log(`\n📄 Detailed report saved: ${reportFile}`);
  
  return results;
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testEndpoint };
