/*
  Create Demo User Script
  Usage: npx tsx src/create-demo-user.ts
*/
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import 'dotenv/config';

const prisma = new PrismaClient();

async function createDemoUser() {
  console.log('🔧 Creating demo user...');

  const demoEmail = 'demo@audiotailoc.com';
  const demoPassword = 'demo123';
  const demoName = 'Demo User';

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(demoPassword, 12);

    // Check if demo user already exists
    const existingDemo = await prisma.users.findUnique({
      where: { email: demoEmail }
    });

    if (existingDemo) {
      console.log('✅ Demo user already exists, updating password...');
      await prisma.users.update({
        where: { email: demoEmail },
        data: {
          password: hashedPassword,
          name: demoName,
          role: 'USER'
        }
      });
    } else {
      console.log('✅ Creating new demo user...');
      await prisma.users.create({
        data: {
          id: randomUUID(),
          email: demoEmail,
          password: hashedPassword,
          name: demoName,
          role: 'USER',
          updatedAt: new Date()
        }
      });
    }

    console.log('🎉 Demo user created/updated successfully!');
    console.log(`📧 Email: ${demoEmail}`);
    console.log(`🔑 Password: ${demoPassword}`);
    console.log(`👤 Role: USER`);

  } catch (error) {
    console.error('❌ Error creating demo user:', error);
    throw error;
  }
}

async function main() {
  try {
    await createDemoUser();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();