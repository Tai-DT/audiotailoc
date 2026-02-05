import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from './seed-client';

type CloudinaryResource = {
  public_id: string;
  secure_url: string;
};

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

function parseArgs(argv: string[]) {
  const args = new Set(argv);
  return {
    dryRun: args.has('--dry-run'),
  };
}

function getPublicIdSuffix(publicId: string): string {
  const parts = publicId.split('/').filter(Boolean);
  return parts[parts.length - 1] || publicId;
}

async function listAllResources(prefix: string): Promise<CloudinaryResource[]> {
  const resources: CloudinaryResource[] = [];
  let cursor: string | undefined;

  for (let i = 0; i < 20; i++) {
    const res = await cloudinary.api.resources({
      type: 'upload',
      prefix,
      max_results: 500,
      next_cursor: cursor,
    });

    for (const r of res.resources || []) {
      if (r?.public_id && r?.secure_url) {
        resources.push({ public_id: String(r.public_id), secure_url: String(r.secure_url) });
      }
    }

    cursor = res.next_cursor;
    if (!cursor) break;
  }

  return resources;
}

async function main() {
  const { dryRun } = parseArgs(process.argv.slice(2));

  requireEnv('CLOUDINARY_CLOUD_NAME');
  requireEnv('CLOUDINARY_API_KEY');
  requireEnv('CLOUDINARY_API_SECRET');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // eslint-disable-next-line no-console
  console.log('🗂️ Sync Cloudinary category images → DB');
  // eslint-disable-next-line no-console
  console.log(`- dryRun: ${dryRun}`);

  const resources = await listAllResources('audiotailoc/categories');
  const urlBySlug = new Map<string, string>();
  for (const r of resources) {
    const slug = getPublicIdSuffix(r.public_id);
    urlBySlug.set(slug, r.secure_url);
  }

  const categories = await prisma.categories.findMany({
    select: { id: true, slug: true, imageUrl: true },
  });

  let updated = 0;
  let missing = 0;
  let unchanged = 0;

  for (const cat of categories) {
    const url = urlBySlug.get(cat.slug);
    if (!url) {
      missing += 1;
      // eslint-disable-next-line no-console
      console.warn(`⚠️ Missing Cloudinary image for category "${cat.slug}"`);
      continue;
    }

    if (cat.imageUrl === url) {
      unchanged += 1;
      continue;
    }

    if (!dryRun) {
      await prisma.categories.update({
        where: { id: cat.id },
        data: {
          imageUrl: url,
          updatedAt: new Date(),
        },
      });
    }

    updated += 1;
  }

  // eslint-disable-next-line no-console
  console.log(`✅ Done. ~${updated} updated, =${unchanged} unchanged, !${missing} missing`);
}

main()
  .catch(err => {
    // eslint-disable-next-line no-console
    console.error('❌ Sync category images failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

