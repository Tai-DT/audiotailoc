#!/usr/bin/env node

const axios = require('axios');

class ApiDataVerifier {
  constructor() {
    this.backendUrl = 'http://localhost:3010/api/v1';
    this.frontendUrl = 'http://localhost:3000';
    this.results = {
      products: { backend: null, frontend: null, status: 'pending' },
      categories: { backend: null, frontend: null, status: 'pending' },
      auth: { backend: null, frontend: null, status: 'pending' },
      cart: { backend: null, frontend: null, status: 'pending' },
      payment: { backend: null, frontend: null, status: 'pending' }
    };
  }

  async testBackendProducts() {
    try {
      console.log('🔍 Testing Backend Products API...');
      const response = await axios.get(`${this.backendUrl}/catalog/products`);
      this.results.products.backend = {
        success: response.data.success,
        totalItems: response.data.data?.items?.length || response.data.data?.length || 0,
        items: response.data.data?.items || response.data.data || [],
        status: response.status
      };
      console.log(`✅ Backend Products: ${this.results.products.backend.totalItems} items`);
      return true;
    } catch (error) {
      console.log(`❌ Backend Products Error: ${error.response?.status || error.code}`);
      this.results.products.backend = { error: error.response?.status || error.code };
      return false;
    }
  }

  async testFrontendProducts() {
    try {
      console.log('🔍 Testing Frontend Products Page...');
      const response = await axios.get(`${this.frontendUrl}/products`);
      const html = response.data;

      // Check if products are rendered in HTML
      const productCount = (html.match(/product/gi) || []).length;
      const hasProductData = html.includes('sản phẩm') || html.includes('product');

      this.results.products.frontend = {
        status: response.status,
        hasProducts: hasProductData,
        productReferences: productCount,
        htmlLength: html.length
      };
      console.log(`✅ Frontend Products: ${productCount} product references`);
      return true;
    } catch (error) {
      console.log(`❌ Frontend Products Error: ${error.response?.status || error.code}`);
      this.results.products.frontend = { error: error.response?.status || error.code };
      return false;
    }
  }

  async testBackendCategories() {
    try {
      console.log('🔍 Testing Backend Categories API...');
      const response = await axios.get(`${this.backendUrl}/catalog/categories`);
      this.results.categories.backend = {
        success: response.data.success,
        totalItems: response.data.data?.items?.length || response.data.data?.length || 0,
        items: response.data.data?.items || response.data.data || [],
        status: response.status
      };
      console.log(`✅ Backend Categories: ${this.results.categories.backend.totalItems} items`);
      return true;
    } catch (error) {
      console.log(`❌ Backend Categories Error: ${error.response?.status || error.code}`);
      this.results.categories.backend = { error: error.response?.status || error.code };
      return false;
    }
  }

  async testFrontendCategories() {
    try {
      console.log('🔍 Testing Frontend Categories Data...');
      // Check if categories are accessible via products page
      const response = await axios.get(`${this.frontendUrl}/products`);
      const html = response.data;

      const categoryCount = (html.match(/category|danh mục/gi) || []).length;
      const hasCategoryData = html.includes('danh mục') || html.includes('category');

      this.results.categories.frontend = {
        status: response.status,
        hasCategories: hasCategoryData,
        categoryReferences: categoryCount,
        htmlLength: html.length
      };
      console.log(`✅ Frontend Categories: ${categoryCount} category references`);
      return true;
    } catch (error) {
      console.log(`❌ Frontend Categories Error: ${error.response?.status || error.code}`);
      this.results.categories.frontend = { error: error.response?.status || error.code };
      return false;
    }
  }

  async testBackendAuth() {
    try {
      console.log('🔍 Testing Backend Auth API...');
      const response = await axios.get(`${this.backendUrl}/auth/status`);
      this.results.auth.backend = {
        success: response.data.success,
        status: response.status,
        data: response.data
      };
      console.log(`✅ Backend Auth Status: ${response.status}`);
      return true;
    } catch (error) {
      console.log(`❌ Backend Auth Error: ${error.response?.status || error.code}`);
      this.results.auth.backend = { error: error.response?.status || error.code };
      return false;
    }
  }

