
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.backend' });
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.users.findMany({
        select: { email: true, role: true }
    });
    console.log('Users in DB:', JSON.stringify(users, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
