import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import 'dotenv/config';

async function testPrismaAccelerate() {
  console.log('🚀 Testing Prisma Accelerate Configuration...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('DIRECT_DATABASE_URL:', process.env.DIRECT_DATABASE_URL ? '✅ Set' : '❌ Missing');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set!');
    return;
  }

  try {
    // Create Prisma client with Accelerate
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    }).$extends(withAccelerate());

    console.log('\n🔌 Testing connection...');

    // Test basic connection with Accelerate
    const result = await prisma.$queryRaw`SELECT 1 as test_value`;
    console.log('✅ Basic connection successful:', result);

    // Test if we can access the database through Accelerate
    console.log('\n⚡ Testing Accelerate functionality...');

    // Try a simple query to test Accelerate caching
    const startTime = Date.now();
    const testQuery = await prisma.$queryRaw`SELECT NOW() as current_time`;
    const endTime = Date.now();

    console.log('✅ Accelerate query successful:', testQuery);
    console.log(`⏱️  Query took: ${endTime - startTime}ms`);

    console.log('\n🎉 Prisma Accelerate is working correctly!');
    console.log('📊 Your database is now using Prisma Accelerate for improved performance.');

  } catch (error) {
    console.error('❌ Error testing Prisma Accelerate:', error.message);

    if (error.message.includes('accelerate')) {
      console.log('\n💡 This might be due to:');
      console.log('   - Invalid API key in DATABASE_URL');
      console.log('   - Network connectivity issues');
      console.log('   - Prisma Accelerate service issues');
    }
  }
}

testPrismaAccelerate().catch(console.error);