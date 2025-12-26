/**
 * Script to delete folders in Cloudinary using Admin API
 * 
 * ⚠️ WARNING: This action is IRREVERSIBLE!
 * Folders will be permanently deleted from Cloudinary.
 * 
 * Usage:
 *   node scripts/delete-cloudinary-folders-admin.js folder1 folder2 ...
 * 
 * Or with confirmation:
 *   node scripts/delete-cloudinary-folders-admin.js --confirm folder1 folder2 ...
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const cloudinary = require('cloudinary').v2;

async function deleteFoldersAdmin(folders, confirm = false) {
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
    console.error('Usage: node scripts/delete-cloudinary-folders-admin.js [--confirm] folder1 folder2 ...');
    process.exit(1);
  }

  console.log('🔍 Connecting to Cloudinary Admin API...');
  console.log(`📦 Cloud Name: ${cloudName || cloudinary.config().cloud_name || 'N/A'}\n`);

  if (!confirm) {
    console.log('⚠️  WARNING: This will delete the following folders:');
    folders.forEach((folder, index) => {
      console.log(`   ${index + 1}. ${folder}`);
    });
    console.log(`\n⚠️  Total folders: ${folders.length}`);
    console.log('⚠️  This action is IRREVERSIBLE!');
    console.log('\nTo proceed, run with --confirm flag:');
    console.log(`  node scripts/delete-cloudinary-folders-admin.js --confirm ${folders.join(' ')}\n`);
    process.exit(0);
  }

  console.log('⚠️  CONFIRMED: Starting deletion of folders...\n');
  console.log(`📁 Folders to delete: ${folders.length}\n`);

  const summary = {
    deleted: [],
    failed: [],
    notFound: [],
  };

  try {
    // First, try to get root folders to see what's available
    console.log('🔍 Checking available folders...\n');
    let availableFolders = [];
    try {
      const rootFolders = await cloudinary.api.root_folders();
      if (rootFolders && rootFolders.folders) {
        availableFolders = rootFolders.folders.map(f => f.name);
        console.log(`📁 Found ${availableFolders.length} root folders in Cloudinary\n`);
      }
    } catch (error) {
      console.log('⚠️  Could not fetch root folders, proceeding with deletion attempts...\n');
    }

    // Process each folder
    for (const folder of folders) {
      console.log(`📁 Processing folder: ${folder}`);
      console.log('─'.repeat(50));

      try {
        // Method 1: Try to delete using delete_folder API
        try {
          const result = await cloudinary.api.delete_folder(folder);
          summary.deleted.push(folder);
          console.log(`   ✅ Successfully deleted folder: ${folder}`);
        } catch (deleteError) {
          const errorMsg = deleteError.message || deleteError.error?.message || JSON.stringify(deleteError);
          
          // Method 2: If delete_folder fails, try to delete all assets in the folder first
          if (errorMsg.includes('not empty') || errorMsg.includes('NotEmpty')) {
            console.log(`   ⚠️  Folder is not empty, trying to delete assets first...`);
            
            // Delete all assets in the folder
            let nextCursor;
            let deletedCount = 0;
            
            do {
              try {
                const result = await cloudinary.search
                  .expression(`public_id:${folder}/*`)
                  .max_results(500)
                  .next_cursor(nextCursor)
                  .execute();

                const resources = result.resources || [];
                
                for (const resource of resources) {
                  try {
                    await cloudinary.uploader.destroy(resource.public_id, {
                      resource_type: resource.resource_type || 'image',
                      invalidate: true,
                    });
                    deletedCount++;
                  } catch (assetError) {
                    // Continue with other assets
                  }
                }

                nextCursor = result.next_cursor;
              } catch (searchError) {
                break;
              }
            } while (nextCursor);

            if (deletedCount > 0) {
              console.log(`   ✅ Deleted ${deletedCount} assets from folder`);
              
              // Try to delete folder again
              try {
                await cloudinary.api.delete_folder(folder);
                summary.deleted.push(folder);
                console.log(`   ✅ Successfully deleted folder: ${folder}`);
              } catch (retryError) {
                const retryErrorMsg = retryError.message || retryError.error?.message || JSON.stringify(retryError);
                summary.failed.push({ folder, error: retryErrorMsg });
                console.log(`   ❌ Failed to delete folder after cleaning: ${retryErrorMsg}`);
              }
            } else {
              // Folder might be empty or doesn't exist - try direct deletion
              try {
                await cloudinary.api.delete_folder(folder);
                summary.deleted.push(folder);
                console.log(`   ✅ Successfully deleted empty folder: ${folder}`);
              } catch (emptyError) {
                const emptyErrorMsg = emptyError.message || emptyError.error?.message || JSON.stringify(emptyError);
                if (emptyErrorMsg.includes('not found') || emptyErrorMsg.includes('NotFound')) {
                  summary.notFound.push(folder);
                  console.log(`   ℹ️  Folder not found (may already be deleted): ${folder}`);
                } else {
                  summary.notFound.push(folder);
                  console.log(`   ℹ️  Folder appears to be empty: ${folder}`);
                }
              }
            }
          } else if (errorMsg.includes('not found') || errorMsg.includes('NotFound')) {
            summary.notFound.push(folder);
            console.log(`   ℹ️  Folder not found: ${folder}`);
          } else {
            // Try alternative method: delete by prefix
            console.log(`   ⚠️  Standard deletion failed, trying alternative method...`);
            try {
              // Try to delete all assets with this prefix and then the folder
              let deletedAny = false;
              let nextCursor;
              
              do {
                try {
                  const searchResult = await cloudinary.search
                    .expression(`public_id:${folder}*`)
                    .max_results(500)
                    .next_cursor(nextCursor)
                    .execute();

                  const resources = searchResult.resources || [];
                  
                  for (const resource of resources) {
                    try {
                      await cloudinary.uploader.destroy(resource.public_id, {
                        resource_type: resource.resource_type || 'image',
                        invalidate: true,
                      });
                      deletedAny = true;
                    } catch (assetError) {
                      // Continue
                    }
                  }

                  nextCursor = searchResult.next_cursor;
                } catch (searchError) {
                  break;
                }
              } while (nextCursor);

              if (deletedAny) {
                // Try to delete folder again
                try {
                  await cloudinary.api.delete_folder(folder);
                  summary.deleted.push(folder);
                  console.log(`   ✅ Successfully deleted folder after cleanup: ${folder}`);
                } catch (finalError) {
                  const finalErrorMsg = finalError.message || finalError.error?.message || JSON.stringify(finalError);
                  summary.failed.push({ folder, error: finalErrorMsg });
                  console.log(`   ❌ Still failed after cleanup: ${finalErrorMsg}`);
                }
              } else {
                summary.failed.push({ folder, error: errorMsg });
                console.log(`   ❌ Failed to delete folder: ${errorMsg}`);
              }
            } catch (altError) {
              summary.failed.push({ folder, error: errorMsg });
              console.log(`   ❌ Failed to delete folder: ${errorMsg}`);
            }
          }
        }
      } catch (error) {
        const errorMsg = error.message || error.error?.message || JSON.stringify(error);
        summary.failed.push({ folder, error: errorMsg });
        console.log(`   ❌ Error processing folder: ${errorMsg}`);
      }
    }

    // Print summary
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 DELETION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successfully deleted: ${summary.deleted.length} folders`);
    console.log(`❌ Failed to delete: ${summary.failed.length} folders`);
    console.log(`ℹ️  Not found/empty: ${summary.notFound.length} folders\n`);

    if (summary.deleted.length > 0) {
      console.log('✅ Successfully deleted folders:');
      summary.deleted.forEach((folder) => {
        console.log(`   - ${folder}`);
      });
      console.log('');
    }

    if (summary.failed.length > 0) {
      console.log('❌ Failed to delete folders:');
      summary.failed.forEach(({ folder, error }) => {
        console.log(`   - ${folder}: ${error}`);
      });
      console.log('');
    }

    if (summary.notFound.length > 0) {
      console.log('ℹ️  Folders not found or already empty:');
      summary.notFound.forEach((folder) => {
        console.log(`   - ${folder}`);
      });
      console.log('');
    }

    console.log('✅ Deletion process completed!');
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
deleteFoldersAdmin(folders, confirm)
  .then(() => {
    console.log('\n🎉 Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error.message || error);
    process.exit(1);
  });
