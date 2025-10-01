// Script to reset admin password
try {
  const path = require('path');
  const dotenvPath = path.resolve(__dirname, '..', '.env');
  require('dotenv').config({ path: dotenvPath });
} catch (e) {
  // Continue even if dotenv isn't available
}

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdminPassword() {
  try {
    const adminEmail = 'admin@audiotailoc.com';
    const newPassword = 'Admin1234';
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update admin password
    const admin = await prisma.user.update({
      where: { email: adminEmail },
      data: { 
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    
    console.log('✅ Admin password reset successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', newPassword);
    console.log('👤 User ID:', admin.id);
    console.log('🎭 Role:', admin.role);
    
  } catch (error) {
    console.error('❌ Error resetting admin password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
