const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createServiceTypes() {
  try {
    console.log('🔄 Tạo service types mẫu trực tiếp vào database...');

    const serviceTypes = [
      {
        name: 'Cho thuê',
        slug: 'cho-thue',
        description: 'Dịch vụ cho thuê thiết bị âm thanh',
        color: '#FF6B6B',
        isActive: true,
      },
      {
        name: 'Bán hàng',
        slug: 'ban-hang',
        description: 'Dịch vụ bán thiết bị âm thanh',
        color: '#4ECDC4',
        isActive: true,
      },
      {
        name: 'Sửa chữa',
        slug: 'sua-chua',
        description: 'Dịch vụ sửa chữa thiết bị âm thanh',
        color: '#45B7D1',
        isActive: true,
      }
    ];

    for (const type of serviceTypes) {
      try {
        const created = await prisma.serviceType.create({
          data: type
        });
        console.log('✅ Created service type:', created.name);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log('⚠️  Service type already exists:', type.name);
        } else {
          console.error('❌ Failed to create service type:', type.name, error.message);
        }
      }
    }

    console.log('🎉 Hoàn thành tạo service types mẫu');

    // Verify created service types
    const allTypes = await prisma.serviceType.findMany();
    console.log('📋 Service types hiện tại:', allTypes.length);
    allTypes.forEach(type => {
      console.log(`  - ${type.name} (${type.slug})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createServiceTypes();