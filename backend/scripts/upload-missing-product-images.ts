/**
 * Script to upload missing images for products that don't have images
 * 
 * Usage:
 *   npx ts-node scripts/upload-missing-product-images.ts
 */

import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import axios from 'axios';

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

async function uploadImageToCloudinary(imagePath: string, productSlug: string): Promise<string | null> {
  try {
    if (!fs.existsSync(imagePath)) {
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
    console.error(`   ❌ Error uploading ${imagePath}:`, error.message);
    return null;
  }
}

async function downloadAndUploadImage(imageUrl: string, productSlug: string): Promise<string | null> {
  try {
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
            console.error(`   ❌ Error uploading to Cloudinary:`, error.message);
            resolve(null);
          } else {
            resolve(result?.secure_url || result?.url || null);
          }
        }
      );

      uploadStream.end(Buffer.from(response.data));
    });
  } catch (error: any) {
    console.error(`   ❌ Error downloading/uploading image:`, error.message);
    return null;
  }
}

async function uploadMissingImages() {
  console.log('🖼️  Starting upload of missing product images...\n');

  try {
    // Get products without images
    const productsWithoutImages = await prisma.products.findMany({
      where: {
        imageUrl: null,
        isDeleted: false
      },
      select: {
        id: true,
        name: true,
        slug: true
      }
    });

    console.log(`📦 Found ${productsWithoutImages.length} products without images\n`);

    if (productsWithoutImages.length === 0) {
      console.log('✅ All products have images!');
      return;
    }

    // Read the scraped products JSON to get image URLs
    const productsJsonPath = path.resolve(__dirname, '../data/phuctruongaudio/products.json');
    let scrapedProducts: any[] = [];
    
    if (fs.existsSync(productsJsonPath)) {
      const jsonData = fs.readFileSync(productsJsonPath, 'utf-8');
      scrapedProducts = JSON.parse(jsonData);
      console.log(`📄 Loaded ${scrapedProducts.length} products from scraped data\n`);
    }

    // Create a map of slug to product data
    const productMap = new Map<string, any>();
    scrapedProducts.forEach(p => {
      // Try to match by slug (might need to extract base slug)
      const baseSlug = p.slug;
      productMap.set(baseSlug, p);
      
      // Also try with category prefix
      const categorySlug = p.categorySlug || '';
      const fullSlug = `${categorySlug}-${baseSlug}`;
      if (!productMap.has(fullSlug)) {
        productMap.set(fullSlug, p);
      }
    });

    let uploaded = 0;
    let failed = 0;

    for (const product of productsWithoutImages) {
      try {
        // Try to find matching product in scraped data
        let productData = productMap.get(product.slug);
        
        // If not found, try to extract base slug
        if (!productData) {
          const slugParts = product.slug.split('-');
          // Try different combinations
          for (let i = slugParts.length - 1; i >= 0; i--) {
            const testSlug = slugParts.slice(i).join('-');
            if (productMap.has(testSlug)) {
              productData = productMap.get(testSlug);
              break;
            }
          }
        }

        if (!productData) {
          // Try to find by name similarity
          const nameMatch = scrapedProducts.find(p => 
            p.name.toLowerCase().includes(product.name.toLowerCase().substring(0, 20)) ||
            product.name.toLowerCase().includes(p.name.toLowerCase().substring(0, 20))
          );
          if (nameMatch) {
            productData = nameMatch;
          }
        }

        if (!productData) {
          console.log(`   ⚠️  No image data found for: ${product.name}`);
          failed++;
          continue;
        }

        process.stdout.write(`\r   Processing: ${uploaded + failed + 1}/${productsWithoutImages.length} - ${product.name.substring(0, 40)}...`);

        let cloudinaryImageUrl: string | null = null;

        // Try local file first
        if (productData.imagePath && fs.existsSync(productData.imagePath)) {
          cloudinaryImageUrl = await uploadImageToCloudinary(productData.imagePath, product.slug);
        }
        
        // If local file doesn't work, try URL
        if (!cloudinaryImageUrl && productData.imageUrl) {
          cloudinaryImageUrl = await downloadAndUploadImage(productData.imageUrl, product.slug);
        }

        if (cloudinaryImageUrl) {
          // Update product with image URL
          await prisma.products.update({
            where: { id: product.id },
            data: {
              imageUrl: cloudinaryImageUrl,
              images: JSON.stringify([cloudinaryImageUrl]),
              updatedAt: new Date()
            }
          });
          uploaded++;
        } else {
          failed++;
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error: any) {
        failed++;
        console.error(`\n   ❌ Error processing ${product.name}:`, error.message);
      }
    }

    console.log('\n\n📊 Upload Summary:');
    console.log(`   ✅ Successfully uploaded: ${uploaded} images`);
    console.log(`   ❌ Failed: ${failed} images`);
    console.log(`   📦 Total processed: ${productsWithoutImages.length} products`);

  } catch (error: any) {
    console.error('\n❌ Error during upload:', error.message || error);
    throw error;
  }
}

// Run the script
uploadMissingImages()
  .then(async () => {
    await prisma.$disconnect();
    console.log('\n🎉 Script completed successfully!');
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('\n❌ Script failed:', error.message || error);
    await prisma.$disconnect();
    process.exit(1);
  });


