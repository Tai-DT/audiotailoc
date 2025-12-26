/**
 * Script to import products from phuctruongaudio.vn into database
 * Downloads images and uploads to Cloudinary
 * 
 * Usage:
 *   npx ts-node scripts/import-phuctruongaudio-with-cloudinary.ts
 */

import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import axios from 'axios';
import crypto from 'crypto';

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

interface Product {
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description?: string;
  imageUrl?: string;
  imagePath?: string; // Local path to downloaded image
  brand?: string;
  category: string;
  categorySlug: string;
  url: string;
  sku?: string;
}

// 8 categories mapping
const CATEGORY_MAPPING = [
  { name: 'DÀN KARAOKE', slug: 'dan-karaoke' },
  { name: 'MIXER / VANG SỐ', slug: 'mixer-vang-so' },
  { name: 'ĐẦU KARAOKE / CD', slug: 'dau-karaoke-cd' },
  { name: 'AMPLY – CỤC ĐẨY', slug: 'amply-cuc-day' },
  { name: 'Loa Soundbar', slug: 'loa-soundbar' },
  { name: 'LOA – LOA SUB', slug: 'loa-loa-sub' },
  { name: 'MICRO KARAOKE KHÔNG DÂY', slug: 'micro-karaoke-khong-day' },
  { name: 'Hàng Thanh Lý – Hàng Cũ', slug: 'hang-thanh-ly-hang-cu' }
];