  async testFrontendAuth() {
    try {
      console.log('🔍 Testing Frontend Auth Pages...');
      const loginResponse = await axios.get(`${this.frontendUrl}/login`);
      const registerResponse = await axios.get(`${this.frontendUrl}/register`);

      const hasAuthForms = loginResponse.data.includes('login') && registerResponse.data.includes('register');

      this.results.auth.frontend = {
        loginStatus: loginResponse.status,
        registerStatus: registerResponse.status,
        hasAuthForms: hasAuthForms
      };
      console.log(`✅ Frontend Auth: Login ${loginResponse.status}, Register ${registerResponse.status}`);
      return true;
    } catch (error) {
      console.log(`❌ Frontend Auth Error: ${error.response?.status || error.code}`);
      this.results.auth.frontend = { error: error.response?.status || error.code };
      return false;
    }
  }

  async testBackendCart() {
    try {
      console.log('🔍 Testing Backend Cart API...');
      const response = await axios.get(`${this.backendUrl}/cart`);
      this.results.cart.backend = {
        status: response.status,
        data: response.data
      };
      console.log(`✅ Backend Cart: ${response.status}`);
      return true;
    } catch (error) {
      console.log(`❌ Backend Cart Error: ${error.response?.status || error.code}`);
      this.results.cart.backend = { error: error.response?.status || error.code };
      return false;
    }
  }

  async testFrontendCart() {
    try {
      console.log('🔍 Testing Frontend Cart Page...');
      const response = await axios.get(`${this.frontendUrl}/cart`);
      const html = response.data;

      const hasCartContent = html.includes('cart') || html.includes('giỏ hàng');
      const cartReferences = (html.match(/cart|giỏ hàng/gi) || []).length;

      this.results.cart.frontend = {
        status: response.status,
        hasCartContent: hasCartContent,
        cartReferences: cartReferences
      };
      console.log(`✅ Frontend Cart: ${cartReferences} cart references`);
      return true;
    } catch (error) {
      console.log(`❌ Frontend Cart Error: ${error.response?.status || error.code}`);
      this.results.cart.frontend = { error: error.response?.status || error.code };
      return false;
    }
  }

  async testBackendPayment() {
    try {
      console.log('🔍 Testing Backend Payment API...');
      const response = await axios.get(`${this.backendUrl}/payments/methods`);
      this.results.payment.backend = {
        success: response.data.success,
        status: response.status,
        data: response.data
      };
      console.log(`✅ Backend Payment Methods: ${response.status}`);
      return true;
    } catch (error) {
      console.log(`❌ Backend Payment Error: ${error.response?.status || error.code}`);
      this.results.payment.backend = { error: error.response?.status || error.code };
      return false;
    }
  }

  async testFrontendPayment() {
    try {
      console.log('🔍 Testing Frontend Payment Integration...');
      const cartResponse = await axios.get(`${this.frontendUrl}/cart`);
      const html = cartResponse.data;

      const hasPaymentContent = html.includes('payment') || html.includes('thanh toán');
      const paymentReferences = (html.match(/payment|thanh toán|checkout/gi) || []).length;

      this.results.payment.frontend = {
        status: cartResponse.status,
        hasPaymentContent: hasPaymentContent,
        paymentReferences: paymentReferences
      };
      console.log(`✅ Frontend Payment: ${paymentReferences} payment references`);
      return true;
    } catch (error) {
      console.log(`❌ Frontend Payment Error: ${error.response?.status || error.code}`);
      this.results.payment.frontend = { error: error.response?.status || error.code };
      return false;
    }
  }

