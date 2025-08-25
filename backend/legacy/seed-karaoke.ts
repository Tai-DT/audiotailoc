import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedKaraokeProducts() {
  console.log('🎤 Seeding Karaoke products...');

  // Create Karaoke category
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

  // Create Karaoke subcategories
  const karaokeSubcategories = [
    {
      name: 'Dàn Karaoke',
      slug: 'dan-karaoke', 
      description: 'Dàn karaoke tích hợp hoàn chỉnh cho gia đình và kinh doanh'
    },
    {
      name: 'Đầu Karaoke',
      slug: 'dau-karaoke',
      description: 'Đầu karaoke HD, 4K với kho nhạc khổng lồ'
    },
    {
      name: 'Loa & Loa Sub',
      slug: 'loa-karaoke',
      description: 'Loa karaoke chuyên dụng và loa sub bass mạnh mẽ'
    },
    {
      name: 'Micro Phone',
      slug: 'micro-karaoke',
      description: 'Micro karaoke có dây và không dây chất lượng cao'
    },
    {
      name: 'Mixer / Vang Số',
      slug: 'mixer-vang-so',
      description: 'Mixer và vang số chuyên nghiệp cho karaoke'
    },
    {
      name: 'Màn Hình Chọn Bài',
      slug: 'man-hinh-chon-bai',
      description: 'Màn hình cảm ứng chọn bài karaoke thông minh'
    }
  ];

  const subcategories = await Promise.all(
    karaokeSubcategories.map(sub => 
      prisma.category.upsert({
        where: { slug: sub.slug },
        update: {},
        create: {
          name: sub.name,
          slug: sub.slug,
          description: sub.description,
          image: `/images/categories/${sub.slug}.jpg`,
          parentId: karaokeCategory.id,
          seoTitle: `${sub.name} Chuyên Nghiệp | Audio Tài Lộc`,
          seoDescription: sub.description,
          isActive: true,
        },
      })
    )
  );

  // Create Karaoke products
  const karaokeProducts = [
    // Dàn Karaoke
    {
      name: 'Dàn Karaoke Gia Đình BMB 880SE',
      slug: 'dan-karaoke-bmb-880se',
      description: 'Dàn karaoke gia đình cao cấp BMB 880SE với âm thanh sống động, kết nối Bluetooth',
      category: subcategories[0].id,
      price: 25000000,
      comparePrice: 30000000,
      specifications: {
        'Công suất': '2x300W',
        'Kết nối': 'Bluetooth, USB, AUX',
        'Đầu karaoke': 'Tích hợp sẵn',
        'Màn hình': '21.5 inch cảm ứng',
        'Bảo hành': '24 tháng'
      },
      images: ['/images/products/dan-karaoke-bmb-880se-1.jpg'],
      status: 'ACTIVE'
    },
    {
      name: 'Dàn Karaoke Kinh Doanh Paramax Pro 2000',
      slug: 'dan-karaoke-paramax-pro-2000',
      description: 'Dàn karaoke kinh doanh chuyên nghiệp với âm thanh cực đỉnh, phù hợp quán karaoke',
      category: subcategories[0].id,
      price: 45000000,
      comparePrice: 52000000,
      specifications: {
        'Công suất': '4x500W',
        'Kết nối': 'HDMI, Bluetooth, WiFi',
        'Chất lượng âm thanh': 'Hi-Fi',
        'Số micro': 'Hỗ trợ 8 micro',
        'Bảo hành': '36 tháng'
      },
      images: ['/images/products/dan-karaoke-paramax-pro-2000-1.jpg'],
      status: 'ACTIVE'
    },

    // Đầu Karaoke
    {
      name: 'Đầu Karaoke Acnos SK9018KTV',
      slug: 'dau-karaoke-acnos-sk9018ktv',
      description: 'Đầu karaoke 4K với 50,000+ bài hát cập nhật liên tục, giao diện thân thiện',
      category: subcategories[1].id,
      price: 6500000,
      comparePrice: 7500000,
      specifications: {
        'Độ phân giải': '4K Ultra HD',
        'Kho nhạc': '50,000+ bài hát',
        'Cập nhật': 'Online tự động',
        'Định dạng': 'MP4, MKV, AVI',
        'Bảo hành': '18 tháng'
      },
      images: ['/images/products/dau-karaoke-acnos-sk9018ktv-1.jpg'],
      status: 'ACTIVE'
    },

    // Loa & Loa Sub
    {
      name: 'Loa Karaoke JBL KP6055',
      slug: 'loa-karaoke-jbl-kp6055',
      description: 'Loa karaoke JBL 3 tấc chuyên nghiệp với âm bass sâu, treble trong trẻo',
      category: subcategories[2].id,
      price: 8500000,
      comparePrice: 9800000,
      specifications: {
        'Công suất': '600W',
        'Driver': '3 tấc x 2, Tweeter 1 inch',
        'Tần số': '45Hz - 20kHz',
        'Trọng lượng': '25kg/chiếc',
        'Bảo hành': '24 tháng'
      },
      images: ['/images/products/loa-karaoke-jbl-kp6055-1.jpg'],
      status: 'ACTIVE'
    },
    {
      name: 'Loa Sub Karaoke Martin MX215SUB',
      slug: 'loa-sub-martin-mx215sub',
      description: 'Loa sub bass 2 tấc 5 Martin chuyên dụng karaoke với âm bass sâu lắng, mạnh mẽ',
      category: subcategories[2].id,
      price: 12000000,
      comparePrice: 14000000,
      specifications: {
        'Công suất': '1000W',
        'Driver Sub': '2 tấc 5 x 2',
        'Tần số': '20Hz - 200Hz',
        'Kết nối': 'XLR, Jack 6.5',
        'Bảo hành': '24 tháng'
      },
      images: ['/images/products/loa-sub-martin-mx215sub-1.jpg'],
      status: 'ACTIVE'
    },

    // Micro Phone
    {
      name: 'Micro Karaoke Không Dây Shure UGX9II',
      slug: 'micro-karaoke-shure-ugx9ii',
      description: 'Micro karaoke không dây Shure cao cấp với chất lượng âm thanh studio, chống hú tốt',
      category: subcategories[3].id,
      price: 3200000,
      comparePrice: 3800000,
      specifications: {
        'Loại': 'Không dây UHF',
        'Tần số': '500MHz - 900MHz',
        'Khoảng cách': '100m không vướng',
        'Pin': '8-10 giờ liên tục',
        'Bảo hành': '18 tháng'
      },
      images: ['/images/products/micro-karaoke-shure-ugx9ii-1.jpg'],
      status: 'ACTIVE'
    },

    // Mixer / Vang Số
    {
      name: 'Mixer Karaoke Yamaha MG12XU',
      slug: 'mixer-karaoke-yamaha-mg12xu',
      description: 'Mixer karaoke Yamaha 12 kênh với hiệu ứng vang số tích hợp, chất lượng âm thanh chuyên nghiệp',
      category: subcategories[4].id,
      price: 7800000,
      comparePrice: 8900000,
      specifications: {
        'Số kênh': '12 kênh',
        'Hiệu ứng': 'Vang số tích hợp',
        'EQ': '3 band/kênh',
        'Phantom Power': '+48V',
        'Bảo hành': '24 tháng'
      },
      images: ['/images/products/mixer-karaoke-yamaha-mg12xu-1.jpg'],
      status: 'ACTIVE'
    },

    // Màn Hình Chọn Bài
    {
      name: 'Màn Hình Cảm Ứng Karaoke 21.5 inch',
      slug: 'man-hinh-cam-ung-karaoke-215',
      description: 'Màn hình cảm ứng chọn bài karaoke 21.5 inch Full HD, giao diện thân thiện, phản hồi nhanh',
      category: subcategories[5].id,
      price: 4200000,
      comparePrice: 4800000,
      specifications: {
        'Kích thước': '21.5 inch',
        'Độ phân giải': '1920x1080',
        'Cảm ứng': '10 điểm đa chạm',
        'Kết nối': 'HDMI, USB, WiFi',
        'Bảo hành': '18 tháng'
      },
      images: ['/images/products/man-hinh-cam-ung-karaoke-215-1.jpg'],
      status: 'ACTIVE'
    }
  ];

  // Create products
  for (const productData of karaokeProducts) {
    const { category, specifications, images, ...productInfo } = productData;
    
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productInfo,
        categoryId: category,
        specifications: specifications,
        images: images,
        inventory: {
          create: {
            quantity: Math.floor(Math.random() * 50) + 10,
            reserved: 0,
            location: 'Kho Karaoke',
          }
        },
        seoTitle: `${productData.name} - Chính Hãng | Audio Tài Lộc`,
        seoDescription: productData.description,
      }
    });
  }

  // Create liquidation service for Karaoke
  const liquidationService = await prisma.service.upsert({
    where: { slug: 'thanh-ly-karaoke' },
    update: {},
    create: {
      name: 'Thanh Lý Thiết Bị Karaoke',
      slug: 'thanh-ly-karaoke',
      description: 'Dịch vụ thu mua và thanh lý thiết bị karaoke cũ với giá tốt',
      category: 'LIQUIDATION',
      type: 'AUDIO_EQUIPMENT',
      basePriceCents: 0,
      estimatedDuration: 60,
      requirements: JSON.stringify(['Thiết bị còn hoạt động', 'Có phụ kiện kèm theo']),
      features: JSON.stringify(['Định giá miễn phí', 'Thu mua tận nơi']),
      imageUrl: '/images/services/thanh-ly-karaoke.jpg',
    },
  });

  // Create some sample requests for the service
  await prisma.serviceBooking.createMany({
    data: [
      {
        serviceId: liquidationService.id,
        customerName: 'Nguyễn Văn A',
        customerEmail: 'nguyenvana@example.com',
        customerPhone: '0901234567',
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        address: '123 Đường Karaoke, Quận 1, TP.HCM',
        status: 'PENDING',
        notes: 'Thanh lý dàn karaoke 5.1 cũ'
      },
      {
        serviceId: liquidationService.id,
        customerName: 'Trần Thị B',
        customerEmail: 'tranthib@example.com',
        customerPhone: '0902345678',
        scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        address: '456 Đường Âm Nhạc, Quận 3, TP.HCM',
        status: 'PENDING',
        notes: 'Thu mua đầu karaoke cũ'
      }
    ]
  });
}

seedKaraokeProducts()
  .catch((e) => {
    console.error('❌ Error during karaoke seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

