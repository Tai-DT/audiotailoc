import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting test chat creation...');

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = (process.env.TELEGRAM_CHAT_IDS || '').split(',').map(id => id.trim()).filter(Boolean);

  // Nếu không có TELEGRAM_CHAT_IDS, thử dùng TELEGRAM_CHAT_ID (singular) làm fallback
  if (chatIds.length === 0 && process.env.TELEGRAM_CHAT_ID) {
    chatIds.push(process.env.TELEGRAM_CHAT_ID);
  }

  if (!botToken || chatIds.length === 0) {
    console.error('❌ Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_IDS in .env');
    process.exit(1);
  }

  try {
    // 1. Find or create a test user
    let user = await prisma.users.findFirst({
      where: { email: 'customer@example.com' },
    });

    if (!user) {
      console.log('Creating test customer...');
      user = await prisma.users.create({
        data: {
          id: uuidv4(),
          email: 'customer@example.com',
          name: 'Khách hàng Test',
          password: 'hashed_password_here', // Not important for this test
          role: 'USER',
          updatedAt: new Date(),
        },
      });
    } else {
        console.log(`Found existing user: ${user.email} (${user.id})`);
    }

    // 2. Create a real Conversation
    console.log('Creating test conversation...');
    const conversation = await prisma.conversations.create({
      data: {
        id: uuidv4(),
        userId: user.id,
        status: 'OPEN',
        updatedAt: new Date(),
      },
    });
    console.log(`✅ Created conversation ID: ${conversation.id}`);

    // 3. Create a Message in that conversation
    const messageContent = 'Xin chào, tôi cần tư vấn về sản phẩm Loa Marshall (Test Conversation).';
    const chatMessage = await prisma.messages.create({
      data: {
        id: uuidv4(),
        conversationId: conversation.id,
        senderId: user.id,
        senderType: 'USER',
        content: messageContent,
        createdAt: new Date(),
      }
    });
    console.log(`✅ Created message ID: ${chatMessage.id}`);

    // 4. Create a Notification (optional, but good for consistency)
    console.log('Creating test notification...');
    const notification = await prisma.notifications.create({
      data: {
        id: uuidv4(),
        userId: user.id,
        type: 'NEW_MESSAGE',
        title: 'Tin nhắn từ khách hàng',
        message: messageContent,
        isRead: false,
        updatedAt: new Date(),
        data: { conversationId: conversation.id } // Link to conversation
      },
    });
    console.log(`✅ Created notification ID: ${notification.id}`);

    // 5. Send notification to Telegram manually
    // IMPORTANT: We must send the CONVERSATION ID so the bot can reply to it.
    console.log('Sending notification to Telegram...');
    
    const message = `
💬 TIN NHẮN MỚI (TEST)
👤 Khách hàng: ${user.name}
📝 Nội dung: "${messageContent}"
🆔 ID: <code>${conversation.id}</code>

🔗 Trả lời ngay: ${process.env.DASHBOARD_URL}/dashboard/messages?id=${conversation.id}
💡 Tip: Reply tin nhắn này để trả lời trực tiếp cho khách hàng.
    `.trim();

    for (const chatId of chatIds) {
        try {
            await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML',
            });
            console.log(`✅ Sent to Telegram Chat ID: ${chatId}`);
        } catch (error) {
            console.error(`❌ Failed to send to ${chatId}:`, (error as any).message);
        }
    }

    console.log('--------------------------------------------------');
    console.log('🎉 Test Completed!');
    console.log('👉 Please check your Telegram bot. You should see a new message.');
    console.log('👉 Reply to that message with any text (e.g., "Chào bạn, tôi có thể giúp gì?")');
    console.log('👉 The bot should reply back confirming the message was sent.');
    console.log('--------------------------------------------------');

  } catch (error) {
    console.error('❌ Error creating test chat:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();