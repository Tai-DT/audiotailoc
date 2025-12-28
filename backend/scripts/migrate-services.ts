
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('--- MIGRATING SERVICES TO NEW HIERARCHY ---');

    // 1. Create or get the new service types
    const typesData = [
      { name: 'Sửa chữa', slug: 'sua-chua', description: 'Dịch vụ sửa chữa thiết bị âm thanh chuyên nghiệp' },
      { name: 'Lắp đặt', slug: 'lap-dat', description: 'Dịch vụ lắp đặt hệ thống âm thanh tận nơi' },
      { name: 'Tư vấn', slug: 'tu-van', description: 'Tư vấn giải pháp âm thanh chuyên sâu' }
    ];

    const types = [];
    for (const t of typesData) {
      const existing = await prisma.service_types.findUnique({ where: { slug: t.slug } });
      if (existing) {
        console.log(`Type ${t.name} already exists.`);
        types.push(existing);
      } else {
        const created = await prisma.service_types.create({
          data: {
            id: randomUUID(),
            name: t.name,
            slug: t.slug,
            description: t.description,
            updatedAt: new Date()
          }
        });
        console.log(`Created type: ${t.name}`);
        types.push(created);
      }
    }

    const [suaChua, lapDat, tuVan] = types;

    // 2. Assign existing services to "Lắp đặt" by default if they contain "Lắp đặt"
    const services = await prisma.services.findMany();
    for (const s of services) {
      if (s.name.includes('Lắp đặt')) {
        await prisma.services.update({
          where: { id: s.id },
          data: { typeId: lapDat.id }
        });
        console.log(`Moved service "${s.name}" to "Lắp đặt"`);
      }
    }

    // 3. Create "Sửa chữa tận nhà" inside "Sửa chữa"
    const suaChuaTanNha = await prisma.services.findFirst({ where: { slug: 'sua-chua-tan-nha' } });
    if (!suaChuaTanNha) {
      await prisma.services.create({
        data: {
          id: randomUUID(),
          name: 'Sửa chữa tận nhà',
          slug: 'sua-chua-tan-nha',
          description: 'Dịch vụ sửa chữa thiết bị âm thanh tận nhà nhanh chóng, chuyên nghiệp',
          shortDescription: 'Sửa chữa tại gia',
          typeId: suaChua.id,
          duration: 60,
          updatedAt: new Date()
        }
      });
      console.log('Created service: Sửa chữa tận nhà');
    }

    console.log('✅ Migration complete');
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
