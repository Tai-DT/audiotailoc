#!/usr/bin/env node

const fs = require('fs');
const axios = require('axios');

class AudioTailocFinalReport {
  constructor() {
    this.reports = {};
  }

  async checkSystemStatus() {
    console.log('🔍 MCP FINAL SYSTEM STATUS CHECK');
    console.log('='.repeat(60));

    // Backend Check
    try {
      const backendHealth = await axios.get('http://localhost:3010/api/v1/health', { timeout: 5000 });
      console.log(`✅ Backend: ${backendHealth.status} - ${backendHealth.data.message}`);
      this.reports.backend = {
        status: 'healthy',
        code: backendHealth.status,
        message: backendHealth.data.message
      };
    } catch (error) {
      console.log(`❌ Backend: ${error.code || 'Connection failed'}`);
      this.reports.backend = {
        status: 'unhealthy',
        error: error.code || 'Connection failed'
      };
    }

    // Frontend Check
    try {
      const frontendHealth = await axios.get('http://localhost:3000', { timeout: 15000 });
      console.log(`✅ Frontend: ${frontendHealth.status} - Homepage loaded`);
      this.reports.frontend = {
        status: 'healthy',
        code: frontendHealth.status,
        contentLength: frontendHealth.data.length
      };
    } catch (error) {
      console.log(`❌ Frontend: ${error.code || 'Connection failed'}`);
      this.reports.frontend = {
        status: 'unhealthy',
        error: error.code || 'Connection failed'
      };
    }

    // Monitoring Dashboard Check
    try {
      const dashboardHealth = await axios.get('http://localhost:3001/api/health', { timeout: 5000 });
      console.log(`✅ Monitoring Dashboard: ${dashboardHealth.status} - ${dashboardHealth.data.status}`);
      this.reports.monitoring = {
        status: 'healthy',
        code: dashboardHealth.status,
        data: dashboardHealth.data
      };
    } catch (error) {
      console.log(`❌ Monitoring Dashboard: ${error.code || 'Connection failed'}`);
      this.reports.monitoring = {
        status: 'unhealthy',
        error: error.code || 'Connection failed'
      };
    }
  }

