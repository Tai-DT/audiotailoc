import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating demo user for testing...');

  const email = 'demo@audiotailoc.com';
  const password = 'Demo123!';  // Password meets all requirements: 8+ chars, uppercase, lowercase, number, special char
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if demo user already exists
  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`Demo user already exists: ${email}`);
    // Update password in case it was changed
    await prisma.users.update({
      where: { email },
      data: {
        password: hashedPassword,
        role: 'USER',
        name: 'Demo User',
        phone: '0900000000',
      },
    });
    console.log('✅ Demo user password updated');
  } else {
    await prisma.users.create({
      data: {
        id: crypto.randomUUID(),
        email,
        password: hashedPassword,
        name: 'Demo User',
        phone: '0900000000',
        role: 'USER',
        updatedAt: new Date(),
      },
    });
    console.log(`✅ Demo user created: ${email}`);
  }

  console.log('\n📝 Demo User Credentials:');
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log('\n✅ Password meets all security requirements!');
  console.log('⚠️  Note: For production, use stronger passwords!');
}

main()
  .catch((e) => {
    console.error('❌ Error creating demo user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