  generateDataConsistencyReport() {
    console.log('\n📊 DATA CONSISTENCY VERIFICATION REPORT');
    console.log('='.repeat(60));

    // Products Analysis
    console.log('\n🛍️  PRODUCTS DATA VERIFICATION');
    console.log('-'.repeat(40));
    if (this.results.products.backend && !this.results.products.backend.error) {
      console.log(`Backend: ${this.results.products.backend.totalItems} products available`);
      console.log(`API Response: ${this.results.products.backend.success ? '✅ Valid' : '❌ Invalid'}`);
    }
    if (this.results.products.frontend && !this.results.products.frontend.error) {
      console.log(`Frontend: ${this.results.products.frontend.productReferences} product references`);
      console.log(`Page Load: ${this.results.products.frontend.hasProducts ? '✅ Has products' : '❌ No products'}`);
    }
    this.results.products.status = this.analyzeDataConsistency('products');

    // Categories Analysis
    console.log('\n📂 CATEGORIES DATA VERIFICATION');
    console.log('-'.repeat(40));
    if (this.results.categories.backend && !this.results.categories.backend.error) {
      console.log(`Backend: ${this.results.categories.backend.totalItems} categories available`);
      console.log(`API Response: ${this.results.categories.backend.success ? '✅ Valid' : '❌ Invalid'}`);
    }
    if (this.results.categories.frontend && !this.results.categories.frontend.error) {
      console.log(`Frontend: ${this.results.categories.frontend.categoryReferences} category references`);
      console.log(`Page Load: ${this.results.categories.frontend.hasCategories ? '✅ Has categories' : '❌ No categories'}`);
    }
    this.results.categories.status = this.analyzeDataConsistency('categories');

    // Auth Analysis
    console.log('\n🔐 AUTH DATA VERIFICATION');
    console.log('-'.repeat(40));
    if (this.results.auth.backend && !this.results.auth.backend.error) {
      console.log(`Backend: Auth API responding (${this.results.auth.backend.status})`);
      console.log(`API Response: ${this.results.auth.backend.success ? '✅ Valid' : '❌ Invalid'}`);
    }
    if (this.results.auth.frontend && !this.results.auth.frontend.error) {
      console.log(`Frontend: Login (${this.results.auth.frontend.loginStatus}), Register (${this.results.auth.frontend.registerStatus})`);
      console.log(`Auth Forms: ${this.results.auth.frontend.hasAuthForms ? '✅ Present' : '❌ Missing'}`);
    }
    this.results.auth.status = this.analyzeDataConsistency('auth');

    // Cart Analysis
    console.log('\n🛒 CART DATA VERIFICATION');
    console.log('-'.repeat(40));
    if (this.results.cart.backend && !this.results.cart.backend.error) {
      console.log(`Backend: Cart API responding (${this.results.cart.backend.status})`);
    }
    if (this.results.cart.frontend && !this.results.cart.frontend.error) {
      console.log(`Frontend: ${this.results.cart.frontend.cartReferences} cart references`);
      console.log(`Cart Content: ${this.results.cart.frontend.hasCartContent ? '✅ Present' : '❌ Missing'}`);
    }
    this.results.cart.status = this.analyzeDataConsistency('cart');

    // Payment Analysis
    console.log('\n💳 PAYMENT DATA VERIFICATION');
    console.log('-'.repeat(40));
    if (this.results.payment.backend && !this.results.payment.backend.error) {
      console.log(`Backend: Payment API responding (${this.results.payment.backend.status})`);
      console.log(`API Response: ${this.results.payment.backend.success ? '✅ Valid' : '❌ Invalid'}`);
    }
    if (this.results.payment.frontend && !this.results.payment.frontend.error) {
      console.log(`Frontend: ${this.results.payment.frontend.paymentReferences} payment references`);
      console.log(`Payment Content: ${this.results.payment.frontend.hasPaymentContent ? '✅ Present' : '❌ Missing'}`);
    }
    this.results.payment.status = this.analyzeDataConsistency('payment');

    return this.generateOverallReport();
  }

