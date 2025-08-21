const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function quickSeed() {
  console.log('🎤 Quick Karaoke Seed Test...');

  try {
    // Test connection
    console.log('1. Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected');

    // Create Karaoke category
    console.log('2. Creating Karaoke category...');
    const karaokeCategory = await prisma.category.upsert({
      where: { slug: 'karaoke' },
      update: {},
      create: {
        name: 'Karaoke',
        slug: 'karaoke',
        description: 'Thiết bị Karaoke chuyên nghiệp và gia đình',
        image: '/images/categories/karaoke.jpg',
        seoTitle: 'Thiết Bị Karaoke Chuyên Nghiệp | Audio Tài Lộc',
        seoDescription: 'Cung cấp thiết bị karaoke chất lượng cao: dàn karaoke, đầu karaoke, loa, micro, mixer',
        isActive: true,
      },
    });
    console.log('✅ Karaoke category created:', karaokeCategory.name);

    // Create subcategory
    console.log('3. Creating subcategory...');
    const subcategory = await prisma.category.upsert({
      where: { slug: 'dan-karaoke' },
      update: {},
      create: {
        name: 'Dàn Karaoke',
        slug: 'dan-karaoke',
        description: 'Dàn karaoke tích hợp hoàn chỉnh',
        image: '/images/categories/dan-karaoke.jpg',
        parentId: karaokeCategory.id,
        isActive: true,
      },
    });
    console.log('✅ Subcategory created:', subcategory.name);

    // Create a sample product
    console.log('4. Creating sample product...');
    const product = await prisma.product.upsert({
      where: { slug: 'dan-karaoke-bmb-csv-900-se' },
      update: {},
      create: {
        name: 'Dàn Karaoke BMB CSV-900 SE',
        slug: 'dan-karaoke-bmb-csv-900-se',
        description: 'Dàn karaoke BMB CSV-900 SE cao cấp',
        shortDescription: 'Dàn karaoke BMB chuyên nghiệp',
        sku: 'BMB-CSV-900-SE',
        price: 18000000,
        comparePrice: 20000000,
        costPrice: 15000000,
        stockQuantity: 10,
        weight: 25.5,
        status: 'ACTIVE',
        isActive: true,
        isFeatured: true,
        categoryId: subcategory.id,
        seoTitle: 'Dàn Karaoke BMB CSV-900 SE',
        seoDescription: 'Dàn karaoke BMB CSV-900 SE chất lượng cao',
      },
    });
    console.log('✅ Product created:', product.name);

    // Create liquidation service
    console.log('5. Creating liquidation service...');
    const liquidationService = await prisma.service.upsert({
      where: { slug: 'thanh-ly-karaoke' },
      update: {},
      create: {
        name: 'Dịch Vụ Thanh Lý Thiết Bị Karaoke',
        slug: 'thanh-ly-karaoke',
        description: 'Dịch vụ thanh lý thiết bị karaoke chuyên nghiệp với quy trình đánh giá và định giá chính xác',
        shortDescription: 'Thanh lý thiết bị karaoke uy tín, giá tốt',
        category: 'LIQUIDATION',
        type: 'EVALUATION',
        basePrice: 500000,
        duration: 240,
        isActive: true,
        tags: ['thanh-lý', 'karaoke', 'định-giá', 'thu-mua'],
        metadata: {
          specialization: 'karaoke_equipment',
          processSteps: [
            'Khảo sát và đánh giá tình trạng thiết bị',
            'Định giá theo thị trường hiện tại',
            'Thương thảo và thỏa thuận giá cả',
            'Thu mua và thanh toán nhanh chóng'
          ]
        }
      },
    });
    console.log('✅ Liquidation service created:', liquidationService.name);

    console.log('\n🎉 Quick seed completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed
quickSeed().catch(console.error);
