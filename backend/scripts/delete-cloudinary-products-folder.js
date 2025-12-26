/**
 * Script to delete the products folder in Cloudinary
 * 
 * ⚠️ WARNING: This will delete ALL images in the products folder!
 * 
 * Usage:
 *   node scripts/delete-cloudinary-products-folder.js
 *   node scripts/delete-cloudinary-products-folder.js --confirm
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const cloudinary = require('cloudinary').v2;

async function deleteProductsFolder(confirm = false) {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudinaryUrl && !cloudName) {
    console.error('❌ Cloudinary is not configured!');
    process.exit(1);
  }

  if (cloudinaryUrl) {
    cloudinary.config({ url: cloudinaryUrl, secure: true });
  } else {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }

  console.log('🔍 Connecting to Cloudinary...');
  console.log(`📦 Cloud Name: ${cloudName || cloudinary.config().cloud_name || 'N/A'}\n`);

  if (!confirm) {
    console.log('⚠️  WARNING: This will delete ALL images in the products folder!');
    console.log('⚠️  Folder: audiotailoc/products/');
    console.log('⚠️  This action is IRREVERSIBLE!');
    console.log('\nTo proceed, run with --confirm flag:');
    console.log('  node scripts/delete-cloudinary-products-folder.js --confirm\n');
    process.exit(0);
  }

  console.log('⚠️  CONFIRMED: Starting deletion of products folder...\n');

  try {
    let nextCursor;
    let totalDeleted = 0;
    let totalFailed = 0;
    const errors = [];

    do {
      // Search for all images in the products folder
      const result = await cloudinary.search
        .expression('folder:audiotailoc/products OR public_id:audiotailoc/products/*')
        .max_results(500)
        .next_cursor(nextCursor)
        .execute();

      const resources = result.resources || [];

      if (resources.length === 0 && !nextCursor) {
        console.log('✅ No more images found in products folder.');
        break;
      }

      console.log(`📦 Found ${resources.length} images in this batch...`);

      // Delete each resource
      for (const resource of resources) {
        try {
          await cloudinary.uploader.destroy(resource.public_id, {
            resource_type: resource.resource_type || 'image',
            invalidate: true,
          });
          totalDeleted++;
          process.stdout.write(`\r   ✅ Deleted: ${totalDeleted} | ❌ Failed: ${totalFailed} | Current: ${resource.public_id.substring(0, 50)}...`);
        } catch (error) {
          totalFailed++;
          errors.push({
            publicId: resource.public_id,
            error: error.message || String(error),
          });
          process.stdout.write(`\r   ❌ Failed: ${resource.public_id} - ${error.message || String(error)}`);
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
        console.log(`   - ${err.publicId}: ${err.error}`);
      });
      if (errors.length > 10) {
        console.log(`   ... and ${errors.length - 10} more errors`);
      }
    }

    console.log('\n✅ Deletion process completed!');
  } catch (error) {
    console.error('\n❌ Error during deletion:', error.message || error);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
const confirm = args.includes('--confirm') || args.includes('-y') || args.includes('--yes');

deleteProductsFolder(confirm)
  .then(() => {
    console.log('\n🎉 Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error.message || error);
    process.exit(1);
  });



