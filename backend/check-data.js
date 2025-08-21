const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('🔍 Checking database data...\n');

    // Check categories
    const categories = await prisma.category.findMany({
      include: {
        parent: true,
        children: true,
        _count: {
          select: { products: true }
        }
      }
    });
    
    console.log('📂 Categories:');
    categories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.slug}) - ${cat._count.products} products`);
      if (cat.parent) console.log(`    └─ Parent: ${cat.parent.name}`);
    });

    // Check products
    const products = await prisma.product.findMany({
      include: {
        category: true
      },
      take: 10
    });
    
    console.log('\n📦 Products:');
    products.forEach(prod => {
      console.log(`  - ${prod.name} (${prod.sku}) - ${prod.price.toLocaleString()}đ`);
      console.log(`    └─ Category: ${prod.category?.name || 'None'}`);
    });

    // Check services
    const services = await prisma.service.findMany({
      take: 10
    });
    
    console.log('\n🔧 Services:');
    services.forEach(service => {
      console.log(`  - ${service.name} (${service.category}) - ${service.basePrice.toLocaleString()}đ`);
    });

    // Check karaoke specifically
    const karaokeCategories = await prisma.category.findMany({
      where: {
        OR: [
          { slug: { contains: 'karaoke' } },
          { name: { contains: 'Karaoke' } }
        ]
      }
    });
    
    console.log('\n🎤 Karaoke Categories:');
    karaokeCategories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.slug})`);
    });

    const karaokeProducts = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: 'karaoke', mode: 'insensitive' } },
          { name: { contains: 'Karaoke' } }
        ]
      }
    });
    
    console.log('\n🎤 Karaoke Products:');
    karaokeProducts.forEach(prod => {
      console.log(`  - ${prod.name} - ${prod.price.toLocaleString()}đ`);
    });

    console.log('\n✅ Data check completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData().catch(console.error);
