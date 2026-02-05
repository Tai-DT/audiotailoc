import { prisma } from './seed-client';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

type CategorySeed = {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
};

type ProductSeed = {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  brand: string;
  priceVND: number;
  originalPriceVND?: number | null;
  description: string;
  shortDescription: string;
  specifications?: string | null;
  features?: string | null;
  warranty?: string | null;
  stockQuantity: number;
  featured: boolean;
};

const CATEGORIES: CategorySeed[] = [
  {
    name: 'Dàn Karaoke',
    slug: 'dan-karaoke',
    description:
      'Trọn bộ dàn karaoke cao cấp cho gia đình và kinh doanh, bao gồm loa, amply, mic và các thiết bị đi kèm',
    imageUrl: '/images/categories/dan-karaoke.jpg',
  },
  {
    name: 'Loa Karaoke',
    slug: 'loa-karaoke',
    description: 'Loa karaoke chất lượng cao từ các thương hiệu CAF, E3 Audio với âm thanh sống động',
    imageUrl: '/images/categories/loa-karaoke.jpg',
  },
  {
    name: 'Loa Sub',
    slug: 'loa-sub',
    description: 'Loa sub bass mạnh mẽ, tái tạo âm trầm sâu cho dàn karaoke chuyên nghiệp',
    imageUrl: '/images/categories/loa-sub.jpg',
  },
  {
    name: 'Vang Số / Mixer',
    slug: 'vang-so-mixer',
    description:
      'Vang số, mixer xử lý tín hiệu âm thanh chuyên nghiệp với công nghệ chống hú thông minh',
    imageUrl: '/images/categories/vang-so.jpg',
  },
  {
    name: 'Microphone',
    slug: 'microphone',
    description:
      'Micro không dây cao cấp với khả năng thu sóng ổn định, chống hú feedback hiệu quả',
    imageUrl: '/images/categories/microphone.jpg',
  },
  {
    name: 'Amply & Cục Đẩy',
    slug: 'amply-cuc-day',
    description: 'Amply và cục đẩy công suất lớn cho hệ thống âm thanh karaoke chuyên nghiệp',
    imageUrl: '/images/categories/amply.jpg',
  },
  {
    name: 'Đầu Karaoke',
    slug: 'dau-karaoke',
    description: 'Đầu karaoke VOD với kho bài hát khổng lồ, giao diện dễ sử dụng',
    imageUrl: '/images/categories/dau-karaoke.jpg',
  },
  {
    name: 'Màn Hình Chọn Bài',
    slug: 'man-hinh-chon-bai',
    description: 'Màn hình cảm ứng chọn bài karaoke thông minh, dễ thao tác',
    imageUrl: '/images/categories/man-hinh.jpg',
  },
];

function parseArgs(argv: string[]) {
  const args = new Set(argv);
  return {
    dryRun: args.has('--dry-run'),
    skipExisting: args.has('--skip-existing'),
  };
}

function loadJsonFile<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

function normalizeMoneyToCents(vnd: number) {
  // This codebase stores VND as "cents" by multiplying by 100 (no decimals in VND but keeps consistency).
  // Use BigInt to avoid overflow in Postgres int4 columns.
  const normalized = Math.round(Number(vnd) * 100);
  return BigInt(normalized);
}

async function upsertCategories(options: { dryRun: boolean }) {
  let created = 0;
  let updated = 0;

  for (const cat of CATEGORIES) {
    const existing = await prisma.categories.findUnique({ where: { slug: cat.slug } });

    if (options.dryRun) {
      if (existing) updated += 1;
      else created += 1;
      continue;
    }

    if (existing) {
      await prisma.categories.update({
        where: { slug: cat.slug },
        data: {
          name: cat.name,
          description: cat.description,
          imageUrl: cat.imageUrl,
          isActive: true,
          updatedAt: new Date(),
        },
      });
      updated += 1;
    } else {
      await prisma.categories.create({
        data: {
          id: randomUUID(),
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          imageUrl: cat.imageUrl,
          isActive: true,
          updatedAt: new Date(),
        },
      });
      created += 1;
    }
  }

  return { created, updated };
}

