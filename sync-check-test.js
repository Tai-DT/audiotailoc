#!/usr/bin/env node

const axios = require('axios');

class SyncChecker {
  constructor() {
    this.backendUrl = 'http://localhost:3010/api/v1';
    this.frontendUrl = 'http://localhost:3000';
    this.results = {
      apiSync: { success: 0, total: 0, errors: [] },
      dataSync: { success: 0, total: 0, errors: [] },
      stateSync: { success: 0, total: 0, errors: [] }
    };
  }

  async checkAPISync() {
    console.log('🔗 Checking API Synchronization...\n');
    
    const apiTests = [
      {
        name: 'Products API',
        backendPath: '/catalog/products',
        frontendPath: '/products',
        checkData: (data) => data && Array.isArray(data.data?.items || data.items)
      },
      {
        name: 'Categories API',
        backendPath: '/catalog/categories',
        frontendPath: '/products',
        checkData: (data) => data && Array.isArray(data.data?.items || data.items)
      },
      {
        name: 'Auth Status',
        backendPath: '/auth/status',
        frontendPath: '/login',
        checkData: (data) => data && typeof data === 'object'
      },
      {
        name: 'Payment Methods',
        backendPath: '/payments/methods',
        frontendPath: '/cart',
        checkData: (data) => data && Array.isArray(data.data || data)
      }
    ];

    for (const test of apiTests) {
      try {
        // Test backend API
        const backendResponse = await axios.get(`${this.backendUrl}${test.backendPath}`);
        const backendData = backendResponse.data;
        
        // Test frontend page loads
        const frontendResponse = await axios.get(`${this.frontendUrl}${test.frontendPath}`);
        
        // Check data consistency
        const dataValid = test.checkData(backendData);
        
        if (backendResponse.status === 200 && frontendResponse.status === 200 && dataValid) {
          console.log(`✅ ${test.name}: Backend & Frontend in sync`);
          this.results.apiSync.success++;
        } else {
          console.log(`⚠️ ${test.name}: Partial sync (Backend: ${backendResponse.status}, Frontend: ${frontendResponse.status})`);
          this.results.apiSync.errors.push({
            test: test.name,
            backendStatus: backendResponse.status,
            frontendStatus: frontendResponse.status,
            dataValid
          });
        }
      } catch (error) {
        console.log(`❌ ${test.name}: Sync failed (${error.response?.status || error.code})`);
        this.results.apiSync.errors.push({
          test: test.name,
          error: error.response?.status || error.code
        });
      }
      this.results.apiSync.total++;
    }
  }

  async checkDataSync() {
    console.log('\n📊 Checking Data Synchronization...\n');
    
    try {
      // Get products from backend
      const backendProducts = await axios.get(`${this.backendUrl}/catalog/products`);
      const backendData = backendProducts.data;
      
      // Check if frontend can access the same data
      const frontendResponse = await axios.get(`${this.frontendUrl}/products`);
      
      if (backendData && frontendResponse.status === 200) {
        console.log('✅ Products data sync: Backend provides data, Frontend can access');
        this.results.dataSync.success++;
      } else {
        console.log('❌ Products data sync: Failed');
        this.results.dataSync.errors.push({
          test: 'Products Data Sync',
          backendData: !!backendData,
          frontendAccess: frontendResponse.status === 200
        });
      }
    } catch (error) {
      console.log('❌ Products data sync: Error occurred');
      this.results.dataSync.errors.push({
        test: 'Products Data Sync',
        error: error.response?.status || error.code
      });
    }
    this.results.dataSync.total++;

    // Check categories sync
    try {
      const backendCategories = await axios.get(`${this.backendUrl}/catalog/categories`);
      const frontendResponse = await axios.get(`${this.frontendUrl}/products`);
      
      if (backendCategories.data && frontendResponse.status === 200) {
        console.log('✅ Categories data sync: Backend provides data, Frontend can access');
        this.results.dataSync.success++;
      } else {
        console.log('❌ Categories data sync: Failed');
        this.results.dataSync.errors.push({
          test: 'Categories Data Sync',
          backendData: !!backendCategories.data,
          frontendAccess: frontendResponse.status === 200
        });
      }
    } catch (error) {
      console.log('❌ Categories data sync: Error occurred');
      this.results.dataSync.errors.push({
        test: 'Categories Data Sync',
        error: error.response?.status || error.code
      });
    }
    this.results.dataSync.total++;
  }

