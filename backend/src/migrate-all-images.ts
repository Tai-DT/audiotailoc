/*
  Migrate ALL Images to Cloudinary
  Usage: npx tsx src/migrate-all-images.ts
*/
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

const prisma = new PrismaClient();

// Configure Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error('❌ Cloudinary credentials not found in environment variables');
  process.exit(1);
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

async function uploadImageFromUrl(url: string, publicId: string, folder: string, transformation?: any) {
  try {
    console.log(`    📤 Uploading: ${url.substring(0, 50)}...`);
    
    const result = await cloudinary.uploader.upload(url, {
      public_id: publicId,
      folder: folder,
      resource_type: 'image',
      overwrite: true,
      transformation: transformation,
    });
    
    console.log(`    ✅ Success: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`    ❌ Failed: ${(error as Error).message}`);
    return null;
  }
}

// ========================================
// 1. MIGRATE PRODUCTS
// ========================================
async function migrateProductImages() {
  console.log('\n📦 MIGRATING PRODUCT IMAGES...');
  console.log('─'.repeat(50));
  
  const products = await prisma.product.findMany({
    where: { isActive: true }
  });
  
  let successCount = 0;
  let failureCount = 0;
  
  for (const product of products) {
    const updates: any = {};
    
    // Skip if already on Cloudinary
    if (product.imageUrl?.includes('cloudinary')) {
      continue;
    }
    
    console.log(`\n  🛍️ Product: ${product.name} (${product.id})`);
    
    // Migrate main image
    if (product.imageUrl && !product.imageUrl.includes('cloudinary')) {
      const newUrl = await uploadImageFromUrl(
        product.imageUrl,
        `product-${product.id}`,
        'products/main',
        [
          { width: 800, height: 800, crop: 'fill', gravity: 'auto' },
          { quality: 'auto:good' },
        ]
      );
      
      if (newUrl) {
        updates.imageUrl = newUrl;
      }
    }
    
    // Migrate gallery images
    if (product.images) {
      try {
        const images = JSON.parse(product.images as any);
        if (Array.isArray(images)) {
          const newImages: string[] = [];
          
          for (let i = 0; i < images.length; i++) {
            const img = images[i];
            if (!img.includes('cloudinary')) {
              const newUrl = await uploadImageFromUrl(
                img,
                `product-gallery-${product.id}-${i}`,
                'products/gallery',
                [
                  { width: 1200, height: 1200, crop: 'fill', gravity: 'auto' },
                  { quality: 'auto:good' },
                ]
              );
              
              if (newUrl) {
                newImages.push(newUrl);
              } else {
                newImages.push(img); // Keep original if upload failed
              }
            } else {
              newImages.push(img); // Already on Cloudinary
            }
          }
          
          if (newImages.length > 0) {
            updates.images = JSON.stringify(newImages);
          }
        }
      } catch (e) {}
    }
    
    // Update product if there are changes
    if (Object.keys(updates).length > 0) {
      try {
        await prisma.product.update({
          where: { id: product.id },
          data: updates,
        });
        console.log(`    ✅ Product updated`);
        successCount++;
      } catch (error) {
        console.error(`    ❌ Failed to update product: ${(error as Error).message}`);
        failureCount++;
      }
    }
  }
  
  console.log(`\n  📊 Products: ${successCount} success, ${failureCount} failed`);
}

// ========================================
// 2. MIGRATE SERVICES
// ========================================
async function migrateServiceImages() {
  console.log('\n🔧 MIGRATING SERVICE IMAGES...');
  console.log('─'.repeat(50));
  
  const services = await prisma.service.findMany({
    where: { isActive: true }
  });
  
  let successCount = 0;
  let failureCount = 0;
  
  for (const service of services) {
    // Skip if already on Cloudinary
    if (service.images?.includes('cloudinary')) {
      continue;
    }
    
    console.log(`\n  🔧 Service: ${service.name} (${service.id})`);
    
    const updates: any = {};
    
    // Migrate service images
    if (service.images && !service.images.includes('cloudinary')) {
      try {
        const images = JSON.parse(service.images);
        if (Array.isArray(images)) {
          const newImages: string[] = [];
          
          for (let i = 0; i < images.length; i++) {
            const img = images[i];
            if (!img.includes('cloudinary')) {
              const newUrl = await uploadImageFromUrl(
                img,
                `service-${service.id}-${i}`,
                'services',
                [
                  { width: 1200, height: 800, crop: 'fill', gravity: 'auto' },
                  { quality: 'auto:good' },
                ]
              );
              
              if (newUrl) {
                newImages.push(newUrl);
              } else {
                newImages.push(img);
              }
            } else {
              newImages.push(img);
            }
          }
          
          if (newImages.length > 0) {
            updates.images = JSON.stringify(newImages);
          }
        }
      } catch (e) {
        // If not JSON, treat as single URL
        const newUrl = await uploadImageFromUrl(
          service.images,
          `service-${service.id}`,
          'services',
          [
            { width: 1200, height: 800, crop: 'fill', gravity: 'auto' },
            { quality: 'auto:good' },
          ]
        );
        
        if (newUrl) {
          updates.images = newUrl;
        }
      }
    }
    
    // Update service if there are changes
    if (Object.keys(updates).length > 0) {
      try {
        await prisma.service.update({
          where: { id: service.id },
          data: updates,
        });
        console.log(`    ✅ Service updated`);
        successCount++;
      } catch (error) {
        console.error(`    ❌ Failed to update service: ${(error as Error).message}`);
        failureCount++;
      }
    }
  }
  
  console.log(`\n  📊 Services: ${successCount} success, ${failureCount} failed`);
}

// ========================================
// 3. MIGRATE BANNERS
// ========================================
async function migrateBannerImages() {
  console.log('\n🎨 MIGRATING BANNER IMAGES...');
  console.log('─'.repeat(50));
  
  const banners = await prisma.banner.findMany({
    where: { isDeleted: false }
  });
  
  let successCount = 0;
  let failureCount = 0;
  
  for (const banner of banners) {
    const updates: any = {};
    
    // Skip if already on Cloudinary
    if (banner.imageUrl?.includes('cloudinary') && 
        (!banner.mobileImageUrl || banner.mobileImageUrl.includes('cloudinary'))) {
      continue;
    }
    
    console.log(`\n  🎨 Banner: ${banner.title} (${banner.id})`);
    
    // Migrate desktop image
    if (banner.imageUrl && !banner.imageUrl.includes('cloudinary')) {
      const newUrl = await uploadImageFromUrl(
        banner.imageUrl,
        `banner-desktop-${banner.id}`,
        'banners/desktop',
        [
          { width: 1920, height: 600, crop: 'fill', gravity: 'auto' },
          { quality: 'auto:good' },
        ]
      );
      
      if (newUrl) {
        updates.imageUrl = newUrl;
      }
    }
    
    // Migrate mobile image
    if (banner.mobileImageUrl && !banner.mobileImageUrl.includes('cloudinary')) {
      const newUrl = await uploadImageFromUrl(
        banner.mobileImageUrl,
        `banner-mobile-${banner.id}`,
        'banners/mobile',
        [
          { width: 768, height: 400, crop: 'fill', gravity: 'auto' },
          { quality: 'auto:good' },
        ]
      );
      
      if (newUrl) {
        updates.mobileImageUrl = newUrl;
      }
    }
    
    // Update banner if there are changes
    if (Object.keys(updates).length > 0) {
      try {
        await prisma.banner.update({
          where: { id: banner.id },
          data: updates,
        });
        console.log(`    ✅ Banner updated`);
        successCount++;
      } catch (error) {
        console.error(`    ❌ Failed to update banner: ${(error as Error).message}`);
        failureCount++;
      }
    }
  }
  
  console.log(`\n  📊 Banners: ${successCount} success, ${failureCount} failed`);
}

// ========================================
// 4. MIGRATE REMAINING PROJECT IMAGES
// ========================================
async function migrateRemainingProjectImages() {
  console.log('\n📁 MIGRATING REMAINING PROJECT IMAGES...');
  console.log('─'.repeat(50));
  
  const projects = await prisma.project.findMany({
    where: { isActive: true }
  });
  
  let successCount = 0;
  let failureCount = 0;
  
  for (const project of projects) {
    const updates: any = {};
    let hasExternalImages = false;
    
    // Check all image fields
    const imageFields = [
      { field: 'thumbnailImage', prefix: 'thumbnail' },
      { field: 'coverImage', prefix: 'cover' },
      { field: 'clientLogoUrl', prefix: 'client-logo' },
      { field: 'ogImage', prefix: 'og' }
    ];
    
    for (const { field, prefix } of imageFields) {
      const value = (project as any)[field];
      if (value && !value.includes('cloudinary')) {
        hasExternalImages = true;
        break;
      }
    }
    
    // Check gallery images
    if (project.galleryImages) {
      try {
        const gallery = JSON.parse(project.galleryImages as string);
        if (Array.isArray(gallery)) {
          for (const img of gallery) {
            if (!img.includes('cloudinary')) {
              hasExternalImages = true;
              break;
            }
          }
        }
      } catch (e) {}
    }
    
    if (!hasExternalImages) {
      continue; // Skip if all images are already on Cloudinary
    }
    
    console.log(`\n  📁 Project: ${project.name} (${project.id})`);
    
    // Migrate each image field
    for (const { field, prefix } of imageFields) {
      const value = (project as any)[field];
      if (value && !value.includes('cloudinary')) {
        const transformation = prefix === 'client-logo' 
          ? [{ width: 200, height: 200, crop: 'fill', gravity: 'auto' }, { quality: 'auto:good' }]
          : prefix === 'thumbnail'
          ? [{ width: 800, height: 600, crop: 'fill', gravity: 'auto' }, { quality: 'auto:good' }]
          : prefix === 'cover'
          ? [{ width: 1920, height: 800, crop: 'fill', gravity: 'auto' }, { quality: 'auto:good' }]
          : [{ width: 1200, height: 630, crop: 'fill', gravity: 'auto' }, { quality: 'auto:good' }];
        
        const newUrl = await uploadImageFromUrl(
          value,
          `project-${prefix}-${project.id}`,
          `projects/${prefix}`,
          transformation
        );
        
        if (newUrl) {
          updates[field] = newUrl;
        }
      }
    }
    
    // Migrate gallery images
    if (project.galleryImages) {
      try {
        const gallery = JSON.parse(project.galleryImages as string);
        if (Array.isArray(gallery)) {
          const newGallery: string[] = [];
          let hasChanges = false;
          
          for (let i = 0; i < gallery.length; i++) {
            const img = gallery[i];
            if (!img.includes('cloudinary')) {
              hasChanges = true;
              const newUrl = await uploadImageFromUrl(
                img,
                `project-gallery-${project.id}-${i}`,
                'projects/gallery',
                [
                  { width: 1200, height: 900, crop: 'fill', gravity: 'auto' },
                  { quality: 'auto:good' },
                ]
              );
              
              if (newUrl) {
                newGallery.push(newUrl);
              } else {
                newGallery.push(img);
              }
            } else {
              newGallery.push(img);
            }
          }
          
          if (hasChanges) {
            updates.galleryImages = JSON.stringify(newGallery);
          }
        }
      } catch (e) {}
    }
    
    // Update project if there are changes
    if (Object.keys(updates).length > 0) {
      try {
        await prisma.project.update({
          where: { id: project.id },
          data: updates,
        });
        console.log(`    ✅ Project updated`);
        successCount++;
      } catch (error) {
        console.error(`    ❌ Failed to update project: ${(error as Error).message}`);
        failureCount++;
      }
    }
  }
  
  console.log(`\n  📊 Projects: ${successCount} success, ${failureCount} failed`);
}

// ========================================
// MAIN MIGRATION FUNCTION
// ========================================
async function main() {
  console.log('🚀 STARTING COMPREHENSIVE IMAGE MIGRATION TO CLOUDINARY');
  console.log('='.repeat(80));
  
  const startTime = Date.now();
  
  try {
    // Run all migrations
    await migrateProductImages();
    await migrateServiceImages();
    await migrateBannerImages();
    await migrateRemainingProjectImages();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ MIGRATION COMPLETED!');
    console.log(`⏱️  Duration: ${duration} seconds`);
    console.log('='.repeat(80));
    
    // Run analysis to verify
    console.log('\n🔍 Running post-migration analysis...\n');
    
    const products = await prisma.product.count({
      where: { 
        isActive: true,
        imageUrl: { contains: 'cloudinary' }
      }
    });
    
    const services = await prisma.service.count({
      where: {
        isActive: true,
        images: { contains: 'cloudinary' }
      }
    });
    
    const banners = await prisma.banner.count({
      where: {
        isDeleted: false,
        imageUrl: { contains: 'cloudinary' }
      }
    });
    
    const projects = await prisma.project.count({
      where: {
        isActive: true,
        thumbnailImage: { contains: 'cloudinary' }
      }
    });
    
    console.log('📊 CLOUDINARY MIGRATION STATUS:');
    console.log('─'.repeat(40));
    console.log(`  ✅ Products with Cloudinary images: ${products}`);
    console.log(`  ✅ Services with Cloudinary images: ${services}`);
    console.log(`  ✅ Banners with Cloudinary images: ${banners}`);
    console.log(`  ✅ Projects with Cloudinary images: ${projects}`);
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
