/**
 * Script to recursively delete folders in Cloudinary
 * 
 * ⚠️ WARNING: This action is IRREVERSIBLE!
 * 
 * Usage:
 *   node scripts/delete-folders-recursive.js --confirm folder1 folder2 ...
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const cloudinary = require('cloudinary').v2;

async function deleteFolderRecursive(folderPath) {
  try {
    // First, try to get subfolders
    let subfolders = [];
    try {
      const foldersResult = await cloudinary.api.sub_folders(folderPath);
      if (foldersResult && foldersResult.folders) {
        subfolders = foldersResult.folders.map(f => f.path);
        console.log(`   📂 Found ${subfolders.length} subfolders, deleting recursively...`);
      }
    } catch (error) {
      // No subfolders or error - that's okay
    }

    // Delete subfolders first (recursive)
    for (const subfolder of subfolders) {
      console.log(`   📁 Deleting subfolder: ${subfolder}`);
      try {
        await deleteFolderRecursive(subfolder);
      } catch (subError) {
        // Continue even if subfolder deletion fails
        console.log(`   ⚠️  Subfolder deletion had issues, continuing...`);
      }
    }
    
    // After deleting subfolders, check again
    try {
      const recheckFolders = await cloudinary.api.sub_folders(folderPath);
      if (recheckFolders && recheckFolders.folders && recheckFolders.folders.length > 0) {
        console.log(`   ⚠️  Still has ${recheckFolders.folders.length} subfolders, trying to delete all assets recursively...`);
        // Delete ALL assets in this folder tree (including subfolders)
        let allDeleted = 0;
        let allNextCursor;
        do {
          try {
            const allResult = await cloudinary.search
              .expression(`public_id:${folderPath}*`)
              .max_results(500)
              .next_cursor(allNextCursor)
              .execute();
            
            const allResources = allResult.resources || [];
            for (const resource of allResources) {
              try {
                await cloudinary.uploader.destroy(resource.public_id, {
                  resource_type: resource.resource_type || 'image',
                  invalidate: true,
                });
                allDeleted++;
              } catch (e) {
                // Continue
              }
            }
            allNextCursor = allResult.next_cursor;
          } catch (e) {
            break;
          }
        } while (allNextCursor);
        
        if (allDeleted > 0) {
          console.log(`   🗑️  Deleted ${allDeleted} assets from entire folder tree`);
        }
        
        // Try to delete subfolders again
        const finalCheck = await cloudinary.api.sub_folders(folderPath);
        if (finalCheck && finalCheck.folders) {
          for (const remainingSubfolder of finalCheck.folders) {
            try {
              await cloudinary.api.delete_folder(remainingSubfolder.path);
            } catch (e) {
              // Continue
            }
          }
        }
      }
    } catch (recheckError) {
      // Continue
    }

    // Delete all assets in this folder (only direct assets, not in subfolders)
    let nextCursor;
    let deletedCount = 0;
    
    // Only delete assets directly in this folder (not in subfolders)
    const exactFolderPattern = folderPath.includes('/') 
      ? `public_id:${folderPath}/* AND -public_id:${folderPath}/*/*`
      : `public_id:${folderPath}/* AND -public_id:${folderPath}/*/*`;
    
    do {
      try {
        let result;
        
        // Try exact folder match (no subfolders)
        try {
          result = await cloudinary.search
            .expression(exactFolderPattern)
            .max_results(500)
            .next_cursor(nextCursor)
            .execute();
        } catch (e1) {
          // Fallback: try simple pattern
          try {
            result = await cloudinary.search
              .expression(`public_id:${folderPath}/*`)
              .max_results(500)
              .next_cursor(nextCursor)
              .execute();
            
            // Filter out assets in subfolders
            if (result.resources) {
              result.resources = result.resources.filter(r => {
                const path = r.public_id.replace(folderPath + '/', '');
                return !path.includes('/'); // Only direct children
              });
            }
          } catch (e2) {
            break;
          }
        }

        const resources = result.resources || [];
        
        for (const resource of resources) {
          try {
            await cloudinary.uploader.destroy(resource.public_id, {
              resource_type: resource.resource_type || 'image',
              invalidate: true,
            });
            deletedCount++;
          } catch (assetError) {
            // Continue
          }
        }

        nextCursor = result.next_cursor;
      } catch (searchError) {
        break;
      }
    } while (nextCursor);

    if (deletedCount > 0) {
      console.log(`   🗑️  Deleted ${deletedCount} direct assets`);
    }

    // Now try to delete the folder itself
    try {
      await cloudinary.api.delete_folder(folderPath);
      return { success: true, deleted: deletedCount, folderDeleted: true };
    } catch (deleteError) {
      const errorMsg = deleteError.message || deleteError.error?.message || String(deleteError);
      
      // Check if there are still subfolders
      let stillHasSubfolders = false;
      try {
        const checkFolders = await cloudinary.api.sub_folders(folderPath);
        if (checkFolders && checkFolders.folders && checkFolders.folders.length > 0) {
          stillHasSubfolders = true;
          console.log(`   ⚠️  Folder still has ${checkFolders.folders.length} subfolders`);
        }
      } catch (checkError) {
        // Can't check
      }
      
      if (stillHasSubfolders) {
        throw new Error('Folder still has subfolders');
      }
      
      // If folder deletion fails but we deleted assets and no subfolders, that's okay
      if (deletedCount > 0 && !stillHasSubfolders) {
        return { success: true, deleted: deletedCount, folderDeleted: false };
      }
      throw deleteError;
    }
  } catch (error) {
    throw error;
  }
}

async function deleteFolders(folders, confirm = false) {
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

  if (!folders || folders.length === 0) {
    console.error('❌ No folders specified!');
    process.exit(1);
  }

  console.log('🔍 Connecting to Cloudinary...');
  console.log(`📦 Cloud Name: ${cloudName || cloudinary.config().cloud_name || 'N/A'}\n`);

  if (!confirm) {
    console.log('⚠️  WARNING: This will delete the following folders:');
    folders.forEach((f, i) => console.log(`   ${i + 1}. ${f}`));
    console.log('\n⚠️  This action is IRREVERSIBLE!');
    console.log(`\nTo proceed: node scripts/delete-folders-recursive.js --confirm ${folders.join(' ')}\n`);
    process.exit(0);
  }

  console.log('⚠️  CONFIRMED: Starting recursive deletion...\n');

  const summary = {
    deleted: [],
    failed: [],
    notFound: [],
  };

  for (const folder of folders) {
    console.log(`📁 Processing: ${folder}`);
    console.log('─'.repeat(50));
    
    try {
      const result = await deleteFolderRecursive(folder);
      if (result.success) {
        summary.deleted.push({ folder, assets: result.deleted, folderDeleted: result.folderDeleted !== false });
        console.log(`   ✅ Deleted ${result.deleted} assets${result.folderDeleted !== false ? ' and folder' : ' (folder may still exist)'}`);
      }
    } catch (error) {
      const errorMsg = error.message || error.error?.message || JSON.stringify(error);
      if (errorMsg.includes('not found') || errorMsg.includes('NotFound')) {
        summary.notFound.push(folder);
        console.log(`   ℹ️  Folder not found: ${folder}`);
      } else {
        summary.failed.push({ folder, error: errorMsg });
        console.log(`   ❌ Failed: ${errorMsg}`);
      }
    }
  }

  console.log('\n\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Deleted: ${summary.deleted.length}`);
  console.log(`❌ Failed: ${summary.failed.length}`);
  console.log(`ℹ️  Not found: ${summary.notFound.length}\n`);

  if (summary.deleted.length > 0) {
    console.log('✅ Successfully processed:');
    summary.deleted.forEach(({ folder, assets, folderDeleted }) => {
      console.log(`   ${folder}: ${assets} assets${folderDeleted ? ', folder deleted' : ', folder may still exist'}`);
    });
  }

  if (summary.failed.length > 0) {
    console.log('\n❌ Failed:');
    summary.failed.forEach(({ folder, error }) => {
      console.log(`   ${folder}: ${error}`);
    });
  }

  console.log('\n✅ Completed!');
}

const args = process.argv.slice(2);
const confirm = args.includes('--confirm');
const folders = args.filter(a => !['--confirm', '-y', '--yes'].includes(a));

deleteFolders(folders, confirm)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Script failed:', error.message || error);
    process.exit(1);
  });
