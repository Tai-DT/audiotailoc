import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function main() {
  console.log('🌱 Seeding service categories and types...');

  // Create service categories
  const categories = [
    {
      name: 'Lắp đặt',
      slug: 'lap-dat',
      description: 'Dịch vụ lắp đặt thiết bị',
      icon: 'install',
      color: '#3498db',
      types: [
        { name: 'Âm thanh', description: 'Lắp đặt hệ thống âm thanh', icon: 'speaker', color: '#2ecc71' },
        { name: 'Ánh sáng', description: 'Lắp đặt hệ thống ánh sáng', icon: 'light', color: '#f1c40f' },
        { name: 'Màn hình', description: 'Lắp đặt màn hình', icon: 'tv', color: '#9b59b6' },
      ],
    },
    {
      name: 'Bảo trì',
      slug: 'bao-tri',
      description: 'Dịch vụ bảo trì thiết bị',
      icon: 'settings',
      color: '#e74c3c',
      types: [
        { name: 'Bảo dưỡng', description: 'Bảo dưỡng định kỳ', icon: 'settings', color: '#e67e22' },
        { name: 'Sửa chữa', description: 'Sửa chữa hư hỏng', icon: 'tool', color: '#c0392b' },
      ],
    },
    {
      name: 'Cho thuê',
      slug: 'cho-thue',
      description: 'Dịch vụ cho thuê thiết bị',
      icon: 'package',
      color: '#27ae60',
      types: [
        { name: 'Âm thanh', description: 'Cho thuê thiết bị âm thanh', icon: 'speaker', color: '#16a085' },
        { name: 'Ánh sáng', description: 'Cho thuê thiết bị ánh sáng', icon: 'light', color: '#f39c12' },
      ],
    },
  ];

  for (const categoryData of categories) {
    const { types, ...categoryInfo } = categoryData;
    
    // Create or update category
    const category = await prisma.serviceCategory.upsert({
      where: { slug: categoryInfo.slug },
      update: {},
      create: categoryInfo,
    });

    console.log(`✅ Created category: ${category.name}`);

    // Create types for this category
    for (const typeData of types) {
      const typeSlug = generateSlug(typeData.name);
      
      await prisma.serviceType.upsert({
        where: { 
          slug: typeSlug,
        },
        update: {},
        create: {
          ...typeData,
          slug: typeSlug,
          category: {
            connect: { id: category.id }
          }
        },
      });
      console.log(`   - Created type: ${typeData.name}`);
    }
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
