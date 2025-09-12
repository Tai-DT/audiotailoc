/*
  Migrate Project Images to Cloudinary
  Usage: npx tsx src/migrate-project-images.ts
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
    console.log(`  📤 Uploading from: ${url}`);
    
    const result = await cloudinary.uploader.upload(url, {
      public_id: publicId,
      folder: folder,
      resource_type: 'image',
      overwrite: true,
      transformation: transformation,
    });
    
    console.log(`  ✅ Uploaded to: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`  ❌ Failed to upload: ${(error as Error).message}`);
    return null;
  }
}

async function migrateProjectImages() {
  console.log('🚀 Starting migration of project images to Cloudinary...\n');
  
  // Get all projects
  const projects = await prisma.project.findMany({
    where: {
      isActive: true,
    },
  });
  
  console.log(`📊 Found ${projects.length} projects to process\n`);
  
  let successCount = 0;
  let failureCount = 0;
  
  for (const project of projects) {
    console.log(`\n📁 Processing project: ${project.name} (${project.id})`);
    console.log('─'.repeat(50));
    
    const updates: any = {};
    
    // Migrate thumbnail image
    if (project.thumbnailImage && !project.thumbnailImage.includes('cloudinary')) {
      console.log('🖼️  Migrating thumbnail image...');
      const newUrl = await uploadImageFromUrl(
        project.thumbnailImage,
        `project-thumbnail-${project.id}`,
        'projects/thumbnails',
        [
          { width: 800, height: 600, crop: 'fill', gravity: 'auto' },
          { quality: 'auto:good' },
        ]
      );
      
      if (newUrl) {
        updates.thumbnailImage = newUrl;
      }
    }
    
    // Migrate cover image
    if (project.coverImage && !project.coverImage.includes('cloudinary')) {
      console.log('🎨 Migrating cover image...');
      const newUrl = await uploadImageFromUrl(
        project.coverImage,
        `project-cover-${project.id}`,
        'projects/covers',
        [
          { width: 1920, height: 800, crop: 'fill', gravity: 'auto' },
          { quality: 'auto:good' },
        ]
      );
      
      if (newUrl) {
        updates.coverImage = newUrl;
      }
    }
    
    // Migrate gallery images
    if (project.galleryImages) {
      try {
        const galleryUrls = JSON.parse(project.galleryImages as string);
        
        if (Array.isArray(galleryUrls) && galleryUrls.length > 0) {
          console.log(`🎭 Migrating ${galleryUrls.length} gallery images...`);
          
          const newGalleryUrls: string[] = [];
          
          for (let i = 0; i < galleryUrls.length; i++) {
            const url = galleryUrls[i];
            
            if (url && !url.includes('cloudinary')) {
              const newUrl = await uploadImageFromUrl(
                url,
                `project-gallery-${project.id}-${i}`,
                'projects/gallery',
                [
                  { width: 1200, height: 900, crop: 'fill', gravity: 'auto' },
                  { quality: 'auto:good' },
                ]
              );
              
              if (newUrl) {
                newGalleryUrls.push(newUrl);
              } else {
                // Keep original if upload failed
                newGalleryUrls.push(url);
              }
            } else {
              // Keep Cloudinary URLs as is
              newGalleryUrls.push(url);
            }
          }
          
          if (newGalleryUrls.length > 0) {
            updates.galleryImages = JSON.stringify(newGalleryUrls);
          }
        }
      } catch (error) {
        console.error(`  ❌ Failed to parse gallery images: ${(error as Error).message}`);
      }
    }
    
    // Migrate client logo if exists
    if (project.clientLogoUrl && !project.clientLogoUrl.includes('cloudinary')) {
      console.log('🏢 Migrating client logo...');
      const newUrl = await uploadImageFromUrl(
        project.clientLogoUrl,
        `project-client-logo-${project.id}`,
        'projects/logos',
        [
          { width: 200, height: 200, crop: 'fill', gravity: 'auto' },
          { quality: 'auto:good' },
        ]
      );
      
      if (newUrl) {
        updates.clientLogoUrl = newUrl;
      }
    }
    
    // Update project if there are changes
    if (Object.keys(updates).length > 0) {
      try {
        await prisma.project.update({
          where: { id: project.id },
          data: updates,
        });
        
        console.log(`✅ Project updated successfully with ${Object.keys(updates).length} new images`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to update project: ${(error as Error).message}`);
        failureCount++;
      }
    } else {
      console.log('ℹ️  No images to migrate (already on Cloudinary or no images)');
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Migration Summary:');
  console.log(`  ✅ Success: ${successCount} projects`);
  console.log(`  ❌ Failed: ${failureCount} projects`);
  console.log(`  ⏭️  Skipped: ${projects.length - successCount - failureCount} projects`);
  console.log('='.repeat(60));
}

async function main() {
  try {
    await migrateProjectImages();
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
