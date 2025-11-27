import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const CONVERSATION_ID = '7c760e3e-09be-4aee-b5e6-3cb1fe9ccff6';

async function main() {
  console.log(`🔍 Checking messages for conversation: ${CONVERSATION_ID}`);

  try {
    const messages = await prisma.messages.findMany({
      where: {
        conversationId: CONVERSATION_ID,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5, // Lấy 5 tin nhắn mới nhất
      include: {
        users: true, // Lấy thông tin người gửi
      }
    });

    if (messages.length === 0) {
      console.log('⚠️ No messages found.');
    } else {
      console.log('✅ Found messages:');
      messages.forEach((msg) => {
        const senderName = msg.senderType === 'ADMIN' ? 'Admin (from Telegram)' : (msg.users?.name || 'Unknown User');
        console.log(`[${msg.createdAt.toISOString()}] ${senderName}: ${msg.content}`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking messages:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();