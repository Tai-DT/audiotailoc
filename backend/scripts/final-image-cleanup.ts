/**
 * Final cleanup script to handle remaining products without images
 * Tries multiple strategies to find and upload images
 * 
 * Usage:
 *   npx ts-node scripts/final-image-cleanup.ts
 */

import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';

dotenv.config({ path: resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

// Configure Cloudinary
const cloudinaryUrl = process.env.CLOUDINARY_URL;
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudinaryUrl) {
  cloudinary.config({ url: cloudinaryUrl, secure: true } as any);
} else if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

const IMAGES_DIR = path.resolve(__dirname, '../data/phuctruongaudio/images');

async function uploadImageToCloudinary(imagePath: string, productSlug: string): Promise<string | null> {
  try {
    if (!fs.existsSync(imagePath)) {
      return null;
    }

    if (!cloudinaryUrl && !cloudName) {
      return null;
    }

    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'audiotailoc/products',
      public_id: `products/${productSlug}`,
      overwrite: true,
      resource_type: 'image'
    });

    return result.secure_url || result.url || null;
  } catch (error: any) {
    return null;
  }
}

async function downloadAndUploadImage(imageUrl: string, productSlug: string): Promise<string | null> {
  try {
    if (!imageUrl || !imageUrl.startsWith('http')) {
      return null;
    }

    if (!cloudinaryUrl && !cloudName) {
      return null;
    }

    // Fix relative URLs
    if (imageUrl.startsWith('//')) {
      imageUrl = 'https:' + imageUrl;
    } else if (imageUrl.startsWith('/')) {
      imageUrl = 'https://phuctruongaudio.vn' + imageUrl;
    }

    // Download image
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Upload to Cloudinary using upload_stream
    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'audiotailoc/products',
          public_id: `products/${productSlug}`,
          overwrite: true,
          resource_type: 'image'
        },
        (error, result) => {
          if (error) {
            resolve(null);
          } else {
            resolve(result?.secure_url || result?.url || null);
          }
        }
      );

      uploadStream.end(Buffer.from(response.data));
    });
  } catch (error: any) {
    return null;
  }
}

/**
 * Try to find image from scraped data
 */
function findImageFromScrapedData(product: any, scrapedProducts: any[]): string | null {
  // Try exact name match
  const exactMatch = scrapedProducts.find(sp => 
    sp.name?.toLowerCase() === product.name.toLowerCase()
  );
  if (exactMatch?.imageUrl) {
    return exactMatch.imageUrl;
  }

  // Try partial name match
  const partialMatch = scrapedProducts.find(sp => {
    const spName = sp.name?.toLowerCase() || '';
    const pName = product.name.toLowerCase();
    return spName.includes(pName.substring(0, 30)) || 
           pName.includes(spName.substring(0, 30));
  });
  if (partialMatch?.imageUrl) {
    return partialMatch.imageUrl;
  }

  // Try slug match
  const slugMatch = scrapedProducts.find(sp => {
    const spSlug = sp.slug?.toLowerCase() || '';
    const pSlug = product.slug.toLowerCase();
    return pSlug.includes(spSlug) || spSlug.includes(pSlug.split('-').slice(-3).join('-'));
  });
  if (slugMatch?.imageUrl) {
    return slugMatch.imageUrl;
  }

  return null;
}

/**
 * Try to find local image file
 */
function findLocalImage(product: any, imageFiles: any[]): string | null {
  const productSlug = product.slug.toLowerCase();
  
  for (const imgFile of imageFiles) {
    const imgSlug = imgFile.slug.toLowerCase();
    
    // Exact match
    if (productSlug === imgSlug || productSlug.endsWith(`-${imgSlug}`)) {
      return imgFile.path;
    }
    
    // Contains match
    if (productSlug.includes(imgSlug) && imgSlug.length > 5) {
      return imgFile.path;
    }
    
    // Extract last parts and match
    const slugParts = productSlug.split('-');
    for (let i = Math.max(1, slugParts.length - 5); i < slugParts.length; i++) {
      const testSlug = slugParts.slice(i).join('-');
      if (testSlug === imgSlug || imgSlug.includes(testSlug)) {
        return imgFile.path;
      }
    }
  }
  
  return null;
}

async function processRemainingProducts() {
  console.log('🔍 Processing remaining products without images...\n');

  // Get all products without images
  const productsWithoutImages = await prisma.products.findMany({
    where: { isDeleted: false, imageUrl: null },
    select: {
      id: true,
      name: true,
      slug: true,
      categoryId: true
    }
  });

  console.log(`📦 Found ${productsWithoutImages.length} products without images\n`);

  // Load scraped products data
  const productsJsonPath = path.resolve(__dirname, '../data/phuctruongaudio/products.json');
  let scrapedProducts: any[] = [];
  if (fs.existsSync(productsJsonPath)) {
    scrapedProducts = JSON.parse(fs.readFileSync(productsJsonPath, 'utf-8'));
    console.log(`📄 Loaded ${scrapedProducts.length} scraped products\n`);
  }

  // Get all local image files
  const imageFiles: any[] = [];
  if (fs.existsSync(IMAGES_DIR)) {
    const files = fs.readdirSync(IMAGES_DIR)
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => ({
        filename: file,
        path: path.join(IMAGES_DIR, file),
        slug: file.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')
      }));
    imageFiles.push(...files);
    console.log(`📁 Found ${imageFiles.length} local image files\n`);
  }

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < productsWithoutImages.length; i++) {
    const product = productsWithoutImages[i];
    
    try {
      process.stdout.write(`\r   Processing: ${i + 1}/${productsWithoutImages.length} | ✅ ${uploaded} | ⏭️  ${skipped} | ❌ ${failed} | ${product.name.substring(0, 40)}...`);

      let cloudinaryImageUrl: string | null = null;

      // Strategy 1: Try to find from scraped data
      const scrapedImageUrl = findImageFromScrapedData(product, scrapedProducts);
      if (scrapedImageUrl) {
        cloudinaryImageUrl = await downloadAndUploadImage(scrapedImageUrl, product.slug);
        if (cloudinaryImageUrl) {
          uploaded++;
          await prisma.products.update({
            where: { id: product.id },
            data: {
              imageUrl: cloudinaryImageUrl,
              images: JSON.stringify([cloudinaryImageUrl]),
              updatedAt: new Date()
            }
          });
          continue;
        }
      }

      // Strategy 2: Try to find local image file
      const localImagePath = findLocalImage(product, imageFiles);
      if (localImagePath) {
        cloudinaryImageUrl = await uploadImageToCloudinary(localImagePath, product.slug);
        if (cloudinaryImageUrl) {
          uploaded++;
          await prisma.products.update({
            where: { id: product.id },
            data: {
              imageUrl: cloudinaryImageUrl,
              images: JSON.stringify([cloudinaryImageUrl]),
              updatedAt: new Date()
            }
          });
          continue;
        }
      }

      skipped++;

    } catch (error: any) {
      failed++;
    }
  }

  console.log('\n\n📊 Final Cleanup Summary:');
  console.log(`   ✅ Images uploaded: ${uploaded}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📦 Total processed: ${productsWithoutImages.length} products`);
}

async function main() {
  try {
    await processRemainingProducts();
  } catch (error: any) {
    console.error('\n❌ Script failed:', error.message || error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('\n🎉 Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error.message || error);
    process.exit(1);
  });
