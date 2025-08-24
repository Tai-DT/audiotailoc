const axios = require('axios');

const BACKEND_URL = 'http://localhost:3010/api/v1';

// Test configuration
const TEST_USER = {
  email: 'admin@audiotailoc.com',
  password: 'Admin123!'
};

let authToken = null;

// Utility functions
const log = (message, type = 'INFO') => {
  const timestamp = new Date().toISOString();
  const color = type === 'ERROR' ? '\x1b[31m' : type === 'SUCCESS' ? '\x1b[32m' : type === 'WARNING' ? '\x1b[33m' : '\x1b[36m';
  console.log(`${color}[${timestamp}] ${type}: ${message}\x1b[0m`);
};

const testEndpoint = async (method, endpoint, data = null, headers = {}) => {
  try {
    const config = {
      method,
      url: `${BACKEND_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        ...headers,
      },
      ...(data && { data }),
    };

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message, 
      status: error.response?.status 
    };
  }
};

// Test functions
async function testAuthentication() {
  log('Testing authentication...');
  
  const loginResult = await testEndpoint('POST', '/auth/login', {
    email: TEST_USER.email,
    password: TEST_USER.password,
  });

  if (loginResult.success) {
    authToken = loginResult.data.data.accessToken;
    log('Authentication successful', 'SUCCESS');
    return true;
  } else {
    log(`Authentication failed: ${loginResult.error}`, 'ERROR');
    return false;
  }
}

async function testDataCollection() {
  log('Testing data collection endpoints...');

  const tests = [
    {
      name: 'Track Search Query',
      endpoint: '/data-collection/track/search',
      method: 'POST',
      data: {
        query: 'audio equipment',
        sessionId: 'test-session-123',
        resultCount: 5,
        clickedResults: ['prod-1', 'prod-2'],
        searchDuration: 2500,
      },
    },
    {
      name: 'Track Customer Question',
      endpoint: '/data-collection/track/question',
      method: 'POST',
      data: {
        question: 'What is the best audio system for home use?',
        sessionId: 'test-session-123',
        category: 'audio-systems',
        source: 'chat',
        satisfaction: 4,
      },
    },
    {
      name: 'Track Product View',
      endpoint: '/data-collection/track/product-view',
      method: 'POST',
      data: {
        productId: 'prod-1',
        sessionId: 'test-session-123',
        duration: 120,
        source: 'search',
        referrer: 'google.com',
      },
    },
    {
      name: 'Track Service View',
      endpoint: '/data-collection/track/service-view',
      method: 'POST',
      data: {
        serviceId: 'service-1',
        sessionId: 'test-session-123',
        duration: 180,
        source: 'category',
        referrer: 'internal',
      },
    },
  ];

  for (const test of tests) {
    const result = await testEndpoint(test.method, test.endpoint, test.data);
    if (result.success) {
      log(`${test.name}: SUCCESS`, 'SUCCESS');
    } else {
      log(`${test.name}: FAILED - ${result.error}`, 'ERROR');
    }
  }
}

async function testDataAnalytics() {
  log('Testing data analytics endpoints...');

  const tests = [
    {
      name: 'Search Analytics',
      endpoint: '/data-collection/analytics/search',
      method: 'GET',
    },
    {
      name: 'Question Analytics',
      endpoint: '/data-collection/analytics/questions',
      method: 'GET',
    },
    {
      name: 'Product View Analytics',
      endpoint: '/data-collection/analytics/product-views',
      method: 'GET',
    },
    {
      name: 'Service View Analytics',
      endpoint: '/data-collection/analytics/service-views',
      method: 'GET',
    },
    {
      name: 'Analytics Summary',
      endpoint: '/data-collection/analytics/summary',
      method: 'GET',
    },
  ];

  for (const test of tests) {
    const result = await testEndpoint(test.method, test.endpoint);
    if (result.success) {
      log(`${test.name}: SUCCESS`, 'SUCCESS');
      console.log(`  Data:`, JSON.stringify(result.data, null, 2));
    } else {
      log(`${test.name}: FAILED - ${result.error}`, 'ERROR');
    }
  }
}

async function testCustomerInsights() {
  log('Testing customer insights endpoints...');

  const tests = [
    {
      name: 'Customer Engagement Metrics',
      endpoint: '/customer-insights/engagement-metrics',
      method: 'GET',
    },
    {
      name: 'Customer Satisfaction Trends',
      endpoint: '/customer-insights/satisfaction-trends',
      method: 'GET',
    },
    {
      name: 'Customer Needs Analysis',
      endpoint: '/customer-insights/needs',
      method: 'GET',
    },
    {
      name: 'Improvement Suggestions',
      endpoint: '/customer-insights/improvements',
      method: 'GET',
    },
    {
      name: 'Customer Segments',
      endpoint: '/customer-insights/segments',
      method: 'GET',
    },
    {
      name: 'Insights Summary',
      endpoint: '/customer-insights/summary',
      method: 'GET',
    },
  ];

  for (const test of tests) {
    const result = await testEndpoint(test.method, test.endpoint);
    if (result.success) {
      log(`${test.name}: SUCCESS`, 'SUCCESS');
      console.log(`  Data:`, JSON.stringify(result.data, null, 2));
    } else {
      log(`${test.name}: FAILED - ${result.error}`, 'ERROR');
    }
  }
}

async function testAIFeatures() {
  log('Testing AI analysis features...');

  const tests = [
    {
      name: 'AI Chat',
      endpoint: '/ai/chat',
      method: 'POST',
      data: {
        message: 'What audio equipment do you recommend for a home studio?',
        sessionId: 'test-ai-session',
      },
    },
    {
      name: 'Product Recommendations',
      endpoint: '/ai/recommendations',
      method: 'POST',
      data: {
        query: 'professional audio equipment',
      },
    },
  ];

  for (const test of tests) {
    const result = await testEndpoint(test.method, test.endpoint, test.data);
    if (result.success) {
      log(`${test.name}: SUCCESS`, 'SUCCESS');
      console.log(`  Response:`, JSON.stringify(result.data, null, 2));
    } else {
      log(`${test.name}: FAILED - ${result.error}`, 'ERROR');
    }
  }
}

async function generateSampleData() {
  log('Generating sample data for testing...');

  const sampleData = [
    // Search queries
    { query: 'audio system', category: 'audio' },
    { query: 'microphone', category: 'recording' },
    { query: 'speaker', category: 'audio' },
    { query: 'headphones', category: 'audio' },
    { query: 'studio equipment', category: 'professional' },
    
    // Questions
    { question: 'What is the best audio system for home use?', category: 'audio-systems' },
    { question: 'How to set up a home studio?', category: 'studio-setup' },
    { question: 'Which microphone is best for vocals?', category: 'microphones' },
    { question: 'What speakers are good for mixing?', category: 'speakers' },
    { question: 'How to connect audio equipment?', category: 'technical' },
    
    // Product views
    { productId: 'prod-1', duration: 120 },
    { productId: 'prod-2', duration: 180 },
    { productId: 'prod-3', duration: 90 },
    { productId: 'prod-4', duration: 150 },
    { productId: 'prod-5', duration: 200 },
    
    // Service views
    { serviceId: 'service-1', duration: 300 },
    { serviceId: 'service-2', duration: 250 },
    { serviceId: 'service-3', duration: 180 },
  ];

  for (const data of sampleData) {
    if (data.query) {
      await testEndpoint('POST', '/data-collection/track/search', {
        query: data.query,
        sessionId: 'sample-data-session',
        resultCount: Math.floor(Math.random() * 10) + 1,
        searchDuration: Math.floor(Math.random() * 5000) + 1000,
      });
    }
    
    if (data.question) {
      await testEndpoint('POST', '/data-collection/track/question', {
        question: data.question,
        sessionId: 'sample-data-session',
        category: data.category,
        source: 'chat',
        satisfaction: Math.floor(Math.random() * 5) + 1,
      });
    }
    
    if (data.productId) {
      await testEndpoint('POST', '/data-collection/track/product-view', {
        productId: data.productId,
        sessionId: 'sample-data-session',
        duration: data.duration,
        source: 'search',
      });
    }
    
    if (data.serviceId) {
      await testEndpoint('POST', '/data-collection/track/service-view', {
        serviceId: data.serviceId,
        sessionId: 'sample-data-session',
        duration: data.duration,
        source: 'category',
      });
    }
  }

  log('Sample data generation completed', 'SUCCESS');
}

async function runAllTests() {
  log('Starting comprehensive data collection and AI analysis test...', 'INFO');
  
  // Test authentication
  const authSuccess = await testAuthentication();
  if (!authSuccess) {
    log('Cannot proceed without authentication', 'ERROR');
    return;
  }

  // Generate sample data
  await generateSampleData();

  // Test data collection
  await testDataCollection();

  // Test analytics
  await testDataAnalytics();

  // Test customer insights
  await testCustomerInsights();

  // Test AI features
  await testAIFeatures();

  log('All tests completed!', 'SUCCESS');
}

// Run the tests
runAllTests().catch(console.error);
