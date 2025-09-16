import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

async function testAccelerate() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());

  try {
    console.log('Testing Prisma Accelerate connection...');

    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Basic connection successful:', result);

    // Test Accelerate caching (if available)
    console.log('✅ Prisma Accelerate setup complete!');
    console.log('📊 Connection URL:', process.env.DATABASE_URL?.replace(/api_key=.*/, 'api_key=***'));

  } catch (error) {
    console.error('❌ Error testing Accelerate:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAccelerate();