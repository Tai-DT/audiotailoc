#!/usr/bin/env node

/**
 * Audio Tài Lộc - API Smoke Test Script
 * Sử dụng để kiểm tra API endpoints trước khi phát triển frontend
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3010';
const API_TOKEN = process.env.API_TOKEN || '';

class APITester {
  constructor(baseUrl, token = '') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.token = token;
    this.results = [];
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
      const url = `${this.baseUrl}${endpoint}`;
      const isHttps = url.startsWith('https://');

      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(this.token && { 'Authorization': `Bearer ${this.token}` })
        }
      };

      const req = (isHttps ? https : http).request(url, options, (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          try {
            const response = {
              endpoint,
              method,
              status: res.statusCode,
              headers: res.headers,
              data: body ? JSON.parse(body) : null,
              timestamp: new Date().toISOString()
            };
            resolve(response);
          } catch (e) {
            resolve({
              endpoint,
              method,
              status: res.statusCode,
              error: 'Invalid JSON response',
              rawBody: body,
              timestamp: new Date().toISOString()
            });
          }
        });
      });

      req.on('error', (err) => {
        resolve({
          endpoint,
          method,
          error: err.message,
          timestamp: new Date().toISOString()
        });
      });

      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        req.write(JSON.stringify(data));
      }

      req.setTimeout(10000, () => {
        req.destroy();
        resolve({
          endpoint,
          method,
          error: 'Request timeout',
          timestamp: new Date().toISOString()
        });
      });

      req.end();
    });
  }

  async testEndpoint(name, endpoint, method = 'GET', data = null, expectedStatus = 200) {
    console.log(`🔍 Testing ${name}: ${method} ${endpoint}`);

    const result = await this.makeRequest(endpoint, method, data);
    this.results.push({ name, ...result });

    const status = result.status || 'ERROR';
    const success = status === expectedStatus;

    console.log(`   Status: ${status} ${success ? '✅' : '❌'}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }

    return result;
  }

  async runSmokeTests() {
    console.log('🚀 Starting Audio Tài Lộc API Smoke Tests\n');
    console.log(`Base URL: ${this.baseUrl}`);
    console.log(`Token: ${this.token ? 'Present' : 'Not set'}\n`);

    // Health Check
    await this.testEndpoint('Health Check', '/api/v1/health');

    // Auth endpoints (if no token)
    if (!this.token) {
      await this.testEndpoint('Auth Status', '/api/v1/auth/status');
    }

    // Catalog endpoints
    await this.testEndpoint('List Categories', '/api/v1/catalog/categories');
    await this.testEndpoint('List Products', '/api/v1/catalog/products?limit=5');
    await this.testEndpoint('List Services', '/api/v1/catalog/services');

    // Sample entity endpoints (may require auth)
    await this.testEndpoint('Get Product Details', '/api/v1/catalog/products/1', 'GET', null, [200, 404]);
    await this.testEndpoint('Get Category Details', '/api/v1/catalog/categories/1', 'GET', null, [200, 404]);

    // Orders (may require auth)
    await this.testEndpoint('List Orders', '/api/v1/orders', 'GET', null, [200, 401, 403]);

    // Users (may require auth)
    await this.testEndpoint('List Users', '/api/v1/users', 'GET', null, [200, 401, 403]);

    this.generateReport();
  }

  generateReport() {
    console.log('\n📊 SMOKE TEST REPORT');
    console.log('='.repeat(50));

    const successCount = this.results.filter(r => r.status === 200 || r.status === 201).length;
    const totalCount = this.results.length;

    console.log(`\n✅ Successful: ${successCount}/${totalCount}`);
    console.log(`❌ Failed: ${totalCount - successCount}/${totalCount}`);

    console.log('\n📋 Detailed Results:');
    this.results.forEach((result, index) => {
      const status = result.status || 'ERROR';
      const success = status === 200 || status === 201;
      console.log(`${index + 1}. ${result.name}: ${status} ${success ? '✅' : '❌'}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });

    console.log('\n🔗 API Endpoints Summary:');
    console.log(`Base URL: ${this.baseUrl}`);
    console.log('Swagger: ${this.baseUrl}/api');
    console.log('Health: ${this.baseUrl}/api/v1/health');

    // Save to file
    const fs = require('fs');
    const report = {
      timestamp: new Date().toISOString(),
      baseUrl: this.baseUrl,
      results: this.results,
      summary: {
        total: totalCount,
        successful: successCount,
        failed: totalCount - successCount
      }
    };

    fs.writeFileSync('smoke-test-report.json', JSON.stringify(report, null, 2));
    console.log('\n💾 Report saved to: smoke-test-report.json');
  }
}

// Run if called directly
if (require.main === module) {
  const tester = new APITester(BASE_URL, API_TOKEN);
  tester.runSmokeTests().catch(console.error);
}

module.exports = APITester;
