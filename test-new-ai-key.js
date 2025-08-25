const { GoogleGenerativeAI } = require('@google/generative-ai');

// Test Gemini API with new key
async function testNewGeminiKey() {
  console.log('🤖 Testing Gemini API with new key...\n');

  const apiKey = 'AIzaSyBmnRG-kZB9QFUPXgZBEz8zrOzHM7MyF0E';
  
  try {
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    console.log('✅ Gemini initialized successfully with new key');
    
    // Test simple response
    console.log('\n1. Testing simple response...');
    const result = await model.generateContent('Xin chào, bạn có thể giúp tôi tìm tai nghe chống ồn không?');
    const response = await result.response;
    console.log('✅ Response:', response.text().substring(0, 200) + '...');
    
    // Test product recommendation
    console.log('\n2. Testing product recommendation...');
    const productPrompt = `
Bạn là chuyên gia tư vấn thiết bị âm thanh của Audio Tài Lộc. 
Khách hàng tìm kiếm: "tai nghe chống ồn cho gaming"

Danh sách sản phẩm có sẵn:
- Tai nghe Sony WH-1000XM4: Tai nghe chống ồn cao cấp (Giá: 8,500,000 VNĐ)
- Tai nghe Bose QuietComfort 35 II: Chống ồn tuyệt vời (Giá: 7,200,000 VNĐ)
- Tai nghe Audio-Technica ATH-M50x: Chuyên nghiệp cho studio (Giá: 3,500,000 VNĐ)

Hãy giới thiệu 2-3 sản phẩm phù hợp nhất cho gaming và giải thích tại sao.
`;

    const productResult = await model.generateContent(productPrompt);
    const productResponse = await productResult.response;
    console.log('✅ Product recommendation:', productResponse.text().substring(0, 300) + '...');
    
    console.log('\n🎉 New Gemini API key test successful!');
    console.log('✅ New API key is valid');
    console.log('✅ Model gemini-1.5-pro is working');
    console.log('✅ Can generate responses in Vietnamese');
    console.log('✅ No rate limit issues');
    
    // Test backend integration
    console.log('\n3. Testing backend integration...');
    console.log('Now we can update the backend with this new API key');
    
  } catch (error) {
    console.error('❌ New Gemini API key test failed:', error.message);
    
    if (error.message?.includes('429')) {
      console.log('⚠️ Rate limit exceeded');
    } else if (error.message?.includes('400')) {
      console.log('⚠️ Bad request - check prompt format');
    } else if (error.message?.includes('401')) {
      console.log('⚠️ Unauthorized - check API key');
    } else {
      console.log('⚠️ Unknown error');
    }
  }
}

// Run the test
testNewGeminiKey();
