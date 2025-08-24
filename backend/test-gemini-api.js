const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
  const apiKey = 'AIzaSyCNyawNFTCG86rBUGbA_c0tyFiC2FHQE8Y';
  
  try {
    console.log('🔍 Testing Gemini API...');
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    console.log('✅ Model initialized successfully');
    
    const prompt = 'Say hello in Vietnamese';
    console.log(`📝 Sending prompt: "${prompt}"`);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ API Response:');
    console.log(text);
    
    return true;
  } catch (error) {
    console.error('❌ Gemini API Error:');
    console.error(error.message);
    
    if (error.message.includes('429')) {
      console.log('⚠️  Rate limit exceeded. Please wait and try again.');
    } else if (error.message.includes('401')) {
      console.log('⚠️  API key is invalid or expired.');
    } else if (error.message.includes('400')) {
      console.log('⚠️  Bad request. Check the model name.');
    }
    
    return false;
  }
}

testGeminiAPI().then(success => {
  if (success) {
    console.log('\n🎉 Gemini API is working correctly!');
  } else {
    console.log('\n💥 Gemini API test failed.');
  }
  process.exit(success ? 0 : 1);
});
