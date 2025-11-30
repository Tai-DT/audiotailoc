import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function seedAdmin() {
    console.log('🛡️ Seeding admin user...');

    const email = 'admin@audiotailoc.com';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingAdmin = await prisma.users.findUnique({
        where: { email },
    });

    if (existingAdmin) {
        console.log(`✓ Admin user already exists: ${email}`);
        await prisma.users.update({
            where: { email },
            data: {
                password: hashedPassword,
                role: 'ADMIN',
            },
        });
        console.log('  - Updated admin password and role');
    } else {
        await prisma.users.create({
            data: {
                id: randomUUID(),
                email,
                password: hashedPassword,
                name: 'System Admin',
                role: 'ADMIN',
                updatedAt: new Date(),
            },
        });
        console.log(`✓ Created admin user: ${email}`);
    }
}

seedAdmin()
    .catch((e) => {
        console.error('❌ Error seeding admin:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
