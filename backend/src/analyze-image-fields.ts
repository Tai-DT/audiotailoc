/*
  Analyze all models with image fields
  Usage: npx tsx src/analyze-image-fields.ts
*/
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

interface ImageFieldInfo {
  model: string;
  fields: string[];
  totalRecords: number;
  externalImages: number;
  cloudinaryImages: number;
  needsMigration: boolean;
}

async function analyzeImageFields(): Promise<ImageFieldInfo[]> {
  const results: ImageFieldInfo[] = [];

  // 1. Products - imageUrl, images
  const products = await prisma.product.findMany({
    where: { isActive: true }
  });
  
  let productExternal = 0;
  let productCloudinary = 0;
  
  products.forEach(p => {
    if (p.imageUrl) {
      if (p.imageUrl.includes('cloudinary')) productCloudinary++;
      else productExternal++;
    }
  });
  
  results.push({
    model: 'Product',
    fields: ['imageUrl', 'images'],
    totalRecords: products.length,
    externalImages: productExternal,
    cloudinaryImages: productCloudinary,
    needsMigration: productExternal > 0
  });

  // 2. Services - images
  const services = await prisma.service.findMany({
    where: { isActive: true }
  });
  
  let serviceExternal = 0;
  let serviceCloudinary = 0;
  
  services.forEach(s => {
    if (s.images) {
      if (s.images.includes('cloudinary')) serviceCloudinary++;
      else serviceExternal++;
    }
  });
  
  results.push({
    model: 'Service',
    fields: ['images'],
    totalRecords: services.length,
    externalImages: serviceExternal,
    cloudinaryImages: serviceCloudinary,
    needsMigration: serviceExternal > 0
  });

  // 3. Banners - imageUrl, mobileImageUrl
  const banners = await prisma.banner.findMany({
    where: { isDeleted: false }
  });
  
  let bannerExternal = 0;
  let bannerCloudinary = 0;
  
  banners.forEach(b => {
    if (b.imageUrl && !b.imageUrl.includes('cloudinary')) {
      bannerExternal++;
    } else if (b.imageUrl?.includes('cloudinary')) {
      bannerCloudinary++;
    }
    
    if (b.mobileImageUrl && !b.mobileImageUrl.includes('cloudinary')) {
      bannerExternal++;
    } else if (b.mobileImageUrl?.includes('cloudinary')) {
      bannerCloudinary++;
    }
  });
  
  results.push({
    model: 'Banner',
    fields: ['imageUrl', 'mobileImageUrl'],
    totalRecords: banners.length,
    externalImages: bannerExternal,
    cloudinaryImages: bannerCloudinary,
    needsMigration: bannerExternal > 0
  });

  // 4. Projects - Already migrated
  const projects = await prisma.project.findMany({
    where: { isActive: true }
  });
  
  let projectExternal = 0;
  let projectCloudinary = 0;
  
  projects.forEach(p => {
    const imageFields = [
      p.thumbnailImage,
      p.coverImage,
      p.clientLogoUrl,
      p.ogImage
    ];
    
    imageFields.forEach(field => {
      if (field) {
        if (field.includes('cloudinary')) projectCloudinary++;
        else projectExternal++;
      }
    });
    
    // Check gallery images
    if (p.galleryImages) {
      try {
        const gallery = JSON.parse(p.galleryImages as string);
        gallery.forEach((img: string) => {
          if (img.includes('cloudinary')) projectCloudinary++;
          else projectExternal++;
        });
      } catch (e) {}
    }
  });
  
  results.push({
    model: 'Project',
    fields: ['thumbnailImage', 'coverImage', 'galleryImages', 'clientLogoUrl', 'ogImage'],
    totalRecords: projects.length,
    externalImages: projectExternal,
    cloudinaryImages: projectCloudinary,
    needsMigration: projectExternal > 0
  });

  // 5. OrderItems - imageUrl (referenced from products)
  const orderItems = await prisma.orderItem.findMany({
    take: 100
  });
  
  let orderItemExternal = 0;
  let orderItemCloudinary = 0;
  
  orderItems.forEach(item => {
    if (item.imageUrl) {
      if (item.imageUrl.includes('cloudinary')) orderItemCloudinary++;
      else orderItemExternal++;
    }
  });
  
  results.push({
    model: 'OrderItem',
    fields: ['imageUrl'],
    totalRecords: orderItems.length,
    externalImages: orderItemExternal,
    cloudinaryImages: orderItemCloudinary,
    needsMigration: orderItemExternal > 0
  });

  // 6. Technicians - No image fields in current schema
  results.push({
    model: 'Technician',
    fields: [],
    totalRecords: await prisma.technician.count(),
    externalImages: 0,
    cloudinaryImages: 0,
    needsMigration: false
  });

  return results;
}

async function main() {
  console.log('🔍 Analyzing image fields across all models...\n');
  console.log('='.repeat(80));
  
  try {
    const results = await analyzeImageFields();
    
    // Display results
    console.log('\n📊 ANALYSIS RESULTS:\n');
    console.log('='.repeat(80));
    
    let totalNeedsMigration = 0;
    let totalExternalImages = 0;
    let totalCloudinaryImages = 0;
    
    results.forEach(result => {
      console.log(`\n📦 ${result.model}`);
      console.log('─'.repeat(40));
      console.log(`  Fields: ${result.fields.join(', ')}`);
      console.log(`  Total Records: ${result.totalRecords}`);
      console.log(`  External Images: ${result.externalImages}`);
      console.log(`  Cloudinary Images: ${result.cloudinaryImages}`);
      console.log(`  Status: ${result.needsMigration ? '⚠️  NEEDS MIGRATION' : '✅ OK'}`);
      
      if (result.needsMigration) {
        totalNeedsMigration++;
        totalExternalImages += result.externalImages;
      }
      totalCloudinaryImages += result.cloudinaryImages;
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('📈 SUMMARY:');
    console.log('─'.repeat(40));
    console.log(`  Models needing migration: ${totalNeedsMigration}`);
    console.log(`  Total external images: ${totalExternalImages}`);
    console.log(`  Total Cloudinary images: ${totalCloudinaryImages}`);
    console.log('='.repeat(80));
    
    if (totalNeedsMigration > 0) {
      console.log('\n⚠️  ACTION REQUIRED:');
      console.log('The following models have external images that need migration:');
      results
        .filter(r => r.needsMigration)
        .forEach(r => {
          console.log(`  - ${r.model}: ${r.externalImages} images`);
        });
      console.log('\nRun the migration scripts for each model to move images to Cloudinary.');
    } else {
      console.log('\n✅ All images are already hosted on Cloudinary!');
    }
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
