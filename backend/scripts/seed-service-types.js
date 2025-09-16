const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedServiceTypes() {
  try {
    console.log('🌱 Seeding service types...');

    const serviceTypes = [
      {
        name: 'Thanh Lý',
        slug: 'thanh-ly',
        description: 'Dịch vụ thanh lý tài sản, thiết bị cũ'
      },
      {
        name: 'Lắp đặt',
        slug: 'lap-dat',
        description: 'Dịch vụ lắp đặt, thi công và triển khai'
      },
      {
        name: 'Cho thuê',
        slug: 'cho-thue',
        description: 'Dịch vụ cho thuê thiết bị, máy móc'
      }
    ];

    for (const serviceType of serviceTypes) {
      const existing = await prisma.serviceType.findFirst({
        where: { name: serviceType.name }
      });

      if (!existing) {
        await prisma.serviceType.create({
          data: serviceType
        });
        console.log(`✅ Created service type: ${serviceType.name}`);
      } else {
        console.log(`⚠️  Service type already exists: ${serviceType.name}`);
      }
    }

    console.log('🎉 Service types seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding service types:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedServiceTypes();