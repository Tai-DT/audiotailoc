import { prisma } from './seed-client';
import { randomUUID } from 'crypto';

async function seedBlog() {
  console.log('🌱 Seeding blog data...');

  // Get or create an author (admin user)
  let author = await prisma.users.findFirst({
    where: { role: 'ADMIN' },
  });

  if (!author) {
    // Create a default admin user for blog posts
    author = await prisma.users.create({
      data: {
        id: randomUUID(),
        email: 'admin@audiotailoc.com',
        password: '$2b$10$dummyHashForSeedData', // This is just for seeding
        name: 'Audio Tài Lộc Admin',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('✓ Created admin user for blog posts');
  }

  // Create blog categories
  const categories = [
    {
      name: 'Hướng dẫn mua hàng',
      slug: 'huong-dan-mua-hang',
      description: 'Hướng dẫn chi tiết về quy trình mua hàng và thanh toán',
      isActive: true,
    },
    {
      name: 'Chính sách',
      slug: 'chinh-sach',
      description: 'Các chính sách về bảo hành, đổi trả và giao hàng',
      isActive: true,
    },
    {
      name: 'Kỹ thuật',
      slug: 'ky-thuat',
      description: 'Kiến thức kỹ thuật về âm thanh và thiết bị',
      isActive: true,
    },
    {
      name: 'Thanh toán',
      slug: 'thanh-toan',
      description: 'Hướng dẫn các phương thức thanh toán',
      isActive: true,
    },
    {
      name: 'Giao hàng',
      slug: 'giao-hang',
      description: 'Thông tin về giao hàng và vận chuyển',
      isActive: true,
    },
    {
      name: 'Bảo hành',
      slug: 'bao-hanh',
      description: 'Chính sách và quy trình bảo hành sản phẩm',
      isActive: true,
    },
  ];

  const createdCategories = [];
  for (const category of categories) {
    const existingCategory = await prisma.blog_categories.findFirst({
      where: { slug: category.slug },
    });

    if (existingCategory) {
      console.log(`✓ Category "${category.name}" already exists`);
      createdCategories.push(existingCategory);
    } else {
      const created = await prisma.blog_categories.create({
        data: {
          ...category,
          id: randomUUID(),
          updatedAt: new Date(),
        },
      });
      console.log(`✓ Created category: ${created.name}`);
      createdCategories.push(created);
    }
  }

  // Create blog articles
  const articles = [
    {
      id: randomUUID(),
      title: 'Hướng dẫn chọn mua amply karaoke gia đình',
      slug: 'huong-dan-chon-mua-amply-karaoke-gia-dinh',
      excerpt: 'Những tiêu chí quan trọng khi lựa chọn amply karaoke cho gia đình',
      content: `
## Giới thiệu

Amply karaoke là thiết bị không thể thiếu trong một dàn karaoke gia đình hoàn hảo. Việc lựa chọn một chiếc amply phù hợp sẽ quyết định đến chất lượng âm thanh và trải nghiệm ca hát của bạn.

## Các tiêu chí lựa chọn

### 1. Công suất
Công suất amply cần phù hợp với diện tích phòng và loa bạn sử dụng. Thường thì:
- Phòng dưới 20m²: 150-200W
- Phòng 20-40m²: 200-400W
- Phòng trên 40m²: 400W trở lên

### 2. Số kênh
- Amply 2 kênh: phù hợp cho phòng nhỏ
- Amply 4 kênh: cho không gian lớn hơn
- Amply đa kênh: cho hệ thống chuyên nghiệp

### 3. Tính năng
- Echo, Reverb điều chỉnh được
- Chỉnh âm bass, treble, middle
- Kết nối Bluetooth, USB
- Hỗ trợ nhiều nguồn âm thanh

## Khuyến nghị

Hãy đến Audio Tài Lộc để được tư vấn và trải nghiệm trực tiếp các sản phẩm amply karaoke chất lượng cao từ các thương hiệu uy tín.
`,
      categoryId: createdCategories[0].id,
      authorId: author.id,
      status: 'PUBLISHED',
      imageUrl: 'https://placehold.co/800x600/png?text=Amply+Karaoke',
      publishedAt: new Date(),
      viewCount: 150,
      likeCount: 25,
      commentCount: 8,
      seoTitle: 'Hướng dẫn chọn mua Amply Karaoke gia đình chất lượng',
      seoDescription: 'Tìm hiểu các tiêu chí quan trọng khi lựa chọn amply karaoke cho gia đình. Tư vấn miễn phí tại Audio Tài Lộc.',
      seoKeywords: 'amply karaoke, amply gia đình, chọn mua amply, thiết bị karaoke',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: randomUUID(),
      title: 'Chính sách bảo hành sản phẩm tại Audio Tài Lộc',
      slug: 'chinh-sach-bao-hanh-san-pham',
      excerpt: 'Thông tin chi tiết về chính sách bảo hành và hỗ trợ sau bán hàng',
      content: `
## Chính sách bảo hành

Audio Tài Lộc cam kết bảo hành chính hãng cho tất cả sản phẩm được bán ra.

## Thời gian bảo hành

- **Thiết bị âm thanh chính**: 12-24 tháng
- **Phụ kiện**: 6-12 tháng
- **Linh kiện điện tử**: 12 tháng

## Điều kiện bảo hành

1. Sản phẩm còn trong thời hạn bảo hành
2. Có đầy đủ tem bảo hành, hóa đơn mua hàng
3. Không có dấu hiệu tác động vật lý từ bên ngoài
4. Không tự ý sửa chữa

## Quy trình bảo hành

1. Liên hệ hotline hoặc mang sản phẩm đến cửa hàng
2. Kiểm tra tình trạng và xác nhận bảo hành
3. Sửa chữa hoặc thay thế trong 3-7 ngày làm việc
4. Giao sản phẩm đã sửa chữa cho khách hàng

## Liên hệ

- **Hotline**: 1900 xxxx
- **Email**: support@audiotailoc.com
- **Địa chỉ**: 123 Đường ABC, Quận 1, TP.HCM
`,
      categoryId: createdCategories[1].id, // Chính sách
      authorId: author.id,
      status: 'PUBLISHED',
      imageUrl: 'https://placehold.co/800x600/png?text=Bao+Hanh',
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      viewCount: 320,
      likeCount: 45,
      commentCount: 12,
      seoTitle: 'Chính sách bảo hành sản phẩm - Audio Tài Lộc',
      seoDescription: 'Thông tin chi tiết về chính sách bảo hành và hỗ trợ sau bán hàng tại Audio Tài Lộc. Cam kết bảo hành chính hãng.',
      seoKeywords: 'bảo hành, chính sách bảo hành, hỗ trợ khách hàng, audio tài lộc',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: randomUUID(),
      title: 'Cách setup dàn karaoke gia đình hoàn hảo',
      slug: 'cach-setup-dan-karaoke-gia-dinh',
      excerpt: 'Hướng dẫn từng bước setup dàn karaoke chuyên nghiệp tại nhà',
      content: `
## Giới thiệu

Setup một dàn karaoke gia đình không khó nhưng cần có kiến thức để đạt được chất lượng âm thanh tốt nhất.

## Các bước setup

### Bước 1: Chuẩn bị thiết bị
- Amply karaoke
- Loa
- Micro không dây
- Đầu karaoke hoặc Android TV Box
- Dây kết nối

### Bước 2: Kết nối thiết bị
1. Kết nối loa với amply
2. Kết nối đầu karaoke với amply
3. Kết nối micro với amply
4. Kết nối amply với TV

### Bước 3: Điều chỉnh âm thanh
- Điều chỉnh âm lượng phù hợp
- Chỉnh echo, reverb
- Cân bằng âm bass, treble

### Bước 4: Kiểm tra
- Test từng thiết bị
- Kiểm tra độ trễ
- Điều chỉnh để đạt âm thanh cân bằng

## Lưu ý

- Đặt loa đúng vị trí
- Không để âm lượng quá lớn
- Bảo dưỡng thiết bị định kỳ

## Tư vấn miễn phí

Liên hệ Audio Tài Lộc để được hỗ trợ setup tận nhà hoàn toàn miễn phí!
`,
      categoryId: createdCategories[2].id, // Kỹ thuật
      authorId: author.id,
      status: 'PUBLISHED',
      imageUrl: 'https://placehold.co/800x600/png?text=Setup+Karaoke',
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      viewCount: 280,
      likeCount: 38,
      commentCount: 15,
      seoTitle: 'Hướng dẫn setup dàn karaoke gia đình chuyên nghiệp',
      seoDescription: 'Hướng dẫn chi tiết từng bước setup dàn karaoke tại nhà. Tư vấn và hỗ trợ miễn phí tại Audio Tài Lộc.',
      seoKeywords: 'setup karaoke, lắp đặt karaoke, dàn karaoke gia đình, hướng dẫn karaoke',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: randomUUID(),
      title: 'Các phương thức thanh toán tại Audio Tài Lộc',
      slug: 'cac-phuong-thuc-thanh-toan',
      excerpt: 'Thông tin về các hình thức thanh toán được hỗ trợ',
      content: `
## Phương thức thanh toán

Audio Tài Lộc hỗ trợ nhiều hình thức thanh toán tiện lợi cho khách hàng.

### 1. Tiền mặt
- Thanh toán trực tiếp tại cửa hàng
- Thanh toán khi nhận hàng (COD)

### 2. Chuyển khoản ngân hàng
**Thông tin tài khoản:**
- Ngân hàng: Vietcombank
- Chi nhánh: TP.HCM
- Số tài khoản: xxxx xxxx xxxx
- Chủ tài khoản: CÔNG TY AUDIO TÀI LỘC

### 3. Thẻ tín dụng/ghi nợ
- Visa, Master Card
- JCB, American Express
- Thẻ nội địa

### 4. Ví điện tử
- MoMo
- ZaloPay
- VNPay
- ShopeePay

### 5. Trả góp
- Trả góp qua thẻ tín dụng
- Trả góp qua công ty tài chính
- Lãi suất 0% cho đơn hàng từ 5 triệu

## Lưu ý
- Giữ lại biên lai thanh toán
- Kiểm tra thông tin trước khi chuyển khoản
- Liên hệ với chúng tôi nếu có vấn đề
`,
      categoryId: createdCategories[3].id, // Thanh toán
      authorId: author.id,
      status: 'PUBLISHED',
      imageUrl: 'https://placehold.co/800x600/png?text=Thanh+Toan',
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      viewCount: 410,
      likeCount: 52,
      commentCount: 20,
      seoTitle: 'Các phương thức thanh toán - Audio Tài Lộc',
      seoDescription: 'Thông tin về các hình thức thanh toán được hỗ trợ tại Audio Tài Lộc. Hỗ trợ đa dạng phương thức thanh toán.',
      seoKeywords: 'thanh toán, phương thức thanh toán, trả góp, chuyển khoản',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: randomUUID(),
      title: 'So sánh loa karaoke thương hiệu Nhật và Hàn Quốc',
      slug: 'so-sanh-loa-karaoke-nhat-han',
      excerpt: 'Phân tích ưu nhược điểm của loa Nhật và loa Hàn Quốc',
      content: `
## Giới thiệu

Loa karaoke Nhật Bản và Hàn Quốc đều là những dòng sản phẩm chất lượng cao được ưa chuộng tại Việt Nam.

## Loa Nhật Bản

### Ưu điểm
- Chất lượng âm thanh tự nhiên, trung thực
- Độ bền cao, ít hỏng hóc
- Thiết kế sang trọng, tinh tế
- Công nghệ tiên tiến

### Nhược điểm
- Giá thành cao
- Bass không mạnh bằng loa Hàn

### Thương hiệu nổi tiếng
- JBL
- Sony
- Yamaha
- Denon

## Loa Hàn Quốc

### Ưu điểm
- Bass mạnh mẽ, ấm
- Giá cả phải chăng hơn
- Thiết kế hiện đại
- Phù hợp với nhạc Việt

### Nhược điểm
- Độ bền không bằng loa Nhật
- Âm thanh đôi khi bị "màu mè"

### Thương hiệu nổi tiếng
- Bose
- BMB
- Paramax
- Acnos

## Kết luận

Tùy vào nhu cầu và ngân sách mà bạn có thể lựa chọn loa phù hợp. Đến Audio Tài Lộc để được tư vấn và trải nghiệm trực tiếp!
`,
      categoryId: createdCategories[2].id, // Kỹ thuật
      authorId: author.id,
      status: 'PUBLISHED',
      imageUrl: 'https://placehold.co/800x600/png?text=Loa+Karaoke',
      publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      viewCount: 520,
      likeCount: 68,
      commentCount: 25,
      seoTitle: 'So sánh loa karaoke Nhật Bản và Hàn Quốc',
      seoDescription: 'Phân tích chi tiết ưu nhược điểm của loa karaoke Nhật và Hàn. Tư vấn chọn loa phù hợp tại Audio Tài Lộc.',
      seoKeywords: 'loa karaoke, loa nhật, loa hàn, so sánh loa, chọn loa karaoke',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const article of articles) {
    const existingArticle = await prisma.blog_articles.findFirst({
      where: { slug: article.slug },
    });

    if (existingArticle) {
      console.log(`✓ Article "${article.title}" already exists`);
    } else {
      const created = await prisma.blog_articles.create({
        data: {
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          categoryId: article.categoryId,
          authorId: article.authorId,
          status: article.status,
          imageUrl: article.imageUrl,
          publishedAt: article.publishedAt,
          viewCount: article.viewCount,
          likeCount: article.likeCount,
          commentCount: article.commentCount,
          seoTitle: article.seoTitle,
          seoDescription: article.seoDescription,
          seoKeywords: article.seoKeywords,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
        },
      });
      console.log(`✓ Created article: ${created.title}`);
    }
  }

  console.log('✅ Blog seeding completed!');
}

seedBlog()
  .catch((error) => {
    console.error('❌ Error seeding blog data:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
