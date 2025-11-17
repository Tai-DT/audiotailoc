const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    const email = process.argv[2];
    if (!email) {
      console.error('Usage: node backend/scripts/promote-user.js <email>');
      process.exit(1);
    }
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      console.error('User not found:', email);
      process.exit(2);
    }
    await prisma.users.update({ where: { email }, data: { role: 'ADMIN' } });
    console.log('User promoted to ADMIN:', email);
  } catch (err) {
    console.error('Error promoting user:', err);
    process.exit(3);
  } finally {
    await prisma.$disconnect();
  }
})();