/**
 * Script to match local images with products that don't have images
 * Uses improved matching algorithms to find the best matches
 * 
 * Usage:
 *   npx ts-node scripts/match-missing-images.ts
 */

import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

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

/**
 * Calculate similarity between two strings (0-1)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.9;
  
  // Calculate Levenshtein distance
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  const editDistance = levenshteinDistance(longer, shorter);
  
  if (longer.length === 0) return 1.0;
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[str2.length][str1.length];
}

/**
 * Extract keywords from product name for matching
 */
function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2)
    .filter(w => !['dan', 'loa', 'micro', 'amply', 'mixer', 'dau', 'cuc', 'day'].includes(w));
}

/**
 * Find best matching product for an image file
 */
function findBestMatch(
  imageSlug: string,
  imageName: string,
  products: any[],
  categories: Map<string, any>
): { product: any; score: number; method: string } | null {
  let bestMatch: { product: any; score: number; method: string } | null = null;
  
  for (const product of products) {
    const productSlug = product.slug.toLowerCase();
    const imgSlug = imageSlug.toLowerCase();
    const productName = product.name.toLowerCase();
    const imgName = imageName.toLowerCase();
    
    // Method 1: Exact slug match
    if (productSlug === imgSlug) {
      return { product, score: 1.0, method: 'exact-slug' };
    }
    
    // Method 2: Product slug ends with image slug
    if (productSlug.endsWith(`-${imgSlug}`) || productSlug.endsWith(imgSlug)) {
      const score = imgSlug.length / productSlug.length;
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { product, score, method: 'slug-suffix' };
      }
    }
    
    // Method 3: Product slug contains image slug
    if (productSlug.includes(imgSlug) && imgSlug.length > 5) {
      const score = imgSlug.length / productSlug.length * 0.8;
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { product, score, method: 'slug-contains' };
      }
    }
    
    // Method 4: Extract base slug from product (last parts)
    const slugParts = productSlug.split('-');
    for (let i = Math.max(1, slugParts.length - 6); i < slugParts.length; i++) {
      const testSlug = slugParts.slice(i).join('-');
      if (testSlug === imgSlug || imgSlug.includes(testSlug) || testSlug.includes(imgSlug)) {
        const score = Math.min(testSlug.length, imgSlug.length) / Math.max(testSlug.length, imgSlug.length) * 0.7;
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { product, score, method: 'slug-parts' };
        }
      }
    }
    
    // Method 5: Name similarity
    const nameSimilarity = calculateSimilarity(productName, imgName);
    if (nameSimilarity > 0.6) {
      if (!bestMatch || nameSimilarity > bestMatch.score) {
        bestMatch = { product, score: nameSimilarity * 0.6, method: 'name-similarity' };
      }
    }
    
    // Method 6: Keyword matching
    const productKeywords = extractKeywords(product.name);
    const imageKeywords = extractKeywords(imageName);
    const commonKeywords = productKeywords.filter(k => imageKeywords.includes(k));
    if (commonKeywords.length >= 3) {
      const keywordScore = commonKeywords.length / Math.max(productKeywords.length, imageKeywords.length);
      if (!bestMatch || keywordScore > bestMatch.score) {
        bestMatch = { product, score: keywordScore * 0.5, method: 'keywords' };
      }
    }
  }
  
  // Only return matches with score > 0.4
  return bestMatch && bestMatch.score > 0.4 ? bestMatch : null;
}

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

async function matchAndUploadMissingImages() {
  console.log('🔍 Starting to match missing images...\n');

  // Get all products without images
  const productsWithoutImages = await prisma.products.findMany({
    where: { isDeleted: false, imageUrl: null },
    select: {
      id: true,
      name: true,
      slug: true,
      categoryId: true,
      imageUrl: true
    }
  });

  console.log(`📦 Found ${productsWithoutImages.length} products without images\n`);

  // Get all categories
  const categories = await prisma.categories.findMany();
  const categoryMap = new Map(categories.map(c => [c.id, c]));

  // Get all local image files
  const imagesDir = path.resolve(__dirname, '../data/phuctruongaudio/images');
  if (!fs.existsSync(imagesDir)) {
    console.error('❌ Images directory not found!');
    return;
  }

  const imageFiles = fs.readdirSync(imagesDir)
    .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    .map(file => ({
      filename: file,
      path: path.join(imagesDir, file),
      slug: file.replace(/\.(jpg|jpeg|png|gif|webp)$/i, ''),
      name: file.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').replace(/-/g, ' ')
    }));

  console.log(`📁 Found ${imageFiles.length} local image files\n`);

  // Read scraped products data for additional matching
  const productsJsonPath = path.resolve(__dirname, '../data/phuctruongaudio/products.json');
  let scrapedProducts: any[] = [];
  if (fs.existsSync(productsJsonPath)) {
    scrapedProducts = JSON.parse(fs.readFileSync(productsJsonPath, 'utf-8'));
    console.log(`📄 Loaded ${scrapedProducts.length} scraped products for reference\n`);
  }

  let matched = 0;
  let uploaded = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  // Process each product without image
  for (let i = 0; i < productsWithoutImages.length; i++) {
    const product = productsWithoutImages[i];
    const category = categoryMap.get(product.categoryId);
    
    try {
      process.stdout.write(`\r   Processing: ${i + 1}/${productsWithoutImages.length} | ✅ ${uploaded} | 🔄 ${updated} | ⏭️  ${skipped} | ❌ ${failed} | ${product.name.substring(0, 40)}...`);

      // Find best matching image
      const match = findBestMatch(
        product.slug,
        product.name,
        imageFiles.map(img => ({ slug: img.slug, name: img.name })),
        categoryMap
      );

      if (!match || match.score < 0.5) {
        skipped++;
        continue;
      }

      // Find the actual image file
      const imageFile = imageFiles.find(img => img.slug === match.product.slug);
      if (!imageFile) {
        skipped++;
        continue;
      }

      matched++;

      // Upload to Cloudinary
      const cloudinaryUrl = await uploadImageToCloudinary(imageFile.path, product.slug);
      if (!cloudinaryUrl) {
        failed++;
        continue;
      }

      // Update product in database
      await prisma.products.update({
        where: { id: product.id },
        data: {
          imageUrl: cloudinaryUrl,
          images: JSON.stringify([cloudinaryUrl]),
          updatedAt: new Date()
        }
      });

      uploaded++;
      updated++;

    } catch (error: any) {
      failed++;
    }
  }

  console.log('\n\n📊 Matching Summary:');
  console.log(`   ✅ Matched: ${matched}`);
  console.log(`   📤 Uploaded: ${uploaded}`);
  console.log(`   🔄 Updated: ${updated}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
}

async function main() {
  try {
    await matchAndUploadMissingImages();
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
