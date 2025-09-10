// Test login script
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testLogin() {
  try {
    console.log('🔍 Testing login...');

    const email = 'admin@audiotailoc.com';
    const password = 'admin123';

    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ User found:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Password hash: ${user.password.substring(0, 20)}...`);

    // Test password
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log(`🔐 Password valid: ${isValidPassword}`);

    if (isValidPassword) {
      console.log('✅ Login should work!');
    } else {
      console.log('❌ Password mismatch');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
