/**
 * Script to list all folders in Cloudinary
 * 
 * Usage:
 *   node scripts/list-cloudinary-folders.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const cloudinary = require('cloudinary').v2;

async function listCloudinaryFolders() {
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

  console.log('🔍 Connecting to Cloudinary...');
  console.log(`📦 Cloud Name: ${cloudName || cloudinary.config().cloud_name || 'N/A'}\n`);

  try {
    // Method 1: Get all resources to extract folder names
    const folders = new Set();
    let nextCursor;
    let totalResources = 0;

    console.log('🔍 Searching for resources to extract folder names...\n');

    do {
      const result = await cloudinary.search
        .expression('resource_type:image OR resource_type:video OR resource_type:raw')
        .max_results(500)
        .next_cursor(nextCursor)
        .execute();

      const resources = result.resources || [];
      totalResources += resources.length;

      // Extract folder names from public_id
      resources.forEach((resource) => {
        const publicId = resource.public_id;
        const parts = publicId.split('/');
        if (parts.length > 1) {
          // Get all folder levels
          for (let i = 0; i < parts.length - 1; i++) {
            const folderPath = parts.slice(0, i + 1).join('/');
            folders.add(folderPath);
          }
        }
      });

      nextCursor = result.next_cursor;
    } while (nextCursor);

    // Method 2: Try to get folders using Admin API (if available)
    console.log('🔍 Trying to get folders using Admin API...\n');
    try {
      // Note: This requires Admin API access
      const adminResult = await cloudinary.api.root_folders();
      if (adminResult && adminResult.folders) {
        adminResult.folders.forEach((folder) => {
          folders.add(folder.name);
        });
      }
    } catch (adminError) {
      // Admin API might not be available or might require different permissions
      console.log('   ℹ️  Admin API not available or requires different permissions');
    }

    const folderArray = Array.from(folders).sort();

    if (folderArray.length === 0) {
      console.log('⚠️  No folders found!');
      console.log('\nPossible reasons:');
      console.log('  1. All assets have been deleted');
      console.log('  2. All assets are in root (no folders)');
      console.log('  3. Cloudinary account is empty');
      console.log('\n💡 If you know the folder names, you can still delete them using:');
      console.log('   node scripts/delete-cloudinary-folders.js --confirm folder1 folder2 ...');
    } else {
      console.log(`📊 Found ${folderArray.length} folders from ${totalResources} resources:\n`);
      
      folderArray.forEach((folder, index) => {
        console.log(`${index + 1}. ${folder}`);
      });
    }

    console.log(`\n✅ Total folders: ${folderArray.length}`);
    console.log(`📦 Total resources scanned: ${totalResources}`);
    
    return folderArray;
  } catch (error) {
    console.error('\n❌ Error listing folders:', error.message || error);
    process.exit(1);
  }
}

// Run the script
listCloudinaryFolders()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error.message || error);
    process.exit(1);
  });



