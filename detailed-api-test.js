#!/usr/bin/env node

const axios = require('axios');

class DetailedApiTester {
  constructor() {
    this.backendUrl = 'http://localhost:3010/api/v1';
    this.frontendUrl = 'http://localhost:3000';
    this.testResults = {};
  }

  async testProductsApi() {
    console.log('\n🛍️  TESTING PRODUCTS API INTEGRATION');
    console.log('='.repeat(50));

    try {
      // Test Backend Products API
      console.log('📡 Backend Products API:');
      const backendResponse = await axios.get(`${this.backendUrl}/catalog/products`);
      console.log(`   Status: ${backendResponse.status}`);
      console.log(`   Success: ${backendResponse.data.success}`);
      console.log(`   Total Products: ${backendResponse.data.data?.items?.length || backendResponse.data.data?.length || 0}`);

      // Show sample product data
      const products = backendResponse.data.data?.items || backendResponse.data.data || [];
      if (products.length > 0) {
        console.log('   Sample Product:');
        console.log(`     - ID: ${products[0].id}`);
        console.log(`     - Name: ${products[0].name || products[0].title}`);
        console.log(`     - Price: ${products[0].priceCents || products[0].price || 'N/A'}`);
      }

      // Test if frontend can access products page
      console.log('\n🌐 Frontend Products Page:');
      const frontendResponse = await axios.get(`${this.frontendUrl}/products`);
      console.log(`   Status: ${frontendResponse.status}`);
      console.log(`   Page Size: ${frontendResponse.data.length} characters`);

      const hasProductContent = frontendResponse.data.includes('product') || frontendResponse.data.includes('sản phẩm');
      console.log(`   Has Product Content: ${hasProductContent ? '✅ YES' : '❌ NO'}`);

      this.testResults.products = {
        backend: {
          status: backendResponse.status,
          success: backendResponse.data.success,
          totalItems: products.length,
          sampleData: products[0] || null
        },
        frontend: {
          status: frontendResponse.status,
          hasContent: hasProductContent,
          pageSize: frontendResponse.data.length
        },
        consistency: backendResponse.status === 200 && frontendResponse.status === 200 && hasProductContent && products.length > 0
      };

    } catch (error) {
      console.log(`❌ Products API Error: ${error.response?.status || error.code}`);
      this.testResults.products = { error: error.response?.status || error.code };
    }
  }

  async testCategoriesApi() {
    console.log('\n📂 TESTING CATEGORIES API INTEGRATION');
    console.log('='.repeat(50));

    try {
      // Test Backend Categories API
      console.log('📡 Backend Categories API:');
      const backendResponse = await axios.get(`${this.backendUrl}/catalog/categories`);
      console.log(`   Status: ${backendResponse.status}`);
      console.log(`   Success: ${backendResponse.data.success}`);
      console.log(`   Total Categories: ${backendResponse.data.data?.items?.length || backendResponse.data.data?.length || 0}`);

      // Show sample category data
      const categories = backendResponse.data.data?.items || backendResponse.data.data || [];
      if (categories.length > 0) {
        console.log('   Sample Category:');
        console.log(`     - ID: ${categories[0].id}`);
        console.log(`     - Name: ${categories[0].name || categories[0].title}`);
        console.log(`     - Slug: ${categories[0].slug}`);
      }

      // Test if frontend can access categories
      console.log('\n🌐 Frontend Categories Integration:');
      const frontendResponse = await axios.get(`${this.frontendUrl}/products`);
      console.log(`   Status: ${frontendResponse.status}`);

      const hasCategoryContent = frontendResponse.data.includes('category') || frontendResponse.data.includes('danh mục');
      console.log(`   Has Category Content: ${hasCategoryContent ? '✅ YES' : '❌ NO'}`);

      this.testResults.categories = {
        backend: {
          status: backendResponse.status,
          success: backendResponse.data.success,
          totalItems: categories.length,
          sampleData: categories[0] || null
        },
        frontend: {
          status: frontendResponse.status,
          hasContent: hasCategoryContent
        },
        consistency: backendResponse.status === 200 && frontendResponse.status === 200 && hasCategoryContent && categories.length > 0
      };

    } catch (error) {
      console.log(`❌ Categories API Error: ${error.response?.status || error.code}`);
      this.testResults.categories = { error: error.response?.status || error.code };
    }
  }