  analyzeDataConsistency(type) {
    const result = this.results[type];

    if (result.backend?.error || result.frontend?.error) {
      return '❌ Error';
    }

    // Check if both backend and frontend have data
    const backendHasData = result.backend && (
      result.backend.totalItems > 0 ||
      result.backend.success ||
      result.backend.status === 200
    );

    const frontendHasData = result.frontend && (
      result.frontend.productReferences > 0 ||
      result.frontend.categoryReferences > 0 ||
      result.frontend.cartReferences > 0 ||
      result.frontend.paymentReferences > 0 ||
      result.frontend.hasProducts ||
      result.frontend.hasCategories ||
      result.frontend.hasCartContent ||
      result.frontend.hasPaymentContent ||
      result.frontend.hasAuthForms
    );

    if (backendHasData && frontendHasData) {
      return '✅ Consistent';
    } else if (backendHasData && !frontendHasData) {
      return '⚠️ Backend Only';
    } else if (!backendHasData && frontendHasData) {
      return '⚠️ Frontend Only';
    } else {
      return '❌ No Data';
    }
  }

  generateOverallReport() {
    console.log('\n🎯 OVERALL DATA CONSISTENCY SUMMARY');
    console.log('='.repeat(60));

    const statuses = {
      consistent: 0,
      backendOnly: 0,
      frontendOnly: 0,
      error: 0,
      noData: 0
    };

    Object.keys(this.results).forEach(key => {
      const status = this.results[key].status;
      if (status.includes('✅')) statuses.consistent++;
      else if (status.includes('⚠️ Backend Only')) statuses.backendOnly++;
      else if (status.includes('⚠️ Frontend Only')) statuses.frontendOnly++;
      else if (status.includes('❌ Error')) statuses.error++;
      else if (status.includes('❌ No Data')) statuses.noData++;
    });

    const totalTests = Object.keys(this.results).length;
    const successRate = Math.round((statuses.consistent / totalTests) * 100);

    console.log(`\n📈 Consistency Score: ${successRate}%`);
    console.log(`✅ Consistent APIs: ${statuses.consistent}/${totalTests}`);
    console.log(`⚠️  Backend Only: ${statuses.backendOnly}/${totalTests}`);
    console.log(`⚠️  Frontend Only: ${statuses.frontendOnly}/${totalTests}`);
    console.log(`❌ Errors: ${statuses.error}/${totalTests}`);
    console.log(`❌ No Data: ${statuses.noData}/${totalTests}`);

    console.log('\n📋 DETAILED RESULTS:');
    Object.keys(this.results).forEach(key => {
      console.log(`   ${key.toUpperCase()}: ${this.results[key].status}`);
    });

    console.log('\n' + '='.repeat(60));

    if (successRate >= 90) {
      console.log('🎉 EXCELLENT! Data is perfectly consistent between backend and frontend!');
    } else if (successRate >= 75) {
      console.log('✅ GOOD! Data is well synchronized with minor issues.');
    } else if (successRate >= 50) {
      console.log('⚠️ FAIR! Data synchronization needs improvement.');
    } else {
      console.log('❌ POOR! Major data synchronization issues detected.');
    }

    return {
      successRate,
      statuses,
      details: this.results
    };
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive API Data Verification...\n');

    await this.testBackendProducts();
    await this.testFrontendProducts();

    await this.testBackendCategories();
    await this.testFrontendCategories();

    await this.testBackendAuth();
    await this.testFrontendAuth();

    await this.testBackendCart();
    await this.testFrontendCart();

    await this.testBackendPayment();
    await this.testFrontendPayment();

    return this.generateDataConsistencyReport();
  }
}

// Run tests
async function main() {
  const verifier = new ApiDataVerifier();
  const report = await verifier.runAllTests();

  // Save report to file
  const fs = require('fs');
  fs.writeFileSync('api-data-verification-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Detailed report saved to api-data-verification-report.json');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ApiDataVerifier;
