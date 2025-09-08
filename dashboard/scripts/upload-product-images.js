#!/usr/bin/env node

/**
 * Script để upload hình ảnh mẫu cho sản phẩm lên Cloudinary
 * Chạy: node scripts/upload-product-images.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Cấu hình Cloudinary
const CLOUD_NAME = 'dib7tbv7w';
const UPLOAD_PRESET = 'audio-tailoc';

// Danh sách sản phẩm và hình ảnh tương ứng
const products = [
  {
    id: 'cmf7jedkd000827ypbac28k9n',
    name: 'Dàn Karaoke Gia Đình 5.1 Premium',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    category: 'karaoke-system'
  },
  {
    id: 'cmf7jflmf000a27q13mz82bgo',
    name: 'Dàn Karaoke Chuyên Nghiệp 7.1',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    category: 'karaoke-system'
  },
  {
    id: 'cmf7jflt9000c27q1u8pbxi8i',
    name: 'Đầu Karaoke 100.000 Bài Hát HD',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    category: 'karaoke-player'
  },
  {
    id: 'cmf7jflz1000e27q1lh4ivnka',
    name: 'Đầu Karaoke 50.000 Bài Hát',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    category: 'karaoke-player'
  },
  {
    id: 'cmf7jfm4t000g27q1zko8aeh0',
    name: 'Bộ Loa Karaoke 500W + Subwoofer 300W',
    imageUrl: 'https://picsum.photos/400/300?random=5',
    category: 'speakers'
  },
  {
    id: 'cmf7jfmaj000i27q1ok97klzm',
    name: 'Loa Karaoke 300W',
    imageUrl: 'https://picsum.photos/400/300?random=6',
    category: 'speakers'
  },
  {
    id: 'cmf7jfmgd000k27q1jen61fhc',
    name: 'Micro Karaoke Không Dây 2.4G Dual',
    imageUrl: 'https://picsum.photos/400/300?random=7',
    category: 'microphones'
  },
  {
    id: 'cmf7jfmmn000m27q1xaysxdsc',
    name: 'Micro Karaoke Có Dây',
    imageUrl: 'https://picsum.photos/400/300?random=8',
    category: 'microphones'
  },
  {
    id: 'cmf7jfmtd000o27q11lejohk4',
    name: 'Mixer Karaoke 8 Kênh + Vang Số Pro',
    imageUrl: 'https://picsum.photos/400/300?random=9',
    category: 'mixers'
  },
  {
    id: 'cmf7jfmzc000q27q1p0g3u1no',
    name: 'Vang Số Karaoke 4 Kênh',
    imageUrl: 'https://picsum.photos/400/300?random=10',
    category: 'effects'
  }
];

// Hàm download hình ảnh
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filename);
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

// Hàm upload lên Cloudinary
async function uploadToCloudinary(imagePath, productName, category) {
  try {
    const formData = new FormData();
    const fileBuffer = fs.readFileSync(imagePath);
    const blob = new Blob([fileBuffer]);

    formData.append('file', blob, `${productName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.jpg`);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', `products/${category}`);
    formData.append('public_id', productName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase());

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();

    if (response.ok) {
      return result.secure_url;
    } else {
      throw new Error(`Upload failed: ${result.error?.message}`);
    }
  } catch (error) {
    throw error;
  }
}

// Hàm cập nhật database
async function updateProductImage(productId, imageUrl) {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const result = await prisma.product.update({
      where: { id: productId },
      data: { imageUrl },
      select: { id: true, name: true, imageUrl: true }
    });

    console.log(`✅ Cập nhật ${result.name}: ${result.imageUrl}`);
    return result;
  } catch (error) {
    console.error(`❌ Lỗi cập nhật ${productId}:`, error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Hàm chính
async function uploadProductImages() {
  console.log('🚀 Bắt đầu upload hình ảnh cho sản phẩm...\n');

  const tempDir = path.join(__dirname, '..', 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    try {
      console.log(`📥 [${i + 1}/${products.length}] Đang xử lý: ${product.name}`);

      // Download hình ảnh
      const tempFile = path.join(tempDir, `temp-${i}.jpg`);
      await downloadImage(product.imageUrl, tempFile);
      console.log(`   📥 Đã download hình ảnh`);

      // Upload lên Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(tempFile, product.name, product.category);
      console.log(`   ☁️  Đã upload lên Cloudinary: ${cloudinaryUrl}`);

      // Cập nhật database
      await updateProductImage(product.id, cloudinaryUrl);
      console.log(`   💾 Đã cập nhật database`);

      successCount++;

      // Xóa file tạm
      fs.unlinkSync(tempFile);

    } catch (error) {
      console.error(`❌ Lỗi xử lý ${product.name}:`, error.message);
      errorCount++;
    }

    console.log(''); // Empty line
  }

  // Dọn dẹp thư mục temp
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (error) {
    // Ignore cleanup errors
  }

  console.log('🎉 Hoàn thành!');
  console.log(`✅ Thành công: ${successCount} sản phẩm`);
  console.log(`❌ Lỗi: ${errorCount} sản phẩm`);

  if (successCount > 0) {
    console.log('\n🔗 Hình ảnh đã được upload lên Cloudinary và cập nhật trong database!');
    console.log('📱 Kiểm tra dashboard: http://localhost:3001');
  }
}

// Chạy script
uploadProductImages().catch(console.error);
