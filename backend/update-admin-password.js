// Script to update admin password
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updateAdminPassword() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const user = await prisma.user.update({
      where: { email: 'admin@audiotailoc.com' },
      data: { 
        password: hashedPassword,
        role: 'ADMIN' // Ensure it's admin
      }
    });
    console.log('Admin password updated:', user.email, 'Role:', user.role);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword();
