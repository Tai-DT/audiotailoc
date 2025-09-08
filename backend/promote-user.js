const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function promoteUser() {
  try {
    const user = await prisma.user.update({
      where: { email: 'test@example.com' },
      data: { role: 'ADMIN' }
    });
    console.log('User promoted to admin:', user);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

promoteUser();
