
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

async function uploadAndUpdate() {
  const imagePath = '/Users/macbook/.gemini/antigravity/brain/91ba04cf-c120-4882-ad31-e18794e607bb/premium_cafe_acoustic_setup_1767634944812.png';
  
  try {
    console.log('Uploading image to Cloudinary...');
    const uploadResult = await cloudinary.uploader.upload(imagePath, {
      folder: 'audiotailoc/products',
      public_id: 'premium-cafe-acoustic-system'
    });
    
    const imageUrl = uploadResult.secure_url;
    console.log('Uploaded image:', imageUrl);
    
    console.log('Updating products in database...');
    const result = await prisma.products.updateMany({
      where: {
        slug: {
          in: [
            'dan-am-thanh-san-khau-cafe-acoustic-vip',
            'dan-am-thanh-san-khau-e3-acoustic',
            'dan-am-thanh-acoustic-bose-s1-pro-cao-cap'
          ]
        }
      },
      data: {
        imageUrl: imageUrl,
        images: JSON.stringify([imageUrl])
      }
    });
    
    console.log(`Updated ${result.count} products.`);
    
    // Also update category image if possible
    await prisma.categories.update({
        where: { slug: 'am-thanh-quan-cafe' },
        data: { imageUrl: imageUrl }
    });
    console.log('Updated category image.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

uploadAndUpdate();
