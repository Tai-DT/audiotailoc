const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function checkAndUpdateAdmin() {
  const prisma = new PrismaClient();

  try {
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@audiotailoc.com' }
    });

    if (admin) {
      console.log('Current admin password hash:', admin.password);

      const isValid = await bcrypt.compare('Admin123!', admin.password);
      console.log('Current password valid:', isValid);

      if (!isValid) {
        console.log('Updating admin password...');
        const newHash = await bcrypt.hash('Admin123!', 12);
        await prisma.user.update({
          where: { email: 'admin@audiotailoc.com' },
          data: { password: newHash }
        });
        console.log('Admin password updated successfully');
      } else {
        console.log('Admin password is already correct');
      }
    } else {
      console.log('Admin user not found, creating new one...');
      const hashedPassword = await bcrypt.hash('Admin123!', 12);
      const newAdmin = await prisma.user.create({
        data: {
          email: 'admin@audiotailoc.com',
          password: hashedPassword,
          name: 'Administrator',
          role: 'ADMIN'
        }
      });
      console.log('New admin created:', newAdmin.email);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndUpdateAdmin();