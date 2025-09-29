/*
  Seed script to populate initial products for local development.
  Usage: pnpm --filter @audiotailoc/backend ts-node src/seed.ts
*/
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
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

  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim() || 'admin@audiotailoc.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD?.trim() || 'password123';
  const adminName = process.env.SEED_ADMIN_NAME?.trim() || 'Audio Tài Lộc';

  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  // Admin user
  const adminUser = await prisma.users.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: 'ADMIN',
      id: crypto.randomUUID(),
      updatedAt: new Date()
    },
  });

  console.log(`👤 Admin user ready: ${adminEmail}`);

  // Categories
  const catSpeakers = await prisma.categories.upsert({ where: { slug: 'loa' }, update: {}, create: { slug: 'loa', name: 'Loa', id: crypto.randomUUID(), updatedAt: new Date() } });
  const catHeadphones = await prisma.categories.upsert({ where: { slug: 'tai-nghe' }, update: {}, create: { slug: 'tai-nghe', name: 'Tai nghe', id: crypto.randomUUID(), updatedAt: new Date() } });

  // Service Types
  const serviceTypeInstallation = await prisma.service_types.upsert({ 
    where: { slug: 'lap-dat' }, 
    update: {}, 
    create: { 
      slug: 'lap-dat', 
      name: 'Lắp đặt & Thi công',
      description: 'Dịch vụ lắp đặt và thi công hệ thống âm thanh chuyên nghiệp',
      isActive: true,
      id: crypto.randomUUID(),
      updatedAt: new Date()
    } 
  });
  const serviceTypeMaintenance = await prisma.service_types.upsert({ 
    where: { slug: 'bao-tri' }, 
    update: {}, 
    create: { 
      slug: 'bao-tri', 
      name: 'Bảo trì & Sửa chữa',
      description: 'Dịch vụ bảo trì và sửa chữa thiết bị âm thanh',
      isActive: true,
      id: crypto.randomUUID(),
      updatedAt: new Date()
    } 
  });
  const serviceTypeConsultation = await prisma.service_types.upsert({ 
    where: { slug: 'tu-van' }, 
    update: {}, 
    create: { 
      slug: 'tu-van', 
      name: 'Tư vấn & Thiết kế',
      description: 'Dịch vụ tư vấn và thiết kế hệ thống âm thanh',
      isActive: true,
      id: crypto.randomUUID(),
      updatedAt: new Date()
    } 
  });

  // Promotions
  const now = new Date();
  const nextYear = new Date(now.getTime());
  nextYear.setFullYear(now.getFullYear() + 1);
  await prisma.promotions.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      name: 'Welcome 10%',
      description: 'Giảm 10% cho khách hàng mới',
      type: 'PERCENTAGE',
      value: 10,
      isActive: true,
      expiresAt: nextYear,
      id: crypto.randomUUID(),
      updatedAt: new Date()
    },
  });

  const blogCategoryDefinitions = [
    {
      slug: 'huong-dan',
      name: 'Hướng dẫn',
      description: 'Các bài viết chia sẻ kinh nghiệm và hướng dẫn sử dụng thiết bị âm thanh.',
      imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=960&h=540&fit=crop',
    },
    {
      slug: 'kien-thuc',
      name: 'Kiến thức âm thanh',
      description: 'Kiến thức nền tảng về âm thanh, thiết bị và xu hướng công nghệ.',
      imageUrl: 'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=960&h=540&fit=crop',
    },
    {
      slug: 'tin-tuc',
      name: 'Tin tức',
      description: 'Tin tức mới nhất về sản phẩm, sự kiện và hoạt động của Audio Tài Lộc.',
      imageUrl: 'https://images.unsplash.com/photo-1512427691650-1e0c1b4f2612?w=960&h=540&fit=crop',
    },
    {
      slug: 'du-an-thuc-te',
      name: 'Dự án thực tế',
      description: 'Những dự án lắp đặt và triển khai hệ thống âm thanh tiêu biểu.',
      imageUrl: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=960&h=540&fit=crop',
    },
  ];

  const blogCategoryMap = new Map<string, string>();
  for (const category of blogCategoryDefinitions) {
    const saved = await prisma.blog_categories.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        imageUrl: category.imageUrl,
        isActive: true,
      },
      create: {
        slug: category.slug,
        name: category.name,
        description: category.description,
        imageUrl: category.imageUrl,
        isActive: true,
        id: crypto.randomUUID(),
        updatedAt: new Date()
      },
    });
    blogCategoryMap.set(category.slug, saved.id);
  }

  console.log(`🗂️  Seeded ${blogCategoryMap.size} blog categories`);

  type BlogArticleSeed = {
    slug: string;
    title: string;
    categorySlug: string;
    excerpt: string;
    imageUrl: string;
    content: string;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    publishedAt: Date;
    viewCount: number;
    likeCount: number;
    comments?: Array<{
      authorName: string;
      authorEmail: string;
      content: string;
      createdAt?: Date;
    }>;
  };

  const blogArticles: BlogArticleSeed[] = [
    {
      slug: 'huong-dan-chon-loa-keo-cho-gia-dinh',
      title: 'Hướng dẫn chọn loa kéo phù hợp cho gia đình',
      categorySlug: 'huong-dan',
      excerpt: 'Bạn đang tìm loa kéo cho gia đình? Bài viết này sẽ giúp bạn chọn được sản phẩm phù hợp với nhu cầu và ngân sách.',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1280&h=720&fit=crop',
      content: `
        <p>Loa kéo là lựa chọn linh hoạt cho các buổi tiệc gia đình, sinh nhật hay karaoke tại nhà. Khi chọn loa kéo, bạn nên chú ý tới công suất, thời lượng pin, chất lượng micro và khả năng kết nối.</p>
        <h2>Công suất phù hợp với không gian</h2>
        <p>Không gian phòng khách nhỏ 15-20m² chỉ cần loa công suất 80-150W. Với không gian lớn hơn, bạn nên chọn các mẫu 200W trở lên để đảm bảo âm lượng và sự lan tỏa âm thanh.</p>
        <h2>Thời lượng pin và khả năng di chuyển</h2>
        <p>Các mẫu loa kéo hiện nay thường có pin kéo dài 4-8 giờ. Nếu bạn thường xuyên sử dụng ngoài trời, hãy chọn loa có thời lượng pin lớn và bánh xe kéo tiện dụng.</p>
        <h2>Kết nối đa dạng</h2>
        <p>Ưu tiên các sản phẩm hỗ trợ Bluetooth 5.0, USB, thẻ nhớ và cổng AUX để dễ dàng phát nhạc từ điện thoại, laptop hay TV.</p>
      `,
      seoTitle: 'Hướng dẫn chọn loa kéo cho gia đình',
      seoDescription: 'Bí quyết chọn mua loa kéo phù hợp cho gia đình với công suất, thời lượng pin và kết nối tối ưu.',
      seoKeywords: 'loa kéo, hướng dẫn mua loa, karaoke gia đình',
      publishedAt: new Date('2024-12-05T08:00:00Z'),
      viewCount: 420,
      likeCount: 65,
      comments: [
        {
          authorName: 'Nguyễn Văn A',
          authorEmail: 'nguyenvana@example.com',
          content: 'Bài viết rất hữu ích, nhờ vậy tôi đã chọn được mẫu loa phù hợp!',
        },
        {
          authorName: 'Trần Thị B',
          authorEmail: 'tranthib@example.com',
          content: 'Mong bạn chia sẻ thêm về cách bảo quản loa kéo khi sử dụng ngoài trời.',
        },
      ],
    },
    {
      slug: 'cam-nang-am-thanh-cho-quan-cafe',
      title: 'Cẩm nang thiết kế âm thanh cho quán cà phê',
      categorySlug: 'du-an-thuc-te',
      excerpt: 'Âm thanh đóng vai trò quan trọng trong trải nghiệm khách hàng tại quán cà phê. Cùng tìm hiểu cách thiết kế hệ thống âm thanh hài hòa.',
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1280&h=720&fit=crop',
      content: `
        <p>Âm nhạc nhẹ nhàng giúp khách hàng thư giãn và ở lại lâu hơn. Hệ thống âm thanh cho quán cà phê cần đảm bảo sự đồng đều giữa các khu vực và không gây ồn ào.</p>
        <ul>
          <li>Lựa chọn loa treo tường hoặc âm trần để tiết kiệm diện tích.</li>
          <li>Thiết kế zoning để điều chỉnh âm lượng phù hợp từng khu vực.</li>
          <li>Sử dụng ampli tích hợp DSP để cân chỉnh tần số, tránh ù bass hoặc chói treble.</li>
        </ul>
        <p>Audio Tài Lộc đã triển khai hơn 50 dự án quán cà phê trong 2 năm qua và luôn nhận được phản hồi tích cực từ khách hàng.</p>
      `,
      seoTitle: 'Cẩm nang thiết kế âm thanh cho quán cà phê',
      seoDescription: 'Giải pháp thiết kế âm thanh chuyên nghiệp cho quán cà phê, tạo trải nghiệm thư giãn cho khách hàng.',
      seoKeywords: 'thiết kế âm thanh, quán cà phê, dự án thực tế',
      publishedAt: new Date('2024-11-20T09:30:00Z'),
      viewCount: 310,
      likeCount: 52,
    },
    {
      slug: 'ban-tin-am-thanh-thang-12',
      title: 'Bản tin âm thanh tháng 12: Xu hướng và sản phẩm nổi bật',
      categorySlug: 'tin-tuc',
      excerpt: 'Cùng điểm qua những xu hướng âm thanh và sản phẩm nổi bật trong tháng 12 cùng Audio Tài Lộc.',
      imageUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1280&h=720&fit=crop',
      content: `
        <p>Tháng 12 ghi nhận sự quan tâm lớn tới các mẫu loa di động chống nước và tai nghe chống ồn. Các thương hiệu như JBL, Sony, Bose tiếp tục ra mắt phiên bản nâng cấp với thời lượng pin ấn tượng.</p>
        <p>Đặc biệt, thị trường karaoke gia đình cũng tăng trưởng mạnh với nhiều giải pháp âm thanh tích hợp. Audio Tài Lộc đang triển khai chương trình ưu đãi cuối năm cho các combo karaoke trọn gói.</p>
      `,
      seoTitle: 'Bản tin âm thanh tháng 12: Xu hướng mới',
      seoDescription: 'Cập nhật xu hướng âm thanh và sản phẩm nổi bật tháng 12 từ Audio Tài Lộc.',
      seoKeywords: 'tin tức âm thanh, xu hướng âm thanh, sản phẩm mới',
      publishedAt: new Date('2024-12-15T07:45:00Z'),
      viewCount: 255,
      likeCount: 38,
    },
    {
      slug: 'kien-thuc-can-ban-ve-he-thong-hi-fi',
      title: 'Kiến thức căn bản về hệ thống Hi-Fi dành cho người mới',
      categorySlug: 'kien-thuc',
      excerpt: 'Bài viết dành cho người mới tìm hiểu về hệ thống Hi-Fi: thành phần, cách phối ghép và lưu ý quan trọng.',
      imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1280&h=720&fit=crop',
      content: `
        <p>Hệ thống Hi-Fi gồm các thành phần chính: nguồn phát, ampli và loa. Việc phối ghép đúng cách giúp tái tạo âm thanh trung thực.</p>
        <h2>Lựa chọn nguồn phát</h2>
        <p>Người chơi có thể lựa chọn đầu CD, đầu phát nhạc số (streamer) hoặc mâm đĩa than tùy theo sở thích.</p>
        <h2>Phối ghép ampli và loa</h2>
        <p>Chú ý công suất và trở kháng phù hợp. Ampli đèn mang lại âm thanh ấm áp, trong khi ampli bán dẫn cho công suất mạnh mẽ.</p>
        <p>Đừng quên xử lý phòng nghe bằng vật liệu tiêu âm để đạt được trải nghiệm tốt nhất.</p>
      `,
      seoTitle: 'Kiến thức căn bản về hệ thống Hi-Fi',
      seoDescription: 'Giới thiệu hệ thống Hi-Fi, thành phần cơ bản và cách phối ghép dành cho người mới bắt đầu.',
      seoKeywords: 'hi-fi, kiến thức âm thanh, phối ghép loa',
      publishedAt: new Date('2024-10-02T06:15:00Z'),
      viewCount: 198,
      likeCount: 44,
    },
  ];

  for (const article of blogArticles) {
    const categoryId = blogCategoryMap.get(article.categorySlug);
    if (!categoryId) {
      console.warn(`⚠️  Skipping article ${article.slug} because category ${article.categorySlug} was not found`);
      continue;
    }

    const baseData = {
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      imageUrl: article.imageUrl,
      categoryId,
      authorId: adminUser.id,
      status: 'PUBLISHED',
      publishedAt: article.publishedAt,
      viewCount: article.viewCount,
      likeCount: article.likeCount,
      seoTitle: article.seoTitle,
      seoDescription: article.seoDescription,
      seoKeywords: article.seoKeywords,
    };

    const savedArticle = await prisma.blog_articles.upsert({
      where: { slug: article.slug },
      update: {
        ...baseData,
        commentCount: article.comments?.length ?? 0,
      },
      create: {
        slug: article.slug,
        ...baseData,
        commentCount: article.comments?.length ?? 0,
        id: crypto.randomUUID(),
        updatedAt: new Date()
      },
    });

    if (article.comments && article.comments.length > 0) {
      for (const comment of article.comments) {
        const existingComment = await prisma.blog_comments.findFirst({
          where: {
            articleId: savedArticle.id,
            authorEmail: comment.authorEmail,
            content: comment.content,
          },
        });

        if (!existingComment) {
          await prisma.blog_comments.create({
            data: {
              articleId: savedArticle.id,
              authorName: comment.authorName,
              authorEmail: comment.authorEmail,
              content: comment.content,
              isApproved: true,
              createdAt: comment.createdAt ?? article.publishedAt,
              id: crypto.randomUUID(),
              updatedAt: new Date()
            },
          });
        }
      }

      const commentCount = await prisma.blog_comments.count({ where: { articleId: savedArticle.id } });
      await prisma.blog_articles.update({
        where: { id: savedArticle.id },
        data: { commentCount },
      });
    }
  }

  console.log(`📝 Seeded ${blogArticles.length} blog articles`);

  const items = [
    {
      slug: 'loa-tai-loc-classic',
      name: 'Loa Tài Lộc Classic',
      description: 'Âm thanh ấm áp, thiết kế cổ điển. Loa 2 chiều với driver 6.5" và tweeter dome, công suất 50W RMS.',
      shortDescription: 'Âm thanh ấm áp, thiết kế cổ điển',
      priceCents: 1990000,
      originalPriceCents: 2200000,
      images: JSON.stringify(['https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/speaker-1.jpg']),
      categoryId: catSpeakers.id,
      brand: 'Tài Lộc',
      model: 'Classic',
      sku: 'ATL-CLASSIC-001',
      stockQuantity: 15,
      featured: true,
      isActive: true,
      viewCount: 150,
      warranty: '12 tháng',
      weight: 4.5,
      dimensions: '25x18x30 cm'
    },
    {
      slug: 'tai-nghe-tai-loc-pro',
      name: 'Tai nghe Tài Lộc Pro',
      description: 'Tai nghe studio chuyên nghiệp với driver 40mm, đáp tuyến tần số 20Hz-20kHz, trở kháng 32Ω.',
      shortDescription: 'Tai nghe studio chuyên nghiệp',
      priceCents: 2990000,
      images: JSON.stringify(['https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/headphone-1.jpg']),
      categoryId: catHeadphones.id,
      brand: 'Tài Lộc',
      model: 'Pro',
      sku: 'ATL-PRO-001',
      stockQuantity: 25,
      featured: true,
      isActive: true,
      viewCount: 200,
      warranty: '24 tháng',
      weight: 0.3,
      dimensions: '18x15x8 cm'
    },
    {
      slug: 'soundbar-tai-loc-5-1',
      name: 'Soundbar Tài Lộc 5.1',
      description: 'Hệ thống âm thanh rạp tại gia với 5 loa vệ tinh và subwoofer, công suất tổng 300W.',
      shortDescription: 'Rạp tại gia, âm trường rộng',
      priceCents: 4990000,
      originalPriceCents: 5500000,
      images: JSON.stringify(['https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/soundbar-1.jpg']),
      categoryId: catSpeakers.id,
      brand: 'Tài Lộc',
      model: '5.1',
      sku: 'ATL-5-1-001',
      stockQuantity: 8,
      featured: true,
      isActive: true,
      viewCount: 120,
      warranty: '18 tháng',
      weight: 8.2,
      dimensions: '90x10x8 cm'
    },
    {
      slug: 'loa-bluetooth-jbl-go-3',
      name: 'Loa Bluetooth JBL GO 3',
      description: 'Loa di động chống nước IPX7, kết nối Bluetooth 5.0, thời lượng pin lên đến 5 giờ.',
      shortDescription: 'Loa di động chống nước, âm thanh JBL',
      priceCents: 1490000,
      images: JSON.stringify(['https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/jbl-go3.jpg']),
      categoryId: catSpeakers.id,
      brand: 'JBL',
      model: 'GO 3',
      sku: 'JBL-GO3-001',
      stockQuantity: 30,
      featured: false,
      isActive: true,
      viewCount: 95,
      warranty: '12 tháng',
      weight: 0.2,
      dimensions: '8.1x7.5x3.9 cm'
    },
    {
      slug: 'tai-nghe-sony-wh-1000xm4',
      name: 'Tai nghe Sony WH-1000XM4',
      description: 'Tai nghe chống ồn chủ động hàng đầu với công nghệ chống ồn HD, thời lượng pin 30 giờ.',
      shortDescription: 'Tai nghe chống ồn hàng đầu thế giới',
      priceCents: 8990000,
      originalPriceCents: 9500000,
      images: JSON.stringify(['https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/sony-wh1000xm4.jpg']),
      categoryId: catHeadphones.id,
      brand: 'Sony',
      model: 'WH-1000XM4',
      sku: 'SON-WH1000XM4-001',
      stockQuantity: 12,
      featured: true,
      isActive: true,
      viewCount: 180,
      warranty: '12 tháng',
      weight: 0.25,
      dimensions: '18.5x25.2x8.3 cm'
    },
    {
      slug: 'loa-karaoke-samsung',
      name: 'Loa Karaoke Samsung',
      description: 'Hệ thống karaoke gia đình với micro không dây, hiệu ứng âm thanh chuyên nghiệp, hỗ trợ USB/SD.',
      shortDescription: 'Hệ thống karaoke gia đình hoàn chỉnh',
      priceCents: 3500000,
      images: JSON.stringify(['https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/karaoke-1.jpg']),
      categoryId: catSpeakers.id,
      brand: 'Samsung',
      model: 'Karaoke Pro',
      sku: 'SAM-KARAOKE-001',
      stockQuantity: 10,
      featured: false,
      isActive: true,
      viewCount: 85,
      warranty: '12 tháng',
      weight: 6.8,
      dimensions: '35x25x20 cm'
    },
    {
      slug: 'microphone-shure-sm58',
      name: 'Microphone Shure SM58',
      description: 'Microphone động chuyên nghiệp cho biểu diễn và ghi âm, đáp tuyến tần số 50Hz-15kHz.',
      shortDescription: 'Micro SM58 - Biểu tượng của độ bền',
      priceCents: 2500000,
      images: JSON.stringify(['https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/shure-sm58.jpg']),
      categoryId: catSpeakers.id,
      brand: 'Shure',
      model: 'SM58',
      sku: 'SHU-SM58-001',
      stockQuantity: 20,
      featured: true,
      isActive: true,
      viewCount: 160,
      warranty: '24 tháng',
      weight: 0.3,
      dimensions: '16.2x5.1x5.1 cm'
    },
    {
      slug: 'loa-monitor-yamaha-hs8',
      name: 'Loa Monitor Yamaha HS8',
      description: 'Loa monitor studio 2 chiều với driver 8" và tweeter 1", công suất 75W, đáp tuyến 38Hz-30kHz.',
      shortDescription: 'Loa monitor studio chuyên nghiệp',
      priceCents: 8500000,
      images: JSON.stringify(['https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/yamaha-hs8.jpg']),
      categoryId: catSpeakers.id,
      brand: 'Yamaha',
      model: 'HS8',
      sku: 'YAM-HS8-001',
      stockQuantity: 6,
      featured: true,
      isActive: true,
      viewCount: 110,
      warranty: '36 tháng',
      weight: 10.2,
      dimensions: '25x30x39 cm'
    }
  ];

  for (const item of items) {
    // Upsert to keep idempotent
    // Note: sequential upserts to avoid DB write spikes
    const p = await prisma.products.upsert({
      where: { slug: item.slug },
      update: item,
      create: { ...item, id: crypto.randomUUID(), updatedAt: new Date() },
    });
    // Seed KB entry for product if not exists
    const exists = await prisma.knowledge_base_entries.findFirst({ where: { productId: p.id, kind: 'PRODUCT' } });
    if (!exists) {
      await prisma.knowledge_base_entries.create({ data: { kind: 'PRODUCT', title: p.name, content: p.description || '', productId: p.id, id: crypto.randomUUID(), updatedAt: new Date() } });
    }
  }

  // Seed Services
  const services = [
    {
      slug: 'lap-dat-he-thong-am-thanh-gia-dinh',
      name: 'Lắp đặt hệ thống âm thanh gia đình',
      description: 'Dịch vụ lắp đặt chuyên nghiệp hệ thống âm thanh rạp tại gia với loa, ampli, thiết bị streaming và hiệu chỉnh âm thanh chuyên nghiệp.',
      shortDescription: 'Lắp đặt rạp tại gia hoàn chỉnh',
      price: 5000000,
      minPrice: 3000000,
      maxPrice: 15000000,
      priceType: 'RANGE',
      duration: 480, // 8 hours
      typeId: serviceTypeInstallation.id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop']),
      isActive: true,
      isFeatured: true,
      viewCount: 245,
      tags: JSON.stringify(['lắp đặt', 'rạp tại gia', 'home theater', 'hiệu chỉnh âm thanh']),
      features: JSON.stringify([
        'Khảo sát và tư vấn miễn phí',
        'Lắp đặt chuyên nghiệp bởi kỹ thuật viên giàu kinh nghiệm',
        'Hiệu chỉnh âm thanh với thiết bị chuyên dụng',
        'Hướng dẫn sử dụng và bảo hành 12 tháng',
        'Hỗ trợ kỹ thuật trọn đời'
      ]),
      requirements: JSON.stringify([
        'Không gian lắp đặt đã hoàn thiện',
        'Nguồn điện 220V ổn định',
        'Internet (cho thiết bị streaming)',
        'Khách hàng có mặt tại thời điểm lắp đặt'
      ])
    },
    {
      slug: 'tu-van-thiet-ke-he-thong-am-thanh',
      name: 'Tư vấn thiết kế hệ thống âm thanh',
      description: 'Dịch vụ tư vấn và thiết kế hệ thống âm thanh chuyên nghiệp cho gia đình, văn phòng, nhà hàng, trường học và các không gian thương mại.',
      shortDescription: 'Tư vấn thiết kế hệ thống âm thanh',
      price: 2000000,
      priceType: 'FIXED',
      duration: 120, // 2 hours
      typeId: serviceTypeConsultation.id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop']),
      isActive: true,
      isFeatured: true,
      viewCount: 189,
      tags: JSON.stringify(['tư vấn', 'thiết kế', 'acoustic design', 'âm học']),
      features: JSON.stringify([
        'Khảo sát thực tế không gian lắp đặt',
        'Phân tích acoustic và yêu cầu âm thanh',
        'Thiết kế sơ đồ hệ thống chi tiết',
        'Tư vấn chọn thiết bị phù hợp',
        'Báo giá chi tiết và timeline thực hiện'
      ]),
      requirements: JSON.stringify([
        'Mô tả yêu cầu sử dụng hệ thống',
        'Bản vẽ kỹ thuật (nếu có)',
        'Ngân sách dự kiến',
        'Thời hạn hoàn thành'
      ])
    },
    {
      slug: 'bao-tri-va-sua-chua-thiet-bi-am-thanh',
      name: 'Bảo trì và sửa chữa thiết bị âm thanh',
      description: 'Dịch vụ bảo trì định kỳ và sửa chữa khẩn cấp các thiết bị âm thanh như loa, ampli, mixer, micro, tai nghe với đội ngũ kỹ thuật viên chuyên nghiệp.',
      shortDescription: 'Bảo trì & sửa chữa thiết bị âm thanh',
      price: 500000,
      priceType: 'NEGOTIABLE',
      duration: 180, // 3 hours
      typeId: serviceTypeMaintenance.id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&h=600&fit=crop']),
      isActive: true,
      isFeatured: true,
      viewCount: 156,
      tags: JSON.stringify(['bảo trì', 'sửa chữa', 'technical support', 'repair']),
      features: JSON.stringify([
        'Kiểm tra và chẩn đoán miễn phí',
        'Sửa chữa tận nơi hoặc tại xưởng',
        'Thay thế linh kiện chính hãng',
        'Bảo hành sửa chữa 6 tháng',
        'Hỗ trợ kỹ thuật hotline 24/7'
      ]),
      requirements: JSON.stringify([
        'Mô tả triệu chứng và tình trạng thiết bị',
        'Hình ảnh hoặc video lỗi (nếu có)',
        'Thông tin bảo hành (nếu còn hạn)',
        'Thời gian thuận tiện để kỹ thuật viên đến'
      ])
    },
    {
      slug: 'lap-dat-he-thong-karaoke-chuyen-nghiep',
      name: 'Lắp đặt hệ thống karaoke chuyên nghiệp',
      description: 'Dịch vụ lắp đặt hệ thống karaoke chuyên nghiệp cho quán bar, nhà hàng, karaoke gia đình với thiết bị chất lượng cao và hiệu chỉnh âm thanh chuyên nghiệp.',
      shortDescription: 'Lắp đặt karaoke chuyên nghiệp',
      price: 8000000,
      minPrice: 5000000,
      maxPrice: 25000000,
      priceType: 'RANGE',
      duration: 600, // 10 hours
      typeId: serviceTypeInstallation.id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop']),
      isActive: true,
      isFeatured: false,
      viewCount: 134,
      tags: JSON.stringify(['karaoke', 'quán bar', 'nhà hàng', 'điều chỉnh âm thanh']),
      features: JSON.stringify([
        'Khảo sát và tư vấn loại hình kinh doanh',
        'Lựa chọn thiết bị phù hợp với ngân sách',
        'Lắp đặt và đấu nối chuyên nghiệp',
        'Hiệu chỉnh âm thanh cho từng phòng',
        'Đào tạo nhân viên sử dụng hệ thống'
      ]),
      requirements: JSON.stringify([
        'Thông tin về quy mô kinh doanh',
        'Số lượng phòng và diện tích mỗi phòng',
        'Ngân sách cho hệ thống',
        'Thời hạn hoàn thành dự án'
      ])
    },
    {
      slug: 'thiet-ke-am-thanh-cho-nha-hang-khach-san',
      name: 'Thiết kế âm thanh cho nhà hàng, khách sạn',
      description: 'Dịch vụ thiết kế và lắp đặt hệ thống âm thanh chuyên nghiệp cho nhà hàng, khách sạn, resort với giải pháp âm thanh nền và paging system.',
      shortDescription: 'Thiết kế âm thanh thương mại',
      price: 15000000,
      priceType: 'CONTACT',
      duration: 720, // 12 hours
      typeId: serviceTypeConsultation.id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop']),
      isActive: true,
      isFeatured: false,
      viewCount: 98,
      tags: JSON.stringify(['nhà hàng', 'khách sạn', 'âm thanh nền', 'paging system']),
      features: JSON.stringify([
        'Khảo sát acoustic chi tiết',
        'Thiết kế zoning âm thanh',
        'Lựa chọn thiết bị phù hợp',
        'Lắp đặt và commissioning',
        'Đào tạo và handover'
      ]),
      requirements: JSON.stringify([
        'Bản vẽ kiến trúc và kỹ thuật',
        'Yêu cầu về chất lượng âm thanh',
        'Ngân sách dự án',
        'Timeline thực hiện'
      ])
    },
    {
      slug: 'hieu-chinh-am-thanh-chuyen-nghiep',
      name: 'Hiệu chỉnh âm thanh chuyên nghiệp',
      description: 'Dịch vụ hiệu chỉnh âm thanh chuyên nghiệp với thiết bị đo đạc hiện đại, cân bằng hệ thống loa và tối ưu hóa chất lượng âm thanh.',
      shortDescription: 'Hiệu chỉnh âm thanh chuyên nghiệp',
      price: 1500000,
      priceType: 'FIXED',
      duration: 240, // 4 hours
      typeId: serviceTypeMaintenance.id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&h=600&fit=crop']),
      isActive: true,
      isFeatured: false,
      viewCount: 76,
      tags: JSON.stringify(['hiệu chỉnh âm thanh', 'calibration', 'acoustic measurement', 'tuning']),
      features: JSON.stringify([
        'Đo đạc acoustic với máy chuyên dụng',
        'Phân tích tần số và đáp ứng',
        'Cân bằng hệ thống loa',
        'Tối ưu hóa chất lượng âm thanh',
        'Báo cáo chi tiết sau hiệu chỉnh'
      ]),
      requirements: JSON.stringify([
        'Hệ thống âm thanh đã lắp đặt',
        'Không gian đã hoàn thiện',
        'Thời gian thực hiện trong giờ hành chính',
        'Khách hàng có mặt để nghe và góp ý'
      ])
    }
  ];

  console.log(`📝 Creating ${services.length} services...`);

  for (const serviceData of services) {
    try {
      const existing = await prisma.services.findUnique({
        where: { slug: serviceData.slug }
      });

      if (existing) {
        console.log(`✓ Updating service: ${serviceData.name}`);
        const { typeId: _typeId, ...updateData } = serviceData;
        await prisma.services.update({
          where: { slug: serviceData.slug },
          data: updateData
        });
      } else {
        console.log(`✓ Creating service: ${serviceData.name}`);
        await prisma.services.create({
          data: { ...serviceData, id: crypto.randomUUID(), updatedAt: new Date() }
        });
      }
    } catch (error) {
      console.error(`✗ Error with service ${serviceData.name}:`, error);
    }
  }

  // Seed FAQ entries if none
  const faqCount = await prisma.knowledge_base_entries.count({ where: { kind: 'FAQ' } });
  if (faqCount === 0) {
    await prisma.knowledge_base_entries.createMany({
      data: [
        { kind: 'FAQ', title: 'Chính sách đổi trả', content: 'Đổi trả trong 7 ngày với sản phẩm còn nguyên vẹn.', id: crypto.randomUUID(), updatedAt: new Date() },
        { kind: 'FAQ', title: 'Bảo hành', content: 'Bảo hành 12 tháng cho tất cả sản phẩm chính hãng.', id: crypto.randomUUID(), updatedAt: new Date() },
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
        data: { ...banner, id: crypto.randomUUID(), updatedAt: new Date() },
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
      create: { ...setting, id: crypto.randomUUID(), updatedAt: new Date() },
    });
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
