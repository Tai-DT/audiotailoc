import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function enhanceProducts() {
  console.log('🚀 Enhancing products with detailed information...');

  try {
    // First, let's get current products to see what we have
    const existingProducts = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        specifications: true,
        features: true,
        categoryId: true,
        warranty: true,
        weight: true,
        dimensions: true,
        metaTitle: true,
        metaDescription: true
      }
    });

    console.log(`📊 Found ${existingProducts.length} existing products`);

    // Enhanced product data with detailed specifications
    const newProducts: any[] = [
      {
        name: "Loa Bluetooth JBL GO 3",
        slug: "loa-bluetooth-jbl-go-3",
        description: "Loa Bluetooth JBL GO 3 với chất lượng âm thanh vượt trội, thiết kế nhỏ gọn, chống nước IPX7. Hoàn hảo cho việc nghe nhạc ngoài trời và các hoạt động thể thao.",
        shortDescription: "Loa Bluetooth nhỏ gọn, chống nước với âm thanh JBL chất lượng cao",
        priceCents: 890000,
        originalPriceCents: 990000,
        brand: "JBL",
        model: "GO 3",
        sku: "JBL-GO3-BLK",
        stockQuantity: 25,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
          "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400"
        ]),
        specifications: JSON.stringify({
          "Driver Size": "40mm",
          "Frequency Response": "110Hz - 20kHz",
          "Impedance": "4 ohms",
          "Sensitivity": "85dB",
          "Battery Life": "5 giờ",
          "Charging Time": "2.5 giờ",
          "Water Resistance": "IPX7",
          "Connectivity": "Bluetooth 4.1",
          "Dimensions": "87.5 x 75 x 31.5mm",
          "Weight": "184g"
        }),
        features: "Chống nước IPX7, Bluetooth 4.1, Pin 5 giờ, Thiết kế nhỏ gọn",
        warranty: "12 tháng",
        weight: 184,
        dimensions: "87.5 x 75 x 31.5mm",
        metaTitle: "Loa Bluetooth JBL GO 3 - Chống Nước, Âm Thanh Chất Lượng",
        metaDescription: "Mua Loa Bluetooth JBL GO 3 chính hãng với giá tốt nhất. Chống nước IPX7, âm thanh JBL chất lượng cao, pin 5 giờ sử dụng.",
        featured: true,
        categoryId: null as string | null
      },
      {
        name: "Tai Nghe Sony WH-1000XM4",
        slug: "tai-nghe-sony-wh-1000xm4",
        description: "Tai nghe chống ồn Sony WH-1000XM4 với công nghệ chống ồn tiên tiến, âm thanh Hi-Res, và thời lượng pin lên đến 30 giờ. Trải nghiệm nghe nhạc đỉnh cao với chất lượng studio.",
        shortDescription: "Tai nghe chống ồn cao cấp với âm thanh Hi-Res và pin 30 giờ",
        priceCents: 8990000,
        originalPriceCents: 9990000,
        brand: "Sony",
        model: "WH-1000XM4",
        sku: "SONY-WH1000XM4-BLK",
        stockQuantity: 15,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400"
        ]),
        specifications: JSON.stringify({
          "Driver Size": "40mm",
          "Frequency Response": "4Hz - 40kHz",
          "Impedance": "48 ohms",
          "Sensitivity": "105dB/mW",
          "Battery Life": "30 giờ (ANC bật), 38 giờ (ANC tắt)",
          "Charging Time": "3 giờ",
          "Noise Cancellation": "HD Noise Cancelling Processor QN1",
          "Codec Support": "LDAC, aptX HD, aptX, AAC, SBC",
          "Weight": "254g",
          "Dimensions": "185 x 85 x 265mm",
          "Connectivity": "Bluetooth 5.0, USB-C, 3.5mm jack"
        }),
        features: "Chống ồn chủ động, Âm thanh Hi-Res, Pin 30 giờ, Bluetooth 5.0, Sạc nhanh",
        warranty: "24 tháng",
        weight: 254,
        dimensions: "185 x 85 x 265mm",
        metaTitle: "Tai Nghe Sony WH-1000XM4 - Chống Ồn Cao Cấp",
        metaDescription: "Tai nghe chống ồn Sony WH-1000XM4 chính hãng. Công nghệ chống ồn tiên tiến, âm thanh Hi-Res, pin 30 giờ sử dụng liên tục.",
        featured: true,
        categoryId: null as string | null
      },
      {
        name: "Soundbar Samsung HW-K360",
        slug: "soundbar-samsung-hw-k360",
        description: "Soundbar Samsung HW-K360 với âm thanh Dolby Digital, kết nối Bluetooth, và subwoofer không dây. Nâng cấp trải nghiệm xem phim và nghe nhạc của bạn.",
        shortDescription: "Soundbar 2.1 kênh với subwoofer không dây và Dolby Digital",
        priceCents: 2990000,
        originalPriceCents: 3490000,
        brand: "Samsung",
        model: "HW-K360",
        sku: "SS-HWK360-BLK",
        stockQuantity: 12,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400",
          "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400"
        ]),
        specifications: JSON.stringify({
          "Configuration": "2.1 kênh",
          "Total Power": "300W RMS",
          "Soundbar Power": "160W",
          "Subwoofer Power": "140W",
          "Frequency Response": "40Hz - 20kHz",
          "Connectivity": "HDMI, Optical, Bluetooth, USB",
          "Supported Formats": "Dolby Digital, DTS",
          "Dimensions (Soundbar)": "890 x 56 x 78mm",
          "Dimensions (Subwoofer)": "170 x 305 x 261mm",
          "Weight (Soundbar)": "1.8kg",
          "Weight (Subwoofer)": "5.2kg"
        }),
        features: "Dolby Digital, Subwoofer không dây, Bluetooth, HDMI ARC",
        warranty: "12 tháng",
        weight: 6900,
        dimensions: "890 x 56 x 78mm (Soundbar)",
        metaTitle: "Soundbar Samsung HW-K360 - Âm Thanh Vòm Chất Lượng",
        metaDescription: "Mua Soundbar Samsung HW-K360 chính hãng. Âm thanh Dolby Digital, subwoofer không dây, kết nối Bluetooth tiện lợi.",
        featured: true,
        categoryId: null as string | null
      },
      {
        name: "Microphone Audio-Technica AT2020",
        slug: "microphone-audio-technica-at2020",
        description: "Microphone condenser Audio-Technica AT2020 chuyên nghiệp cho studio recording. Độ nhạy cao, đáp tuyến tần số rộng, hoàn hảo cho giọng hát và nhạc cụ.",
        shortDescription: "Microphone condenser chuyên nghiệp cho studio recording",
        priceCents: 2590000,
        originalPriceCents: 2990000,
        brand: "Audio-Technica",
        model: "AT2020",
        sku: "AT-AT2020-BLK",
        stockQuantity: 8,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400",
          "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400"
        ]),
        specifications: JSON.stringify({
          "Type": "Condenser",
          "Polar Pattern": "Cardioid",
          "Frequency Response": "20Hz - 20kHz",
          "Impedance": "100 ohms",
          "Sensitivity": "-37dB (14.1mV)",
          "Max SPL": "144dB",
          "Signal-to-Noise Ratio": "74dB",
          "Dimensions": "52 x 162mm",
          "Weight": "345g",
          "Connector": "XLR",
          "Power Requirements": "48V DC phantom power"
        }),
        features: "Condenser cardioid, Độ nhạy cao, Phantom power 48V, XLR connector",
        warranty: "24 tháng",
        weight: 345,
        dimensions: "52 x 162mm",
        metaTitle: "Microphone Audio-Technica AT2020 - Condenser Chuyên Nghiệp",
        metaDescription: "Microphone condenser Audio-Technica AT2020 chính hãng. Hoàn hảo cho studio recording, podcast và streaming.",
        featured: false,
        categoryId: null as string | null
      },
      {
        name: "Tai Nghe Gaming Logitech G435",
        slug: "tai-nghe-gaming-logitech-g435",
        description: "Tai nghe gaming Logitech G435 với thiết kế nhẹ, thoải mái, pin 20 giờ và âm thanh DTS. Hoàn hảo cho gaming và nghe nhạc hàng ngày.",
        shortDescription: "Tai nghe gaming nhẹ với âm thanh DTS và pin 20 giờ",
        priceCents: 1290000,
        originalPriceCents: 1490000,
        brand: "Logitech",
        model: "G435",
        sku: "LOG-G435-BLK",
        stockQuantity: 20,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1599669454699-248893623440?w=400",
          "https://images.unsplash.com/photo-1599669454699-248893623440?w=400"
        ]),
        specifications: JSON.stringify({
          "Driver Size": "40mm",
          "Frequency Response": "20Hz - 20kHz",
          "Impedance": "45 ohms",
          "Sensitivity": "83.1dB SPL/mW",
          "Battery Life": "20 giờ",
          "Charging Time": "3 giờ",
          "Connectivity": "Bluetooth 5.0, USB-C",
          "Weight": "165g",
          "Dimensions": "163 x 71 x 182mm",
          "Microphone": "Built-in with noise cancellation",
          "Compatibility": "PC, Mac, Mobile devices"
        }),
        features: "Âm thanh DTS, Pin 20 giờ, Micro chống ồn, Thiết kế nhẹ",
        warranty: "24 tháng",
        weight: 165,
        dimensions: "163 x 71 x 182mm",
        metaTitle: "Tai Nghe Gaming Logitech G435 - Nhẹ Và Thoải Mái",
        metaDescription: "Tai nghe gaming Logitech G435 với thiết kế nhẹ, âm thanh DTS chất lượng cao và pin 20 giờ sử dụng.",
        featured: false,
        categoryId: null as string | null
      }
    ];

    // Get categories for assignment
    const categories = await prisma.category.findMany();
    const categoryMap: { [key: string]: string } = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });

    // Assign categories to new products
    newProducts.forEach(product => {
      if (product.name.includes('Loa') || product.name.includes('Soundbar')) {
        product.categoryId = categoryMap['loa'];
      } else if (product.name.includes('Tai nghe')) {
        product.categoryId = categoryMap['tai-nghe'];
      } else if (product.name.includes('Microphone')) {
        product.categoryId = categoryMap['am-thanh-chuyen-nghiep'];
      }
    });

    // Create new products
    console.log('\n📝 Creating new detailed products...');
    let createdCount = 0;
    for (const productData of newProducts) {
      try {
        await prisma.product.create({
          data: productData
        });
        console.log(`✅ Created: ${productData.name}`);
        createdCount++;
      } catch (error) {
        console.log(`⚠️ Failed to create: ${productData.name} - ${(error as Error).message}`);
      }
    }

    // Enhance existing products with more details
    console.log('\n🔧 Enhancing existing products...');
    let enhancedCount = 0;

    for (const product of existingProducts) {
      try {
        const updateData: any = {};

        // Add more detailed descriptions if missing
        if (!product.description || product.description.length < 50) {
          updateData.description = `${product.name} - Sản phẩm chất lượng cao với thiết kế hiện đại và tính năng vượt trội. Mang đến trải nghiệm âm thanh tuyệt vời cho mọi nhu cầu sử dụng.`;
        }

        // Add features if missing
        if (!product.features) {
          updateData.features = "Chất lượng cao, Thiết kế hiện đại, Tính năng vượt trội";
        }

        // Add warranty if missing
        if (!product.warranty) {
          updateData.warranty = "12 tháng";
        }

        // Add weight if missing
        if (!product.weight) {
          updateData.weight = Math.floor(Math.random() * 500) + 100; // Random weight 100-600g
        }

        // Add dimensions if missing
        if (!product.dimensions) {
          updateData.dimensions = `${Math.floor(Math.random() * 200) + 100} x ${Math.floor(Math.random() * 100) + 50} x ${Math.floor(Math.random() * 50) + 20}mm`;
        }

        // Add meta information if missing
        if (!product.metaTitle) {
          updateData.metaTitle = `${product.name} - Sản Phẩm Chất Lượng Cao`;
        }

        if (!product.metaDescription) {
          updateData.metaDescription = `${product.name} chính hãng với chất lượng vượt trội. Mua ngay để trải nghiệm sản phẩm tuyệt vời nhất.`;
        }

        if (Object.keys(updateData).length > 0) {
          await prisma.product.update({
            where: { id: product.id },
            data: updateData
          });
          console.log(`✅ Enhanced: ${product.name}`);
          enhancedCount++;
        }

      } catch (error) {
        console.log(`⚠️ Failed to enhance: ${product.name} - ${(error as Error).message}`);
      }
    }

    // Final summary
    const finalCount = await prisma.product.count();
    console.log('\n📊 FINAL SUMMARY:');
    console.log(`✅ Created ${createdCount} new detailed products`);
    console.log(`✅ Enhanced ${enhancedCount} existing products`);
    console.log(`📈 Total products in database: ${finalCount}`);

    // Show some sample enhanced products
    console.log('\n🎯 SAMPLE ENHANCED PRODUCTS:');
    const samples = await prisma.product.findMany({
      take: 3,
      select: {
        name: true,
        description: true,
        features: true,
        specifications: true
      }
    });

    samples.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Description: ${product.description?.substring(0, 100)}...`);
      console.log(`   Features: ${product.features}`);
      console.log(`   Has specs: ${product.specifications ? '✅' : '❌'}`);
      console.log('');
    });

  } catch (error) {
    console.error('💥 Error enhancing products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

enhanceProducts();
