import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

function configureCloudinary() {
  const url = process.env.CLOUDINARY_URL;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (url) {
    cloudinary.config({ url, secure: true } as any);
  } else if (cloudName && apiKey && apiSecret) {
    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true } as any);
  } else {
    console.error('Cloudinary not configured in env vars. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME + API keys.');
    process.exit(1);
  }
}

async function uploadBuffer(buffer: Buffer, publicId: string, folder = 'products') {
  return new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder, public_id: publicId, resource_type: 'image', overwrite: true }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
    stream.end(buffer);
  });
}

async function main() {
  configureCloudinary();

  // collect local image path candidates
  const repoRoot = path.resolve(__dirname, '..');
  const candidates = [
    path.join(repoRoot, 'test-upload.png'),
    path.join(repoRoot, 'test.png'),
    path.join(repoRoot, 'test-image.jpg'),
  ];

  let imagePath: string | null = null;
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      imagePath = p;
      break;
    }
  }

  if (!imagePath) {
    console.error('No local image found to upload. Place a file named test-upload.png at repo root or adjust candidates.');
    process.exit(1);
  }

  const buffer = fs.readFileSync(imagePath);

  const products = await prisma.product.findMany();
  console.log(`Found ${products.length} products; uploading image for each and updating imageUrl...`);

  for (const prod of products) {
    const publicId = `product-${prod.id}`;
    try {
      const uploaded = await uploadBuffer(buffer, publicId, 'audiotailoc/products');
      const url = uploaded.secure_url || uploaded.url;
      await prisma.product.update({ where: { id: prod.id }, data: { imageUrl: url } });
      console.log(`- ${prod.slug} -> ${url}`);
    } catch (err) {
      console.error(`Failed upload for ${prod.slug}:`, err);
    }
  }

  console.log('✅ All products updated with Cloudinary images');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
