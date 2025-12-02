/*
  Projects Seed Script - Tạo dữ liệu mẫu cho Projects với đầy đủ thông tin SEO
  Usage: npx ts-node src/seed-projects.ts
*/
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding projects...');

  // Create or get admin user for projects
  let adminUser = await prisma.users.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!adminUser) {
    // Create a default admin user if none exists
    adminUser = await prisma.users.create({
      data: {
        id: randomUUID(),
        email: 'admin@audiotailoc.com',
        password: '$2a$10$YourHashedPasswordHere', // Use bcrypt hash in production
        name: 'Admin',
        role: 'ADMIN',
        updatedAt: new Date()
      }
    });
  }

  // Sample projects with full information including SEO
  const projects = [
    {
      id: randomUUID(),
      updatedAt: new Date(),
      slug: 'he-thong-am-thanh-rap-phim-gia-dinh',
      name: 'Hệ thống âm thanh rạp phim gia đình',
      description: 'Thiết kế và lắp đặt hệ thống âm thanh 7.1 surround cho phòng chiếu phim gia đình với các thiết bị cao cấp từ JBL và Yamaha.',
      content: `
        <h2>Giới thiệu dự án</h2>
        <p>Dự án lắp đặt hệ thống âm thanh rạp phim gia đình cao cấp cho biệt thự tại Quận 2, TP.HCM. Hệ thống được thiết kế với cấu hình 7.1 surround sound, mang đến trải nghiệm điện ảnh chân thực ngay tại nhà.</p>
        
        <h3>Thiết bị sử dụng</h3>
        <ul>
          <li>Loa JBL Synthesis S4700 (Front L/R)</li>
          <li>Loa center JBL Synthesis S4Ai</li>
          <li>Loa surround JBL Synthesis S4S (4 chiếc)</li>
          <li>Subwoofer JBL Synthesis S1S-EX (2 chiếc)</li>
          <li>Ampli Yamaha RX-A8A</li>
          <li>Máy chiếu Sony VPL-VW295ES 4K HDR</li>
          <li>Màn chiếu Stewart Filmscreen 120 inch</li>
        </ul>

        <h3>Quy trình thực hiện</h3>
        <ol>
          <li><strong>Khảo sát không gian:</strong> Đo đạc kích thước phòng, xác định vị trí lắp đặt tối ưu</li>
          <li><strong>Thiết kế hệ thống:</strong> Tính toán âm học, thiết kế sơ đồ kết nối</li>
          <li><strong>Thi công lắp đặt:</strong> Lắp đặt thiết bị, đi dây âm thanh chuyên nghiệp</li>
          <li><strong>Hiệu chỉnh âm thanh:</strong> Calibration với Audyssey MultEQ XT32</li>
          <li><strong>Nghiệm thu và bàn giao:</strong> Test thử với các bộ phim demo, hướng dẫn sử dụng</li>
        </ol>

        <h3>Kết quả đạt được</h3>
        <p>Hệ thống hoạt động ổn định với chất lượng âm thanh vượt trội. Khách hàng hài lòng với khả năng tái tạo âm thanh chi tiết, bass sâu và mạnh mẽ, tạo không gian giải trí đẳng cấp cho gia đình.</p>
      `,
      shortDescription: 'Lắp đặt hệ thống âm thanh 7.1 surround cho phòng chiếu phim gia đình',
      thumbnailImage: 'https://images.unsplash.com/photo-1608970669253-3c630f898e1e?w=800&h=600&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1522444690501-5bbd3a92e42d?w=1920&h=800&fit=crop',
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1593078165899-c31c2d0a96a8?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop'
      ]),
      client: 'Gia đình Anh Minh - Quận 2',
      clientLogoUrl: 'https://ui-avatars.com/api/?name=Minh+Nguyen&background=0D8ABC&color=fff&size=200',
      projectDate: new Date('2024-11-15'),
      completionDate: new Date('2024-11-28'),
      budget: '450000000', // 450 triệu VND as string
      technologies: JSON.stringify(['JBL Synthesis', 'Yamaha', 'Sony 4K', 'Audyssey', 'Dolby Atmos']),
      category: 'home-theater',
      status: 'completed',
      featured: true,
      viewCount: 1250,
      // SEO fields
      metaTitle: 'Dự án lắp đặt hệ thống âm thanh rạp phim gia đình 7.1 | Audio Tài Lộc',
      metaDescription: 'Khám phá dự án lắp đặt hệ thống âm thanh rạp phim gia đình 7.1 surround cao cấp với thiết bị JBL và Yamaha. Giải pháp âm thanh chuyên nghiệp cho không gian giải trí tại nhà.',
      metaKeywords: 'hệ thống âm thanh, rạp phim gia đình, home theater, JBL Synthesis, Yamaha, lắp đặt âm thanh, 7.1 surround',
      ogTitle: 'Hệ thống âm thanh rạp phim gia đình - Dự án thành công',
      ogDescription: 'Thiết kế và lắp đặt hệ thống âm thanh 7.1 surround cho phòng chiếu phim gia đình với thiết bị cao cấp',
      ogImage: 'https://images.unsplash.com/photo-1522444690501-5bbd3a92e42d?w=1200&h=630&fit=crop',
      structuredData: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": "Hệ thống âm thanh rạp phim gia đình",
        "description": "Dự án lắp đặt hệ thống âm thanh 7.1 surround cho phòng chiếu phim gia đình",
        "creator": {
          "@type": "Organization",
          "name": "Audio Tài Lộc"
        },
        "dateCreated": "2024-11-15",
        "dateModified": "2024-11-28"
      }),
      isActive: true,
      isDeleted: false,
      users: { connect: { id: adminUser.id } } // Add user reference
    },
    {
      id: randomUUID(),
      updatedAt: new Date(),
      slug: 'he-thong-am-thanh-hoi-truong-500-cho',
      name: 'Hệ thống âm thanh hội trường 500 chỗ',
      description: 'Thiết kế và thi công hệ thống âm thanh chuyên nghiệp cho hội trường Trung tâm Hội nghị Quốc tế với sức chứa 500 người.',
      content: `
        <h2>Tổng quan dự án</h2>
        <p>Dự án nâng cấp toàn diện hệ thống âm thanh cho hội trường của Trung tâm Hội nghị Quốc tế. Hệ thống mới được thiết kế để đáp ứng các yêu cầu khắt khe về chất lượng âm thanh cho hội nghị, hội thảo và các sự kiện văn hóa.</p>
        
        <h3>Thách thức kỹ thuật</h3>
        <ul>
          <li>Không gian hội trường lớn với kiến trúc phức tạp</li>
          <li>Yêu cầu độ phủ âm thanh đồng đều cho 500 ghế ngồi</li>
          <li>Tích hợp hệ thống phiên dịch đa ngôn ngữ</li>
          <li>Khả năng ghi âm và livestream chất lượng cao</li>
        </ul>

        <h3>Giải pháp triển khai</h3>
        <h4>Hệ thống loa chính</h4>
        <ul>
          <li>Line Array: 12x QSC KLA12 (mỗi bên)</li>
          <li>Subwoofer: 4x QSC KLA181</li>
          <li>Front Fill: 4x QSC K10.2</li>
          <li>Delay Speaker: 8x QSC AD-S82</li>
        </ul>

        <h4>Hệ thống xử lý và khuếch đại</h4>
        <ul>
          <li>Mixer kỹ thuật số: Allen & Heath dLive S7000</li>
          <li>DSP: QSC Q-SYS Core 510i</li>
          <li>Power Amplifier: QSC PLD Series</li>
          <li>Wireless Microphone: Shure QLXD (16 channels)</li>
        </ul>

        <h3>Kết quả</h3>
        <p>Sau khi hoàn thành, hệ thống đạt được các tiêu chuẩn:</p>
        <ul>
          <li>SPL đồng đều: ±3dB trên toàn bộ khu vực khán giả</li>
          <li>Độ rõ giọng nói (STI): >0.6 (Excellent)</li>
          <li>Frequency Response: 45Hz - 18kHz (±3dB)</li>
          <li>Hỗ trợ 8 ngôn ngữ phiên dịch đồng thời</li>
        </ul>
      `,
      shortDescription: 'Hệ thống âm thanh chuyên nghiệp cho hội trường 500 chỗ',
      thumbnailImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&h=800&fit=crop',
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop'
      ]),
      client: 'Trung tâm Hội nghị Quốc tế',
      clientLogoUrl: 'https://ui-avatars.com/api/?name=Conference+Center&background=DC2626&color=fff&size=200',
      projectDate: new Date('2024-10-01'),
      completionDate: new Date('2024-10-20'),
      budget: '850000000', // 850 triệu VND as string
      technologies: JSON.stringify(['QSC', 'Allen & Heath', 'Shure', 'Q-SYS', 'Dante Network']),
      category: 'commercial',
      status: 'completed',
      featured: true,
      viewCount: 2340,
      // SEO fields
      metaTitle: 'Dự án âm thanh hội trường 500 chỗ - Giải pháp chuyên nghiệp | Audio Tài Lộc',
      metaDescription: 'Tìm hiểu dự án lắp đặt hệ thống âm thanh chuyên nghiệp cho hội trường 500 chỗ với thiết bị QSC và Allen & Heath. Âm thanh chuẩn quốc tế cho hội nghị và sự kiện.',
      metaKeywords: 'âm thanh hội trường, QSC line array, Allen Heath dLive, hệ thống âm thanh hội nghị, audio conference',
      ogTitle: 'Hệ thống âm thanh hội trường 500 chỗ - Audio Tài Lộc',
      ogDescription: 'Giải pháp âm thanh chuyên nghiệp cho hội trường lớn với công nghệ line array và xử lý số hiện đại',
      ogImage: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=630&fit=crop',
      structuredData: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Lắp đặt âm thanh hội trường",
        "provider": {
          "@type": "Organization",
          "name": "Audio Tài Lộc"
        },
        "areaServed": "Vietnam",
        "serviceType": "Professional Audio Installation"
      }),
      isActive: true,
      isDeleted: false,
      users: { connect: { id: adminUser.id } } // Add user reference
    },
    {
      id: randomUUID(),
      updatedAt: new Date(),
      slug: 'he-thong-karaoke-chuyen-nghiep-luxury-ktv',
      name: 'Hệ thống Karaoke chuyên nghiệp Luxury KTV',
      description: 'Thiết kế và lắp đặt hệ thống âm thanh karaoke cao cấp cho chuỗi 20 phòng hát Luxury KTV với công nghệ hiện đại nhất.',
      content: `
        <h2>Mô tả dự án</h2>
        <p>Luxury KTV là một trong những chuỗi karaoke cao cấp hàng đầu tại TP.HCM. Audio Tài Lộc vinh dự được lựa chọn là đơn vị thiết kế và thi công hệ thống âm thanh cho 20 phòng hát với các kích cỡ khác nhau.</p>

        <h3>Phân loại phòng hát</h3>
        <h4>Phòng VIP (5 phòng)</h4>
        <ul>
          <li>Diện tích: 35-45m²</li>
          <li>Loa chính: JBL KP6015 (2 cặp)</li>
          <li>Loa bass: JBL KP6018S (2 chiếc)</li>
          <li>Cục đẩy: Crown XLi 3500</li>
          <li>Mixer: Yamaha MG16XU</li>
          <li>Micro không dây: Shure BLX288/PG58 (4 mic)</li>
          <li>Màn hình: Samsung 75" QLED 4K</li>
        </ul>

        <h4>Phòng Deluxe (10 phòng)</h4>
        <ul>
          <li>Diện tích: 25-30m²</li>
          <li>Loa chính: JBL KP6012 (1 cặp)</li>
          <li>Loa bass: JBL KP6015S (1 chiếc)</li>
          <li>Cục đẩy: Crown XLi 2500</li>
          <li>Mixer: Yamaha MG12XU</li>
          <li>Micro không dây: Shure BLX288/PG58 (2 mic)</li>
          <li>Màn hình: LG 65" 4K</li>
        </ul>

        <h4>Phòng Standard (5 phòng)</h4>
        <ul>
          <li>Diện tích: 15-20m²</li>
          <li>Loa chính: JBL KP6010 (1 cặp)</li>
          <li>Loa bass: JBL KP6012S (1 chiếc)</li>
          <li>Cục đẩy: Crown XLi 1500</li>
          <li>Mixer: Yamaha MG10XU</li>
          <li>Micro không dây: Audio-Technica ATW-1322 (2 mic)</li>
          <li>Màn hình: Samsung 55" 4K</li>
        </ul>

        <h3>Hệ thống quản lý trung tâm</h3>
        <ul>
          <li>Đầu karaoke: Hanet PlayX One (hệ thống mạng)</li>
          <li>Server trung tâm: Dell PowerEdge T340</li>
          <li>Phần mềm quản lý: Custom KTV Management System</li>
          <li>Hệ thống backup: UPS APC 10KVA</li>
        </ul>

        <h3>Tính năng đặc biệt</h3>
        <ul>
          <li>Điều khiển qua app mobile cho khách hàng</li>
          <li>Tích hợp đặt phòng online</li>
          <li>Live stream karaoke lên social media</li>
          <li>Chấm điểm tự động với AI</li>
          <li>Playlist cá nhân hóa theo sở thích</li>
        </ul>
      `,
      shortDescription: 'Lắp đặt hệ thống karaoke cao cấp cho chuỗi 20 phòng hát',
      thumbnailImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&h=800&fit=crop',
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=600&fit=crop'
      ]),
      client: 'Luxury KTV Chain',
      clientLogoUrl: 'https://ui-avatars.com/api/?name=Luxury+KTV&background=7C3AED&color=fff&size=200',
      projectDate: new Date('2024-09-15'),
      completionDate: new Date('2024-10-30'),
      budget: '1200000000', // 1.2 tỷ VND as string
      technologies: JSON.stringify(['JBL KP Series', 'Crown', 'Yamaha', 'Shure', 'Hanet', 'AI Scoring']),
      category: 'karaoke',
      status: 'completed',
      featured: true,
      viewCount: 3560,
      // SEO fields
      metaTitle: 'Dự án lắp đặt hệ thống Karaoke Luxury KTV - 20 phòng hát cao cấp',
      metaDescription: 'Khám phá dự án lắp đặt hệ thống karaoke chuyên nghiệp cho chuỗi Luxury KTV với 20 phòng hát cao cấp, công nghệ AI chấm điểm và quản lý thông minh.',
      metaKeywords: 'hệ thống karaoke, karaoke chuyên nghiệp, JBL karaoke, Crown amplifier, Luxury KTV, phòng hát cao cấp',
      ogTitle: 'Hệ thống Karaoke Luxury KTV - 20 phòng hát chuyên nghiệp',
      ogDescription: 'Dự án lắp đặt hệ thống karaoke cao cấp với công nghệ AI và quản lý thông minh',
      ogImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=630&fit=crop',
      structuredData: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Luxury KTV",
        "description": "Chuỗi karaoke cao cấp với hệ thống âm thanh chuyên nghiệp",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Ho Chi Minh City",
          "addressCountry": "VN"
        }
      }),
      isActive: true,
      isDeleted: false,
      users: { connect: { id: adminUser.id } } // Add user reference
    },
    {
      id: randomUUID(),
      updatedAt: new Date(),
      slug: 'am-thanh-nha-hang-skybar-rooftop',
      name: 'Âm thanh nhà hàng SkyBar Rooftop',
      description: 'Thiết kế hệ thống âm thanh ngoài trời cho nhà hàng SkyBar trên sân thượng với khả năng chống thời tiết và chất lượng âm thanh vượt trội.',
      content: `
        <h2>Thông tin dự án</h2>
        <p>SkyBar Rooftop là nhà hàng cao cấp nằm trên tầng 28 của một tòa nhà tại trung tâm TP.HCM. Với không gian mở hoàn toàn, dự án đòi hỏi giải pháp âm thanh đặc biệt có khả năng chống chịu thời tiết khắc nghiệt.</p>

        <h3>Thách thức</h3>
        <ul>
          <li>Không gian ngoài trời với gió lớn</li>
          <li>Độ ẩm cao và mưa thường xuyên</li>
          <li>Yêu cầu âm thanh phải rõ ràng trong môi trường ồn</li>
          <li>Thiết kế phải hài hòa với kiến trúc sang trọng</li>
          <li>Phân vùng âm thanh cho các khu vực khác nhau</li>
        </ul>

        <h3>Giải pháp kỹ thuật</h3>
        <h4>Khu vực Bar & Lounge</h4>
        <ul>
          <li>Loa: 8x Bose FreeSpace FS4SE (Surface Mount)</li>
          <li>Subwoofer: 2x Bose FreeSpace 3 Series II Acoustimass</li>
          <li>Coverage: 150m² với SPL 85-90dB</li>
        </ul>

        <h4>Khu vực Dining</h4>
        <ul>
          <li>Loa: 12x JBL Control 28-1 (Weather Resistant)</li>
          <li>Subwoofer: 4x JBL Control SB-2</li>
          <li>Coverage: 200m² với SPL 80-85dB</li>
        </ul>

        <h4>Khu vực Pool & Garden</h4>
        <ul>
          <li>Loa: 6x QSC AD-S82 (All-Weather)</li>
          <li>Landscape Speaker: 8x Episode ES-LS-GARDEN-8</li>
          <li>Coverage: 100m² với SPL 75-80dB</li>
        </ul>

        <h4>Hệ thống xử lý và điều khiển</h4>
        <ul>
          <li>DSP: Symetrix Radius 12x8 EX</li>
          <li>Amplifier: QSC CX Series (Weather Protected Rack)</li>
          <li>Control: iPad với app custom</li>
          <li>Source: Spotify Business, Local Server</li>
          <li>Microphone: Shure QLXD24/SM58 (cho events)</li>
        </ul>

        <h3>Tính năng thông minh</h3>
        <ul>
          <li>Tự động điều chỉnh âm lượng theo thời gian</li>
          <li>Sensor đo độ ồn môi trường để tự động cân bằng</li>
          <li>Preset cho các loại sự kiện khác nhau</li>
          <li>Tích hợp với hệ thống lighting</li>
          <li>Remote control qua internet</li>
        </ul>

        <h3>Kết quả</h3>
        <p>Sau 6 tháng vận hành, hệ thống hoạt động ổn định với 0% downtime. Khách hàng hài lòng với chất lượng âm thanh trong suốt và khả năng tạo không gian âm nhạc phù hợp cho từng thời điểm trong ngày.</p>
      `,
      shortDescription: 'Hệ thống âm thanh chống thời tiết cho nhà hàng rooftop',
      thumbnailImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1920&h=800&fit=crop',
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop'
      ]),
      client: 'SkyBar Rooftop Restaurant',
      clientLogoUrl: 'https://ui-avatars.com/api/?name=SkyBar&background=0EA5E9&color=fff&size=200',
      projectDate: new Date('2024-08-10'),
      completionDate: new Date('2024-08-25'),
      budget: '320000000', // 320 triệu VND as string
      technologies: JSON.stringify(['Bose FreeSpace', 'JBL Control', 'QSC', 'Symetrix', 'Weather Resistant']),
      category: 'restaurant',
      status: 'completed',
      featured: false,
      viewCount: 890,
      // SEO fields
      metaTitle: 'Dự án âm thanh nhà hàng SkyBar Rooftop - Giải pháp ngoài trời',
      metaDescription: 'Hệ thống âm thanh chống thời tiết cho nhà hàng rooftop SkyBar với công nghệ Bose và JBL. Âm thanh chất lượng cao cho không gian ngoài trời.',
      metaKeywords: 'âm thanh nhà hàng, rooftop restaurant audio, Bose outdoor, JBL weather resistant, âm thanh ngoài trời',
      ogTitle: 'Âm thanh nhà hàng SkyBar Rooftop - Audio Tài Lộc',
      ogDescription: 'Giải pháp âm thanh chuyên nghiệp cho nhà hàng rooftop với thiết bị chống thời tiết',
      ogImage: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&h=630&fit=crop',
      structuredData: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": "SkyBar Rooftop",
        "servesCuisine": "International",
        "amenityFeature": {
          "@type": "LocationFeatureSpecification",
          "name": "Professional Audio System",
          "value": "Bose & JBL Weather Resistant"
        }
      }),
      isActive: true,
      isDeleted: false,
      users: { connect: { id: adminUser.id } } // Add user reference
    },
    {
      id: randomUUID(),
      updatedAt: new Date(),
      slug: 'studio-thu-am-podcast-modern-media',
      name: 'Studio thu âm Podcast Modern Media',
      description: 'Xây dựng studio thu âm chuyên nghiệp cho Modern Media với khả năng recording multi-track và livestream chất lượng cao.',
      content: `
        <h2>Giới thiệu</h2>
        <p>Modern Media là công ty truyền thông digital hàng đầu, chuyên sản xuất podcast và content audio. Audio Tài Lộc đã thiết kế và xây dựng studio thu âm đạt chuẩn broadcast cho họ.</p>

        <h3>Thiết kế không gian</h3>
        <h4>Live Room (25m²)</h4>
        <ul>
          <li>Acoustic treatment: Primacoustic Broadway Panels</li>
          <li>Bass traps: Auralex LENRD Bass Traps</li>
          <li>Diffusers: Vicoustic Multifuser DC2</li>
          <li>Floating floor với rubber isolation</li>
          <li>RT60: 0.3s (optimized for speech)</li>
        </ul>

        <h4>Control Room (15m²)</h4>
        <ul>
          <li>Monitor: Genelec 8341A "The Ones"</li>
          <li>Subwoofer: Genelec 7360A</li>
          <li>Room correction: Genelec GLM 4</li>
          <li>Acoustic panels: GIK Acoustics 244 Bass Traps</li>
        </ul>

        <h3>Thiết bị thu âm</h3>
        <h4>Microphones</h4>
        <ul>
          <li>4x Shure SM7B (podcast hosts)</li>
          <li>2x Neumann U87 Ai (vocals/voiceover)</li>
          <li>2x Audio-Technica AT4050 (instruments)</li>
          <li>1x Sennheiser MKH 416 (shotgun for video)</li>
        </ul>

        <h4>Audio Interface & Processing</h4>
        <ul>
          <li>Interface: Universal Audio Apollo x8p</li>
          <li>Preamp: 4x Universal Audio 4-710d</li>
          <li>Compressor: dbx 266xs</li>
          <li>Headphone Amp: Behringer HA8000 V2</li>
        </ul>

        <h4>Mixing & Control</h4>
        <ul>
          <li>Mixer: Rodecaster Pro II</li>
          <li>Control Surface: Avid S1</li>
          <li>DAW: Pro Tools Studio + Logic Pro X</li>
          <li>Plugins: Waves Mercury Bundle, iZotope RX 10</li>
        </ul>

        <h3>Video & Streaming</h3>
        <ul>
          <li>Cameras: 3x Sony A7S III</li>
          <li>Switcher: Blackmagic ATEM Mini Pro ISO</li>
          <li>Streaming: OBS Studio + Restream.io</li>
          <li>Lighting: Aputure 300d II Kit</li>
        </ul>

        <h3>Workflow Integration</h3>
        <ul>
          <li>Cloud storage: 10TB Synology NAS</li>
          <li>Backup: Automated to AWS S3</li>
          <li>Remote recording: Source-Connect Pro</li>
          <li>Collaboration: Avid Cloud Collaboration</li>
        </ul>

        <h3>Thành tựu</h3>
        <p>Studio đã sản xuất hơn 200 tập podcast trong 3 tháng đầu hoạt động, với nhiều show đạt top trending trên Spotify và Apple Podcasts.</p>
      `,
      shortDescription: 'Studio thu âm podcast chuyên nghiệp với khả năng livestream',
      thumbnailImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1920&h=800&fit=crop',
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&h=600&fit=crop'
      ]),
      client: 'Modern Media Production',
      clientLogoUrl: 'https://ui-avatars.com/api/?name=Modern+Media&background=EC4899&color=fff&size=200',
      projectDate: new Date('2024-07-01'),
      completionDate: new Date('2024-07-20'),
      budget: '580000000', // 580 triệu VND as string
      technologies: JSON.stringify(['Genelec', 'Universal Audio', 'Neumann', 'Pro Tools', 'Rodecaster']),
      category: 'studio',
      status: 'completed',
      featured: false,
      viewCount: 1456,
      // SEO fields
      metaTitle: 'Studio thu âm Podcast Modern Media - Giải pháp recording chuyên nghiệp',
      metaDescription: 'Khám phá dự án xây dựng studio thu âm podcast chuyên nghiệp với thiết bị Genelec, Universal Audio và khả năng livestream multi-platform.',
      metaKeywords: 'studio thu âm, podcast studio, Genelec monitors, Universal Audio, Neumann microphone, recording studio',
      ogTitle: 'Studio thu âm Podcast Modern Media - Audio Tài Lộc',
      ogDescription: 'Studio recording chuyên nghiệp cho podcast và content creation',
      ogImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200&h=630&fit=crop',
      structuredData: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "MusicVenue",
        "name": "Modern Media Podcast Studio",
        "description": "Professional podcast recording studio",
        "maximumAttendeeCapacity": 6
      }),
      isActive: true,
      isDeleted: false,
      users: { connect: { id: adminUser.id } } // Add user reference
    }
  ];

  console.log(`📝 Creating ${projects.length} projects...`);

  for (const projectData of projects) {
    try {
      // Check if project exists
      const existing = await prisma.projects.findUnique({
        where: { slug: projectData.slug }
      });

      if (existing) {
        console.log(`✓ Updating project: ${projectData.name}`);
        const { users: _users, ...updateData } = projectData;
        await prisma.projects.update({
          where: { slug: projectData.slug },
          data: updateData
        });
      } else {
        console.log(`✓ Creating project: ${projectData.name}`);
        await prisma.projects.create({
          data: projectData
        });
      }
    } catch (error) {
      console.error(`✗ Error with project ${projectData.name}:`, error);
    }
  }

  console.log('✅ Projects seeding completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
