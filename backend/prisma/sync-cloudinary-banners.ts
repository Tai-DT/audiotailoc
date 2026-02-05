import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'crypto';
import { prisma } from './seed-client';

type CloudinaryResource = {
  public_id: string;
  secure_url: string;
};

type BannerSeed = {
  page: string;
  position: number;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  linkUrl?: string | null;
  buttonLabel?: string | null;
  locale?: string | null;
  imageKey: string;
  darkImageKey?: string;
  mobileImageKey?: string;
  darkMobileImageKey?: string;
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
    onlyHome: args.has('--only-home'),
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

function buildUrlMap(resources: CloudinaryResource[]) {
  const urlByKey = new Map<string, string>();
  for (const r of resources) {
    urlByKey.set(r.public_id, r.secure_url);
    urlByKey.set(getPublicIdSuffix(r.public_id), r.secure_url);
  }
  return urlByKey;
}

function resolveUrl(urlByKey: Map<string, string>, key: string): string | null {
  const direct = urlByKey.get(key);
  if (direct) return direct;
  const suffix = getPublicIdSuffix(key);
  return urlByKey.get(suffix) || null;
}

const HOME_BANNERS: BannerSeed[] = [
  {
    page: 'home',
    position: 0,
    title: 'Dàn Gia Đẳng',
    subtitle: 'TRẢI NGHIỆM ĐỈNH CAO - MANG CHUẨN RẠP VỀ NHÀ',
    description:
      'Giải pháp dàn âm thanh cao cấp, thiết kế tinh tế, chất âm sang trọng — nâng tầm không gian giải trí tại gia.',
    imageKey: 'hero-showroom-light',
    darkImageKey: 'hero-cinema-dark',
    linkUrl: '/products',
    buttonLabel: 'Khám phá ngay',
  },
  {
    page: 'home',
    position: 1,
    title: 'Karaoke VIP',
    subtitle: 'KHÔNG GIAN GIẢI TRÍ ĐẲNG CẤP',
    description:
      'Biến phòng khách thành phòng hát chuyên nghiệp — âm thanh mạnh mẽ, chống hú thông minh, trải nghiệm mượt mà.',
    imageKey: 'hero-karaoke-light',
    darkImageKey: 'hero-karaoke-dark',
    linkUrl: '/products',
    buttonLabel: 'Xem sản phẩm',
  },
  {
    page: 'home',
    position: 2,
    title: 'Sân Khấu Pro',
    subtitle: 'CÔNG SUẤT & SỨC MẠNH CHUYÊN NGHIỆP',
    description:
      'Hệ thống âm thanh sân khấu bền bỉ, công suất lớn — đáp ứng mọi quy mô sự kiện với chất âm uy lực.',
    imageKey: 'hero-stage-light',
    darkImageKey: 'hero-stage-dark',
    linkUrl: '/products',
    buttonLabel: 'Tư vấn cấu hình',
  },
  {
    page: 'home',
    position: 3,
    title: 'Dịch Vụ Lắp Đặt',
    subtitle: 'THI CÔNG CHUẨN - THẨM MỸ CAO',
    description:
      'Đội ngũ kỹ thuật viên kinh nghiệm, thi công gọn đẹp, căn chỉnh chuẩn — tối ưu âm học cho từng không gian.',
    imageKey: 'service-install-light',
    darkImageKey: 'service-install-dark',
    linkUrl: '/services',
    buttonLabel: 'Đặt lịch ngay',
  },
];

const PAGE_BANNERS: BannerSeed[] = [
  {
    page: 'products',
    position: 0,
    title: 'Sản phẩm',
    subtitle: 'Tinh hoa âm thanh chính hãng',
    description: 'Khám phá bộ sưu tập thiết bị âm thanh & karaoke cao cấp, được tuyển chọn theo tiêu chuẩn showroom.',
    imageKey: 'products-hero',
    linkUrl: '/products',
    buttonLabel: 'Xem danh mục',
  },
  {
    page: 'services',
    position: 0,
    title: 'Dịch vụ',
    subtitle: 'Thi công & căn chỉnh chuyên sâu',
    description: 'Tư vấn thiết kế, lắp đặt và căn chỉnh hệ thống âm thanh chuẩn kỹ thuật — tối ưu theo từng không gian.',
    imageKey: 'services-hero',
    linkUrl: '/services',
    buttonLabel: 'Xem dịch vụ',
  },
  {
    page: 'about',
    position: 0,
    title: 'Về Audio Tài Lộc',
    subtitle: 'Uy tín tạo nên thương hiệu',
    description: 'Showroom trải nghiệm — chính hãng — hậu mãi tận tâm. Đồng hành cùng bạn nâng tầm không gian sống.',
    imageKey: 'about-hero',
    linkUrl: '/about',
    buttonLabel: 'Tìm hiểu thêm',
  },
  {
    page: 'contact',
    position: 0,
    title: 'Liên hệ',
    subtitle: 'Tư vấn nhanh - báo giá chuẩn',
    description: 'Gọi hoặc nhắn để được tư vấn cấu hình phù hợp nhu cầu và ngân sách. Hỗ trợ lắp đặt tận nơi.',
    imageKey: 'contact-hero',
    linkUrl: '/contact',
    buttonLabel: 'Liên hệ ngay',
  },
  {
    page: 'projects',
    position: 0,
    title: 'Dự án',
    subtitle: 'Thi công thực tế - trải nghiệm thật',
    description: 'Tham khảo các dự án đã triển khai: karaoke gia đình, phòng nghe hi-end, sân khấu sự kiện.',
    imageKey: 'projects-hero',
    linkUrl: '/projects',
    buttonLabel: 'Xem dự án',
  },
  {
    page: 'support',
    position: 0,
    title: 'Hỗ trợ',
    subtitle: 'Bảo hành & hậu mãi',
    description: 'Hỗ trợ kỹ thuật, bảo hành chính hãng và bảo trì định kỳ — giúp hệ thống luôn hoạt động tối ưu.',
    imageKey: 'support-hero',
    linkUrl: '/support',
    buttonLabel: 'Gửi yêu cầu',
  },
  {
    page: 'consultation',
    position: 0,
    title: 'Tư vấn',
    subtitle: 'Giải pháp phù hợp từng phòng',
    description:
      'Đánh giá nhu cầu, tư vấn cấu hình, dự toán chi phí — thiết kế âm học tối ưu theo kích thước & vật liệu phòng.',
    imageKey: 'consultation-hero',
    linkUrl: '/contact',
    buttonLabel: 'Nhận tư vấn',
  },
];

async function upsertBanner(seed: BannerSeed, urlByKey: Map<string, string>, options: { dryRun: boolean }) {
  const imageUrl = resolveUrl(urlByKey, seed.imageKey);
  if (!imageUrl) {
    // eslint-disable-next-line no-console
    console.warn(`⚠️ Missing Cloudinary image for key "${seed.imageKey}" (page=${seed.page}, pos=${seed.position})`);
    return { created: 0, updated: 0, skipped: 1 };
  }

  const darkImageUrl = seed.darkImageKey ? resolveUrl(urlByKey, seed.darkImageKey) : null;
  const mobileImageUrl = seed.mobileImageKey ? resolveUrl(urlByKey, seed.mobileImageKey) : null;
  const darkMobileImageUrl = seed.darkMobileImageKey ? resolveUrl(urlByKey, seed.darkMobileImageKey) : null;

  const existing = await prisma.banners.findFirst({
    where: {
      page: seed.page,
      position: seed.position,
      isDeleted: false,
    },
  });

  if (options.dryRun) {
    return existing ? { created: 0, updated: 1, skipped: 0 } : { created: 1, updated: 0, skipped: 0 };
  }

  const data = {
    title: seed.title,
    subtitle: seed.subtitle ?? null,
    description: seed.description ?? null,
    imageUrl,
    darkImageUrl: darkImageUrl ?? null,
    mobileImageUrl: mobileImageUrl ?? null,
    darkMobileImageUrl: darkMobileImageUrl ?? null,
    linkUrl: seed.linkUrl ?? null,
    buttonLabel: seed.buttonLabel ?? null,
    page: seed.page,
    locale: seed.locale ?? null,
    position: seed.position,
    isActive: true,
    isDeleted: false,
    updatedAt: new Date(),
  };

  if (existing) {
    await prisma.banners.update({ where: { id: existing.id }, data });
    return { created: 0, updated: 1, skipped: 0 };
  }

  await prisma.banners.create({
    data: {
      id: randomUUID(),
      ...data,
      createdAt: new Date(),
    },
  });
  return { created: 1, updated: 0, skipped: 0 };
}

async function main() {
  const { dryRun, onlyHome } = parseArgs(process.argv.slice(2));

  requireEnv('CLOUDINARY_CLOUD_NAME');
  requireEnv('CLOUDINARY_API_KEY');
  requireEnv('CLOUDINARY_API_SECRET');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // eslint-disable-next-line no-console
  console.log('🖼️ Sync Cloudinary banners → DB');
  // eslint-disable-next-line no-console
  console.log(`- dryRun: ${dryRun}`);
  // eslint-disable-next-line no-console
  console.log(`- onlyHome: ${onlyHome}`);

  const resources = await listAllResources('audiotailoc/banners');
  const urlByKey = buildUrlMap(resources);

  const seeds = onlyHome ? HOME_BANNERS : [...HOME_BANNERS, ...PAGE_BANNERS];

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const seed of seeds) {
    const res = await upsertBanner(seed, urlByKey, { dryRun });
    created += res.created;
    updated += res.updated;
    skipped += res.skipped;
  }

  // eslint-disable-next-line no-console
  console.log(`✅ Done. +${created} created, ~${updated} updated, =${skipped} skipped`);
}

main()
  .catch(err => {
    // eslint-disable-next-line no-console
    console.error('❌ Sync banners failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

