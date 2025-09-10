const fs = require('fs');
const path = require('path');

// Load .env file manually
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};

    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    });

    return envVars;
  } catch (error) {
    console.log('Error reading .env file:', error.message);
    return {};
  }
}

const envVars = loadEnv();

console.log('=== Cloudinary Configuration Test ===\n');

// Check environment variables
const cloudName = envVars.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = envVars.CLOUDINARY_API_KEY;
const apiSecret = envVars.CLOUDINARY_API_SECRET;
const uploadPreset = envVars.CLOUDINARY_UPLOAD_PRESET;

console.log('Cloud Name:', cloudName ? '✓ Set' : '✗ Missing');
console.log('API Key:', apiKey ? '✓ Set' : '✗ Missing');
console.log('API Secret:', apiSecret ? '✓ Set' : '✗ Missing');
console.log('Upload Preset:', uploadPreset ? '✓ Set' : '✗ Missing');

// Test Cloudinary connection
if (cloudName && apiKey && apiSecret) {
  const cloudinary = require('cloudinary').v2;

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });

  console.log('\n=== Testing Cloudinary Connection ===');

  // Test API connectivity
  cloudinary.api.ping((error, result) => {
    if (error) {
      console.log('✗ Connection failed:', error.message);
    } else {
      console.log('✓ Connection successful');
      console.log('Cloudinary status:', result.status);
    }

    // Test upload preset
    if (uploadPreset) {
      cloudinary.api.upload_preset(uploadPreset, (presetError, presetResult) => {
        if (presetError) {
          console.log('✗ Upload preset check failed:', presetError.message);
        } else {
          console.log('✓ Upload preset exists');
          console.log('Preset name:', presetResult.name);
        }

        console.log('\n=== Test URLs ===');
        // Test URL generation
        const testUrl = cloudinary.url('test.jpg', {
          cloud_name: cloudName,
          secure: true
        });
        console.log('Sample URL:', testUrl);

        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
} else {
  console.log('\n✗ Missing required environment variables');
  process.exit(1);
}