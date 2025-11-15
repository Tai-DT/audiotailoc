// Script to create admin user for dashboard login
// Load environment variables from backend/.env so Prisma can connect
try {
  const path = require('path');
  const dotenvPath = path.resolve(__dirname, '..', '.env');
  require('dotenv').config({ path: dotenvPath });
} catch (e) {
  // Continue even if dotenv isn't available; Prisma may still work if env vars are set
}

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const adminEmail = 'admin@audiotailoc.com';
    const adminPassword = 'Admin1234';
    
    // Check if admin already exists
    const existingAdmin = await prisma.users.findUnique({
      where: { email: adminEmail }
    });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', adminEmail);
      
      // Update to ensure ADMIN role
      await prisma.users.update({
        where: { email: adminEmail },
        data: { role: 'ADMIN' }
      });
      console.log('✅ Admin role updated');
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    // Generate UUID for the user
    const userId = crypto.randomUUID();
    const now = new Date();
    
    // Create admin user
    const admin = await prisma.users.create({
      data: {
        id: userId,
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
        updatedAt: now
      }
    });
    
    console.log('✅ Admin user created successfully:');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Role:', admin.role);
    console.log('🆔 ID:', admin.id);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error?.message || error);
    if (error?.stack) {
      console.error(error.stack);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();




