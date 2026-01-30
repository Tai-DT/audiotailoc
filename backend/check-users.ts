import { PrismaClient } from '@prisma/client';

async function main() {
    const prisma = new PrismaClient();

    try {
        const users = await prisma.users.findMany({
            select: { id: true, email: true, name: true, role: true }
        });
        console.log('Users in database:');
        users.forEach(u => {
            console.log(`  - ${u.email} | role: ${u.role} | name: ${u.name}`);
        });

        // Count admins
        const admins = users.filter(u => u.role === 'ADMIN');
        console.log(`\nTotal: ${users.length} users, ${admins.length} admins`);
    } finally {
        await prisma.$disconnect();
    }
}

main().catch(console.error);
