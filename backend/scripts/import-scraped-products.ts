
import axios from 'axios';
import sharp from 'sharp';
import path from 'path';
import * as fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import slugify from 'slugify';

dotenv.config({ path: path.join(__dirname, '../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();
const LOGO_PATH = '/Users/macbook/Desktop/audiotailoc/frontend/public/images/logo/logo-dark.svg';
const TEMP_DIR = path.join(__dirname, '../temp_import');

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

const productsData = [
  // Âm thanh quán Cafe
  {
    name: 'Dàn âm thanh sân khấu Cafe Acoustic',
    price: 98000000,
    catSlug: 'am-thanh-quan-cafe',
    imgUrl: 'https://phuctruongaudio.vn/wp-content/uploads/2023/04/dan-nhac-cafe-acoustic.png',
    spec: 'Loa Acoustic E3 BR8.5, Sub hơi E3 BR115, Micro E3 Q8900, Vang số E3 S7, Cục đẩy 4 kênh E3 PA4.8, Loa monitor CAF M15-A, Mixer Soundcraft EPM 6.'
  },
  {
    name: 'Dàn âm thanh sân khấu E3 Acoustic',
    price: 89000000,
    catSlug: 'am-thanh-quan-cafe',
    imgUrl: 'https://phuctruongaudio.vn/wp-content/uploads/2023/04/dan-am-thanh-acoustic-phan-khuc-gia-re-day-du-tinh-nang-acoustic.png',
    spec: 'Loa Acoustic E3 Audio MK12, Loa Sub E3 BR115, Micro E3 Q8900, Vang số E3 S7, Cục đẩy 4 kênh E3 PA4.8, Mixer bàn Dynacord CMS 1000.'
  },
  {
    name: 'Dàn Âm Thanh Acoustic Bose S1 Pro',
    price: 88950000,
    catSlug: 'am-thanh-quan-cafe',
    imgUrl: 'https://phuctruongaudio.vn/wp-content/uploads/2023/04/dan-am-thanh-acoustic.png',
    spec: 'Loa acoustic Bose S1 Pro, Loa Sub Bose Sub2, Vang số Vova V9Pro, Micro đèn Sica MK290.'
  },
  {
    name: 'Dàn Âm Thanh Cafe Hay Nhất Hiện Nay 2026',
    price: 65000000,
    catSlug: 'am-thanh-quan-cafe',
    imgUrl: 'https://phuctruongaudio.vn/wp-content/uploads/2023/06/Dan-am-thanh-cafe-hay-nhat.png',
    spec: '3 cặp loa âm trần Yamaha VXC4, 1 Amply Thunder MA-360.'
  },
  {
    name: 'Dàn Âm Thanh Quán Cafe Không Gian Vừa 2026',
    price: 46400000,
    catSlug: 'am-thanh-quan-cafe',
    imgUrl: 'https://phuctruongaudio.vn/wp-content/uploads/2023/06/Dan-am-thanh-quan-cafe-khong-gian-vua-1.png',
    spec: '2 cặp loa âm trần JBL CONTROL 24CT MICRO, 2 cặp loa treo tường JBL CONTROL 23, Amply JBL VMA-160.'
  },
  // Nghe Nhạc - Xem Phim
  {
    name: 'Combo Loa Bowers & Wilkins 802 D4 và Ampli Accuphase E 5000',
    price: 765000000,
    catSlug: 'nghe-nhac-xem-phim',
    imgUrl: 'https://phuctruongaudio.vn/wp-content/uploads/2024/12/combo-loa-bowers-wilkins-802-d4-va-ampli-accuphase-e-5000-cao-cap.jpg',
    spec: 'Loa Bowers & Wilkins 802 D4 (Anh Quốc), Ampli Accuphase E 5000 (Nhật Bản).'
  },
  {
    name: 'Combo Loa Bowers & Wilkins 803 D4 và Amply Gryphon Diablo 120',
    price: 595000000,
    catSlug: 'nghe-nhac-xem-phim',
    imgUrl: 'https://phuctruongaudio.vn/wp-content/uploads/2024/12/combo-loa-bowers-wilkins-803-d4-va-amply-gryphon-diablo-120-cao-cap.jpg',
    spec: 'Loa Bowers & Wilkins 803 D4, Amply Gryphon Diablo 120.'
  },
  {
    name: 'Dàn Nghe Nhạc Cao Cấp Loa Dynaudio Heritage Special và Ampli Gryphon Diablo 120',
    price: 350000000,
    catSlug: 'nghe-nhac-xem-phim',
    imgUrl: 'https://phuctruongaudio.vn/wp-content/uploads/2024/12/dan-nghe-nhac-cao-cap-loa-dynaudio-heritage-special-va-amply-gryphon-diablo-120-cao-cap.jpg',
    spec: 'Loa Dynaudio Heritage Special, Amply Gryphon Diablo 120.'
  },
  {
    name: 'Dàn Nghe Nhạc Cao Cấp Loa Dynaudio Heritage Special và Amply Rotel Michi X3',
    price: 270000000,
    catSlug: 'nghe-nhac-xem-phim',
    imgUrl: 'https://phuctruongaudio.vn/wp-content/uploads/2024/12/combo-loa-dynaudio-heritage-special-va-amply-rotel-michi-x3-cao-cap.jpg',
    spec: 'Loa Dynaudio Heritage Special, Amply Rotel Michi X3.'
  },
  {
    name: 'Combo Loa Focal Kanta No2 Và Amply Primaluna Evo 400',
    price: 247000000,
    catSlug: 'nghe-nhac-xem-phim',
    imgUrl: 'https://phuctruongaudio.vn/wp-content/uploads/2024/12/combo-loa-focal-kanta-no2-va-amply-primaluna-evo-400-cao-cap.jpg',
    spec: 'Loa Focal Kanta No2 (Pháp), Amply Primaluna Evo 400.'
  }
];

async function processProduct(p: any) {
  const slug = slugify(p.name, { lower: true, strict: true });
  const localInput = path.join(TEMP_DIR, `${slug}_orig.png`);
  const localOutput = path.join(TEMP_DIR, `${slug}_wm.png`);

  console.log(`Downloading image for ${p.name}...`);
  const response = await axios({
    url: p.imgUrl,
    method: 'GET',
    responseType: 'stream'
  });
  
  const writer = fs.createWriteStream(localInput);
  response.data.pipe(writer);
  await new Promise<void>((resolve, reject) => {
    writer.on('finish', () => resolve());
    writer.on('error', (err) => reject(err));
  });

  console.log(`Applying watermark to ${p.name}...`);
  await sharp(localInput)
    .resize(1000, 1000, { fit: 'inside' })
    .composite([{ input: LOGO_PATH, gravity: 'southeast' }])
    .toFile(localOutput);

  console.log(`Uploading to Cloudinary...`);
  const upload = await cloudinary.uploader.upload(localOutput, {
    folder: `audiotailoc/products/${p.catSlug}`,
    public_id: slug
  });

  const category = await prisma.categories.findUnique({ where: { slug: p.catSlug } });
  
  await prisma.products.create({
    data: {
      id: uuidv4(),
      name: p.name,
      slug: slug,
      priceCents: BigInt(p.price) * BigInt(100),
      imageUrl: upload.secure_url,
      specifications: p.spec,
      categoryId: category?.id,
      isActive: true,
      updatedAt: new Date(),
      stockQuantity: 10,
      featured: p.price > 100000000 // VIP items
    }
  });

  console.log(`Successfully imported ${p.name}`);
}

async function main() {
  for (const p of productsData) {
    try {
      await processProduct(p);
    } catch (err) {
      console.error(`Failed to process ${p.name}:`, err);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