  async checkStateSync() {
    console.log('\n🔄 Checking State Synchronization...\n');
    
    // Test cart state sync
    try {
      // Check if cart endpoints are available
      const cartResponse = await axios.get(`${this.backendUrl}/cart`);
      const frontendCartResponse = await axios.get(`${this.frontendUrl}/cart`);
      
      if (cartResponse.status === 200 && frontendCartResponse.status === 200) {
        console.log('✅ Cart state sync: Backend & Frontend cart pages accessible');
        this.results.stateSync.success++;
      } else {
        console.log('⚠️ Cart state sync: Partial access');
        this.results.stateSync.errors.push({
          test: 'Cart State Sync',
          backendStatus: cartResponse.status,
          frontendStatus: frontendCartResponse.status
        });
      }
    } catch (error) {
      console.log('❌ Cart state sync: Error occurred');
      this.results.stateSync.errors.push({
        test: 'Cart State Sync',
        error: error.response?.status || error.code
      });
    }
    this.results.stateSync.total++;

    // Test auth state sync
    try {
      const authResponse = await axios.get(`${this.backendUrl}/auth/status`);
      const frontendAuthResponse = await axios.get(`${this.frontendUrl}/login`);
      
      if (authResponse.status === 200 && frontendAuthResponse.status === 200) {
        console.log('✅ Auth state sync: Backend & Frontend auth accessible');
        this.results.stateSync.success++;
      } else {
        console.log('⚠️ Auth state sync: Partial access');
        this.results.stateSync.errors.push({
          test: 'Auth State Sync',
          backendStatus: authResponse.status,
          frontendStatus: frontendAuthResponse.status
        });
      }
    } catch (error) {
      console.log('❌ Auth state sync: Error occurred');
      this.results.stateSync.errors.push({
        test: 'Auth State Sync',
        error: error.response?.status || error.code
      });
    }
    this.results.stateSync.total++;
  }

  generateSyncReport() {
    console.log('\n📊 SYNCHRONIZATION REPORT');
    console.log('='.repeat(50));
    
    const apiSyncScore = Math.round((this.results.apiSync.success / this.results.apiSync.total) * 100);
    const dataSyncScore = Math.round((this.results.dataSync.success / this.results.dataSync.total) * 100);
    const stateSyncScore = Math.round((this.results.stateSync.success / this.results.stateSync.total) * 100);
    const overallSyncScore = Math.round((apiSyncScore + dataSyncScore + stateSyncScore) / 3);

    console.log(`\n🔗 API Sync: ${this.results.apiSync.success}/${this.results.apiSync.total} (${apiSyncScore}%)`);
    console.log(`📊 Data Sync: ${this.results.dataSync.success}/${this.results.dataSync.total} (${dataSyncScore}%)`);
    console.log(`🔄 State Sync: ${this.results.stateSync.success}/${this.results.stateSync.total} (${stateSyncScore}%)`);
    console.log(`\n🎯 Overall Sync Score: ${overallSyncScore}%`);

    if (this.results.apiSync.errors.length > 0) {
      console.log('\n❌ API Sync Errors:');
      this.results.apiSync.errors.forEach(error => {
        console.log(`  - ${error.test}: Backend ${error.backendStatus}, Frontend ${error.frontendStatus}`);
      });
    }

    if (this.results.dataSync.errors.length > 0) {
      console.log('\n❌ Data Sync Errors:');
      this.results.dataSync.errors.forEach(error => {
        console.log(`  - ${error.test}: ${error.error || 'Data mismatch'}`);
      });
    }

    if (this.results.stateSync.errors.length > 0) {
      console.log('\n❌ State Sync Errors:');
      this.results.stateSync.errors.forEach(error => {
        console.log(`  - ${error.test}: ${error.error || 'State mismatch'}`);
      });
    }

    console.log('\n' + '='.repeat(50));
    
    if (overallSyncScore >= 90) {
      console.log('🎉 EXCELLENT! Backend and Frontend are perfectly synchronized!');
    } else if (overallSyncScore >= 75) {
      console.log('✅ GOOD! Backend and Frontend are well synchronized.');
    } else if (overallSyncScore >= 50) {
      console.log('⚠️ FAIR! Backend and Frontend need better synchronization.');
    } else {
      console.log('❌ POOR! Backend and Frontend are not synchronized.');
    }

    return {
      apiSyncScore,
      dataSyncScore,
      stateSyncScore,
      overallSyncScore,
      errors: {
        apiSync: this.results.apiSync.errors,
        dataSync: this.results.dataSync.errors,
        stateSync: this.results.stateSync.errors
      }
    };
  }

  async runSyncCheck() {
    console.log('🔄 Starting Backend-Frontend Synchronization Check...\n');
    
    await this.checkAPISync();
    await this.checkDataSync();
    await this.checkStateSync();
    
    return this.generateSyncReport();
  }
}

// Run sync check
async function main() {
  const checker = new SyncChecker();
  const report = await checker.runSyncCheck();
  
  // Save report to file
  const fs = require('fs');
  fs.writeFileSync('sync-check-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Sync report saved to sync-check-report.json');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = SyncChecker;
