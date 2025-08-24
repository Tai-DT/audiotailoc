import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCategories() {
  console.log('🎤 Testing category creation...');

  try {
    // First, delete all existing categories
    console.log('🗑️ Deleting existing categories...');
    await prisma.category.deleteMany();
    console.log('✅ Deleted existing categories');

    // Create all 7 karaoke categories
    console.log('🎤 Creating all 7 karaoke categories...');
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Dàng Karaoke',
          slug: 'dang-karaoke',
          description: 'Dàn karaoke chuyên nghiệp với âm thanh sống động',
          imageUrl: '/images/categories/karaoke-system.jpg',
          metaTitle: 'Dàn Karaoke chuyên nghiệp - Audio Tài Lộc',
          metaDescription: 'Dàn karaoke chất lượng cao với âm thanh sống động, phù hợp cho gia đình và kinh doanh',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Đầu Karaoke',
          slug: 'dau-karaoke',
          description: 'Đầu karaoke với nhiều bài hát phong phú',
          imageUrl: '/images/categories/karaoke-player.jpg',
          metaTitle: 'Đầu Karaoke chất lượng cao - Audio Tài Lộc',
          metaDescription: 'Đầu karaoke với kho bài hát phong phú, giao diện thân thiện, dễ sử dụng',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Loa & Loa Sub',
          slug: 'loa-loa-sub',
          description: 'Loa và loa sub karaoke chuyên dụng',
          imageUrl: '/images/categories/speakers-subwoofers.jpg',
          metaTitle: 'Loa và Loa Sub karaoke - Audio Tài Lộc',
          metaDescription: 'Loa karaoke và loa sub chuyên dụng với âm bass mạnh mẽ, âm thanh chất lượng',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Micro Phone',
          slug: 'micro-phone',
          description: 'Microphone karaoke chất lượng cao',
          imageUrl: '/images/categories/microphones-karaoke.jpg',
          metaTitle: 'Micro karaoke chuyên nghiệp - Audio Tài Lộc',
          metaDescription: 'Micro karaoke với chất lượng thu âm tốt, thiết kế chuyên nghiệp',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Mixer / Vang Số',
          slug: 'mixer-vang-so',
          description: 'Mixer và vang số karaoke chuyên nghiệp',
          imageUrl: '/images/categories/mixer-effects.jpg',
          metaTitle: 'Mixer và Vang số karaoke - Audio Tài Lộc',
          metaDescription: 'Mixer và vang số chuyên nghiệp cho karaoke với nhiều hiệu ứng âm thanh',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Màn Hình Chọn Bài',
          slug: 'man-hinh-chon-bai',
          description: 'Màn hình cảm ứng chọn bài karaoke',
          imageUrl: '/images/categories/touch-screen.jpg',
          metaTitle: 'Màn hình chọn bài karaoke - Audio Tài Lộc',
          metaDescription: 'Màn hình cảm ứng chọn bài karaoke với giao diện thân thiện, dễ sử dụng',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Thanh lý',
          slug: 'thanh-ly',
          description: 'Sản phẩm thanh lý với giá ưu đãi đặc biệt',
          imageUrl: '/images/categories/clearance-sale.jpg',
          metaTitle: 'Thanh lý sản phẩm karaoke - Audio Tài Lộc',
          metaDescription: 'Sản phẩm thanh lý với giá ưu đãi đặc biệt, chất lượng đảm bảo',
        },
      }),
    ]);
    console.log('✅ Created all 7 karaoke categories:', categories.map(c => c.name));

    // Check all categories
    const allCategories = await prisma.category.findMany();
    console.log('📋 All categories:', allCategories.map(c => ({ name: c.name, slug: c.slug })));

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testCategories()
  .catch((e) => {
    console.error('❌ Test failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
