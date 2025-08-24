const axios = require('axios');

const BASE_URL = 'http://localhost:3010/api/v1';

// Test data
const testData = {
  contentGeneration: {
    prompt: 'Viết mô tả sản phẩm tai nghe cao cấp',
    type: 'product_description',
    tone: 'professional',
    maxLength: 300
  },
  
  sentimentAnalysis: {
    text: 'Sản phẩm này thật tuyệt vời! Tôi rất hài lòng với chất lượng.',
    context: 'customer_feedback'
  },
  
  textClassification: {
    text: 'Tôi muốn mua tai nghe bluetooth',
    categories: ['purchase_inquiry', 'technical_support', 'complaint', 'general_question']
  },
  
  languageDetection: {
    text: 'Hello, I would like to buy headphones'
  },
  
  textSummarization: {
    text: 'Tai nghe Tài Lộc Pro là sản phẩm cao cấp với công nghệ âm thanh tiên tiến. Sản phẩm có thiết kế đẹp mắt, chất lượng âm thanh tuyệt vời và giá cả hợp lý. Khách hàng đánh giá rất cao về độ bền và hiệu suất của sản phẩm.',
    maxSentences: 2
  },
  
  keywordExtraction: {
    text: 'Tai nghe bluetooth không dây với công nghệ noise cancellation và thời lượng pin lên đến 30 giờ',
    maxKeywords: 5
  },
  
  translation: {
    text: 'Tôi muốn mua tai nghe',
    targetLanguage: 'English',
    sourceLanguage: 'Vietnamese'
  },
  
  customerIntent: {
    message: 'Tôi đang tìm kiếm tai nghe có giá dưới 1 triệu đồng',
    userId: 'test_user_123'
  },
  
  predictiveAnalytics: {
    metric: 'sales',
    dateFrom: '2024-01-01',
    dateTo: '2024-12-31'
  },
  
  personalization: {
    userId: 'test_user_123',
    context: 'homepage'
  }
};

