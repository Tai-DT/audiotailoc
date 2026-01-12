
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

async function uploadGallery() {
  const images = [
    { name: 'main', path: '/Users/macbook/.gemini/antigravity/brain/91ba04cf-c120-4882-ad31-e18794e607bb/premium_cafe_acoustic_setup_1767634944812.png', id: 'vip-set-main' },
    { name: 'speaker', path: '/Users/macbook/.gemini/antigravity/brain/91ba04cf-c120-4882-ad31-e18794e607bb/loa_acoustic_e3_br85_detail_1767653978637.png', id: 'vip-set-speaker' },
    { name: 'sub', path: '/Users/macbook/.gemini/antigravity/brain/91ba04cf-c120-4882-ad31-e18794e607bb/loa_sub_e3_br115_detail_1767653993760.png', id: 'vip-set-sub' },
    { name: 'mic', path: '/Users/macbook/.gemini/antigravity/brain/91ba04cf-c120-4882-ad31-e18794e607bb/micro_e3_q8900_detail_1767654009767.png', id: 'vip-set-mic' },
    { name: 'mixer', path: '/Users/macbook/.gemini/antigravity/brain/91ba04cf-c120-4882-ad31-e18794e607bb/mixer_soundcraft_epm6_detail_1767654029017.png', id: 'vip-set-mixer' },
    { name: 'processor', path: '/Users/macbook/.gemini/antigravity/brain/91ba04cf-c120-4882-ad31-e18794e607bb/vang_so_e3_s7_detail_1767654053020.png', id: 'vip-set-processor' },
    { name: 'amp', path: '/Users/macbook/.gemini/antigravity/brain/91ba04cf-c120-4882-ad31-e18794e607bb/cuc_day_e3_pa48_detail_1767654069476.png', id: 'vip-set-amp' },
    { name: 'monitor', path: '/Users/macbook/.gemini/antigravity/brain/91ba04cf-c120-4882-ad31-e18794e607bb/loa_monitor_caf_m15a_detail_1767654085299.png', id: 'vip-set-monitor' }
  ];

  try {
    const urls = [];
    for (const img of images) {
      console.log(`Uploading ${img.name}...`);
      const result = await cloudinary.uploader.upload(img.path, {
        folder: 'audiotailoc/products/vip-cafe',
        public_id: img.id
      });
      urls.push(result.secure_url);
      console.log(`Uploaded ${img.name}: ${result.secure_url}`);
    }

    console.log('Updating product gallery in database...');
    await prisma.products.update({
      where: { slug: 'dan-am-thanh-san-khau-cafe-acoustic-vip' },
      data: {
        imageUrl: urls[0],
        images: JSON.stringify(urls)
      }
    });

    console.log('Success!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

uploadGallery();
