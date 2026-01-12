
import sharp from 'sharp';
import path from 'path';
import * as fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

const LOGO_PATH = '/Users/macbook/Desktop/audiotailoc/frontend/public/images/logo/logo-dark.svg';
const OUTPUT_DIR = path.join(__dirname, '../temp_watermarked');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

async function addWatermarkAndUpload(inputPath: string, publicId: string, folder: string) {
  const outputPath = path.join(OUTPUT_DIR, `${path.basename(inputPath, path.extname(inputPath))}_wm.png`);
  
  // High quality watermark processing
  await sharp(inputPath)
    .composite([
      {
        input: LOGO_PATH,
        gravity: 'southeast', // Position: bottom right
        blend: 'over',
      }
    ])
    .toFile(outputPath);

  console.log(`Watermarked image created: ${outputPath}`);

  const result = await cloudinary.uploader.upload(outputPath, {
    folder: folder,
    public_id: publicId,
    overwrite: true,
  });

  return result.secure_url;
}

async function applyLogoWatermarks() {
  const vipProducts = [
    {
      slug: 'dan-am-thanh-san-khau-cafe-acoustic-vip',
      mainImg: '/Users/macbook/.gemini/antigravity/brain/91ba04cf-c120-4882-ad31-e18794e607bb/premium_cafe_acoustic_setup_1767634944812.png',
      gallery: [
        { name: 'speaker', path: '/Users/macbook/.gemini/antigravity/brain/91ba04cf-c120-4882-ad31-e18794e607bb/loa_acoustic_e3_br85_detail_1767653978637.png', id: 'vip-set-speaker' },
        { name: 'sub', path: '/Users/macbook/.gemini/antigravity/brain/91ba04cf-c120-4882-ad31-e18794e607bb/loa_sub_e3_br115_detail_1767653993760.png', id: 'vip-set-sub' },
        { name: 'mic', path: '/Users/macbook/.gemini/antigravity/brain/91ba04cf-c120-4882-ad31-e18794e607bb/micro_e3_q8900_detail_1767654009767.png', id: 'vip-set-mic' },
        { name: 'mixer', path: '/Users/macbook/.gemini/antigravity/brain/91ba04cf-c120-4882-ad31-e18794e607bb/mixer_soundcraft_epm6_detail_1767654029017.png', id: 'vip-set-mixer' },
        { name: 'processor', path: '/Users/macbook/.gemini/antigravity/brain/91ba04cf-c120-4882-ad31-e18794e607bb/vang_so_e3_s7_detail_1767654053020.png', id: 'vip-set-processor' },
        { name: 'amp', path: '/Users/macbook/.gemini/antigravity/brain/91ba04cf-c120-4882-ad31-e18794e607bb/cuc_day_e3_pa48_detail_1767654069476.png', id: 'vip-set-amp' },
        { name: 'monitor', path: '/Users/macbook/.gemini/antigravity/brain/91ba04cf-c120-4882-ad31-e18794e607bb/loa_monitor_caf_m15a_detail_1767654085299.png', id: 'vip-set-monitor' }
      ]
    }
  ];

  try {
    for (const prod of vipProducts) {
      console.log(`Processing ${prod.slug}...`);
      
      const mainUrl = await addWatermarkAndUpload(prod.mainImg, 'vip-set-main', 'audiotailoc/products/vip-cafe');
      
      const galleryUrls = [];
      galleryUrls.push(mainUrl);
      
      for (const item of prod.gallery) {
        const url = await addWatermarkAndUpload(item.path, item.id, 'audiotailoc/products/vip-cafe');
        galleryUrls.push(url);
      }

      await prisma.products.update({
        where: { slug: prod.slug },
        data: {
          imageUrl: mainUrl,
          images: JSON.stringify(galleryUrls)
        }
      });
      console.log(`Updated ${prod.slug} with logo watermarks.`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

applyLogoWatermarks();