  async testAuthApi() {
    console.log('\n🔐 TESTING AUTH API INTEGRATION');
    console.log('='.repeat(50));

    try {
      // Test Backend Auth API
      console.log('📡 Backend Auth API:');
      const backendResponse = await axios.get(`${this.backendUrl}/auth/status`);
      console.log(`   Status: ${backendResponse.status}`);
      console.log(`   Success: ${backendResponse.data.success}`);
      console.log(`   Response: ${JSON.stringify(backendResponse.data.data)}`);

      // Test Frontend Auth Pages
      console.log('\n🌐 Frontend Auth Pages:');

      const loginResponse = await axios.get(`${this.frontendUrl}/login`);
      console.log(`   Login Page Status: ${loginResponse.status}`);
      const hasLoginForm = loginResponse.data.includes('login') || loginResponse.data.includes('đăng nhập');
      console.log(`   Has Login Form: ${hasLoginForm ? '✅ YES' : '❌ NO'}`);

      const registerResponse = await axios.get(`${this.frontendUrl}/register`);
      console.log(`   Register Page Status: ${registerResponse.status}`);
      const hasRegisterForm = registerResponse.data.includes('register') || registerResponse.data.includes('đăng ký');
      console.log(`   Has Register Form: ${hasRegisterForm ? '✅ YES' : '❌ NO'}`);

      this.testResults.auth = {
        backend: {
          status: backendResponse.status,
          success: backendResponse.data.success,
          data: backendResponse.data.data
        },
        frontend: {
          loginStatus: loginResponse.status,
          registerStatus: registerResponse.status,
          hasLoginForm,
          hasRegisterForm
        },
        consistency: backendResponse.status === 200 && loginResponse.status === 200 && registerResponse.status === 200 && hasLoginForm && hasRegisterForm
      };

    } catch (error) {
      console.log(`❌ Auth API Error: ${error.response?.status || error.code}`);
      this.testResults.auth = { error: error.response?.status || error.code };
    }
  }

  async testCartApi() {
    console.log('\n🛒 TESTING CART API INTEGRATION');
    console.log('='.repeat(50));

    try {
      // Test Backend Cart API
      console.log('📡 Backend Cart API:');
      const backendResponse = await axios.get(`${this.backendUrl}/cart`);
      console.log(`   Status: ${backendResponse.status}`);
      console.log(`   Response: ${JSON.stringify(backendResponse.data)}`);

      // Test Frontend Cart Page
      console.log('\n🌐 Frontend Cart Page:');
      const frontendResponse = await axios.get(`${this.frontendUrl}/cart`);
      console.log(`   Status: ${frontendResponse.status}`);

      const hasCartContent = frontendResponse.data.includes('cart') || frontendResponse.data.includes('giỏ hàng');
      const hasCartItems = frontendResponse.data.includes('item') || frontendResponse.data.includes('sản phẩm');
      console.log(`   Has Cart Content: ${hasCartContent ? '✅ YES' : '❌ NO'}`);
      console.log(`   Has Cart Items: ${hasCartItems ? '✅ YES' : '❌ NO'}`);

      this.testResults.cart = {
        backend: {
          status: backendResponse.status,
          data: backendResponse.data
        },
        frontend: {
          status: frontendResponse.status,
          hasContent: hasCartContent,
          hasItems: hasCartItems
        },
        consistency: backendResponse.status === 200 && frontendResponse.status === 200 && hasCartContent
      };

    } catch (error) {
      console.log(`❌ Cart API Error: ${error.response?.status || error.code}`);
      this.testResults.cart = { error: error.response?.status || error.code };
    }
  }

