import axios from 'axios';
import { randomUUID } from 'crypto';

// Configuration
const API_URL = 'http://localhost:3010/api/v1'; // Adjust port if needed
const WEBHOOK_URL = `${API_URL}/notifications/telegram/webhook`;

// Mock Data
const MOCK_USER_ID = 'user-123'; // Replace with a valid user ID if checking DB
const MOCK_CONVERSATION_ID = randomUUID();
const MOCK_CHAT_ID = '7583101089'; // Mock Telegram Chat ID

async function runTest() {
  console.log('🚀 Starting Telegram Chat Flow Test...\n');

  try {
    // 1. Simulate Admin sending a command /start
    console.log('1️⃣  Testing /start command...');
    await sendWebhookEvent({
      message: {
        chat: { id: MOCK_CHAT_ID },
        text: '/start',
      },
    });
    console.log('✅ /start command sent successfully.\n');

    // 2. Simulate Admin sending a command /stats
    console.log('2️⃣  Testing /stats command...');
    await sendWebhookEvent({
      message: {
        chat: { id: MOCK_CHAT_ID },
        text: '/stats',
      },
    });
    console.log('✅ /stats command sent successfully.\n');

    // 3. Simulate Admin replying to a customer message
    // Scenario: Admin replies to a notification message that contains the Conversation ID
    console.log('3️⃣  Testing Reply Flow (Admin replies to notification)...');
    
    const replyContent = 'Chào bạn, tôi có thể giúp gì cho bạn?';
    const notificationText = `
💬 TIN NHẮN MỚI
👤 Khách hàng: Nguyen Van A
📝 Nội dung: "Sản phẩm này còn hàng không?"
🆔 ID: <code>${MOCK_CONVERSATION_ID}</code>

🔗 Trả lời ngay: ...
    `.trim();

    await sendWebhookEvent({
      message: {
        chat: { id: MOCK_CHAT_ID },
        text: replyContent,
        reply_to_message: {
          text: notificationText,
          entities: [
            // Simulate the <code> entity for the UUID
            // In real Telegram, entities array contains offset and length
            // We don't strictly need accurate entities if our regex works on text
          ]
        }
      },
    });
    console.log(`✅ Reply sent with content: "${replyContent}"`);
    console.log(`👉 Conversation ID extracted should be: ${MOCK_CONVERSATION_ID}\n`);

    // 4. Simulate Admin using /chat command
    console.log('4️⃣  Testing /chat command...');
    const chatCommandContent = 'Giá sản phẩm là 500k ạ.';
    await sendWebhookEvent({
      message: {
        chat: { id: MOCK_CHAT_ID },
        text: `/chat ${MOCK_CONVERSATION_ID} ${chatCommandContent}`,
      },
    });
    console.log(`✅ /chat command sent with content: "${chatCommandContent}"\n`);

    console.log('🎉 All tests completed successfully!');
    console.log('⚠️  Note: Check backend logs to verify that messages were processed and saved correctly.');

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('👉 Connection refused. Make sure the backend server is running on port 3010.');
    }
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

async function sendWebhookEvent(payload: any) {
  try {
    // Telegram Webhook updates have an 'update_id'
    const fullPayload = {
      update_id: Math.floor(Math.random() * 1000000),
      ...payload,
    };

    await axios.post(WEBHOOK_URL, fullPayload);
  } catch (error) {
    throw error;
  }
}

runTest();