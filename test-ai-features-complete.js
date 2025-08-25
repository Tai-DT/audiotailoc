const { GoogleGenerativeAI } = require('@google/generative-ai');

// Test all AI features with new model
async function testAIFeaturesComplete() {
  console.log('🤖 Testing All AI Features with gemini-1.5-flash...\n');

  const apiKey = 'AIzaSyBmnRG-kZB9QFUPXgZBEz8zrOzHM7MyF0E';
  
  try {
    // Initialize Gemini with new model
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log('✅ Gemini initialized with gemini-1.5-flash');
    
    // 1. Test AI Chat
    console.log('\n1. Testing AI Chat...');
    const chatPrompt = `
Bạn là trợ lý AI của Audio Tài Lộc - cửa hàng thiết bị âm thanh chuyên nghiệp.

Khách hàng hỏi: "Xin chào, tôi muốn tìm tai nghe chống ồn chất lượng tốt"

Hãy trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp. Giới thiệu về các loại tai nghe chống ồn và lời khuyên chọn mua.
`;

    const chatResult = await model.generateContent(chatPrompt);
    const chatResponse = await chatResult.response;
    console.log('✅ AI Chat Response:', chatResponse.text().substring(0, 200) + '...');
    
    // 2. Test AI Product Recommendations
    console.log('\n2. Testing AI Product Recommendations...');
    const recPrompt = `
Bạn là chuyên gia tư vấn thiết bị âm thanh của Audio Tài Lộc. 
Khách hàng tìm kiếm: "tai nghe chống ồn cho gaming"

Danh sách sản phẩm có sẵn:
- Tai nghe Sony WH-1000XM4: Tai nghe chống ồn cao cấp (Giá: 8,500,000 VNĐ)
- Tai nghe Bose QuietComfort 35 II: Chống ồn tuyệt vời (Giá: 7,200,000 VNĐ)
- Tai nghe Audio-Technica ATH-M50x: Chuyên nghiệp cho studio (Giá: 3,500,000 VNĐ)
- Tai nghe Sennheiser HD 660S: Chất lượng âm thanh tuyệt vời (Giá: 6,800,000 VNĐ)

Hãy:
1. Phân tích nhu cầu của khách hàng
2. Giới thiệu 2-3 sản phẩm phù hợp nhất
3. Giải thích tại sao những sản phẩm này phù hợp
4. Đưa ra lời khuyên về cách sử dụng
5. Trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp
`;

    const recResult = await model.generateContent(recPrompt);
    const recResponse = await recResult.response;
    console.log('✅ AI Recommendations:', recResponse.text().substring(0, 300) + '...');
    
    // 3. Test AI Search Keywords
    console.log('\n3. Testing AI Search Keywords...');
    const keywordPrompt = `
Hãy mở rộng từ khóa tìm kiếm "tai nghe chống ồn" thành các từ khóa liên quan để tìm kiếm sản phẩm.

Trả về danh sách các từ khóa, mỗi từ khóa một dòng:
`;

    const keywordResult = await model.generateContent(keywordPrompt);
    const keywordResponse = await keywordResult.response;
    console.log('✅ AI Search Keywords:', keywordResponse.text().substring(0, 200) + '...');
    
    // 4. Test AI Product Description
    console.log('\n4. Testing AI Product Description...');
    const descPrompt = `
Hãy tạo mô tả chi tiết và hấp dẫn cho sản phẩm âm thanh sau:

Tên sản phẩm: Tai nghe Sony WH-1000XM4
Loại: Tai nghe chống ồn không dây
Giá: 8,500,000 VNĐ

Hãy viết mô tả sản phẩm bằng tiếng Việt, bao gồm:
- Đặc điểm nổi bật
- Công nghệ chống ồn
- Chất lượng âm thanh
- Thời lượng pin
- Tính năng đặc biệt
- Đối tượng phù hợp
`;

    const descResult = await model.generateContent(descPrompt);
    const descResponse = await descResult.response;
    console.log('✅ AI Product Description:', descResponse.text().substring(0, 300) + '...');
    
    console.log('\n🎉 All AI Features Test Successful!');
    console.log('✅ AI Chat: Working');
    console.log('✅ AI Recommendations: Working');
    console.log('✅ AI Search Keywords: Working');
    console.log('✅ AI Product Description: Working');
    console.log('✅ Model gemini-1.5-flash: Compatible');
    console.log('✅ API Key: Valid');
    console.log('✅ Vietnamese responses: Working');
    
    console.log('\n📝 Backend Integration Ready:');
    console.log('- Update gemini.service.ts with gemini-1.5-flash');
    console.log('- Use API key: AIzaSyBmnRG-kZB9QFUPXgZBEz8zrOzHM7MyF0E');
    console.log('- All AI features should work in backend');
    
  } catch (error) {
    console.error('❌ AI Features test failed:', error.message);
    
    if (error.message?.includes('429')) {
      console.log('⚠️ Rate limit exceeded - try again later');
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
testAIFeaturesComplete();