// Helper function to make API calls
async function makeRequest(endpoint, data = null, method = 'POST') {
  try {
    const config = {
      method,
      url: `${BASE_URL}/ai/${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.response?.data || error.message);
    return null;
  }
}

// Test functions
async function testContentGeneration() {
  console.log('\n🧠 Testing Content Generation...');
  const result = await makeRequest('generate-content', testData.contentGeneration);
  if (result) {
    console.log('✅ Content Generation:', {
      success: result.success,
      contentLength: result.content?.length,
      metadata: result.metadata
    });
  }
}

async function testSentimentAnalysis() {
  console.log('\n😊 Testing Sentiment Analysis...');
  const result = await makeRequest('analyze-sentiment', testData.sentimentAnalysis);
  if (result) {
    console.log('✅ Sentiment Analysis:', {
      sentiment: result.sentiment,
      confidence: result.confidence,
      emotions: result.emotions,
      score: result.score
    });
  }
}

async function testTextClassification() {
  console.log('\n🏷️ Testing Text Classification...');
  const result = await makeRequest('classify-text', testData.textClassification);
  if (result) {
    console.log('✅ Text Classification:', {
      category: result.category,
      confidence: result.confidence,
      alternatives: result.alternatives
    });
  }
}

async function testLanguageDetection() {
  console.log('\n🌍 Testing Language Detection...');
  const result = await makeRequest('detect-language', testData.languageDetection);
  if (result) {
    console.log('✅ Language Detection:', {
      language: result.language,
      confidence: result.confidence,
      name: result.name
    });
  }
}

async function testTextSummarization() {
  console.log('\n📝 Testing Text Summarization...');
  const result = await makeRequest('summarize-text', testData.textSummarization);
  if (result) {
    console.log('✅ Text Summarization:', {
      summary: result.summary,
      compressionRatio: result.compressionRatio,
      originalLength: result.originalLength,
      summaryLength: result.summaryLength
    });
  }
}

async function testKeywordExtraction() {
  console.log('\n🔑 Testing Keyword Extraction...');
  const result = await makeRequest('extract-keywords', testData.keywordExtraction);
  if (result) {
    console.log('✅ Keyword Extraction:', {
      keywords: result.keywords,
      keywordCount: result.keywords?.length
    });
  }
}

async function testTranslation() {
  console.log('\n🌐 Testing Translation...');
  const result = await makeRequest('translate', testData.translation);
  if (result) {
    console.log('✅ Translation:', {
      original: result.original,
      translation: result.translation,
      targetLanguage: result.targetLanguage
    });
  }
}

async function testCustomerIntentDetection() {
  console.log('\n🎯 Testing Customer Intent Detection...');
  const result = await makeRequest('detect-intent', testData.customerIntent);
  if (result) {
    console.log('✅ Customer Intent Detection:', {
      intent: result.intent,
      confidence: result.confidence,
      urgency: result.urgency,
      suggestedAction: result.suggestedAction
    });
  }
}

async function testPredictiveAnalytics() {
  console.log('\n📊 Testing Predictive Analytics...');
  const result = await makeRequest('predictive-analytics', testData.predictiveAnalytics);
  if (result) {
    console.log('✅ Predictive Analytics:', {
      metric: result.metric,
      prediction: result.prediction,
      confidence: result.confidence
    });
  }
}

async function testPersonalization() {
  console.log('\n👤 Testing Personalization...');
  const result = await makeRequest('personalize', testData.personalization);
  if (result) {
    console.log('✅ Personalization:', {
      userId: result.userId,
      recommendationsCount: result.recommendations?.length,
      preferences: result.preferences
    });
  }
}

async function testAIHealth() {
  console.log('\n🏥 Testing AI Health...');
  const result = await makeRequest('health', null, 'GET');
  if (result) {
    console.log('✅ AI Health:', {
      status: result.status,
      services: result.services,
      version: result.version
    });
  }
}

async function testAICapabilities() {
  console.log('\n⚡ Testing AI Capabilities...');
  const result = await makeRequest('capabilities', null, 'GET');
  if (result) {
    console.log('✅ AI Capabilities:', {
      capabilitiesCount: result.capabilities?.length,
      enabledCapabilities: result.capabilities?.filter(c => c.enabled).length,
      models: Object.keys(result.models || {})
    });
  }
}

async function testImageAnalysis() {
  console.log('\n🖼️ Testing Image Analysis...');
  const result = await makeRequest('analyze-image', {
    imageUrl: 'https://example.com/test-image.jpg',
    analysisType: 'general'
  });
  if (result) {
    console.log('✅ Image Analysis:', {
      analysis: result.analysis,
      imageUrl: result.imageUrl
    });
  }
}

async function testVoiceToText() {
  console.log('\n🎤 Testing Voice to Text...');
  const result = await makeRequest('voice-to-text', {
    audioUrl: 'https://example.com/test-audio.mp3',
    language: 'vi'
  });
  if (result) {
    console.log('✅ Voice to Text:', {
      text: result.text,
      confidence: result.confidence,
      language: result.language
    });
  }
}

async function testTextToSpeech() {
  console.log('\n🔊 Testing Text to Speech...');
  const result = await makeRequest('text-to-speech', {
    text: 'Xin chào, đây là test text to speech',
    voice: 'default',
    language: 'vi'
  });
  if (result) {
    console.log('✅ Text to Speech:', {
      audioUrl: result.audioUrl,
      text: result.text,
      duration: result.duration
    });
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting AI Features Testing...');
  console.log(`📍 Base URL: ${BASE_URL}`);
  
  try {
    // Test core AI features
    await testContentGeneration();
    await testSentimentAnalysis();
    await testTextClassification();
    await testLanguageDetection();
    await testTextSummarization();
    await testKeywordExtraction();
    await testTranslation();
    
    // Test business-specific features
    await testCustomerIntentDetection();
    await testPredictiveAnalytics();
    await testPersonalization();
    
    // Test system features
    await testAIHealth();
    await testAICapabilities();
    
    // Test advanced features (stubs)
    await testImageAnalysis();
    await testVoiceToText();
    await testTextToSpeech();
    
    console.log('\n🎉 All AI Features Tests Completed!');
    
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testData,
  makeRequest
};
