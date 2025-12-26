import { config } from 'dotenv';
import { resolve } from 'path';
import { v2 as cloudinary } from 'cloudinary';

// Load environment variables
config({ path: resolve(__dirname, '../.env') });

interface CloudinaryResource {
  public_id: string;
  resource_type: string;
  type: string;
}

/**
 * Script to delete ALL images from Cloudinary
 * 
 * ⚠️ WARNING: This action is IRREVERSIBLE!
 * All images will be permanently deleted from Cloudinary.
 * 
 * Usage:
 *   npx ts-node scripts/delete-all-cloudinary-images.ts
 * 
 * Or with confirmation:
 *   npx ts-node scripts/delete-all-cloudinary-images.ts --confirm
 */

async function deleteAllCloudinaryImages(confirm: boolean = false): Promise<void> {
  // Check if Cloudinary is configured
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudinaryUrl && !cloudName) {
    console.error('❌ Cloudinary is not configured!');
    console.error('Please set CLOUDINARY_URL or CLOUDINARY_* environment variables.');
    process.exit(1);
  }

  // Configure Cloudinary
  if (cloudinaryUrl) {
    cloudinary.config({ url: cloudinaryUrl, secure: true } as any);
  } else {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }

  console.log('🔍 Connecting to Cloudinary...');
  console.log(`📦 Cloud Name: ${cloudName || cloudinary.config().cloud_name || 'N/A'}`);

  if (!confirm) {
    console.log('\n⚠️  WARNING: This will delete ALL images from Cloudinary!');
    console.log('⚠️  This action is IRREVERSIBLE!');
    console.log('\nTo proceed, run with --confirm flag:');
    console.log('  npx ts-node scripts/delete-all-cloudinary-images.ts --confirm\n');
    process.exit(0);
  }

  console.log('\n⚠️  CONFIRMED: Starting deletion of ALL images...\n');

  try {
    let nextCursor: string | undefined;
    let totalDeleted = 0;
    let totalFailed = 0;
    const errors: Array<{ publicId: string; error: string }> = [];

    do {
      // Fetch resources (images only)
      const result = await cloudinary.search
        .expression('resource_type:image')
        .max_results(500)
        .next_cursor(nextCursor)
        .execute();

      const resources: CloudinaryResource[] = result.resources || [];

      if (resources.length === 0) {
        console.log('✅ No more images found.');
        break;
      }

      console.log(`📦 Found ${resources.length} images in this batch...`);

      // Delete each resource
      for (const resource of resources) {
        try {
          await cloudinary.uploader.destroy(resource.public_id, {
            resource_type: 'image',
            invalidate: true, // Invalidate CDN cache
          });
          totalDeleted++;
          process.stdout.write(`\r✅ Deleted: ${totalDeleted} | ❌ Failed: ${totalFailed} | Current: ${resource.public_id.substring(0, 50)}...`);
        } catch (error: any) {
          totalFailed++;
          errors.push({
            publicId: resource.public_id,
            error: error.message || String(error),
          });
          process.stdout.write(`\r❌ Failed: ${resource.public_id} - ${error.message || String(error)}`);
        }
      }

      nextCursor = result.next_cursor;
    } while (nextCursor);

    console.log('\n\n📊 Deletion Summary:');
    console.log(`✅ Successfully deleted: ${totalDeleted} images`);
    console.log(`❌ Failed to delete: ${totalFailed} images`);

    if (errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      errors.slice(0, 10).forEach((err) => {
        console.log(`  - ${err.publicId}: ${err.error}`);
      });
      if (errors.length > 10) {
        console.log(`  ... and ${errors.length - 10} more errors`);
      }
    }

    // Also delete videos if needed (optional)
    console.log('\n🔍 Checking for videos...');
    try {
      const videoResult = await cloudinary.search
        .expression('resource_type:video')
        .max_results(500)
        .execute();

      if (videoResult.resources && videoResult.resources.length > 0) {
        console.log(`📹 Found ${videoResult.resources.length} videos.`);
        console.log('💡 To delete videos, modify this script to include videos.');
      }
    } catch (error) {
      console.log('⚠️  Could not check for videos:', error);
    }

    console.log('\n✅ Deletion process completed!');
  } catch (error: any) {
    console.error('\n❌ Error during deletion:', error.message || error);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const confirm = args.includes('--confirm') || args.includes('-y') || args.includes('--yes');

// Run the script
deleteAllCloudinaryImages(confirm)
  .then(() => {
    console.log('\n🎉 Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });



