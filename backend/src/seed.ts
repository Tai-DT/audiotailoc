/*
  Seed script to populate initial products for local development.
  Usage: pnpm --filter @audiotailoc/backend ts-node src/seed.ts
*/
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  // Promote admin emails if configured
  const adminEnv = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (adminEnv.length > 0) {
    for (const email of adminEnv) {
      await prisma.users
        .update({ where: { email }, data: { role: 'ADMIN' } })
        .catch(() => Promise.resolve());
    }
  }

  // Categories
  const catSpeakers = await prisma.categories.upsert({ where: { slug: 'loa' }, update: {}, create: { id: randomUUID(), slug: 'loa', name: 'Loa', updatedAt: new Date() } });
  const catHeadphones = await prisma.categories.upsert({ where: { slug: 'tai-nghe' }, update: {}, create: { id: randomUUID(), slug: 'tai-nghe', name: 'Tai nghe', updatedAt: new Date() } });

  // Promotions
  const now = new Date();
  const nextYear = new Date(now.getTime());
  nextYear.setFullYear(now.getFullYear() + 1);
  await prisma.promotions.upsert({
    where: { code: 'WELCOME10' },
    update: { updatedAt: new Date() },
    create: {
      id: randomUUID(),
      code: 'WELCOME10',
      name: 'Welcome 10%',
      description: 'Giảm 10% cho khách hàng mới',
      type: 'PERCENTAGE',
      value: 10,
      isActive: true,
      expiresAt: nextYear,
      updatedAt: new Date(),
    },
  });

  const items = [
    {
      slug: 'loa-tai-loc-classic',
      name: 'Loa Tài Lộc Classic',
      description: 'Âm thanh ấm áp, thiết kế cổ điển.',
      priceCents: 1990000,
      imageUrl: 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/speaker-1.jpg',
      categoryId: catSpeakers.id,
    },
    {
      slug: 'tai-nghe-tai-loc-pro',
      name: 'Tai nghe Tài Lộc Pro',
      description: 'Chống ồn chủ động, pin lâu.',
      priceCents: 2990000,
      imageUrl: 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/headphone-1.jpg',
      categoryId: catHeadphones.id,
    },
    {
      slug: 'soundbar-tai-loc-5-1',
      name: 'Soundbar Tài Lộc 5.1',
      description: 'Rạp tại gia, âm trường rộng.',
      priceCents: 4990000,
      imageUrl: 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/soundbar-1.jpg',
      categoryId: catSpeakers.id,
    },
    {
      slug: 'loa-bluetooth-jbl-go-3',
      name: 'Loa Bluetooth JBL GO 3',
      description: 'Loa di động chống nước, âm thanh JBL chất lượng cao.',
      priceCents: 1490000,
      imageUrl: 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/jbl-go3.jpg',
      categoryId: catSpeakers.id,
    },
    {
      slug: 'tai-nghe-sony-wh-1000xm4',
      name: 'Tai nghe Sony WH-1000XM4',
      description: 'Tai nghe chống ồn hàng đầu, chất lượng âm thanh tuyệt vời.',
      priceCents: 8990000,
      imageUrl: 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/sony-wh1000xm4.jpg',
      categoryId: catHeadphones.id,
    },
    {
      slug: 'loa-karaoke-samsung',
      name: 'Loa Karaoke Samsung',
      description: 'Hệ thống karaoke gia đình với micro không dây.',
      priceCents: 3500000,
      imageUrl: 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/karaoke-1.jpg',
      categoryId: catSpeakers.id,
    },
  ];

  for (const item of items) {
    // Upsert to keep idempotent
    // Note: sequential upserts to avoid DB write spikes
    const p = await prisma.products.upsert({
      where: { slug: item.slug },
      update: item,
      create: {
        id: randomUUID(),
        updatedAt: new Date(),
        slug: item.slug,
        name: item.name,
        description: item.description,
        priceCents: item.priceCents,
        imageUrl: item.imageUrl,
        categories: { connect: { id: item.categoryId } }
      },
    });
    // Seed KB entry for product if not exists
    const exists = await prisma.knowledge_base_entries.findFirst({ where: { productId: p.id, kind: 'PRODUCT' } });
    if (!exists) {
      await prisma.knowledge_base_entries.create({ data: { id: randomUUID(), updatedAt: new Date(), kind: 'PRODUCT', title: p.name, content: p.description || '', products: { connect: { id: p.id } } } });
    }
  }

  // Seed FAQ entries if none
  const faqCount = await prisma.knowledge_base_entries.count({ where: { kind: 'FAQ' } });
  if (faqCount === 0) {
    await prisma.knowledge_base_entries.createMany({
      data: [
        { id: randomUUID(), updatedAt: new Date(), kind: 'FAQ', title: 'Chính sách đổi trả', content: 'Đổi trả trong 7 ngày với sản phẩm còn nguyên vẹn.' },
        { id: randomUUID(), updatedAt: new Date(), kind: 'FAQ', title: 'Bảo hành', content: 'Bảo hành 12 tháng cho tất cả sản phẩm chính hãng.' },
      ],
    });
  }

  // Seed Banners
  const banners = [
    {
      title: 'Ưu đãi Tháng 12 - Giảm đến 50%',
      subtitle: 'Thiết bị âm thanh chính hãng',
      description: 'Chương trình khuyến mãi lớn nhất năm với hàng ngàn sản phẩm giảm giá sâu',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=600&fit=crop',
      mobileImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=768&h=400&fit=crop',
      linkUrl: '/products?promo=december',
      buttonLabel: 'Xem ngay',
      page: 'home',
      position: 1,
      isActive: true,
    },
    {
      title: 'Dịch vụ lắp đặt chuyên nghiệp',
      subtitle: 'Cam kết chất lượng',
      description: 'Đội ngũ kỹ thuật viên giàu kinh nghiệm, lắp đặt tại nhà nhanh chóng',
      imageUrl: 'https://images.unsplash.com/photo-1516487306254-3c183969de53?w=1920&h=600&fit=crop',
      mobileImageUrl: 'https://images.unsplash.com/photo-1516487306254-3c183969de53?w=768&h=400&fit=crop',
      linkUrl: '/services',
      buttonLabel: 'Đặt lịch',
      page: 'home',
      position: 2,
      isActive: true,
    },
    {
      title: 'Về Audio Tài Lộc',
      subtitle: 'Hơn 10 năm kinh nghiệm',
      description: 'Cửa hàng âm thanh uy tín hàng đầu Việt Nam',
      imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1920&h=600&fit=crop',
      linkUrl: '/about',
      buttonLabel: 'Tìm hiểu thêm',
      page: 'about',
      position: 1,
      isActive: true,
    },
    {
      title: 'Sản phẩm mới: Loa Karaoke Tài Lộc X5',
      subtitle: 'Công nghệ tiên tiến',
      description: 'Âm thanh sống động, bass mạnh mẽ, phù hợp cho mọi không gian',
      imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=1920&h=600&fit=crop',
      linkUrl: '/products/loa-karaoke-tai-loc-x5',
      buttonLabel: 'Khám phá',
      page: 'home',
      position: 3,
      isActive: true,
    },
  ];

  for (const banner of banners) {
    // Check if banner exists, then update or create
    const exists = await prisma.banners.findFirst({
      where: { 
        title: banner.title,
        page: banner.page,
        isDeleted: false,
      },
    });
    
    if (exists) {
      await prisma.banners.update({
        where: { id: exists.id },
        data: banner,
      });
    } else {
      await prisma.banners.create({
        data: {
          id: randomUUID(),
          updatedAt: new Date(),
          ...banner
        },
      });
    }
  }

  // Seed System Config (Site Settings)
  const siteSettings = [
    {
      key: 'site.general',
      value: JSON.stringify({
        siteName: 'Audio Tài Lộc',
        tagline: 'Nâng tầm trải nghiệm âm thanh',
        logoUrl: '/logo.png',
        primaryEmail: 'info@audiotailoc.com',
        primaryPhone: '0901 234 567',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        workingHours: 'Thứ 2 - Thứ 7: 8:00 - 20:00',
      }),
      type: 'JSON',
    },
    {
      key: 'site.about',
      value: JSON.stringify({
        title: 'Về Audio Tài Lộc - Cửa hàng âm thanh chuyên nghiệp',
        summary: 'Với hơn 10 năm kinh nghiệm trong lĩnh vực âm thanh, Audio Tài Lộc tự hào là đối tác tin cậy của hàng nghìn khách hàng trên toàn quốc.',
        contentHtml: `
          <div class="space-y-6">
            <p>Audio Tài Lộc được thành lập năm 2014 với sứ mệnh mang đến trải nghiệm âm thanh tuyệt vời nhất cho khách hàng Việt Nam. Chúng tôi chuyên cung cấp các thiết bị âm thanh chính hãng từ các thương hiệu uy tín trên thế giới.</p>
            
            <h3 class="text-xl font-bold">Tầm nhìn của chúng tôi</h3>
            <p>Trở thành cửa hàng âm thanh hàng đầu Việt Nam, được tin tưởng và lựa chọn bởi đông đảo khách hàng yêu âm thanh và công nghệ. Chúng tôi không ngừng nỗ lực để mang đến những sản phẩm và dịch vụ tốt nhất.</p>
            
            <h3 class="text-xl font-bold">Giá trị cốt lõi</h3>
            <ul class="list-disc pl-6">
              <li><strong>Chất lượng:</strong> Chỉ cung cấp sản phẩm chính hãng, chất lượng cao</li>
              <li><strong>Tận tâm:</strong> Dịch vụ khách hàng chu đáo, tư vấn chuyên nghiệp</li>
              <li><strong>Sáng tạo:</strong> Luôn cập nhật công nghệ mới và giải pháp âm thanh tiên tiến</li>
              <li><strong>Uy tín:</strong> Cam kết bảo hành và hỗ trợ sau bán hàng tốt nhất</li>
            </ul>
            
            <h3 class="text-xl font-bold">Đội ngũ của chúng tôi</h3>
            <p>Với đội ngũ kỹ thuật viên được đào tạo chuyên sâu và nhân viên tư vấn giàu kinh nghiệm, chúng tôi tự tin mang đến dịch vụ tốt nhất cho khách hàng. Mỗi thành viên của Audio Tài Lộc đều có niềm đam mê với âm thanh và công nghệ.</p>
            
            <h3 class="text-xl font-bold">Thành tựu</h3>
            <ul class="list-disc pl-6">
              <li>Phục vụ hơn 5000+ khách hàng hài lòng</li>
              <li>Đối tác chính thức của nhiều thương hiệu âm thanh quốc tế</li>
              <li>Nhận giải thưởng "Cửa hàng âm thanh uy tín" năm 2022</li>
              <li>Mạng lưới 3 showroom tại TP.HCM</li>
            </ul>
          </div>
        `,
        heroImageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1920&h=800&fit=crop',
      }),
      type: 'JSON',
    },
    {
      key: 'site.socials',
      value: JSON.stringify({
        facebook: 'https://facebook.com/audiotailoc',
        youtube: 'https://youtube.com/@audiotailoc',
        tiktok: 'https://tiktok.com/@audiotailoc',
        instagram: 'https://instagram.com/audiotailoc',
        zalo: '0901234567',
      }),
      type: 'JSON',
    },
  ];

  for (const setting of siteSettings) {
    await prisma.system_configs.upsert({
      where: { key: setting.key },
      update: { value: setting.value, type: setting.type },
      create: {
        id: randomUUID(),
        updatedAt: new Date(),
        ...setting
      },
    });
  }

  // Create sample notifications for admin emails if users exist
  if (adminEnv.length > 0) {
    const admins = await prisma.users.findMany({ where: { email: { in: adminEnv } }, select: { id: true, email: true } });
    for (const admin of admins) {
      const hasAny = await (prisma as any).notification.count({ where: { userId: admin.id } }).catch(() => 0);
      if (hasAny === 0) {
        await (prisma as any).notification.create({
          data: {
            userId: admin.id,
            type: 'SYSTEM',
            title: 'Chào mừng quản trị viên',
            message: 'Tài khoản của bạn đã được thiết lập. Đây là thông báo thử nghiệm.',
          }
        }).catch(() => undefined);
      }
    }
  }
}

main()
  .then(async () => {
    console.log('Seed completed');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
