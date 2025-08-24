const axios = require('axios');

const BASE_URL = 'http://localhost:3010/api/v1/ai';

async function makeRequest(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message,
      status: error.response?.status 
    };
  }
}

async function testCoreAIFeatures() {
  console.log('🤖 Testing Core AI Features for Audio Tài Lộc...\n');
  
  const tests = [
    {
      name: 'Health Check',
      endpoint: '/health',
      method: 'GET',
      data: null
    },
    {
      name: 'Content Generation',
      endpoint: '/generate-content',
      method: 'POST',
      data: {
        prompt: 'Tạo mô tả sản phẩm tai nghe cao cấp',
        type: 'product_description',
        tone: 'professional',
        maxLength: 200
      }
    },
    {
      name: 'Sentiment Analysis',
      endpoint: '/analyze-sentiment',
      method: 'POST',
      data: {
        text: 'Sản phẩm rất tốt! Tôi rất hài lòng với chất lượng âm thanh.',
        context: 'customer_feedback'
      }
    },
    {
      name: 'Text Classification',
      endpoint: '/classify-text',
      method: 'POST',
      data: {
        text: 'Tôi muốn mua tai nghe bluetooth',
        categories: ['purchase_inquiry', 'technical_support', 'complaint', 'general_question']
      }
    },
    {
      name: 'Translation',
      endpoint: '/translate',
      method: 'POST',
      data: {
        text: 'Hello, I want to buy headphones',
        targetLanguage: 'vi',
        sourceLanguage: 'en'
      }
    },
    {
      name: 'Customer Intent Detection',
      endpoint: '/detect-intent',
      method: 'POST',
      data: {
        message: 'Tôi muốn mua loa bluetooth giá rẻ',
        userId: 'test_user_123'
      }
    },
    {
      name: 'Personalization',
      endpoint: '/personalize',
      method: 'POST',
      data: {
        userId: 'test_user_123',
        context: 'homepage'
      }
    },
    {
      name: 'Product Recommendations',
      endpoint: '/recommendations',
      method: 'POST',
      data: {
        query: 'tai nghe chống ồn'
      }
    },
    {
      name: 'Capabilities',
      endpoint: '/capabilities',
      method: 'GET',
      data: null
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    console.log(`🔍 Testing: ${test.name}`);
    
    const result = await makeRequest(test.method, test.endpoint, test.data);
    
    if (result.success) {
      console.log(`✅ ${test.name}: PASSED`);
      if (test.name === 'Health Check') {
        console.log(`   Status: ${result.data.data.status}`);
        console.log(`   Services: ${JSON.stringify(result.data.data.services)}`);
      }
      passed++;
    } else {
      console.log(`❌ ${test.name}: FAILED`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Error: ${JSON.stringify(result.error)}`);
      failed++;
    }
    
    console.log('');
  }
  
  console.log('📊 Test Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All core AI features are working perfectly!');
  } else {
    console.log('\n⚠️  Some features need attention.');
  }
  
  console.log('\n📋 Core AI Features for Audio Tài Lộc:');
  console.log('• Content Generation - Tạo mô tả sản phẩm, bài viết marketing');
  console.log('• Sentiment Analysis - Phân tích feedback khách hàng');
  console.log('• Text Classification - Phân loại tin nhắn khách hàng');
  console.log('• Translation - Dịch thuật đa ngôn ngữ');
  console.log('• Customer Intent Detection - Hiểu ý định khách hàng');
  console.log('• Personalization - Gợi ý sản phẩm cá nhân hóa');
  console.log('• Product Recommendations - Tư vấn sản phẩm thông minh');
  console.log('• Chat System - Hỗ trợ khách hàng tự động');
}

testCoreAIFeatures().catch(console.error);
