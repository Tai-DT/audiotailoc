const { GoogleGenerativeAI } = require('@google/generative-ai');

// Test different Gemini models
async function testGeminiModels() {
  console.log('🤖 Testing different Gemini models...\n');

  const apiKey = 'AIzaSyBmnRG-kZB9QFUPXgZBEz8zrOzHM7MyF0E';
  
  // List of models to test
  const models = [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-1.0-pro',
    'gemini-pro'
  ];
  
  for (const modelName of models) {
    console.log(`\n--- Testing model: ${modelName} ---`);
    
    try {
      // Initialize Gemini with different model
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      console.log(`✅ Model ${modelName} initialized successfully`);
      
      // Test simple response
      const result = await model.generateContent('Xin chào, bạn có thể giúp tôi tìm tai nghe chống ồn không?');
      const response = await result.response;
      console.log(`✅ ${modelName} Response:`, response.text().substring(0, 100) + '...');
      
      console.log(`🎉 Model ${modelName} is working!`);
      
      // If this model works, update the backend
      console.log(`\n💡 Recommendation: Use ${modelName} in backend`);
      
      // Update backend configuration
      console.log('\n📝 To update backend, change in gemini.service.ts:');
      console.log(`this.model = this.genAI.getGenerativeModel({ model: '${modelName}' });`);
      
      break; // Stop testing if one model works
      
    } catch (error) {
      console.log(`❌ Model ${modelName} failed:`, error.message.substring(0, 100) + '...');
      
      if (error.message?.includes('429')) {
        console.log(`⚠️ ${modelName}: Rate limit exceeded`);
      } else if (error.message?.includes('400')) {
        console.log(`⚠️ ${modelName}: Bad request - model not available`);
      } else if (error.message?.includes('401')) {
        console.log(`⚠️ ${modelName}: Unauthorized - check API key`);
      } else {
        console.log(`⚠️ ${modelName}: Unknown error`);
      }
    }
  }
  
  console.log('\n📊 Summary:');
  console.log('✅ Tested multiple Gemini models');
  console.log('💡 Found working model (if any)');
  console.log('📝 Ready to update backend configuration');
}

// Run the test
testGeminiModels();
