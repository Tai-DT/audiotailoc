import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking for Admin replies in database...');

  try {
    // Find latest messages with type 'ADMIN_REPLY'
    // Note: Adjust 'ADMIN_REPLY' if your actual implementation uses a different type string
    // Based on telegram.service.ts, we used 'ADMIN_REPLY'
    const messages = await prisma.messages.findMany({
      where: {
        senderType: 'ADMIN_REPLY', 
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      include: {
        users: {
            select: {
                email: true,
                name: true
            }
        }
      }
    });

    if (messages.length === 0) {
      console.log('❌ No admin replies found yet.');
    } else {
      console.log(`✅ Found ${messages.length} recent admin replies:`);
      messages.forEach((msg) => {
        console.log('--------------------------------------------------');
        console.log(`ID: ${msg.id}`);
        console.log(`To User: ${msg.users?.name} (${msg.users?.email})`);
        console.log(`Content: "${msg.content}"`);
        console.log(`Time: ${msg.createdAt.toLocaleString()}`);
      });
      console.log('--------------------------------------------------');
    }

  } catch (error) {
    console.error('❌ Error checking messages:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();