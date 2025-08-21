// Test chat analysis và search features
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testChatAnalysis() {
  try {
    console.log('🔍 Testing Chat Analysis Features...\n');

    // 1. Create test chat session
    console.log('1️⃣ Creating test chat session...');
    const testSession = await prisma.chatSession.create({
      data: {
        source: 'WEB',
        status: 'OPEN'
      }
    });

    // 2. Add test messages
    console.log('2️⃣ Adding test messages...');
    await prisma.chatMessage.createMany({
      data: [
        {
          sessionId: testSession.id,
          role: 'USER',
          text: 'Xin chào, tôi muốn mua tai nghe chống ồn'
        },
        {
          sessionId: testSession.id,
          role: 'ASSISTANT',
          text: 'Chào bạn! Chúng tôi có Tai nghe Tài Lộc Pro với chống ồn chủ động rất tốt.'
        },
        {
          sessionId: testSession.id,
          role: 'USER',
          text: 'Giá bao nhiêu và có bảo hành không?'
        },
        {
          sessionId: testSession.id,
          role: 'ASSISTANT',
          text: 'Tai nghe Tài Lộc Pro giá 2.990.000 VNĐ và có bảo hành 24 tháng.'
        },
        {
          sessionId: testSession.id,
          role: 'USER',
          text: 'Tuyệt vời! Tôi sẽ mua. Cảm ơn bạn rất nhiều.'
        }
      ]
    });

    console.log(`✅ Created test session: ${testSession.id}`);
    console.log('📊 Messages added successfully!\n');

    // 3. Test chat search 
    console.log('3️⃣ Testing chat search...');
    const sessions = await prisma.chatSession.findMany({
      where: {
        messages: {
          some: {
            text: {
              contains: 'tai nghe',
              mode: 'insensitive'
            }
          }
        }
      },
      include: {
        messages: true
      }
    });

    console.log(`🔍 Found ${sessions.length} sessions with "tai nghe"`);
    
    // 4. Display session info
    if (sessions.length > 0) {
      const session = sessions[0];
      console.log(`📝 Session ${session.id}:`);
      console.log(`   - Status: ${session.status}`);
      console.log(`   - Messages: ${session.messages.length}`);
      console.log(`   - Created: ${session.createdAt.toLocaleString('vi-VN')}`);
      
      console.log('\n💬 Messages:');
      session.messages.forEach((msg, index) => {
        console.log(`   ${index + 1}. [${msg.role}] ${msg.text.substring(0, 50)}...`);
      });
    }

    console.log('\n🎉 Chat analysis setup completed!');
    console.log('\n📋 Available API endpoints:');
    console.log('   POST /api/v1/ai/analyze-chat - Phân tích chat với AI');
    console.log('   POST /api/v1/ai/search-chats - Tìm kiếm lịch sử chat');
    console.log('   POST /api/v1/ai/summarize-chats - Tóm tắt nhiều chat');
    console.log('   POST /api/v1/ai/chat-insights - Báo cáo insights');
    console.log('   GET  /api/v1/ai/chat-sessions - Danh sách chat sessions');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Chỉ chạy nếu được gọi trực tiếp
if (require.main === module) {
  testChatAnalysis();
}

export { testChatAnalysis };
