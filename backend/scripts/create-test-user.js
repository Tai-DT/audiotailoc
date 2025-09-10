const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  const prisma = new PrismaClient();
  try {
    const hashedPassword = await bcrypt.hash('test123', 12);
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        role: 'ADMIN'
      }
    });
    console.log('✅ User created successfully:');
    console.log('📧 Email:', user.email);
    console.log('🔑 Password: test123');
    console.log('👤 Role:', user.role);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