async function upsertProducts(
  products: ProductSeed[],
  options: { dryRun: boolean; skipExisting: boolean },
) {
  const categories = await prisma.categories.findMany({ select: { id: true, slug: true } });
  const categoryIdBySlug = new Map(categories.map(c => [c.slug, c.id]));

  const mappingPath = path.join(__dirname, '..', 'product-image-mapping.json');
  const imageMap = loadJsonFile<Record<string, string>>(mappingPath);

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let missingCategory = 0;

  for (const p of products) {
    const categoryId = categoryIdBySlug.get(p.categorySlug);
    if (!categoryId) {
      missingCategory += 1;
      // eslint-disable-next-line no-console
      console.warn(`⚠️ Missing category "${p.categorySlug}" for product "${p.name}"`);
      continue;
    }

    const existing = await prisma.products.findUnique({ where: { slug: p.slug } });
    if (existing && options.skipExisting) {
      skipped += 1;
      continue;
    }

    const imageUrl = imageMap[p.name] || existing?.imageUrl || null;
    const images = imageUrl ? JSON.stringify([imageUrl]) : existing?.images || null;

    const priceCents = normalizeMoneyToCents(p.priceVND);
    const originalPriceCents =
      p.originalPriceVND && p.originalPriceVND > 0 ? normalizeMoneyToCents(p.originalPriceVND) : null;

    if (options.dryRun) {
      if (existing) updated += 1;
      else created += 1;
      continue;
    }

    if (existing) {
      await prisma.products.update({
        where: { slug: p.slug },
        data: {
          name: p.name,
          description: p.description,
          shortDescription: p.shortDescription,
          priceCents,
          originalPriceCents,
          imageUrl,
          images,
          categoryId,
          brand: p.brand || null,
          sku: p.id || null,
          specifications: p.specifications || null,
          features: p.features || null,
          warranty: p.warranty || null,
          stockQuantity: Number.isFinite(p.stockQuantity) ? p.stockQuantity : 0,
          featured: Boolean(p.featured),
          isActive: true,
          isDeleted: false,
          isDigital: false,
          metaTitle: p.name,
          metaDescription: p.shortDescription || null,
          updatedAt: new Date(),
        } as any,
      });

      await prisma.inventory.upsert({
        where: { productId: existing.id },
        update: {
          stock: Number.isFinite(p.stockQuantity) ? p.stockQuantity : 0,
          updatedAt: new Date(),
        },
        create: {
          id: randomUUID(),
          productId: existing.id,
          stock: Number.isFinite(p.stockQuantity) ? p.stockQuantity : 0,
          reserved: 0,
          lowStockThreshold: 0,
          updatedAt: new Date(),
        },
      });

      updated += 1;
      continue;
    }

    const createdProduct = await prisma.products.create({
      data: {
        id: randomUUID(),
        name: p.name,
        slug: p.slug,
        description: p.description,
        shortDescription: p.shortDescription,
        priceCents,
        originalPriceCents,
        imageUrl,
        images,
        categoryId,
        brand: p.brand || null,
        sku: p.id || null,
        specifications: p.specifications || null,
        features: p.features || null,
        warranty: p.warranty || null,
        stockQuantity: Number.isFinite(p.stockQuantity) ? p.stockQuantity : 0,
        featured: Boolean(p.featured),
        isActive: true,
        isDeleted: false,
        isDigital: false,
        metaTitle: p.name,
        metaDescription: p.shortDescription || null,
        viewCount: Math.floor(Math.random() * 500) + 50,
        updatedAt: new Date(),
      } as any,
    });

    await prisma.inventory.create({
      data: {
        id: randomUUID(),
        productId: createdProduct.id,
        stock: Number.isFinite(p.stockQuantity) ? p.stockQuantity : 0,
        reserved: 0,
        lowStockThreshold: 0,
        updatedAt: new Date(),
      },
    });

    created += 1;
  }

  return { created, updated, skipped, missingCategory };
}

async function main() {
  const { dryRun, skipExisting } = parseArgs(process.argv.slice(2));

  // eslint-disable-next-line no-console
  console.log('🧩 Restore catalog (Quoc Vinh) starting...');
  // eslint-disable-next-line no-console
  console.log(`- dryRun: ${dryRun}`);
  // eslint-disable-next-line no-console
  console.log(`- skipExisting: ${skipExisting}`);

  const data1Path = path.join(__dirname, 'quocvinh-products-data.json');
  const data2Path = path.join(__dirname, 'quocvinh-products-data-2.json');

  const data1 = loadJsonFile<{ products: ProductSeed[] }>(data1Path);
  const data2 = loadJsonFile<{ products: ProductSeed[] }>(data2Path);
  const products: ProductSeed[] = [...(data1.products || []), ...(data2.products || [])];

  const catResult = await upsertCategories({ dryRun });
  // eslint-disable-next-line no-console
  console.log(`📁 Categories: +${catResult.created} created, ~${catResult.updated} updated`);

  const productResult = await upsertProducts(products, { dryRun, skipExisting });
  // eslint-disable-next-line no-console
  console.log(
    `📦 Products: +${productResult.created} created, ~${productResult.updated} updated, =${productResult.skipped} skipped`,
  );
  if (productResult.missingCategory > 0) {
    // eslint-disable-next-line no-console
    console.log(`⚠️ Missing category for ${productResult.missingCategory} products`);
  }

  // eslint-disable-next-line no-console
  console.log('✅ Restore catalog completed');
}

main()
  .catch(err => {
    // eslint-disable-next-line no-console
    console.error('❌ Restore catalog failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

