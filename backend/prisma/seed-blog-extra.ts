import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function seedExtraBlogArticles() {
  console.log('🌱 Seeding extra blog articles...');

  // Get author
  const author = await prisma.users.findFirst({
    where: { role: 'ADMIN' },
  });

  if (!author) {
    console.error('❌ No admin user found. Run seed-blog.ts first.');
    return;
  }

  // Get categories
  const categories = await prisma.blog_categories.findMany();
  const categoryMap = new Map(categories.map(c => [c.slug, c]));

  const huongDanCategory = categoryMap.get('huong-dan-mua-hang');
  const kyThuatCategory = categoryMap.get('ky-thuat');
  const chinhSachCategory = categoryMap.get('chinh-sach');
  const baoHanhCategory = categoryMap.get('bao-hanh');

  if (!huongDanCategory || !kyThuatCategory) {
    console.error('❌ Required categories not found. Run seed-blog.ts first.');
    return;
  }

  const extraArticles = [
    {
      id: randomUUID(),
      title: 'Top 10 Loa Karaoke Gia Đình Bán Chạy Nhất 2024',
      slug: 'top-10-loa-karaoke-gia-dinh-ban-chay-nhat-2024',
      excerpt: 'Tổng hợp những mẫu loa karaoke gia đình được khách hàng yêu thích và đánh giá cao nhất trong năm 2024.',
      content: `
## Top 10 Loa Karaoke Gia Đình Bán Chạy Nhất 2024

Năm 2024 chứng kiến sự phát triển mạnh mẽ của thị trường loa karaoke gia đình tại Việt Nam. Dưới đây là danh sách 10 mẫu loa được yêu thích nhất.

### 1. JBL Partybox 310
**Giá tham khảo: 12.990.000đ**

Loa Bluetooth di động với công suất 240W, âm thanh mạnh mẽ, có đèn LED đổi màu theo nhịp nhạc.

**Ưu điểm:**
- Pin sử dụng lên đến 18 tiếng
- Kết nối Bluetooth 5.1
- Chống nước IPX4

### 2. Bose S1 Pro+
**Giá tham khảo: 15.990.000đ**

Hệ thống PA di động đa năng với công nghệ Auto EQ tự động điều chỉnh âm thanh.

**Ưu điểm:**
- Âm thanh 360 độ
- Pin sử dụng 11 tiếng
- Nhẹ, dễ di chuyển

### 3. JBL Ki510
**Giá tham khảo: 8.990.000đ**

Loa karaoke chuyên dụng 10 inch với công suất 300W.

**Ưu điểm:**
- Thiết kế chuyên nghiệp
- Âm bass sâu, treble trong
- Phù hợp phòng 30-50m²

### 4. BMB CSN-500SE
**Giá tham khảo: 7.500.000đ**

Loa karaoke thương hiệu Nhật với chất âm mềm mại, phù hợp giọng hát Việt.

### 5. Paramax P-850
**Giá tham khảo: 4.990.000đ**

Loa karaoke made in Vietnam chất lượng cao với giá cả phải chăng.

### 6. Alto TS315
**Giá tham khảo: 9.990.000đ**

Loa active 2000W với khả năng khuếch đại mạnh mẽ.

### 7. Yamaha KMS-3000
**Giá tham khảo: 11.990.000đ**

Loa karaoke cao cấp với công nghệ D-Bass cho âm trầm sâu.

### 8. Electro-Voice ELX200-10P
**Giá tham khảo: 13.500.000đ**

Loa active 1200W với DSP tích hợp.

### 9. RCF ART 712-A MK4
**Giá tham khảo: 16.990.000đ**

Loa active cao cấp từ Ý với âm thanh chuyên nghiệp.

### 10. JBL EON715
**Giá tham khảo: 14.500.000đ**

Loa active thế hệ mới với Bluetooth streaming.

## Kết luận

Việc chọn loa karaoke phụ thuộc vào ngân sách và nhu cầu sử dụng. Hãy đến Audio Tài Lộc để được tư vấn và trải nghiệm trực tiếp!
`,
      categoryId: huongDanCategory.id,
      authorId: author.id,
      status: 'PUBLISHED',
      featured: true,
      imageUrl: '/placeholder-product.svg',
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      viewCount: 2540,
      likeCount: 189,
      commentCount: 45,
      seoTitle: 'Top 10 Loa Karaoke Gia Đình Bán Chạy Nhất 2024',
      seoDescription: 'Tổng hợp 10 mẫu loa karaoke gia đình được yêu thích nhất 2024. Đánh giá chi tiết, so sánh giá cả.',
      seoKeywords: 'loa karaoke, loa gia đình, top loa karaoke, loa bán chạy 2024',
    },
    {
      id: randomUUID(),
      title: 'Cách chọn Micro không dây phù hợp cho dàn Karaoke',
      slug: 'cach-chon-micro-khong-day-phu-hop',
      excerpt: 'Hướng dẫn chi tiết cách chọn micro không dây chất lượng, phù hợp với nhu cầu và ngân sách.',
      content: `
## Tầm quan trọng của Micro trong dàn Karaoke

Micro là thiết bị thu âm trực tiếp giọng hát, quyết định đến 40% chất lượng âm thanh của dàn karaoke.

## Các loại Micro không dây phổ biến

### 1. Micro không dây UHF
- Tần số: 470-960MHz
- Khoảng cách truyền: 50-100m
- Ít nhiễu sóng
- Giá: 2-10 triệu đồng

### 2. Micro không dây VHF
- Tần số: 30-300MHz
- Khoảng cách truyền: 30-50m
- Dễ bị nhiễu
- Giá: 500k-2 triệu đồng

### 3. Micro không dây Digital
- Sử dụng sóng 2.4GHz hoặc 5.8GHz
- Âm thanh số chất lượng cao
- Không bị nhiễu
- Giá: 5-20 triệu đồng

## Tiêu chí chọn Micro

### 1. Dải tần số đáp ứng
- Micro tốt: 50Hz - 15kHz
- Micro cao cấp: 20Hz - 20kHz

### 2. Độ nhạy
- Độ nhạy cao giúp thu âm rõ hơn
- Thông số: -54dB đến -32dB

### 3. Thời lượng pin
- Pin AA: 8-10 tiếng
- Pin sạc: 6-12 tiếng
- Nên chọn pin sạc để tiết kiệm chi phí

### 4. Số kênh
- Sử dụng gia đình: 2 kênh
- Sử dụng chuyên nghiệp: 4-8 kênh

## Top micro không dây được đề xuất

1. **Shure PG288/PG58** - 8.990.000đ
2. **Sennheiser XSW 2-835** - 7.500.000đ
3. **Audio-Technica ATW-1322** - 9.990.000đ
4. **AKG WMS40 Mini Dual** - 4.990.000đ
5. **BOYA BY-WM8 Pro** - 3.500.000đ

## Lưu ý khi sử dụng

- Giữ khoảng cách 5-10cm từ micro đến miệng
- Không để micro rơi hoặc va đập
- Tắt micro khi không sử dụng để tiết kiệm pin
- Vệ sinh đầu micro định kỳ

## Kết luận

Đầu tư vào một bộ micro không dây chất lượng sẽ nâng tầm trải nghiệm karaoke của bạn. Hãy liên hệ Audio Tài Lộc để được tư vấn chi tiết!
`,
      categoryId: kyThuatCategory.id,
      authorId: author.id,
      status: 'PUBLISHED',
      featured: true,
      imageUrl: '/placeholder-product.svg',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      viewCount: 1820,
      likeCount: 142,
      commentCount: 32,
      seoTitle: 'Cách chọn Micro không dây cho Karaoke - Hướng dẫn chi tiết',
      seoDescription: 'Hướng dẫn chọn micro không dây chất lượng cho dàn karaoke. So sánh các loại UHF, VHF, Digital.',
      seoKeywords: 'micro không dây, micro karaoke, chọn micro, micro UHF, micro VHF',
    },
    {
      id: randomUUID(),
      title: 'Hướng dẫn bảo dưỡng thiết bị âm thanh định kỳ',
      slug: 'huong-dan-bao-duong-thiet-bi-am-thanh',
      excerpt: 'Những mẹo hữu ích giúp bảo dưỡng và kéo dài tuổi thọ cho các thiết bị âm thanh của bạn.',
      content: `
## Tại sao cần bảo dưỡng thiết bị âm thanh?

Thiết bị âm thanh là khoản đầu tư lớn. Bảo dưỡng định kỳ giúp:
- Kéo dài tuổi thọ thiết bị
- Duy trì chất lượng âm thanh
- Phát hiện sớm các vấn đề
- Tiết kiệm chi phí sửa chữa

## Bảo dưỡng Loa

### Hàng tuần
- Lau bụi bề mặt loa bằng khăn mềm
- Kiểm tra các kết nối

### Hàng tháng
- Vệ sinh lưới bảo vệ màng loa
- Kiểm tra màng loa có bị rách không
- Kiểm tra dây loa

### Hàng năm
- Thay thế foam viền loa nếu cần
- Bảo dưỡng crossover
- Siết lại các ốc vít

## Bảo dưỡng Amply

### Hàng tuần
- Lau bụi bề mặt
- Kiểm tra quạt tản nhiệt

### Hàng tháng
- Vệ sinh các cổng kết nối
- Kiểm tra volume và các nút chỉnh
- Vệ sinh lỗ thông gió

### Hàng năm
- Mở nắp vệ sinh bên trong
- Thay dầu tản nhiệt nếu cần
- Kiểm tra tụ điện

## Bảo dưỡng Micro

### Sau mỗi lần sử dụng
- Lau đầu micro bằng khăn ẩm
- Tháo pin ra nếu không sử dụng

### Hàng tuần
- Vệ sinh lưới bảo vệ
- Kiểm tra pin

### Hàng tháng
- Vệ sinh kỹ với dung dịch chuyên dụng
- Kiểm tra antenna

## Những điều nên tránh

❌ Đặt thiết bị nơi ẩm ướt
❌ Để thiết bị dưới ánh nắng trực tiếp
❌ Sử dụng hóa chất mạnh để vệ sinh
❌ Mở âm lượng quá lớn liên tục
❌ Để bụi tích tụ lâu ngày

## Dịch vụ bảo dưỡng tại Audio Tài Lộc

Chúng tôi cung cấp dịch vụ bảo dưỡng chuyên nghiệp:
- Kiểm tra miễn phí
- Vệ sinh toàn bộ hệ thống
- Thay thế linh kiện nếu cần
- Bảo hành sau bảo dưỡng

**Liên hệ ngay để đặt lịch bảo dưỡng!**
`,
      categoryId: baoHanhCategory?.id || kyThuatCategory.id,
      authorId: author.id,
      status: 'PUBLISHED',
      featured: false,
      imageUrl: '/placeholder-product.svg',
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      viewCount: 980,
      likeCount: 76,
      commentCount: 18,
      seoTitle: 'Hướng dẫn bảo dưỡng thiết bị âm thanh - Audio Tài Lộc',
      seoDescription: 'Mẹo bảo dưỡng loa, amply, micro định kỳ. Kéo dài tuổi thọ thiết bị âm thanh hiệu quả.',
      seoKeywords: 'bảo dưỡng loa, bảo dưỡng amply, vệ sinh micro, bảo trì thiết bị âm thanh',
    },
    {
      id: randomUUID(),
      title: 'So sánh Amply tích hợp và Amply rời: Nên chọn loại nào?',
      slug: 'so-sanh-amply-tich-hop-va-amply-roi',
      excerpt: 'Phân tích ưu nhược điểm của amply tích hợp và amply rời để giúp bạn đưa ra lựa chọn phù hợp.',
      content: `
## Amply tích hợp là gì?

Amply tích hợp (Integrated Amplifier) kết hợp Pre-amp và Power-amp trong một thiết bị.

### Ưu điểm
✅ Gọn gàng, tiết kiệm không gian
✅ Dễ sử dụng, ít dây nối
✅ Giá thành hợp lý hơn
✅ Phù hợp gia đình

### Nhược điểm
❌ Khó nâng cấp từng phần
❌ Công suất thường nhỏ hơn
❌ Chất lượng âm thanh kém hơn amply rời cùng tầm giá

## Amply rời là gì?

Amply rời bao gồm Pre-amp (tiền khuếch đại) và Power-amp (công suất) riêng biệt.

### Ưu điểm
✅ Chất lượng âm thanh cao hơn
✅ Dễ nâng cấp từng phần
✅ Công suất lớn hơn
✅ Tản nhiệt tốt hơn

### Nhược điểm
❌ Chiếm nhiều không gian
❌ Nhiều dây nối phức tạp
❌ Giá thành cao hơn

## So sánh chi tiết

| Tiêu chí | Amply tích hợp | Amply rời |
|----------|----------------|-----------|
| Giá | 5-20 triệu | 15-100+ triệu |
| Công suất | 50-300W | 100-1000W+ |
| Không gian | Nhỏ gọn | Cồng kềnh |
| Chất lượng âm | Tốt | Rất tốt |
| Nâng cấp | Khó | Dễ |
| Đối tượng | Gia đình | Chuyên nghiệp |

## Nên chọn loại nào?

### Chọn Amply tích hợp nếu:
- Ngân sách dưới 20 triệu
- Phòng karaoke dưới 30m²
- Sử dụng gia đình thông thường
- Không gian hạn chế

### Chọn Amply rời nếu:
- Ngân sách trên 30 triệu
- Phòng karaoke lớn trên 40m²
- Yêu cầu cao về chất lượng âm thanh
- Muốn nâng cấp dần theo thời gian

## Top sản phẩm đề xuất

### Amply tích hợp
1. Yamaha A-S501 - 12.990.000đ
2. Denon PMA-600NE - 9.990.000đ
3. Marantz PM6007 - 15.990.000đ

### Amply rời
1. Crown XLi2500 - 18.990.000đ
2. QSC GX5 - 25.990.000đ
3. Lab Gruppen IPD 2400 - 45.990.000đ

## Kết luận

Việc chọn amply phụ thuộc vào nhu cầu và ngân sách của bạn. Hãy đến Audio Tài Lộc để được tư vấn và test trực tiếp!
`,
      categoryId: kyThuatCategory.id,
      authorId: author.id,
      status: 'PUBLISHED',
      featured: true,
      imageUrl: '/placeholder-product.svg',
      publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      viewCount: 1560,
      likeCount: 98,
      commentCount: 27,
      seoTitle: 'So sánh Amply tích hợp và Amply rời - Chọn loại nào?',
      seoDescription: 'Phân tích ưu nhược điểm amply tích hợp vs amply rời. Hướng dẫn chọn amply phù hợp nhu cầu.',
      seoKeywords: 'amply tích hợp, amply rời, so sánh amply, chọn amply karaoke',
    },
    {
      id: randomUUID(),
      title: 'Tất tần tật về Subwoofer: Từ A đến Z',
      slug: 'tat-tan-tat-ve-subwoofer',
      excerpt: 'Hiểu rõ về subwoofer - loại loa chuyên dụng cho âm trầm, cách chọn và cách setup hiệu quả.',
      content: `
## Subwoofer là gì?

Subwoofer (loa trầm) là loại loa chuyên dụng để tái tạo dải tần số thấp (20Hz - 200Hz), mang lại cảm giác bass sâu, mạnh mẽ.

## Các loại Subwoofer

### 1. Subwoofer Passive (thụ động)
- Cần amply ngoài để cấp nguồn
- Linh hoạt trong việc phối ghép
- Phù hợp hệ thống cao cấp

### 2. Subwoofer Active (chủ động)
- Có amply tích hợp bên trong
- Dễ cài đặt và sử dụng
- Phổ biến cho gia đình

### 3. Subwoofer Horn
- Sử dụng thiết kế horn loaded
- Hiệu suất cao, bass sâu
- Kích thước lớn

## Thông số quan trọng

### Công suất
- Gia đình: 100-300W
- Phòng nghe nhạc: 300-500W
- Chuyên nghiệp: 500W+

### Kích thước driver
- 8 inch: phòng nhỏ
- 10 inch: phòng trung
- 12 inch: phòng lớn
- 15-18 inch: chuyên nghiệp

### Dải tần số
- Subwoofer tốt: 25Hz - 150Hz
- Subwoofer cao cấp: 20Hz - 200Hz

## Cách setup Subwoofer

### 1. Vị trí đặt
- Góc phòng: bass mạnh nhất
- Dọc tường: bass cân bằng
- Giữa phòng: bass ít bị cộng hưởng

### 2. Cài đặt crossover
- Crossover: điểm cắt tần số với loa chính
- Thông thường: 80Hz - 120Hz
- Điều chỉnh dựa trên thử nghiệm

### 3. Điều chỉnh phase
- Phase 0° hoặc 180°
- Chọn phase cho bass chắc nhất
- Thử nghiệm cả hai để so sánh

### 4. Điều chỉnh volume
- Không để sub quá to
- Bass nên hòa quyện với loa chính
- Nghe không thấy sub là đúng

## Lỗi thường gặp

❌ Đặt sub quá gần góc - bass bị bùm
❌ Crossover quá cao - nghe ra tiếng sub
❌ Volume quá lớn - mất cân bằng
❌ Không căn phase - bass yếu

## Top Subwoofer được đề xuất

### Phân khúc phổ thông (5-15 triệu)
1. Klipsch R-100SW - 8.990.000đ
2. SVS SB-1000 - 12.990.000đ
3. Polk Audio HTS 10 - 6.990.000đ

### Phân khúc cao cấp (15-40 triệu)
1. REL T/9x - 25.990.000đ
2. SVS SB-3000 - 32.990.000đ
3. JL Audio Dominion D108 - 28.990.000đ

## Kết luận

Một subwoofer tốt sẽ nâng tầm trải nghiệm âm thanh của bạn lên một cấp độ mới. Hãy liên hệ Audio Tài Lộc để được tư vấn chi tiết!
`,
      categoryId: kyThuatCategory.id,
      authorId: author.id,
      status: 'PUBLISHED',
      featured: false,
      imageUrl: '/placeholder-product.svg',
      publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      viewCount: 1240,
      likeCount: 87,
      commentCount: 21,
      seoTitle: 'Tất tần tật về Subwoofer - Hướng dẫn từ A đến Z',
      seoDescription: 'Hướng dẫn chi tiết về subwoofer: các loại, cách chọn, cách setup. Top subwoofer được đề xuất.',
      seoKeywords: 'subwoofer, loa sub, loa trầm, setup subwoofer, bass speaker',
    },
    {
      id: randomUUID(),
      title: 'Kinh nghiệm mua thiết bị âm thanh cũ: Những điều cần biết',
      slug: 'kinh-nghiem-mua-thiet-bi-am-thanh-cu',
      excerpt: 'Hướng dẫn cách mua thiết bị âm thanh đã qua sử dụng an toàn, tránh mua phải hàng kém chất lượng.',
      content: `
## Tại sao nên cân nhắc thiết bị cũ?

- Tiết kiệm 30-60% so với mua mới
- Có thể mua được hàng cao cấp với giá phổ thông
- Nhiều thiết bị vintage có chất âm đặc trưng
- Bảo vệ môi trường

## Những điều cần kiểm tra

### 1. Kiểm tra bề ngoài
- Vết trầy xước, móp méo
- Tình trạng các nút bấm
- Màn hình hiển thị (nếu có)
- Các cổng kết nối

### 2. Kiểm tra âm thanh
- Test tất cả các kênh
- Nghe có tiếng rè, ù không
- Volume điều chỉnh có mượt không
- Các tính năng hoạt động đầy đủ

### 3. Kiểm tra điện
- Dây nguồn nguyên vẹn
- Không có mùi khét khi bật
- Đèn báo hoạt động bình thường
- Quạt tản nhiệt chạy êm

### 4. Với loa
- Kiểm tra màng loa
- Kiểm tra foam viền loa
- Test ở nhiều mức volume
- Kiểm tra thùng loa không bị nứt

### 5. Với amply
- Test tất cả nguồn vào
- Kiểm tra relay (tiếng tách khi bật)
- Để chạy 30 phút xem có nóng quá không
- Test cả 2 kênh với loa

## Những điều nên tránh

❌ Mua qua online không được test
❌ Mua hàng không rõ nguồn gốc
❌ Mua hàng đã sửa chữa nhiều lần
❌ Mua hàng quá cũ (trên 15 năm)
❌ Mua hàng không có phụ kiện

## Các nguồn mua uy tín

### Nên mua tại
✅ Cửa hàng có uy tín như Audio Tài Lộc
✅ Người bán có feedback tốt
✅ Có chính sách đổi trả
✅ Được test trực tiếp

### Không nên mua tại
❌ Các group Facebook không xác minh
❌ Người lạ không có thông tin
❌ Hàng xách tay không rõ nguồn

## Mức giá tham khảo

| Thiết bị | Mới | Cũ (70-90%) |
|----------|-----|-------------|
| Amply karaoke | 10 triệu | 5-7 triệu |
| Loa karaoke đôi | 8 triệu | 4-6 triệu |
| Micro không dây | 5 triệu | 2.5-4 triệu |
| Đầu karaoke | 3 triệu | 1.5-2 triệu |

## Dịch vụ tại Audio Tài Lộc

Chúng tôi cung cấp:
- Thiết bị cũ đã qua kiểm tra
- Bảo hành 3-6 tháng
- Hỗ trợ kỹ thuật
- Đổi trả trong 7 ngày

**Liên hệ để được tư vấn thiết bị cũ chất lượng!**
`,
      categoryId: huongDanCategory.id,
      authorId: author.id,
      status: 'PUBLISHED',
      featured: false,
      imageUrl: '/placeholder-product.svg',
      publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      viewCount: 890,
      likeCount: 65,
      commentCount: 15,
      seoTitle: 'Kinh nghiệm mua thiết bị âm thanh cũ an toàn',
      seoDescription: 'Hướng dẫn mua thiết bị âm thanh đã qua sử dụng. Cách kiểm tra, những điều cần tránh.',
      seoKeywords: 'thiết bị âm thanh cũ, mua loa cũ, mua amply cũ, second hand audio',
    },
  ];

  for (const article of extraArticles) {
    const existingArticle = await prisma.blog_articles.findFirst({
      where: { slug: article.slug },
    });

    if (existingArticle) {
      console.log(`✓ Article "${article.title}" already exists`);
    } else {
      await prisma.blog_articles.create({
        data: {
          ...article,
          createdAt: article.publishedAt,
          updatedAt: article.publishedAt,
        },
      });
      console.log(`✓ Created article: ${article.title}`);
    }
  }

  console.log('✅ Extra blog articles seeding completed!');
}

seedExtraBlogArticles()
  .catch((error) => {
    console.error('❌ Error seeding extra blog articles:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
