
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking system_configs table...');
    try {
        const count = await prisma.system_configs.count();
        console.log(`Total system_configs: ${count}`);

        const configs = await prisma.system_configs.findMany({
            where: {
                key: {
                    startsWith: 'site.',
                },
            },
        });
        console.log('Site configs found:', configs.length);
        configs.forEach(c => {
            console.log(`Key: ${c.key}, Value Type: ${c.type}`);
            console.log(`Value: ${c.value.substring(0, 100)}...`);
        });
    } catch (error) {
        console.error('Error querying system_configs:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
