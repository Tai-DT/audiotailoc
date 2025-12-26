/**
 * Script to delete specific folders in Cloudinary
 * 
 * ⚠️ WARNING: This action is IRREVERSIBLE!
 * All assets in the specified folders will be permanently deleted.
 * 
 * Usage:
 *   node scripts/delete-cloudinary-folders.js folder1 folder2 folder3
 * 
 * Or with confirmation:
 *   node scripts/delete-cloudinary-folders.js --confirm folder1 folder2 folder3
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const cloudinary = require('cloudinary').v2;

async function deleteCloudinaryFolders(folders, confirm = false) {
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
    cloudinary.config({ url: cloudinaryUrl, secure: true });
  } else {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }

  if (!folders || folders.length === 0) {
    console.error('❌ No folders specified!');
    console.error('Usage: node scripts/delete-cloudinary-folders.js [--confirm] folder1 folder2 ...');
    process.exit(1);
  }

  console.log('🔍 Connecting to Cloudinary...');
  console.log(`📦 Cloud Name: ${cloudName || cloudinary.config().cloud_name || 'N/A'}\n`);

  if (!confirm) {
    console.log('⚠️  WARNING: This will delete ALL assets in the following folders:');
    folders.forEach((folder, index) => {
      console.log(`   ${index + 1}. ${folder}`);
    });
    console.log('\n⚠️  This action is IRREVERSIBLE!');
    console.log('\nTo proceed, run with --confirm flag:');
    console.log(`  node scripts/delete-cloudinary-folders.js --confirm ${folders.join(' ')}\n`);
    process.exit(0);
  }

  console.log('⚠️  CONFIRMED: Starting deletion of folders...\n');
  console.log(`📁 Folders to delete: ${folders.length}\n`);

  const summary = {
    totalDeleted: 0,
    totalFailed: 0,
    folderStats: {},
    errors: [],
  };

  try {
    // Process each folder
    for (const folder of folders) {
      console.log(`\n📁 Processing folder: ${folder}`);
      console.log('─'.repeat(50));

      let folderDeleted = 0;
      let folderFailed = 0;
      let nextCursor;

      do {
        // Search for all assets in this folder
        const expression = folder.includes('/')
          ? `folder:${folder}`
          : `public_id:${folder}/*`;

        const result = await cloudinary.search
          .expression(expression)
          .max_results(500)
          .next_cursor(nextCursor)
          .execute();

        const resources = result.resources || [];

        if (resources.length === 0 && !nextCursor) {
          console.log(`   ℹ️  No assets found in folder: ${folder}`);
          break;
        }

        console.log(`   📦 Found ${resources.length} assets in this batch...`);

        // Delete each resource
        for (const resource of resources) {
          try {
            await cloudinary.uploader.destroy(resource.public_id, {
              resource_type: resource.resource_type || 'image',
              invalidate: true, // Invalidate CDN cache
            });
            folderDeleted++;
            summary.totalDeleted++;
            process.stdout.write(`\r   ✅ Deleted: ${folderDeleted} | ❌ Failed: ${folderFailed} | Current: ${resource.public_id.substring(0, 50)}...`);
          } catch (error) {
            folderFailed++;
            summary.totalFailed++;
            summary.errors.push({
              folder,
              publicId: resource.public_id,
              error: error.message || String(error),
            });
            process.stdout.write(`\r   ❌ Failed: ${resource.public_id} - ${error.message || String(error)}`);
          }
        }

        nextCursor = result.next_cursor;
      } while (nextCursor);

      summary.folderStats[folder] = {
        deleted: folderDeleted,
        failed: folderFailed,
      };

      console.log(`\n   ✅ Folder "${folder}": ${folderDeleted} deleted, ${folderFailed} failed`);
    }

    // Print summary
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 DELETION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Total deleted: ${summary.totalDeleted} assets`);
    console.log(`❌ Total failed: ${summary.totalFailed} assets`);
    console.log(`📁 Folders processed: ${folders.length}\n`);

    console.log('📁 Folder Details:');
    Object.entries(summary.folderStats).forEach(([folder, stats]) => {
      console.log(`   ${folder}:`);
      console.log(`     ✅ Deleted: ${stats.deleted}`);
      console.log(`     ❌ Failed: ${stats.failed}`);
    });

    if (summary.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      summary.errors.slice(0, 10).forEach((err) => {
        console.log(`   - ${err.folder}/${err.publicId}: ${err.error}`);
      });
      if (summary.errors.length > 10) {
        console.log(`   ... and ${summary.errors.length - 10} more errors`);
      }
    }

    console.log('\n✅ Deletion process completed!');
  } catch (error) {
    console.error('\n❌ Error during deletion:', error.message || error);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const confirm = args.includes('--confirm') || args.includes('-y') || args.includes('--yes');
const folders = args.filter(arg => !['--confirm', '-y', '--yes'].includes(arg));

// Run the script
deleteCloudinaryFolders(folders, confirm)
  .then(() => {
    console.log('\n🎉 Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error.message || error);
    process.exit(1);
  });



