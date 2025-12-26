/**
 * Script to delete 18 old folders in Cloudinary
 * 
 * ⚠️ WARNING: This action is IRREVERSIBLE!
 * All assets in the specified folders will be permanently deleted.
 * 
 * Usage:
 *   node scripts/delete-18-old-folders.js
 * 
 * Or with confirmation:
 *   node scripts/delete-18-old-folders.js --confirm
 * 
 * Or specify folders:
 *   node scripts/delete-18-old-folders.js --confirm folder1 folder2 ... folder18
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const cloudinary = require('cloudinary').v2;

async function deleteOldFolders(folders, confirm = false) {
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
    console.error('\nUsage:');
    console.error('  node scripts/delete-18-old-folders.js --confirm folder1 folder2 ... folder18');
    console.error('\nExample:');
    console.error('  node scripts/delete-18-old-folders.js --confirm old-uploads legacy-images temp-files');
    process.exit(1);
  }

  console.log('🔍 Connecting to Cloudinary...');
  console.log(`📦 Cloud Name: ${cloudName || cloudinary.config().cloud_name || 'N/A'}\n`);

  if (!confirm) {
    console.log('⚠️  WARNING: This will delete ALL assets in the following folders:');
    folders.forEach((folder, index) => {
      console.log(`   ${index + 1}. ${folder}`);
    });
    console.log(`\n⚠️  Total folders: ${folders.length}`);
    console.log('⚠️  This action is IRREVERSIBLE!');
    console.log('\nTo proceed, run with --confirm flag:');
    console.log(`  node scripts/delete-18-old-folders.js --confirm ${folders.join(' ')}\n`);
    process.exit(0);
  }

  console.log('⚠️  CONFIRMED: Starting deletion of old folders...\n');
  console.log(`📁 Folders to delete: ${folders.length}\n`);

  const summary = {
    totalDeleted: 0,
    totalFailed: 0,
    folderStats: {},
    errors: [],
    foldersNotFound: [],
  };

  try {
    // Process each folder
    for (const folder of folders) {
      console.log(`\n📁 Processing folder: ${folder}`);
      console.log('─'.repeat(50));

      let folderDeleted = 0;
      let folderFailed = 0;
      let nextCursor;
      let hasAssets = false;

      do {
        // Try multiple search patterns
        let result;
        let searchExpression;

        // Try pattern 1: folder prefix
        searchExpression = `public_id:${folder}/*`;
        try {
          result = await cloudinary.search
            .expression(searchExpression)
            .max_results(500)
            .next_cursor(nextCursor)
            .execute();
        } catch (error) {
          // Try pattern 2: folder name
          try {
            searchExpression = `folder:${folder}`;
            result = await cloudinary.search
              .expression(searchExpression)
              .max_results(500)
              .next_cursor(nextCursor)
              .execute();
          } catch (error2) {
            // Try pattern 3: exact match
            try {
              searchExpression = `public_id:${folder}*`;
              result = await cloudinary.search
                .expression(searchExpression)
                .max_results(500)
                .next_cursor(nextCursor)
                .execute();
            } catch (error3) {
              if (!nextCursor) {
                console.log(`   ℹ️  No assets found in folder: ${folder}`);
                summary.foldersNotFound.push(folder);
              }
              break;
            }
          }
        }

        const resources = result.resources || [];

        if (resources.length === 0 && !nextCursor) {
          if (!hasAssets) {
            console.log(`   ℹ️  No assets found in folder: ${folder}`);
            summary.foldersNotFound.push(folder);
          }
          break;
        }

        hasAssets = true;
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
        found: hasAssets,
      };

      if (hasAssets) {
        console.log(`\n   ✅ Folder "${folder}": ${folderDeleted} deleted, ${folderFailed} failed`);
      }
    }

    // Print summary
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 DELETION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Total deleted: ${summary.totalDeleted} assets`);
    console.log(`❌ Total failed: ${summary.totalFailed} assets`);
    console.log(`📁 Folders processed: ${folders.length}`);
    console.log(`📁 Folders with assets: ${folders.length - summary.foldersNotFound.length}`);
    console.log(`📁 Folders not found/empty: ${summary.foldersNotFound.length}\n`);

    if (summary.foldersNotFound.length > 0) {
      console.log('📁 Folders not found or empty:');
      summary.foldersNotFound.forEach((folder) => {
        console.log(`   - ${folder}`);
      });
      console.log('');
    }

    console.log('📁 Folder Details:');
    Object.entries(summary.folderStats).forEach(([folder, stats]) => {
      if (stats.found) {
        console.log(`   ${folder}:`);
        console.log(`     ✅ Deleted: ${stats.deleted}`);
        console.log(`     ❌ Failed: ${stats.failed}`);
      }
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
deleteOldFolders(folders, confirm)
  .then(() => {
    console.log('\n🎉 Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error.message || error);
    process.exit(1);
  });



