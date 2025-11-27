import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating admin user...');

  const email = 'admin@example.com';
  const password = 'admin123';  // Simple password without special characters
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if admin already exists
  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`Admin user already exists: ${email}`);
    // Update password in case it was changed
    await prisma.users.update({
      where: { email },
      data: {
        password: hashedPassword,
        role: 'ADMIN',
        name: 'Admin',
      },
    });
    console.log('Admin password updated');
  } else {
    await prisma.users.create({
      data: {
        id: crypto.randomUUID(),
        email,
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN',
        updatedAt: new Date(),
      },
    });
    console.log(`Admin user created: ${email}`);
  }

  console.log('\nAdmin credentials:');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
