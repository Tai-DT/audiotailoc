
import { prisma } from './seed-client';
import { randomUUID } from 'crypto';

async function seed() {
    const slug = 'dan-karaoke';
    const name = 'Dàn Karaoke';
    const description = 'Dàn karaoke gia đình và kinh doanh chất lượng cao';

    const existing = await prisma.categories.findUnique({ where: { slug } });
    if (!existing) {
        await prisma.categories.create({
            data: {
                id: randomUUID(),
                name,
                slug,
                description,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        });
        console.log(`Created category ${name}`);
    } else {
        console.log(`Category ${name} already exists`);
    }
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
