#!/usr/bin/env node

/**
 * Script đơn giản để upload hình ảnh mẫu mà không cần preset
 * Sử dụng signed upload với API key
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Cấu hình Cloudinary
const CLOUD_NAME = 'dib7tbv7w';
const API_KEY = '515973253722995';
const API_SECRET = 'JHQbBTbJicxxdF7qoJrLUBLYI7w';

// Danh sách sản phẩm cần update
const products = [
  {
    id: 'cmf7jedkd000827ypbac28k9n',
    name: 'Dàn Karaoke Gia Đình 5.1 Premium',
    imageUrl: 'https://picsum.photos/400/300?random=1'
  },
  {
    id: 'cmf7jflmf000a27q13mz82bgo',
    name: 'Dàn Karaoke Chuyên Nghiệp 7.1',
    imageUrl: 'https://picsum.photos/400/300?random=2'
  },
  {
    id: 'cmf7jflt9000c27q1u8pbxi8i',
    name: 'Đầu Karaoke 100.000 Bài Hát HD',
    imageUrl: 'https://picsum.photos/400/300?random=3'
  },
  {
    id: 'cmf7jflz1000e27q1lh4ivnka',
    name: 'Đầu Karaoke 50.000 Bài Hát',
    imageUrl: 'https://picsum.photos/400/300?random=4'
  },
  {
    id: 'cmf7jfm4t000g27q1zko8aeh0',
    name: 'Bộ Loa Karaoke 500W + Subwoofer 300W',
    imageUrl: 'https://picsum.photos/400/300?random=5'
  }
];

// Hàm tạo signature cho signed upload
function createSignature(params) {
  const sortedParams = Object.keys(params).sort();
  const signatureString = sortedParams
    .map(key => `${key}=${params[key]}`)
    .join('&') + API_SECRET;

  return crypto.createHash('sha1').update(signatureString).digest('hex');
}

// Hàm upload signed
async function uploadSigned(imageUrl, productName) {
  try {
    console.log(`📥 Downloading ${productName}...`);

    // Download image
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(`☁️  Uploading ${productName} to Cloudinary...`);

    // Tạo form data
    const formData = new FormData();
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    formData.append('file', blob, `${productName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.jpg`);

    // Thêm parameters
    const timestamp = Math.floor(Date.now() / 1000);
    const params = {
      timestamp: timestamp,
      folder: 'products',
      public_id: productName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
    };

    // Tạo signature
    const signature = createSignature(params);

    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', API_KEY);
    formData.append('signature', signature);
    formData.append('folder', params.folder);
    formData.append('public_id', params.public_id);

    // Upload
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await uploadResponse.json();

    if (uploadResponse.ok) {
      console.log(`✅ Success: ${result.secure_url}`);
      return result.secure_url;
    } else {
      console.log(`❌ Failed: ${result.error?.message}`);
      return null;
    }

  } catch (error) {
    console.error(`❌ Error uploading ${productName}:`, error.message);
    return null;
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

    console.log(`💾 Updated ${result.name}`);
    return result;
  } catch (error) {
    console.error(`❌ Database error for ${productId}:`, error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Hàm chính
async function uploadSampleImages() {
  console.log('🚀 Starting signed upload for sample images...\n');

  let successCount = 0;

  for (const product of products) {
    try {
      const cloudinaryUrl = await uploadSigned(product.imageUrl, product.name);

      if (cloudinaryUrl) {
        await updateProductImage(product.id, cloudinaryUrl);
        successCount++;
      }

      console.log(''); // Empty line
    } catch (error) {
      console.error(`❌ Failed to process ${product.name}:`, error.message);
    }
  }

  console.log('🎉 Complete!');
  console.log(`✅ Successfully uploaded: ${successCount}/${products.length} products`);

  if (successCount > 0) {
    console.log('\n🔗 Images uploaded to Cloudinary and database updated!');
    console.log('📱 Check dashboard: http://localhost:3001');
  }
}

// Chạy script
uploadSampleImages().catch(console.error);
