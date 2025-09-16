/*
  Create Admin User Script
  Usage: npx tsx src/create-admin.ts
*/
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function createAdminUser() {
  console.log('🔧 Creating admin user...');

  const adminEmail = 'admin@audiotailoc.com';
  const adminPassword = 'admin123'; // Password thật để đăng nhập
  const adminName = 'Administrator';

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists, updating password...');
      await prisma.user.update({
        where: { email: adminEmail },
        data: {
          password: hashedPassword,
          name: adminName,
          role: 'ADMIN'
        }
      });
    } else {
      console.log('✅ Creating new admin user...');
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: adminName,
          role: 'ADMIN'
        }
      });
    }

    console.log('🎉 Admin user created/updated successfully!');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log(`👤 Role: ADMIN`);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
}

async function main() {
  try {
    await createAdminUser();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();