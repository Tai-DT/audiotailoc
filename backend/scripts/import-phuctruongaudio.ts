/**
 * Script to import products from phuctruongaudio.vn into database
 * 
 * Usage:
 *   npx ts-node scripts/import-phuctruongaudio.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

interface Product {
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description?: string;
  imageUrl?: string;
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

async function createCategories() {
  console.log('📁 Creating categories...\n');

  const createdCategories = [];

  for (const cat of CATEGORY_MAPPING) {
    try {
      const category = await prisma.categories.upsert({
        where: { slug: cat.slug },
        update: {
          name: cat.name,
          isActive: true,
          updatedAt: new Date()
        },
        create: {
          id: generateId(),
          name: cat.name,
          slug: cat.slug,
          isActive: true,
          description: `Danh mục ${cat.name} từ Phúc Trường Audio`,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      createdCategories.push(category);
      console.log(`   ✅ Created/Updated: ${cat.name} (${cat.slug})`);
    } catch (error: any) {
      console.error(`   ❌ Error creating category ${cat.name}:`, error.message);
    }
  }

  return createdCategories;
}

async function importProducts(products: Product[]) {
  console.log(`\n📦 Importing ${products.length} products...\n`);

  const categoryMap = new Map<string, string>();
  const categories = await prisma.categories.findMany();
  categories.forEach(cat => {
    categoryMap.set(cat.slug, cat.id);
  });

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const product of products) {
    try {
      const categoryId = categoryMap.get(product.categorySlug);
      
      if (!categoryId) {
        console.log(`   ⚠️  Skipping ${product.name}: Category not found`);
        skipped++;
        continue;
      }

      // Check if product already exists
      const existing = await prisma.products.findUnique({
        where: { slug: product.slug }
      });

      if (existing) {
        // Update existing product
        await prisma.products.update({
          where: { slug: product.slug },
          data: {
            name: product.name,
            priceCents: BigInt(product.price),
            originalPriceCents: product.originalPrice ? BigInt(product.originalPrice) : null,
            imageUrl: product.imageUrl || null,
            images: product.imageUrl ? JSON.stringify([product.imageUrl]) : null,
            categoryId,
            brand: product.brand || null,
            sku: product.sku || null,
            description: product.description || null,
            isActive: true,
            isDeleted: false,
            updatedAt: new Date()
          }
        });
        imported++;
        process.stdout.write(`\r   ✅ Imported/Updated: ${imported} | Skipped: ${skipped} | Errors: ${errors}`);
      } else {
        // Create new product
        await prisma.products.create({
          data: {
            id: generateId(),
            slug: product.slug,
            name: product.name,
            priceCents: BigInt(product.price),
            originalPriceCents: product.originalPrice ? BigInt(product.originalPrice) : null,
            imageUrl: product.imageUrl || null,
            images: product.imageUrl ? JSON.stringify([product.imageUrl]) : null,
            categoryId,
            brand: product.brand || null,
            sku: product.sku || null,
            description: product.description || null,
            stockQuantity: 0,
            minOrderQuantity: 1,
            featured: false,
            isActive: true,
            isDeleted: false,
            viewCount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        imported++;
        process.stdout.write(`\r   ✅ Imported: ${imported} | Skipped: ${skipped} | Errors: ${errors}`);
      }

      // Create inventory record if doesn't exist
      try {
        const productRecord = await prisma.products.findUnique({
          where: { slug: product.slug }
        });
        
        if (productRecord) {
          await prisma.inventory.upsert({
            where: { productId: productRecord.id },
            update: {},
            create: {
              id: generateId(),
              productId: productRecord.id,
              stock: 0,
              reserved: 0,
              lowStockThreshold: 10,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          });
        }
      } catch (invError) {
        // Inventory might already exist, ignore
      }

    } catch (error: any) {
      errors++;
      console.error(`\n   ❌ Error importing ${product.name}:`, error.message);
    }
  }

  console.log('\n\n📊 Import Summary:');
  console.log(`   ✅ Imported/Updated: ${imported}`);
  console.log(`   ⚠️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
}

async function main() {
  const dataFile = path.join(__dirname, '../data/phuctruongaudio/products.json');

  if (!fs.existsSync(dataFile)) {
    console.error(`❌ Data file not found: ${dataFile}`);
    console.log('Please run scrape-phuctruongaudio.ts first to generate the data file.');
    process.exit(1);
  }

  console.log('🚀 Starting import process...\n');
  console.log(`📄 Reading data from: ${dataFile}\n`);

  const productsData = JSON.parse(fs.readFileSync(dataFile, 'utf-8')) as Product[];

  if (!Array.isArray(productsData) || productsData.length === 0) {
    console.error('❌ No products found in data file!');
    process.exit(1);
  }

  try {
    // Create categories first
    await createCategories();

    // Import products
    await importProducts(productsData);

    console.log('\n✅ Import completed successfully!');
  } catch (error: any) {
    console.error('\n❌ Import failed:', error.message || error);
    throw error;
  }
}

// Run the import
main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('\n❌ Script failed:', error.message || error);
    await prisma.$disconnect();
    process.exit(1);
  });



