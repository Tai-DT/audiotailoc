
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up dependent data...');
  await prisma.product_review_reports.deleteMany();
  await prisma.product_review_votes.deleteMany();
  await prisma.product_reviews.deleteMany();
  await prisma.service_reviews.deleteMany();
  await prisma.cart_items.deleteMany();
  await prisma.order_items.deleteMany();
  await prisma.wishlist_items.deleteMany();
  await prisma.product_views.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.inventory_alerts.deleteMany();
  await prisma.inventory_movements.deleteMany();
  await prisma.knowledge_base_entries.deleteMany();
  
  console.log('Cleaning up products...');
  await prisma.products.deleteMany();
  
  console.log('Setting up categories...');
  
  // Create or update categories
  const cafeCat = await prisma.categories.upsert({
    where: { slug: 'am-thanh-quan-cafe' },
    update: { 
      name: 'Âm thanh quán Cafe',
      updatedAt: new Date()
    },
    create: {
      id: uuidv4(),
      name: 'Âm thanh quán Cafe',
      slug: 'am-thanh-quan-cafe',
      description: 'Giải pháp âm thanh chuyên nghiệp cho quán cafe, Acoustic, sân khấu nhỏ.',
      updatedAt: new Date()
    }
  });

  const musicCat = await prisma.categories.upsert({
    where: { slug: 'nghe-nhac-xem-phim' },
    update: { 
      name: 'Nghe Nhạc - Xem Phim',
      updatedAt: new Date()
    },
    create: {
      id: uuidv4(),
      name: 'Nghe Nhạc - Xem Phim',
      slug: 'nghe-nhac-xem-phim',
      description: 'Hệ thống âm thanh Hi-End, xem phim gia đình cao cấp.',
      updatedAt: new Date()
    }
  });

  console.log('Categories set up:', { cafeCat: cafeCat.id, musicCat: musicCat.id });
}

main().catch(console.error).finally(() => prisma.$disconnect());
