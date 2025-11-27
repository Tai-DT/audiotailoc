
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.orders.count();
    console.log(`Total orders: ${count}`);

    const orders = await prisma.orders.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            totalCents: true,
            status: true,
            createdAt: true,
        }
    });

    console.log('Recent orders:', JSON.stringify(orders, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
