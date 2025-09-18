const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();

  try {
    console.log('Testing database connection...');

    // Simple query to test connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;

    console.log('✅ Database connection successful!');
    console.log('Test result:', result);

    // Try a simple model query if possible
    const userCount = await prisma.user.count();
    console.log(`📊 Found ${userCount} users in database`);

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();