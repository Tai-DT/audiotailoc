import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ProductImprovement {
  id: string;
  name: string;
  stockQuantity?: number;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  featured?: boolean;
}

const productImprovements: ProductImprovement[] = [
  {
    id: "cmf9f43ne00013kav7mh39xoe",
    name: "Test Product",
    stockQuantity: 15,
    metaTitle: "Test Product - AudioTailoc Premium Audio Equipment",
    metaDescription: "Experience premium audio quality with our Test Product featuring advanced technology and superior sound performance.",
    canonicalUrl: "https://audiotailoc.com/products/test-product",
    featured: true
  },
  {
    id: "cmf8wylks0003tyk8y1tjjsrx",
    name: "Import Test Product",
    stockQuantity: 8,
    metaTitle: "Import Test Product - Premium German Audio Technology",
    metaDescription: "Discover the excellence of German engineering with our Import Test Product, featuring cutting-edge audio technology.",
    canonicalUrl: "https://audiotailoc.com/products/import-test-product"
  },
  {
    id: "cmf8vxonf0001h2rxn6y4h8xo",
    name: "Test Product Dashboard",
    stockQuantity: 12,
    metaTitle: "Test Product Dashboard - Advanced Audio Control System",
    metaDescription: "Take control of your audio experience with our Test Product Dashboard, featuring intuitive controls and advanced features.",
    canonicalUrl: "https://audiotailoc.com/products/test-product-dashboard"
  },
  {
    id: "cmf8usprk000cymqbvpdd0vvp",
    name: "Soundbar Tài Lộc 5.1",
    stockQuantity: 5,
    metaTitle: "Soundbar Tài Lộc 5.1 - Premium Home Theater Experience",
    metaDescription: "Immerse yourself in cinematic sound with the Soundbar Tài Lộc 5.1, featuring 5.1 surround sound and wireless subwoofer.",
    canonicalUrl: "https://audiotailoc.com/products/soundbar-tai-loc-5-1",
    featured: true
  },
  {
    id: "cmf8uspoj0008ymqbgm373cr6",
    name: "Tai nghe Tài Lộc Pro",
    stockQuantity: 20,
    metaTitle: "Tai nghe Tài Lộc Pro - Professional Wireless Headphones",
    metaDescription: "Experience professional-grade audio with Tai nghe Tài Lộc Pro, featuring active noise cancellation and premium sound quality.",
    canonicalUrl: "https://audiotailoc.com/products/tai-nghe-tai-loc-pro",
    featured: true
  },
  {
    id: "cmf8uspio0004ymqbkze4p775",
    name: "Loa Tài Lộc Classic",
    stockQuantity: 10,
    metaTitle: "Loa Tài Lộc Classic - Timeless Audio Excellence",
    metaDescription: "Enjoy timeless sound quality with Loa Tài Lộc Classic, featuring premium materials and exceptional audio performance.",
    canonicalUrl: "https://audiotailoc.com/products/loa-tai-loc-classic",
    featured: true
  }
];

async function improveProductData() {
  console.log('🚀 Starting product data improvements...');

  let updatedCount = 0;
  let errorCount = 0;

  for (const improvement of productImprovements) {
    try {
      console.log(`📝 Improving product: ${improvement.name}`);

      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id: improvement.id }
      });

      if (!existingProduct) {
        console.log(`❌ Product not found: ${improvement.id}`);
        errorCount++;
        continue;
      }

      // Prepare update data
      const updateData: any = {};

      if (improvement.stockQuantity !== undefined) {
        updateData.stockQuantity = improvement.stockQuantity;
      }

      if (improvement.metaTitle) {
        updateData.metaTitle = improvement.metaTitle;
      }

      if (improvement.metaDescription) {
        updateData.metaDescription = improvement.metaDescription;
      }

      if (improvement.canonicalUrl) {
        updateData.canonicalUrl = improvement.canonicalUrl;
      }

      if (improvement.featured !== undefined) {
        updateData.featured = improvement.featured;
      }

      // Update the product
      await prisma.product.update({
        where: { id: improvement.id },
        data: updateData
      });

      console.log(`✅ Successfully improved: ${improvement.name}`);
      updatedCount++;

    } catch (error) {
      console.error(`❌ Error improving product ${improvement.name}:`, error);
      errorCount++;
    }
  }

  console.log(`\n📊 Improvement Summary:`);
  console.log(`✅ Successfully improved: ${updatedCount} products`);
  console.log(`❌ Errors: ${errorCount} products`);

  if (updatedCount > 0) {
    console.log('\n🎉 Product data improvements completed!');
    console.log('💡 Products now have better SEO, inventory, and featured status.');
  }
}

async function addMoreCategories() {
  console.log('\n🏷️ Adding additional product categories...');

  const categoriesToAdd = [
    {
      name: "Soundbar",
      slug: "soundbar",
      parentId: null
    },
    {
      name: "Âm thanh gia đình",
      slug: "am-thanh-gia-dinh",
      parentId: null
    },
    {
      name: "Âm thanh chuyên nghiệp",
      slug: "am-thanh-chuyen-nghiep",
      parentId: null
    },
    {
      name: "Phụ kiện âm thanh",
      slug: "phu-kien-am-thanh",
      parentId: null
    }
  ];

  let categoryCount = 0;

  for (const category of categoriesToAdd) {
    try {
      // Check if category already exists
      const existingCategory = await prisma.category.findFirst({
        where: { slug: category.slug }
      });

      if (!existingCategory) {
        await prisma.category.create({
          data: category
        });
        console.log(`✅ Created category: ${category.name}`);
        categoryCount++;
      } else {
        console.log(`⏭️ Category already exists: ${category.name}`);
      }
    } catch (error) {
      console.error(`❌ Error creating category ${category.name}:`, error);
    }
  }

  console.log(`📊 Created ${categoryCount} new categories`);
}

async function main() {
  try {
    await improveProductData();
    await addMoreCategories();
  } catch (error) {
    console.error('💥 Script execution failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { improveProductData, addMoreCategories };