  async checkAPIEndpoints() {
    console.log('\n🔍 MCP API ENDPOINTS VERIFICATION');
    console.log('='.repeat(60));

    const endpoints = [
      { name: 'Health', path: '/health', critical: true },
      { name: 'Products', path: '/catalog/products', critical: true },
      { name: 'Categories', path: '/catalog/categories', critical: true },
      { name: 'Auth Status', path: '/auth/status', critical: true },
      { name: 'Cart', path: '/cart', critical: true },
      { name: 'Payment Methods', path: '/payments/methods', critical: true },
      { name: 'Payment Intents', path: '/payments/intents', critical: false },
      { name: 'Search Services', path: '/search/services', critical: false },
      { name: 'Notifications', path: '/notifications', critical: false }
    ];

    const apiResults = { critical: 0, total: 0, working: 0 };

    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`http://localhost:3010/api/v1${endpoint.path}`, { timeout: 5000 });
        console.log(`✅ ${endpoint.name}: ${response.status} (${response.data.success ? 'Valid' : 'Invalid'})`);
        apiResults.working++;
        if (endpoint.critical) apiResults.critical++;
      } catch (error) {
        console.log(`❌ ${endpoint.name}: ${error.response?.status || 'Failed'}`);
      }
      apiResults.total++;
    }

    this.reports.apiEndpoints = {
      total: apiResults.total,
      working: apiResults.working,
      criticalWorking: apiResults.critical,
      availability: `${Math.round((apiResults.working / apiResults.total) * 100)}%`
    };

    console.log(`\n📊 API Availability: ${this.reports.apiEndpoints.availability}`);
    console.log(`   Critical APIs: ${apiResults.critical}/6 working`);
  }

  async checkDataIntegrity() {
    console.log('\n🔍 MCP DATA INTEGRITY CHECK');
    console.log('='.repeat(60));

    try {
      const [products, categories] = await Promise.all([
        axios.get('http://localhost:3010/api/v1/catalog/products'),
        axios.get('http://localhost:3010/api/v1/catalog/categories')
      ]);

      const productsData = products.data.data?.items || products.data.data || [];
      const categoriesData = categories.data.data?.items || categories.data.data || [];

      console.log(`📦 Products: ${productsData.length} items`);
      console.log(`📂 Categories: ${categoriesData.length} items`);

      // Check data quality
      const validProducts = productsData.filter(p =>
        p.id && (p.name || p.title) && (p.priceCents || p.price)
      ).length;

      const validCategories = categoriesData.filter(c =>
        c.id && (c.name || c.title) && c.slug
      ).length;

      console.log(`✅ Valid Products: ${validProducts}/${productsData.length} (${Math.round((validProducts/productsData.length)*100)}%)`);
      console.log(`✅ Valid Categories: ${validCategories}/${categoriesData.length} (${Math.round((validCategories/categoriesData.length)*100)}%)`);

      this.reports.dataIntegrity = {
        products: {
          total: productsData.length,
          valid: validProducts,
          quality: `${Math.round((validProducts/productsData.length)*100)}%`
        },
        categories: {
          total: categoriesData.length,
          valid: validCategories,
          quality: `${Math.round((validCategories/categoriesData.length)*100)}%`
        }
      };

    } catch (error) {
      console.log(`❌ Data Integrity Check Failed: ${error.message}`);
      this.reports.dataIntegrity = { error: error.message };
    }
  }

  async checkImprovements() {
    console.log('\n🔍 MCP IMPROVEMENTS VERIFICATION');
    console.log('='.repeat(60));

    const improvements = [
      { name: 'Environment Config', file: 'frontend/.env.local', critical: true },
      { name: 'Docker Compose', file: 'docker-compose.yml', critical: true },
      { name: 'CI/CD Pipeline', file: '.github/workflows/ci.yml', critical: false },
      { name: 'Monitoring Dashboard', file: 'monitoring-dashboard.js', critical: false },
      { name: 'Development Scripts', file: 'dev-workflow.js', critical: false },
      { name: 'README Documentation', file: 'README.md', critical: true }
    ];

    let completedImprovements = 0;

    for (const improvement of improvements) {
      if (fs.existsSync(improvement.file)) {
        console.log(`✅ ${improvement.name}: Created`);
        completedImprovements++;
      } else {
        console.log(`❌ ${improvement.name}: Missing`);
      }
    }

    this.reports.improvements = {
      total: improvements.length,
      completed: completedImprovements,
      completion: `${Math.round((completedImprovements/improvements.length)*100)}%`
    };

    console.log(`\n📊 Improvements Completion: ${this.reports.improvements.completion}`);
  }

  calculateOverallScore() {
    console.log('\n🔍 MCP OVERALL SCORE CALCULATION');
    console.log('='.repeat(60));

    let totalScore = 0;

    // System Health (30 points max)
    if (this.reports.backend?.status === 'healthy') totalScore += 30;
    console.log(`System Health: ${this.reports.backend?.status === 'healthy' ? 30 : 0}/30`);

    // API Endpoints (25 points max)
    if (this.reports.apiEndpoints) {
      const apiScore = Math.round(parseInt(this.reports.apiEndpoints.availability) * 0.25);
      totalScore += apiScore;
      console.log(`API Endpoints: ${apiScore}/25`);
    } else {
      console.log(`API Endpoints: 0/25`);
    }

    // Data Integrity (20 points max)
    if (this.reports.dataIntegrity && !this.reports.dataIntegrity.error) {
      const dataScore = Math.round(((parseInt(this.reports.dataIntegrity.products.quality) + parseInt(this.reports.dataIntegrity.categories.quality)) / 2) * 0.2);
      totalScore += dataScore;
      console.log(`Data Integrity: ${dataScore}/20`);
    } else {
      console.log(`Data Integrity: 0/20`);
    }

    // Improvements (15 points max)
    if (this.reports.improvements) {
      const improvementScore = Math.round(parseInt(this.reports.improvements.completion) * 0.15);
      totalScore += improvementScore;
      console.log(`Improvements: ${improvementScore}/15`);
    } else {
      console.log(`Improvements: 0/15`);
    }

    // Frontend Health (10 points max)
    if (this.reports.frontend?.status === 'healthy') totalScore += 10;
    console.log(`Frontend Health: ${this.reports.frontend?.status === 'healthy' ? 10 : 0}/10`);

    const finalScore = totalScore;

    this.reports.overallScore = {
      score: `${finalScore}%`,
      breakdown: {
        systemHealth: this.reports.backend?.status === 'healthy' ? '30%' : '0%',
        apiEndpoints: this.reports.apiEndpoints ? `${Math.round(parseInt(this.reports.apiEndpoints.availability) * 0.25)}%` : '0%',
        dataIntegrity: this.reports.dataIntegrity && !this.reports.dataIntegrity.error ? `${Math.round(((parseInt(this.reports.dataIntegrity.products.quality) + parseInt(this.reports.dataIntegrity.categories.quality)) / 2) * 0.2)}%` : '0%',
        improvements: this.reports.improvements ? `${Math.round(parseInt(this.reports.improvements.completion) * 0.15)}%` : '0%',
        frontendHealth: this.reports.frontend?.status === 'healthy' ? '10%' : '0%'
      }
    };

    console.log(`\n🎯 Final Overall Score: ${finalScore}/100 (${finalScore}%)`);

    return finalScore;
  }

  generateFinalReport() {
    const finalScore = this.calculateOverallScore();

    console.log('\n🎉 MCP FINAL COMPREHENSIVE REPORT');
    console.log('='.repeat(60));

    // System Status
    console.log('\n🔧 SYSTEM STATUS:');
    console.log(`   Backend: ${this.reports.backend?.status?.toUpperCase() || 'UNKNOWN'}`);
    console.log(`   Frontend: ${this.reports.frontend?.status?.toUpperCase() || 'UNKNOWN'}`);
    console.log(`   Monitoring: ${this.reports.monitoring?.status?.toUpperCase() || 'UNKNOWN'}`);

    // API Status
    if (this.reports.apiEndpoints) {
      console.log('\n🔗 API ENDPOINTS:');
      console.log(`   Total: ${this.reports.apiEndpoints.total}`);
      console.log(`   Working: ${this.reports.apiEndpoints.working}`);
      console.log(`   Availability: ${this.reports.apiEndpoints.availability}`);
    }

    // Data Status
    if (this.reports.dataIntegrity && !this.reports.dataIntegrity.error) {
      console.log('\n📊 DATA INTEGRITY:');
      console.log(`   Products: ${this.reports.dataIntegrity.products.total} total, ${this.reports.dataIntegrity.products.quality} quality`);
      console.log(`   Categories: ${this.reports.dataIntegrity.categories.total} total, ${this.reports.dataIntegrity.categories.quality} quality`);
    }

    // Improvements
    if (this.reports.improvements) {
      console.log('\n🚀 IMPROVEMENTS:');
      console.log(`   Completed: ${this.reports.improvements.completed}/${this.reports.improvements.total}`);
      console.log(`   Completion: ${this.reports.improvements.completion}`);
    }

    // Final Score
    console.log('\n🎯 FINAL ASSESSMENT:');
    console.log(`   Overall Score: ${this.reports.overallScore.score}`);

    if (finalScore >= 90) {
      console.log('   Status: EXCELLENT - System is production ready!');
    } else if (finalScore >= 75) {
      console.log('   Status: GOOD - System is ready with minor issues');
    } else if (finalScore >= 50) {
      console.log('   Status: FAIR - System needs improvements');
    } else {
      console.log('   Status: POOR - System needs major work');
    }

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    if (this.reports.backend?.status !== 'healthy') {
      console.log('   🔴 Fix backend connectivity issues');
    }
    if (this.reports.frontend?.status !== 'healthy') {
      console.log('   🔴 Fix frontend loading issues');
    }
    if (this.reports.apiEndpoints && parseInt(this.reports.apiEndpoints.availability) < 100) {
      console.log('   🟡 Improve API endpoint availability');
    }
    if (this.reports.dataIntegrity?.error) {
      console.log('   🟡 Fix data integrity issues');
    }

    console.log('\n🔧 AVAILABLE MCP COMMANDS:');
    console.log('   npm run mcp:scan     # Full system scan');
    console.log('   npm run monitor      # System monitoring');
    console.log('   npm run dashboard    # Monitoring dashboard');
    console.log('   npm run test:e2e     # End-to-end testing');

    // Save final report
    const report = {
      ...this.reports,
      timestamp: new Date().toISOString(),
      assessment: finalScore >= 75 ? 'READY' : 'NEEDS_WORK'
    };

    fs.writeFileSync('mcp-final-system-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Final report saved to mcp-final-system-report.json');

    return report;
  }

  async runFinalAssessment() {
    console.log('🤖 AUDIO TAILOC MCP - FINAL SYSTEM ASSESSMENT');
    console.log('='.repeat(60));
    console.log(`Assessment started at: ${new Date().toISOString()}`);
    console.log('='.repeat(60));

    await this.checkSystemStatus();
    await this.checkAPIEndpoints();
    await this.checkDataIntegrity();
    await this.checkImprovements();

    return this.generateFinalReport();
  }
}

// Run final assessment
async function main() {
  const finalReport = new AudioTailocFinalReport();
  await finalReport.runFinalAssessment();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = AudioTailocFinalReport;
