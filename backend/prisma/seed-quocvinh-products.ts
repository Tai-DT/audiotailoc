import { prisma } from './seed-client';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

// Using Cloudinary URLs - BASE_IMAGE_URL no longer needed

interface ProductData {
    id: string;
    name: string;
    slug: string;
    categorySlug: string;
    brand: string;
    priceVND: number;
    originalPriceVND?: number;
    description: string;
    shortDescription: string;
    specifications?: string;
    features?: string;
    warranty: string;
    imageFile: string;
    stockQuantity: number;
    featured: boolean;
}

async function seedQuocVinhProducts() {
    console.log('📦 Nạp sản phẩm từ Quốc Vinh Audio...');

    // Load both data files
    const data1Path = path.join(__dirname, 'quocvinh-products-data.json');
    const data2Path = path.join(__dirname, 'quocvinh-products-data-2.json');

    const data1 = JSON.parse(fs.readFileSync(data1Path, 'utf-8'));
    const data2 = JSON.parse(fs.readFileSync(data2Path, 'utf-8'));

    const allProducts: ProductData[] = [...data1.products, ...data2.products];

    // Get categories
    const categories = await prisma.categories.findMany();
    const catMap = new Map(categories.map(c => [c.slug, c.id]));

    console.log(`📋 Tìm thấy ${categories.length} categories`);
    console.log(`📦 Sẽ nạp ${allProducts.length} sản phẩm`);

    let created = 0;
    let skipped = 0;

    for (const p of allProducts) {
        const categoryId = catMap.get(p.categorySlug);

        if (!categoryId) {
            console.log(`⚠️ Không tìm thấy category "${p.categorySlug}" cho sản phẩm "${p.name}"`);
            skipped++;
            continue;
        }

        try {
            const existing = await prisma.products.findUnique({
                where: { slug: p.slug }
            });

            if (existing) {
                console.log(`⏭️ Đã tồn tại: ${p.name}`);
                skipped++;
                continue;
            }


            // Cloudinary URL mapping
            const productImageMap: Record<string, string> = {
                'Dàn Karaoke Kinh Doanh CAF VIP 1': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770855/audio-tailoc/products/thoz70av0dqhknqhnc01.png',
                'Dàn Combo CAF Super VIP Cho Gia Đình': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770857/audio-tailoc/products/b00xcnd4fd9pdrzqr3a1.png',
                'Dàn Karaoke Gia Đình CAF VIP 2': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770859/audio-tailoc/products/iy2foracdloxiq5nsv4r.png',
                'Dàn Karaoke Gia Đình E3 Combo VIP 1': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770861/audio-tailoc/products/crn8zlytc029xdhegkql.png',
                'Dàn Karaoke Gia Đình VIP 2': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770863/audio-tailoc/products/rulcjmy0eglvhprk6uxu.png',
                'Loa E3 MK15 (4 Tấc)': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770864/audio-tailoc/products/j5m0vr8qnkiqpz5v7at7.png',
                'Loa CAF X-12 PRO': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770866/audio-tailoc/products/xzryiyj0b0n3ocebmcc9.png',
                'Loa Sub CAF CA-218S': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770868/audio-tailoc/products/zkfvbpywxnkfahnhlotg.png',
                'Loa CAF BS-12': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770870/audio-tailoc/products/cybywwxut8qw3rlg0ipl.png',
                'Loa E3 DS-12 II': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770872/audio-tailoc/products/sep2qa0xadct8l8paxdz.png',
                'Vang Số E3 S7': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770877/audio-tailoc/products/wh9kqswe0lf5w9vemzsg.png',
                'Vang Số E3 K8900': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770898/audio-tailoc/products/kk85hszjri1cki9zme4l.png',
                'Vang Số CAF EF-Q10': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770900/audio-tailoc/products/z2cpwuwblgmke0qpv5jf.png',
                'Micro Không Dây CAF MI-9 PRO': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770902/audio-tailoc/products/ylw6dczcpt2vutn9qwto.png',
                'Micro Không Dây CAF MI-9': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770904/audio-tailoc/products/vrejekrs3cgwqbu2rxgi.png',
                'Micro Không Dây E3 Q-8900': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770906/audio-tailoc/products/of2xzi7yejghsvhmsrtp.png',
                'Cục Đẩy CAF T4-1500': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770908/audio-tailoc/products/hhe1jh0tj4muwtsizq3o.png',
                'Đầu Karaoke M15': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770910/audio-tailoc/products/rn9niyzxssgam1utfvr0.png',
                'Màn Hình Cảm Ứng T10': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770912/audio-tailoc/products/ujdludumqppunn5fxvo9.png',
                'Loa E3 BR 8.5/BR115 (Loa Cột)': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770913/audio-tailoc/products/bg0u25gv7npqjpn5fx64.png',
                'Loa E3 MK 12 (3 Tấc)': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770915/audio-tailoc/products/woqyc9luldwggadrpsrx.png',
                'Loa Sub E3 Kép RS218': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770917/audio-tailoc/products/qvofuomoq3avley9tl3g.png',
                'Loa CAF SG-12': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770919/audio-tailoc/products/fuh0rbjmccj6dmgvlb7h.png',
                'Loa E3 DS10II': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770921/audio-tailoc/products/j4bns4batmessgejpzww.png',
                'Loa E3 VX12 (3 Tấc)': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770923/audio-tailoc/products/a8oxu3kkmeyoz7azmay5.png',
                'Loa CAF LAVO-112': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770924/audio-tailoc/products/tifghtsfbehzxpex1fbr.png',
                'Loa Sub E3 BR 118': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770926/audio-tailoc/products/ftr2v3yhnseukgegrk5p.png',
                'Loa E3 R-12 (3 Tấc)': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770928/audio-tailoc/products/sd4a11nxlfqtyr3asio1.png',
                'Loa E3 KC12 (3 Tấc)': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770930/audio-tailoc/products/iuvfwvcirvnlun3mbuyy.png',
                'Loa Sub CAF CA-18S': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770932/audio-tailoc/products/wp0bhajwshkud3bwywrc.png',
                'Loa CAF MC12': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770934/audio-tailoc/products/mmh17btndv4vckvz7bdi.png',
                'Loa Sub E3 BR 115': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770935/audio-tailoc/products/jqpvvzmbpwdmvbbkhb8c.png',
                'Sub CAF MC-115S': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770938/audio-tailoc/products/jf56a1pwuj1fdtm733of.png',
                'Vang Số CAF A5': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770939/audio-tailoc/products/ynuccywmu4yx3gzp5e8q.png',
                'Micro Không Dây E3 Q-100': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770941/audio-tailoc/products/r4fcs0bxjrtpjn8w2ygd.png',
                'Micro Không Dây CAF MH-666': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770943/audio-tailoc/products/rqbmwiam7hu8hzyu4w1t.png',
                'Micro Không Dây E3 M560': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770945/audio-tailoc/products/pasn6wtarlatnfpas7cu.png',
                'Micro Không Dây E3 Q16': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770947/audio-tailoc/products/pshtv1rauiqcbklwfadb.png',
                'Cục Đẩy E3 PA-4.10/TX 12000 Pro (4 Kênh)': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770949/audio-tailoc/products/grewuthrfm6ahrynepbp.png',
                'Cục Đẩy E3 PA-4.8 (4 Kênh)': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770951/audio-tailoc/products/pchwtkz8re916zdkfe9y.png',
                'Cục Đẩy E3 F4.8 (4 Kênh)': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770953/audio-tailoc/products/wgtmhztwkjewhspt3udq.png',
                'Cục Đẩy E3 F3.12 (3 Kênh)': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770954/audio-tailoc/products/yjtoggmff5w0hbxyrnjw.png',
                'Cục Đẩy CAF QUEEN 48X': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770956/audio-tailoc/products/azv0hnb6xxoomz4gs4h0.png',
                'Cục Đẩy Công Suất E3 PA-612': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770958/audio-tailoc/products/ujesjypy3uib8q7jjlch.png',
                'Cục Đẩy E3 PA-2.8 (2 Kênh)': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770960/audio-tailoc/products/oqpa8o2ggvmpdqtsngkh.png',
                'Amply CAF LOTUS 668': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770962/audio-tailoc/products/llqecmcwn6dd0hprzy6f.png',
                'Cục Đẩy E3 PA-2.5 (2 Kênh)': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770964/audio-tailoc/products/y7qcdmyjoesjnekzanv6.png',
                'Cục Đẩy CAF TS-28': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770965/audio-tailoc/products/ufyzzzarpnkub3pdzirs.png',
                'Vang Liền Công Suất D-2.5': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770967/audio-tailoc/products/bhzyq7gziaym2waczmoz.png',
                'Đầu Karaoke CAF QS-108': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770969/audio-tailoc/products/viq4ak8sqzdnxrussqf5.png',
                'Dàn Karaoke Gia Đình E3 Combo 1': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770971/audio-tailoc/products/ccbomwgsrkxpcz10xlys.png',
                'Dàn Karaoke Gia Đình CAF': 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770972/audio-tailoc/products/g1u4io56bguiiyciowsl.png',
            };

            // Build image URL from Cloudinary mapping (fallback to placeholder if not mapped)
            const imageUrl = productImageMap[p.name] || `https://res.cloudinary.com/dib7tbv7w/image/upload/v1769770855/audio-tailoc/products/placeholder.png`;


            await prisma.products.create({
                data: {
                    id: randomUUID(),
                    name: p.name,
                    slug: p.slug,
                    description: p.description,
                    shortDescription: p.shortDescription,
                    priceCents: BigInt(p.priceVND * 100),
                    originalPriceCents: p.originalPriceVND ? BigInt(p.originalPriceVND * 100) : null,
                    imageUrl: imageUrl,
                    images: JSON.stringify([imageUrl]),
                    categoryId: categoryId,
                    brand: p.brand,
                    sku: p.id,
                    specifications: p.specifications || null,
                    features: p.features || null,
                    warranty: p.warranty,
                    stockQuantity: p.stockQuantity,
                    featured: p.featured,
                    isActive: true,
                    isDeleted: false,
                    viewCount: Math.floor(Math.random() * 500) + 50,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            });

            console.log(`✅ Tạo: ${p.name}`);
            created++;
        } catch (error) {
            console.error(`❌ Lỗi tạo "${p.name}":`, error);
        }
    }

    console.log('\n========================================');
    console.log(`✅ Hoàn thành! Đã tạo ${created} sản phẩm, bỏ qua ${skipped}`);
    console.log('========================================');
}

seedQuocVinhProducts()
    .catch((e) => {
        console.error('❌ Lỗi:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
