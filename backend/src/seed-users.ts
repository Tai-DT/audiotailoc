/*
  Seed Users Script - Tạo dữ liệu mẫu cho users
  Usage: npx tsx src/seed-users.ts
*/
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import 'dotenv/config';

const prisma = new PrismaClient();

async function seedUsers() {
  console.log('🌱 Seeding users...');

  const sampleUsers = [
    {
      email: 'user1@example.com',
      name: 'Nguyễn Văn A',
      password: 'user123',
      phone: '0901234567',
      role: 'USER'
    },
    {
      email: 'user2@example.com',
      name: 'Trần Thị B',
      password: 'user123',
      phone: '0901234568',
      role: 'USER'
    },
    {
      email: 'user3@example.com',
      name: 'Lê Văn C',
      password: 'user123',
      phone: '0901234569',
      role: 'USER'
    },
    {
      email: 'user4@example.com',
      name: 'Phạm Thị D',
      password: 'user123',
      phone: '0901234570',
      role: 'USER'
    },
    {
      email: 'user5@example.com',
      name: 'Hoàng Văn E',
      password: 'user123',
      phone: '0901234571',
      role: 'USER'
    }
  ];

  for (const userData of sampleUsers) {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Check if user already exists
      const existingUser = await prisma.users.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`✓ User ${userData.email} already exists, skipping...`);
      } else {
        console.log(`✓ Creating user: ${userData.email}`);
        await prisma.users.create({
          data: {
            id: randomUUID(),
            updatedAt: new Date(),
            email: userData.email,
            password: hashedPassword,
            name: userData.name,
            phone: userData.phone,
            role: userData.role
          }
        });
      }
    } catch (error) {
      console.error(`✗ Error with user ${userData.email}:`, error);
    }
  }

  console.log('✅ Users seeding completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

async function main() {
  await seedUsers();
}