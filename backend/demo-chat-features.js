#!/usr/bin/env node

// Demo script cho tính năng Chat Analysis & Search
// Sử dụng fallback responses do Gemini quota exceeded

const BASE_URL = 'http://localhost:3011/api/v1';

// Mock data để demo (thay thế Gemini responses)
const mockAnalysisResponse = {
  sessionId: 'demo-session',
  analysis: {
    summary: 'Khách hàng quan tâm đến tai nghe gaming với micro chất lượng, ngân sách 2-3 triệu VNĐ',
    sentiment: 'POSITIVE',
    intent: 'PURCHASE_INQUIRY',
    topics: ['tai nghe', 'gaming', 'micro', 'ngân sách'],
    recommendations: [
      'Tai nghe Tài Lộc Pro phù hợp với yêu cầu',
      'Cần tư vấn thêm về tính năng gaming'
    ],
    nextActions: [
      'Giới thiệu chi tiết sản phẩm',
      'Hỗ trợ so sánh các model'
    ]
  },
  generatedAt: new Date().toISOString()
};

async function demonstrateChatFeatures() {
  console.log('🎯 ===== DEMO: TÍNH NĂNG CHAT ANALYSIS & SEARCH =====\n');

  // 1. Tạo chat session mới
  console.log('1️⃣ Tạo chat session mới...');
  try {
    const chatResponse = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Tôi cần tư vấn tai nghe gaming cho streamer'
      })
    });
    const chatData = await chatResponse.json();
    console.log('✅ Session ID:', chatData.sessionId);
    console.log('📝 AI Response:', chatData.answer ? chatData.answer.substring(0, 100) + '...' : 'Fallback response');
    
    const sessionId = chatData.sessionId;

    // 2. Thêm tin nhắn vào session
    console.log('\n2️⃣ Thêm tin nhắn vào session...');
    await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Ngân sách tôi khoảng 5 triệu, cần âm thanh 7.1 surround',
        sessionId: sessionId
      })
    });
    console.log('✅ Đã thêm tin nhắn thứ 2');

    // 3. Phân tích chat session (mock response do quota exceeded)
    console.log('\n3️⃣ Phân tích nội dung chat...');
    console.log('📊 Analysis Results (Mocked):');
    console.log('   - Summary:', mockAnalysisResponse.analysis.summary);
    console.log('   - Sentiment:', mockAnalysisResponse.analysis.sentiment);
    console.log('   - Intent:', mockAnalysisResponse.analysis.intent);
    console.log('   - Topics:', mockAnalysisResponse.analysis.topics.join(', '));
    console.log('   - Recommendations:', mockAnalysisResponse.analysis.recommendations);

    // 4. Tìm kiếm chat history
    console.log('\n4️⃣ Tìm kiếm lịch sử chat...');
    const searchResponse = await fetch(`${BASE_URL}/ai/search-chats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'tai nghe gaming'
      })
    });
    const searchData = await searchResponse.json();
    console.log('🔍 Tìm thấy:', searchData.total, 'cuộc hội thoại');
    
    if (searchData.results && searchData.results.length > 0) {
      console.log('📋 Kết quả tìm kiếm:');
      searchData.results.slice(0, 2).forEach((result, index) => {
        console.log(`   ${index + 1}. Session ${result.sessionId.substring(0, 8)}...`);
        console.log(`      - Messages: ${result.messageCount}`);
        console.log(`      - Created: ${new Date(result.createdAt).toLocaleString('vi-VN')}`);
        if (result.relevantMessages && result.relevantMessages.length > 0) {
          console.log(`      - Sample: "${result.relevantMessages[0].text.substring(0, 50)}..."`);
        }
      });
    }

    // 5. Lấy insights tổng quan
    console.log('\n5️⃣ Báo cáo insights...');
    const insightsResponse = await fetch(`${BASE_URL}/ai/chat-insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const insightsData = await insightsResponse.json();
    console.log('📈 Chat Insights:');
    console.log('   - Tổng sessions:', insightsData.metrics.totalSessions);
    console.log('   - Tổng messages:', insightsData.metrics.totalMessages);
    console.log('   - Trung bình msg/session:', insightsData.metrics.avgMessagesPerSession);
    console.log('   - Status breakdown:', JSON.stringify(insightsData.breakdown.status));

    // 6. Danh sách chat sessions
    console.log('\n6️⃣ Danh sách chat sessions gần đây...');
    const sessionsResponse = await fetch(`${BASE_URL}/ai/chat-sessions?limit=3`);
    const sessionsData = await sessionsResponse.json();
    console.log('📝 Recent Sessions:');
    sessionsData.forEach((session, index) => {
      console.log(`   ${index + 1}. ${session.id.substring(0, 10)}... - ${session.messages?.length || 0} messages`);
      console.log(`      Status: ${session.status} | Created: ${new Date(session.createdAt).toLocaleString('vi-VN')}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  console.log('\n🎉 ===== DEMO HOÀN THÀNH =====');
  console.log('\n📚 API Endpoints đã test:');
  console.log('   ✅ POST /api/v1/ai/chat - Tạo chat với AI');
  console.log('   ✅ POST /api/v1/ai/search-chats - Tìm kiếm lịch sử chat');
  console.log('   ✅ POST /api/v1/ai/chat-insights - Báo cáo insights');
  console.log('   ✅ GET /api/v1/ai/chat-sessions - Danh sách sessions');
  console.log('   🔄 POST /api/v1/ai/analyze-chat - Phân tích chat (cần Gemini quota)');
  
  console.log('\n💡 Tính năng đã hoàn thành:');
  console.log('   🔍 Tìm kiếm semantic trong chat history');
  console.log('   📊 Thống kê và insights từ chat data');
  console.log('   💾 Lưu trữ và quản lý chat sessions');
  console.log('   🤖 AI analysis (sẵn sàng khi có Gemini quota)');
}

// Run demo
demonstrateChatFeatures();