  async testPaymentApi() {
    console.log('\n💳 TESTING PAYMENT API INTEGRATION');
    console.log('='.repeat(50));

    try {
      // Test Backend Payment API
      console.log('📡 Backend Payment Methods API:');
      const backendResponse = await axios.get(`${this.backendUrl}/payments/methods`);
      console.log(`   Status: ${backendResponse.status}`);
      console.log(`   Success: ${backendResponse.data.success}`);
      console.log(`   Response: ${JSON.stringify(backendResponse.data.data)}`);

      // Test Backend Payment Intents API
      console.log('\n📡 Backend Payment Intents API:');
      const intentsResponse = await axios.get(`${this.backendUrl}/payments/intents`);
      console.log(`   Status: ${intentsResponse.status}`);
      console.log(`   Response: ${JSON.stringify(intentsResponse.data)}`);

      // Test Frontend Payment Integration
      console.log('\n🌐 Frontend Payment Integration:');
      const frontendResponse = await axios.get(`${this.frontendUrl}/cart`);
      console.log(`   Status: ${frontendResponse.status}`);

      const hasPaymentContent = frontendResponse.data.includes('payment') || frontendResponse.data.includes('thanh toán') || frontendResponse.data.includes('checkout');
      console.log(`   Has Payment Content: ${hasPaymentContent ? '✅ YES' : '❌ NO'}`);

      this.testResults.payment = {
        backend: {
          methodsStatus: backendResponse.status,
          methodsSuccess: backendResponse.data.success,
          intentsStatus: intentsResponse.status,
          methodsData: backendResponse.data.data,
          intentsData: intentsResponse.data
        },
        frontend: {
          status: frontendResponse.status,
          hasContent: hasPaymentContent
        },
        consistency: backendResponse.status === 200 && frontendResponse.status === 200 && backendResponse.data.success
      };

    } catch (error) {
      console.log(`❌ Payment API Error: ${error.response?.status || error.code}`);
      this.testResults.payment = { error: error.response?.status || error.code };
    }
  }

  async testApiDataFlow() {
    console.log('\n🔄 TESTING API DATA FLOW');
    console.log('='.repeat(50));

    try {
      // Test if frontend API client can reach backend
      console.log('Testing Frontend API Client → Backend Communication:');

      // Since we can't directly test frontend API client, we'll test the actual API endpoints
      const healthResponse = await axios.get(`${this.backendUrl}/health`);
      const productsResponse = await axios.get(`${this.backendUrl}/catalog/products`);
      const categoriesResponse = await axios.get(`${this.backendUrl}/catalog/categories`);

      console.log(`   Health API: ${healthResponse.status === 200 ? '✅ OK' : '❌ FAIL'}`);
      console.log(`   Products API: ${productsResponse.status === 200 ? '✅ OK' : '❌ FAIL'}`);
      console.log(`   Categories API: ${categoriesResponse.status === 200 ? '✅ OK' : '❌ FAIL'}`);

      const allApisWorking = healthResponse.status === 200 && productsResponse.status === 200 && categoriesResponse.status === 200;
      console.log(`   Overall API Health: ${allApisWorking ? '✅ GOOD' : '❌ ISSUES'}`);

      this.testResults.apiFlow = {
        health: healthResponse.status,
        products: productsResponse.status,
        categories: categoriesResponse.status,
        overallHealth: allApisWorking
      };

    } catch (error) {
      console.log(`❌ API Data Flow Error: ${error.response?.status || error.code}`);
      this.testResults.apiFlow = { error: error.response?.status || error.code };
    }
  }

