import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
    try {
        const search = "Nguyễn";
        const where: any = {
            OR: [
                { id: { contains: search, mode: 'insensitive' } },
                { users: { name: { contains: search, mode: 'insensitive' } } },
                { users: { email: { contains: search, mode: 'insensitive' } } },
                { users: { phone: { contains: search, mode: 'insensitive' } } },
                { services: { name: { contains: search, mode: 'insensitive' } } },
            ]
        };

        console.log("Testing query with where:", JSON.stringify(where, null, 2));

        const bookings = await prisma.service_bookings.findMany({
            where,
            take: 5
        });

        console.log("Success! Found", bookings.length, "bookings");
    } catch (error) {
        console.error("Error executing query:");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

run();
