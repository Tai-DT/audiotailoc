const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function promoteUser() {
  try {
    const user = await prisma.user.update({
      where: { email: 'admin@audiotailoc.com' },
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