  generateDetailedReport() {
    console.log('\n📊 DETAILED API INTEGRATION REPORT');
    console.log('='.repeat(60));

    let totalTests = 0;
    let passedTests = 0;

    // Analyze each test result
    Object.keys(this.testResults).forEach(key => {
      const result = this.testResults[key];
      totalTests++;

      if (result.consistency) {
        passedTests++;
        console.log(`✅ ${key.toUpperCase()}: CONSISTENT`);
      } else if (result.error) {
        console.log(`❌ ${key.toUpperCase()}: ERROR - ${result.error}`);
      } else {
        console.log(`⚠️  ${key.toUpperCase()}: INCONSISTENT`);
      }
    });

    const consistencyScore = Math.round((passedTests / totalTests) * 100);

    console.log('\n' + '='.repeat(60));
    console.log(`🎯 OVERALL CONSISTENCY SCORE: ${consistencyScore}%`);
    console.log(`✅ Passed Tests: ${passedTests}/${totalTests}`);
    console.log(`❌ Failed Tests: ${totalTests - passedTests}/${totalTests}`);

    // Detailed Analysis
    console.log('\n📋 DETAILED ANALYSIS:');

    if (this.testResults.products) {
      console.log('\n🛍️  PRODUCTS:');
      if (this.testResults.products.consistency) {
        console.log(`   ✅ Backend: ${this.testResults.products.backend.totalItems} products`);
        console.log(`   ✅ Frontend: Content available`);
      } else {
        console.log(`   ❌ Issues detected`);
      }
    }

    if (this.testResults.categories) {
      console.log('\n📂 CATEGORIES:');
      if (this.testResults.categories.consistency) {
        console.log(`   ✅ Backend: ${this.testResults.categories.backend.totalItems} categories`);
        console.log(`   ✅ Frontend: Content available`);
      } else {
        console.log(`   ❌ Issues detected`);
      }
    }

    if (this.testResults.auth) {
      console.log('\n🔐 AUTH:');
      if (this.testResults.auth.consistency) {
        console.log(`   ✅ Backend: API responding`);
        console.log(`   ✅ Frontend: Login/Register pages working`);
      } else {
        console.log(`   ❌ Issues detected`);
      }
    }

    if (this.testResults.cart) {
      console.log('\n🛒 CART:');
      if (this.testResults.cart.consistency) {
        console.log(`   ✅ Backend: API responding`);
        console.log(`   ✅ Frontend: Cart page working`);
      } else {
        console.log(`   ❌ Issues detected`);
      }
    }

    if (this.testResults.payment) {
      console.log('\n💳 PAYMENT:');
      if (this.testResults.payment.consistency) {
        console.log(`   ✅ Backend: Payment APIs working`);
        console.log(`   ⚠️  Frontend: Payment integration needed`);
      } else {
        console.log(`   ❌ Issues detected`);
      }
    }

    console.log('\n' + '='.repeat(60));

    if (consistencyScore >= 90) {
      console.log('🎉 EXCELLENT! API integration is working perfectly!');
    } else if (consistencyScore >= 75) {
      console.log('✅ GOOD! API integration is working well.');
    } else if (consistencyScore >= 50) {
      console.log('⚠️ FAIR! API integration needs improvement.');
    } else {
      console.log('❌ POOR! Major API integration issues detected.');
    }

    console.log('\n💡 RECOMMENDATIONS:');
    if (consistencyScore < 100) {
      console.log('   1. Check frontend API client configuration');
      console.log('   2. Verify environment variables are set');
      console.log('   3. Test payment integration implementation');
      console.log('   4. Monitor API response times');
    }

    return {
      consistencyScore,
      passedTests,
      totalTests,
      results: this.testResults
    };
  }

  async runDetailedTests() {
    console.log('🔬 Starting Detailed API Integration Testing...\n');

    await this.testProductsApi();
    await this.testCategoriesApi();
    await this.testAuthApi();
    await this.testCartApi();
    await this.testPaymentApi();
    await this.testApiDataFlow();

    return this.generateDetailedReport();
  }
}

// Run detailed tests
async function main() {
  const tester = new DetailedApiTester();
  const report = await tester.runDetailedTests();

  // Save detailed report to file
  const fs = require('fs');
  fs.writeFileSync('detailed-api-test-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Detailed report saved to detailed-api-test-report.json');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = DetailedApiTester;