function generateId(): string {
  return `cm${Date.now()}${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Generate a consistent, unique slug for a product
 * Format: categorySlug-productSlug (without hash for better matching)
 * If duplicate, add a short hash from URL
 */
function generateProductSlug(product: Product, existingSlugs: Set<string>): string {
  // Start with category-product slug
  let baseSlug = `${product.categorySlug}-${product.slug}`;
  
  // Normalize: lowercase, remove special chars, collapse dashes
  baseSlug = baseSlug
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 200); // Limit length

  // Check if slug already exists
  if (!existingSlugs.has(baseSlug)) {
    existingSlugs.add(baseSlug);
    return baseSlug;
  }

  // If duplicate, add a short hash from URL or name
  const hashSource = product.url || product.name;
  const hash = crypto.createHash('md5').update(hashSource).digest('hex').substring(0, 8);
  const uniqueSlug = `${baseSlug}-${hash}`;
  
  existingSlugs.add(uniqueSlug);
  return uniqueSlug;
}

async function uploadImageToCloudinary(imagePath: string, productSlug: string): Promise<string | null> {
  try {
    if (!fs.existsSync(imagePath)) {
      return null;
    }

    if (!cloudinaryUrl && !cloudName) {
      console.log('   ⚠️  Cloudinary is not configured, skipping image upload');
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
    console.error(`   ❌ Error uploading image to Cloudinary:`, error.message);
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

async function createCategories() {
  console.log('📁 Creating categories...\n');

  const createdCategories = [];

  for (const cat of CATEGORY_MAPPING) {
    try {
      const category = await prisma.categories.upsert({
        where: { slug: cat.slug },
        update: {
          name: cat.name,
          slug: cat.slug,
          isActive: true,
          updatedAt: new Date()
        },
        create: {
          id: generateId(),
          name: cat.name,
          slug: cat.slug,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      createdCategories.push(category);
      console.log(`   ✅ ${cat.name}`);
    } catch (error: any) {
      console.error(`   ❌ Error creating category ${cat.name}:`, error.message);
    }
  }

  console.log(`\n✅ Created/Updated ${createdCategories.length} categories\n`);
  return createdCategories;
}

async function importProducts() {
  console.log('📦 Starting product import...\n');

  // Read products.json
  const productsJsonPath = path.resolve(__dirname, '../data/phuctruongaudio/products.json');
  if (!fs.existsSync(productsJsonPath)) {
    console.error('❌ products.json not found! Please run scrape script first.');
    return;
  }

  const products: Product[] = JSON.parse(fs.readFileSync(productsJsonPath, 'utf-8'));
  console.log(`📄 Loaded ${products.length} products from JSON\n`);

  // Get all existing product slugs to check for duplicates
  const existingProducts = await prisma.products.findMany({
    select: { slug: true }
  });
  const existingSlugs = new Set(existingProducts.map(p => p.slug));

  let imported = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  let imagesUploaded = 0;

  for (const product of products) {
    try {
      // Find category
      const category = CATEGORY_MAPPING.find(c => c.slug === product.categorySlug);
      if (!category) {
        console.log(`   ⚠️  Skipping ${product.name}: Category not found`);
        skipped++;
        continue;
      }

      const categoryRecord = await prisma.categories.findUnique({
        where: { slug: category.slug }
      });

      if (!categoryRecord) {
        console.log(`   ⚠️  Skipping ${product.name}: Category not in database`);
        skipped++;
        continue;
      }

      const categoryId = categoryRecord.id;

      // Generate unique slug using improved function
      const finalSlug = generateProductSlug(product, existingSlugs);

      // Upload image to Cloudinary
      let cloudinaryImageUrl: string | null = null;
      
      if (product.imagePath && fs.existsSync(product.imagePath)) {
        // Upload from local file
        cloudinaryImageUrl = await uploadImageToCloudinary(product.imagePath, finalSlug);
        if (cloudinaryImageUrl) imagesUploaded++;
      } else if (product.imageUrl) {
        // Download and upload from URL
        cloudinaryImageUrl = await downloadAndUploadImage(product.imageUrl, finalSlug);
        if (cloudinaryImageUrl) imagesUploaded++;
      }

      const productData = {
        name: product.name,
        priceCents: BigInt(product.price),
        originalPriceCents: product.originalPrice ? BigInt(product.originalPrice) : null,
        imageUrl: cloudinaryImageUrl || null,
        images: cloudinaryImageUrl ? JSON.stringify([cloudinaryImageUrl]) : null,
        categoryId,
        brand: product.brand || null,
        sku: product.sku || null,
        description: product.description || null,
        isActive: true,
        isDeleted: false,
        updatedAt: new Date()
      };

      // Use upsert to handle both create and update
      try {
        const existing = await prisma.products.findUnique({
          where: { slug: finalSlug }
        });

        if (existing) {
          await prisma.products.update({
            where: { slug: finalSlug },
            data: productData
          });
          updated++;
        } else {
          await prisma.products.create({
            data: {
              id: generateId(),
              slug: finalSlug,
              ...productData,
              stockQuantity: 0,
              minOrderQuantity: 1,
              featured: false,
              viewCount: 0,
              createdAt: new Date()
            }
          });
          imported++;
        }

        process.stdout.write(`\r   ✅ Imported/Updated: ${imported + updated} | New: ${imported} | Updated: ${updated} | Images: ${imagesUploaded} | Skipped: ${skipped} | Errors: ${errors}`);
      } catch (upsertError: any) {
        // If upsert fails due to unique constraint, try with different slug
        if (upsertError.code === 'P2002') {
          const timestamp = Date.now().toString(36);
          const altSlug = `${finalSlug}-${timestamp}`;
          try {
            await prisma.products.create({
              data: {
                id: generateId(),
                slug: altSlug,
                ...productData,
                stockQuantity: 0,
                minOrderQuantity: 1,
                featured: false,
                viewCount: 0,
                createdAt: new Date()
              }
            });
            imported++;
            existingSlugs.add(altSlug);
            process.stdout.write(`\r   ✅ Imported/Updated: ${imported + updated} | New: ${imported} | Updated: ${updated} | Images: ${imagesUploaded} | Skipped: ${skipped} | Errors: ${errors}`);
          } catch (altError: any) {
            console.error(`\n   ❌ Error creating product with alt slug:`, altError.message);
            errors++;
          }
        } else {
          console.error(`\n   ❌ Error upserting product:`, upsertError.message);
          errors++;
        }
      }
    } catch (error: any) {
      console.error(`\n   ❌ Error processing product ${product.name}:`, error.message);
      errors++;
    }
  }

  console.log('\n\n📊 Import Summary:');
  console.log(`   ✅ New products: ${imported}`);
  console.log(`   🔄 Updated products: ${updated}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   🖼️  Images uploaded: ${imagesUploaded}`);
}

async function main() {
  try {
    await createCategories();
    await importProducts();
  } catch (error: any) {
    console.error('\n❌ Import failed:', error.message || error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('\n🎉 Import completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Import failed:', error.message || error);
    process.exit(1);
  });
