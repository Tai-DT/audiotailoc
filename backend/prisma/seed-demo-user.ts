import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedDemoUser() {
    console.log('🌱 Seeding demo user...');

    const demoEmail = 'demo@audiotailoc.com';
    const demoPassword = 'demo123';
    const hashedPassword = await bcrypt.hash(demoPassword, 10);

    // Check if demo user already exists
    const existingUser = await prisma.users.findUnique({
        where: { email: demoEmail },
    });

    if (existingUser) {
        console.log(`✓ Demo user "${demoEmail}" already exists`);
        console.log(`  - Name: ${existingUser.name || 'N/A'}`);
        console.log(`  - Role: ${existingUser.role}`);
        console.log(`  - Created: ${existingUser.createdAt}`);
        
        // Update password to ensure it's correct
        await prisma.users.update({
            where: { email: demoEmail },
            data: { password: hashedPassword },
        });
        console.log(`  ✓ Password updated to: ${demoPassword}`);
        return;
    }

    // Create demo user
    const demoUser = await prisma.users.create({
        data: {
            id: randomUUID(),
            email: demoEmail,
            password: hashedPassword,
            name: 'Người dùng Demo',
            phone: '0900000000',
            role: 'USER',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });

    console.log(`\n✅ Demo user created successfully!`);
    console.log(`   - Email: ${demoEmail}`);
    console.log(`   - Password: ${demoPassword}`);
    console.log(`   - Name: ${demoUser.name}`);
    console.log(`   - Role: ${demoUser.role}`);
    console.log(`\n📝 You can now login with these credentials at http://localhost:3000/login`);
}

seedDemoUser()
    .catch((error) => {
        console.error('❌ Error seeding demo user:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

