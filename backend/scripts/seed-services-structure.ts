import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding service categories and types...');

  // Create Service Categories
  const categories = [
    {
      name: 'Lắp đặt',
      slug: 'lap-dat',
      description: 'Dịch vụ lắp đặt thiết bị âm thanh chuyên nghiệp',
      icon: 'wrench',
      color: '#4CAF50',
      sortOrder: 1,
    },
    {
      name: 'Bảo trì',
      slug: 'bao-tri',
      description: 'Dịch vụ bảo trì định kỳ cho hệ thống âm thanh',
      icon: 'shield',
      color: '#2196F3',
      sortOrder: 2,
    },
    {
      name: 'Sửa chữa',
      slug: 'sua-chua',
      description: 'Dịch vụ sửa chữa thiết bị âm thanh',
      icon: 'tools',
      color: '#FF9800',
      sortOrder: 3,
    },
    {
      name: 'Tư vấn',
      slug: 'tu-van',
      description: 'Tư vấn giải pháp âm thanh chuyên nghiệp',
      icon: 'headset',
      color: '#9C27B0',
      sortOrder: 4,
    },
    {
      name: 'Cho thuê',
      slug: 'cho-thue',
      description: 'Cho thuê thiết bị âm thanh cho sự kiện',
      icon: 'calendar',
      color: '#607D8B',
      sortOrder: 5,
    },
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const created = await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    createdCategories.push(created);
    console.log(`Created/Updated category: ${created.name}`);
  }

  // Create Service Types
  const types = [
    // Lắp đặt
    {
      name: 'Lắp đặt hệ thống âm thanh karaoke gia đình',
      slug: 'lap-dat-karaoke-gia-dinh',
      categoryId: createdCategories[0].id,
      sortOrder: 1,
    },
    {
      name: 'Lắp đặt hệ thống âm thanh phòng hát',
      slug: 'lap-dat-am-thanh-phong-hat',
      categoryId: createdCategories[0].id,
      sortOrder: 2,
    },
    {
      name: 'Lắp đặt hệ thống âm thanh sân khấu',
      slug: 'lap-dat-am-thanh-san-khau',
      categoryId: createdCategories[0].id,
      sortOrder: 3,
    },
    // Bảo trì
    {
      name: 'Bảo trì định kỳ hàng tháng',
      slug: 'bao-tri-hang-thang',
      categoryId: createdCategories[1].id,
      sortOrder: 1,
    },
    {
      name: 'Bảo trì định kỳ hàng quý',
      slug: 'bao-tri-hang-quy',
      categoryId: createdCategories[1].id,
      sortOrder: 2,
    },
    // Sửa chữa
    {
      name: 'Sửa chữa loa',
      slug: 'sua-chua-loa',
      categoryId: createdCategories[2].id,
      sortOrder: 1,
    },
    {
      name: 'Sửa chữa amply',
      slug: 'sua-chua-amply',
      categoryId: createdCategories[2].id,
      sortOrder: 2,
    },
    {
      name: 'Sửa chữa micro',
      slug: 'sua-chua-micro',
      categoryId: createdCategories[2].id,
      sortOrder: 3,
    },
    // Tư vấn
    {
      name: 'Tư vấn giải pháp âm thanh gia đình',
      slug: 'tu-van-gia-dinh',
      categoryId: createdCategories[3].id,
      sortOrder: 1,
    },
    {
      name: 'Tư vấn giải pháp âm thanh chuyên nghiệp',
      slug: 'tu-van-chuyen-nghiep',
      categoryId: createdCategories[3].id,
      sortOrder: 2,
    },
    // Cho thuê
    {
      name: 'Cho thuê thiết bị sự kiện nhỏ',
      slug: 'cho-thue-su-kien-nho',
      categoryId: createdCategories[4].id,
      sortOrder: 1,
    },
    {
      name: 'Cho thuê thiết bị sự kiện lớn',
      slug: 'cho-thue-su-kien-lon',
      categoryId: createdCategories[4].id,
      sortOrder: 2,
    },
  ];

  for (const type of types) {
    const created = await prisma.serviceType.upsert({
      where: { slug: type.slug },
      update: type,
      create: type,
    });
    console.log(`Created/Updated type: ${created.name}`);
  }

  // Create some sample services
  const services = [
    {
      name: 'Lắp đặt dàn karaoke gia đình cao cấp',
      slug: 'lap-dat-dan-karaoke-gia-dinh-cao-cap',
      description: 'Dịch vụ lắp đặt dàn karaoke gia đình cao cấp với thiết bị chất lượng từ các thương hiệu uy tín',
      categoryId: createdCategories[0].id,
      typeId: types[0].slug,
      basePriceCents: 500000000, // 5,000,000 VND
      price: 500000000,
      duration: 240, // 4 hours
      isActive: true,
    },
    {
      name: 'Bảo trì hệ thống âm thanh định kỳ',
      slug: 'bao-tri-he-thong-am-thanh-dinh-ky',
      description: 'Dịch vụ bảo trì định kỳ giúp hệ thống âm thanh luôn hoạt động tốt nhất',
      categoryId: createdCategories[1].id,
      typeId: types[3].slug,
      basePriceCents: 150000000, // 1,500,000 VND
      price: 150000000,
      duration: 120, // 2 hours
      isActive: true,
    },
    {
      name: 'Sửa chữa loa chuyên nghiệp',
      slug: 'sua-chua-loa-chuyen-nghiep',
      description: 'Sửa chữa các loại loa từ dân dụng đến chuyên nghiệp với đội ngũ kỹ thuật viên giàu kinh nghiệm',
      categoryId: createdCategories[2].id,
      typeId: types[5].slug,
      basePriceCents: 50000000, // 500,000 VND
      price: 50000000,
      duration: 60, // 1 hour
      isActive: true,
    },
  ];

  // Get the actual type IDs
  const typeMap = new Map();
  for (const type of types) {
    const found = await prisma.serviceType.findUnique({
      where: { slug: type.slug },
    });
    if (found) {
      typeMap.set(type.slug, found.id);
    }
  }

  for (const service of services) {
    const typeId = typeMap.get(service.typeId);
    if (!typeId) continue;

    const created = await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        ...service,
        typeId,
      },
      create: {
        ...service,
        typeId,
      },
    });
    console.log(`Created/Updated service: ${created.name}`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
