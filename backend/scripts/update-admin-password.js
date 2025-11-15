// Script to update admin password
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updateAdminPassword() {
  try {
    const adminEmail = 'admin@audiotailoc.com';
    const newPassword = 'Admin1234';

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update admin password
    const updatedAdmin = await prisma.users.update({
      where: { email: adminEmail },
      data: {
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('✅ Admin password updated successfully:');
    console.log('📧 Email:', updatedAdmin.email);
    console.log('🔑 New Password:', newPassword);
    console.log('👤 Role:', updatedAdmin.role);

  } catch (error) {
    console.error('❌ Error updating admin password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword();