import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { prisma } from './seed-client';
import { v4 as uuidv4 } from 'uuid';

async function main() {
    console.log('🚀 Starting to seed real data...');
    console.log('📍 Current directory:', process.cwd());
    console.log('🔗 DATABASE_URL exists:', !!process.env.DATABASE_URL);
    if (process.env.DATABASE_URL) {
        console.log('🔗 DATABASE_URL (obfuscated):', process.env.DATABASE_URL.substring(0, 20) + '...');
    }

    // 1. Identify and fetch required existing data
    const admin = await prisma.users.findFirst({
        where: { role: 'ADMIN' },
    });

    if (!admin) {
        console.log('❌ Admin user not found. Please create an admin user first.');
        return;
    }

    const authorId = admin.id;

    // 2. CLEANING PHASE (Delete sensitive tables as requested, excluding products, categories, banners)
    console.log('🧹 Cleaning old data...');

    // Order of deletion is important for foreign keys
    await prisma.blog_comments.deleteMany({});
    await prisma.blog_articles.deleteMany({});
    await prisma.blog_categories.deleteMany({});

    await prisma.service_reviews.deleteMany({});
    await prisma.service_booking_items.deleteMany({});
    await prisma.service_bookings.deleteMany({});
    await prisma.services.deleteMany({});
    await prisma.service_types.deleteMany({});

    await prisma.campaign_clicks.deleteMany({});
    await prisma.campaign_opens.deleteMany({});
    await prisma.campaign_recipients.deleteMany({});
    await prisma.email_logs.deleteMany({});
    await prisma.campaigns.deleteMany({});
    await prisma.email_templates.deleteMany({});
    await prisma.loyalty_rewards.deleteMany({});
    await prisma.software.deleteMany({});

    await prisma.projects.deleteMany({});
    await prisma.policies.deleteMany({});
    await prisma.promotions_categories.deleteMany({});
    await prisma.promotions_products.deleteMany({});
    await prisma.promotions.deleteMany({});
    await prisma.faqs.deleteMany({});
    await prisma.testimonials.deleteMany({});
    await prisma.technicians.deleteMany({});
    await prisma.site_stats.deleteMany({});
    await prisma.site_settings.deleteMany({});

    console.log('✅ Cleaning completed.');

    // 3. SEEDING BLOG DATA
    console.log('📝 Seeding Blog Categories...');
    const blogCats = [
        { name: 'Kiến Thức Âm Thanh', slug: 'kien-thuc-am-thanh', description: 'Chia sẻ kiến thức chuyên sâu về thiết bị âm thanh và kỹ thuật phối ghép.' },
        { name: 'Review Sản Phẩm', slug: 'review-san-pham', description: 'Đánh giá chi tiết các thiết bị âm thanh mới nhất trên thị trường.' },
        { name: 'Tin Tức Audio Tài Lộc', slug: 'tin-tuc-audio-tai-loc', description: 'Cập nhật các chương trình khuyến mãi và sự kiện mới nhất.' },
        { name: 'Dự Án Tiêu Biểu', slug: 'du-an-tieu-bieu', description: 'Hình ảnh thực tế các công trình âm thanh chúng tôi đã thực hiện.' },
    ];

    const createdBlogCats = [];
    for (const cat of blogCats) {
        const created = await prisma.blog_categories.create({
            data: {
                id: uuidv4(),
                ...cat,
                updatedAt: new Date(),
            },
        });
        createdBlogCats.push(created);
    }

    console.log('📝 Seeding Blog Articles...');
    const articles = [
        {
            title: 'Bật mí 5 bí kíp phối ghép dàn karaoke gia đình chuẩn như quán',
            slug: 'bi-kip-phoi-ghep-dan-karaoke-gia-dinh',
            excerpt: 'Để có một dàn karaoke hay, không chỉ cần thiết bị đắt tiền mà quan trọng nhất là sự phối ghép ăn ý giữa các thành phần.',
            content: `
## 1. Công suất Amply/Cục đẩy phải tương thích với Loa
Công suất lý tưởng của cục đẩy công suất thường gấp 1.5 đến 2 lần công suất (RMS) của loa. Ví dụ loa 300W thì cục đẩy nên tầm 600W.

## 2. Lựa chọn Micro chất lượng
Micro là "đầu vào" của âm thanh. Một cặp micro không dây chống hú tốt sẽ giúp tiếng hát bay bổng và không bị gián đoạn.

## 3. Chống hú (Feedback) hiệu quả
Sử dụng vang số (Digital Processor) để cắt dải tần gây hú mà không làm mất đi độ chi tiết của âm thanh.

## 4. Vị trí đặt loa
Nên đặt loa cách mặt đất ít nhất 2m, nghiêng góc 15 độ về phía người nghe để đạt được độ phủ âm tốt nhất.

## 5. Dây dẫn và kết nối
Đừng bỏ qua dây loa và dây tín hiệu. Dây đồng nguyên chất giúp tín hiệu truyền tải trung thực hơn.
      `,
            categoryId: createdBlogCats[0].id,
            imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop',
        },
        {
            title: 'Review chi tiết loa JBL KI510 - Sự lựa chọn số 1 cho phòng hát 20m2',
            slug: 'review-loa-jbl-ki510',
            excerpt: 'JBL KI510 là mẫu loa 3 đường tiếng đẳng cấp từ thương hiệu Mỹ, mang lại chất âm tinh tế và mạnh mẽ.',
            content: `
Loa JBL Ki510 là dòng loa full 3 đường tiếng được thiết kế chuyên dụng cho các phòng karaoke gia đình và kinh doanh chuyên nghiệp.

### Thiết kế hiện đại
Với mặt trước là lưới thép chắc chắn, logo JBL phát sáng khi có nhạc, Ki510 mang lại vẻ sang trọng cho không gian nội thất.

### Chất âm đẳng cấp
- **Loa Bass 25cm**: Cho âm trầm sâu, chắc và uy lực.
- **Loa Mid**: Giúp tiếng ca trong trẻo, rõ nét.
- **Loa Treble**: Xử lý các dải cao mịn màng, không bị chói gắt.

### Thông số kỹ thuật
- Công suất (RMS/Peak): 350W / 1400W
- Trở kháng: 8 Ohms
- Dải tần: 58Hz - 20kHz
      `,
            categoryId: createdBlogCats[1].id,
            imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=2070&auto=format&fit=crop',
        }
    ];

    for (const article of articles) {
        await prisma.blog_articles.create({
            data: {
                id: uuidv4(),
                ...article,
                authorId,
                status: 'PUBLISHED',
                publishedAt: new Date(),
                updatedAt: new Date(),
                featured: true,
            },
        });
    }

    // 4. SEEDING SERVICES
    console.log('🛠️ Seeding Service Types & Services...');
    const serviceTypes = [
        { name: 'Lắp Đặt & Setup', slug: 'lap-dat-setup', icon: 'Settings', color: '#ff0000' },
        { name: 'Dịch Vụ Kỹ Thuật', slug: 'dich-vu-ky-thuat', icon: 'Wrench', color: '#ffd700' },
    ];

    for (const type of serviceTypes) {
        const createdType = await prisma.service_types.create({
            data: {
                id: uuidv4(),
                ...type,
                updatedAt: new Date(),
            },
        });

        if (type.slug === 'lap-dat-setup') {
            await prisma.services.create({
                data: {
                    id: uuidv4(),
                    name: 'Lắp đặt dàn karaoke gia đình',
                    slug: 'lap-dat-karaoke-gia-dinh',
                    description: 'Cung cấp giải pháp âm thanh karaoke chuyên nghiệp cho gia đình, từ tư vấn thiết bị đến lắp đặt tận nơi.',
                    shortDescription: 'Lắp đặt karaoke gia đình chuyên nghiệp',
                    price: BigInt(50000000), // Original price 500k as base service fee? or full package? Let's say it's service fee 500k VNĐ.
                    typeId: createdType.id,
                    isActive: true,
                    isFeatured: true,
                    duration: 120,
                    updatedAt: new Date(),
                }
            });
        }
    }

    // 5. SEEDING PROJECTS
    console.log('🏗️ Seeding Projects...');
    const projects = [
        {
            name: 'Hệ thống âm thanh Cafe Rooftop Chill - Quận 1',
            slug: 'cafe-rooftop-chill-q1',
            client: 'The Chill Group',
            category: 'Âm thanh Cafe/Bar',
            description: 'Thi công hệ thống âm thanh phân vùng cho không gian Rooftop ngoài trời, đảm bảo âm thanh dàn trải đều và chịu được thời tiết khắc nghiệt.',
            content: 'Dự án sử dụng loa treo tường chống nước Bose Freespace và hệ thống đẩy công suất Crown.',
            thumbnailImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop',
            status: 'PUBLISHED',
            isActive: true,
            isFeatured: true,
            userId: authorId,
            updatedAt: new Date(),
        },
        {
            name: 'Phòng Karaoke VIP Biệt thự Vinhomes Riverside',
            slug: 'karaoke-vip-vinhomes-riverside',
            client: 'Mr. Tuấn',
            category: 'Karaoke Gia Đình Cao Cấp',
            description: 'Thiết kế và lắp đặt hệ thống âm thanh Hi-end cho phòng giải trí gia đình với diện tích 40m2.',
            content: 'Cấu hình sử dụng loa JBL Ki512, Vang số JBL KX180A, và Micro Shure SLXD.',
            thumbnailImage: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2070&auto=format&fit=crop',
            status: 'PUBLISHED',
            isActive: true,
            isFeatured: true,
            userId: authorId,
            updatedAt: new Date(),
        }
    ];

    for (const project of projects) {
        await prisma.projects.create({
            data: {
                id: uuidv4(),
                ...project,
            }
        });
    }

    // 6. SEEDING POLICIES
    console.log('📜 Seeding Policies...');
    const policies = [
        {
            title: 'Chính sách bảo hành vàng',
            slug: 'warranty',
            type: 'WARRANTY',
            contentHtml: `
<div class="space-y-8">
  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">1. Thời hạn bảo hành</h3>
    <p>Tất cả các thiết bị âm thanh mua tại <strong>Audio Tài Lộc</strong> đều được hưởng chế độ bảo hành chính hãng. Thời gian bảo hành cụ thể:</p>
    <ul class="list-disc pl-6 mt-2 space-y-1">
      <li><strong>Loa Karaoke (JBL, CAF, E3):</strong> Bảo hành 24 tháng cho củ loa, 12 tháng cho thùng loa.</li>
      <li><strong>Cục đẩy công suất & Amply:</strong> Bảo hành 24 tháng.</li>
      <li><strong>Vang số & Micro:</strong> Bảo hành 12 tháng.</li>
      <li><strong>Phụ kiện (Dây cáp, Jack):</strong> Bảo hành 03 tháng (lỗi đổi mới).</li>
    </ul>
  </section>

  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">2. Điều kiện được bảo hành miễn phí</h3>
    <ul class="list-disc pl-6 space-y-2">
      <li>Sản phẩm còn trong thời hạn bảo hành tính từ ngày mua hàng.</li>
      <li>Sản phẩm có đầy đủ tem bảo hành của Audio Tài Lộc và tem niêm phong của nhà sản xuất (không bị rách rời, tẩy xóa).</li>
      <li>Lỗi được xác định là do kỹ thuật của nhà sản xuất.</li>
      <li>Sản phẩm không có dấu hiệu can thiệp của bên thứ ba hoặc tự ý tháo mở.</li>
    </ul>
  </section>

  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">3. Các trường hợp từ chối bảo hành</h3>
    <ul class="list-disc pl-6 space-y-2">
      <li>Sản phẩm hết hạn bảo hành hoặc mất tem niêm phong.</li>
      <li>Hư hỏng do thiên tai, hỏa hoạn, sét đánh, lũ lụt hoặc do nguồn điện không ổn định.</li>
      <li>Sản phẩm bị biến dạng, rơi vỡ, móp méo, trầy xước nặng do tác động vật lý.</li>
      <li>Sử dụng sai quy cách trong sách hướng dẫn (ví dụ: cắm sai nguồn điện, để nước vào loa).</li>
      <li>Loa bị cháy côn (Coil) do sử dụng quá công suất hoặc để hú rít micro kéo dài (Lỗi vận hành).</li>
    </ul>
  </section>

  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">4. Quy trình bảo hành chuyên nghiệp</h3>
    <p>Khi gặp sự cố, quý khách thực hiện theo các bước sau:</p>
    <ol class="list-decimal pl-6 mt-2 space-y-2">
      <li>Liên hệ Hotline kỹ thuật: <strong>0768 426 262</strong> để được hướng dẫn xử lý tại chỗ.</li>
      <li>Nếu không khắc phục được, quý khách mang sản phẩm hoặc gửi chuyển phát đến Showroom của Audio Tài Lộc.</li>
      <li>Chúng tôi sẽ tiếp nhận, kiểm tra và thông báo tình trạng bảo hành trong vòng 24h - 48h làm việc.</li>
      <li>Sản phẩm sau khi bảo hành sẽ được kiểm tra kỹ thuật (QC) trước khi bàn giao lại cho khách hàng.</li>
    </ul>
  </section>

  <div class="p-6 bg-primary/5 border border-primary/20 rounded-2xl italic">
    <strong>Lưu ý:</strong> Audio Tài Lộc hỗ trợ cho mượn thiết bị thay thế tương đương trong thời gian chờ bảo hành đối với các dự án kinh doanh quan trọng.
  </div>
</div>
            `,
            summary: 'Chế độ bảo hành Vàng lên đến 24 tháng cho các thiết bị âm thanh chính hãng tại Audio Tài Lộc.',
        },
        {
            title: 'Chính sách vận chuyển & Lắp đặt',
            slug: 'shipping',
            type: 'SHIPPING',
            contentHtml: `
<div class="space-y-8">
  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">1. Phạm vi giao hàng</h3>
    <p>Audio Tài Lộc cung cấp dịch vụ giao hàng và lắp đặt trên toàn quốc thông qua đội ngũ kỹ thuật riêng và các đối tác vận chuyển uy tín (Viettel Post, GHTK, Chành xe chuyên dụng).</p>
  </section>

  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">2. Phí vận chuyển</h3>
    <ul class="list-disc pl-6 space-y-2">
      <li><strong>Khu vực TP.HCM:</strong> Miễn phí vận chuyển cho tất cả đơn hàng có giá trị từ 5.000.000 VNĐ trở lên.</li>
      <li><strong>Các tỉnh thành khác:</strong> Phí vận chuyển được tính dựa trên trọng lượng hàng hóa và khoảng cách địa lý theo biểu phí của đơn vị vận chuyển.</li>
      <li><strong>Lắp đặt tận nơi:</strong> Miễn phí công lắp đặt và cân chỉnh (Tuning) cho các bộ dàn karaoke trọn gói trong bán kính 30km.</li>
    </ul>
  </section>

  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">3. Thời gian giao hàng</h3>
    <ul class="list-disc pl-6 space-y-2">
      <li><strong>Nội thành TP.HCM:</strong> Giao hàng siêu tốc trong vòng 2h - 4h làm việc.</li>
      <li><strong>Khu vực miền Tây & Đông Nam Bộ:</strong> Giao hàng trong vòng 24h - 48h.</li>
      <li><strong>Khu vực miền Trung & miền Bắc:</strong> Giao hàng từ 3 - 5 ngày làm việc.</li>
    </ul>
  </section>

  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">4. Kiểm tra và Nhận hàng</h3>
    <p>Để đảm bảo quyền lợi, quý khách vui lòng kiểm tra kỹ các hạng mục sau khi nhận hàng:</p>
    <ul class="list-disc pl-6 mt-2 space-y-1">
      <li>Sản phẩm còn nguyên đai, nguyên kiện, đủ băng keo niêm phong.</li>
      <li>Đúng mã hàng và số lượng đã đặt.</li>
      <li>Sản phẩm không bị móp méo, trầy xước do vận chuyển.</li>
    </ul>
    <p class="mt-4 italic text-accent">Trường hợp hàng hóa bị hư hỏng do vận chuyển, quý khách vui lòng từ chối nhận hàng và liên hệ ngay với Audio Tài Lộc để được đổi mới sản phẩm.</p>
  </section>

  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">5. Lưu ý lắp đặt</h3>
    <p>Đối với khách hàng tự lắp đặt, đội ngũ kỹ thuật của chúng tôi sẽ hỗ trợ hướng dẫn qua Video Call. Tuy nhiên, chúng tôi khuyến khích khách hàng sử dụng dịch vụ lắp đặt của Audio Tài Lộc để đảm bảo thiết bị được cân chỉnh đúng thông số, mang lại chất âm tốt nhất và tránh hỏng hóc do đấu nối sai cách.</p>
  </section>
</div>
            `,
            summary: 'Dịch vụ giao hàng siêu tốc và lắp đặt, cân chỉnh âm thanh chuyên nghiệp tận nơi trên toàn quốc.',
        }
    ];

    for (const policy of policies) {
        await prisma.policies.create({
            data: {
                id: uuidv4(),
                ...policy,
                updatedAt: new Date(),
            }
        });
    }

    // 7. SEEDING FAQS
    console.log('❓ Seeding FAQs...');
    const faqs = [
        { question: 'Audio Tài Lộc có hỗ trợ lắp đặt tại nhà không?', answer: 'Có, chúng tôi hỗ trợ lắp đặt và cân chỉnh âm thanh tận nhà miễn phí trong bán kính 20km tại TP.HCM cho các đơn hàng dàn máy.', category: 'Hỗ trợ kỹ thuật' },
        { question: 'Tôi có thể mua trả góp không?', answer: 'Quý khách có thể trả góp qua thẻ tín dụng (lãi suất 0%) hoặc qua các công ty tài chính như HD Saison, Home Credit.', category: 'Thanh toán' },
        { question: 'Làm sao để biết sản phẩm là chính hãng?', answer: 'Các sản phẩm tại Audio Tài Lộc đều có tem chống hàng giả của Bộ Công An, tem nhà phân phối và thẻ bảo hành chính hãng kèm theo.', category: 'Sản phẩm' },
    ];

    for (const faq of faqs) {
        await prisma.faqs.create({
            data: {
                id: uuidv4(),
                ...faq,
                updatedAt: new Date(),
            }
        });
    }

    // 8. SITE SETTINGS & STATS
    console.log('⚙️ Seeding Site Settings...');
    const settings = [
        { key: 'site_name', value: 'Audio Tài Lộc' },
        { key: 'site_slogan', value: 'Âm thanh từ Tâm - Nâng tầm giải trí' },
        { key: 'contact_phone', value: '0933.245.xxx' },
        { key: 'contact_email', value: 'contact@audiotailoc.com' },
        { key: 'contact_address', value: '123 Đường Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM' },
        { key: 'facebook_url', value: 'https://facebook.com/audiotailoc' },
        { key: 'youtube_url', value: 'https://youtube.com/audiotailoc' },
    ];

    for (const setting of settings) {
        await prisma.site_settings.create({
            data: {
                id: uuidv4(),
                ...setting,
                updatedAt: new Date(),
            }
        });
    }

    const stats = [
        { key: 'years_experience', value: '10+', label: 'Năm kinh nghiệm', icon: 'Award', displayOrder: 1 },
        { key: 'happy_customers', value: '5000+', label: 'Khách hàng hài lòng', icon: 'Users', displayOrder: 2 },
        { key: 'projects_completed', value: '800+', label: 'Dự án đã thi công', icon: 'Briefcase', displayOrder: 3 },
        { key: 'warranty_years', value: '02', label: 'Năm bảo hành vàng', icon: 'CheckCircle', displayOrder: 4 },
    ];

    for (const stat of stats) {
        await prisma.site_stats.create({
            data: {
                id: uuidv4(),
                ...stat,
                updatedAt: new Date(),
            }
        });
    }

    // 9. SEEDING TESTIMONIALS
    console.log('💬 Seeding Testimonials...');
    const testimonials = [
        { name: 'Anh Hùng', position: 'Chủ biệt thự', company: 'Vinhomes Central Park', content: 'Tôi rất hài lòng với dàn karaoke mà Audio Tài Lộc lắp đặt. Âm thanh cực kỳ trong trẻo, bass sâu và mạnh mẽ. Nhân viên kỹ thuật hỗ trợ rất nhiệt tình.', avatarUrl: 'https://i.pravatar.cc/150?u=hung', rating: 5, displayOrder: 1 },
        { name: 'Chị Mai', position: 'Quản lý', company: 'Cafe Oasis', content: 'Giải pháp âm thanh cho quán cafe sân vườn của tôi rất tuyệt vời. Âm thanh dàn trải đều, khách hàng rất thích không gian âm nhạc tại đây.', avatarUrl: 'https://i.pravatar.cc/150?u=mai', rating: 5, displayOrder: 2 },
        { name: 'Anh Nam', position: 'Giám đốc IT', company: 'FPT Software', content: 'Hệ thống âm thanh hội thảo hoạt động rất ổn định, micro bắt sóng xa và tiếng rất trung thực. Sẽ tiếp tục ủng hộ trong các dự án tới.', avatarUrl: 'https://i.pravatar.cc/150?u=nam', rating: 5, displayOrder: 3 },
    ];

    for (const t of testimonials) {
        await prisma.testimonials.create({
            data: {
                id: uuidv4(),
                ...t,
                updatedAt: new Date(),
            }
        });
    }

    // 10. SEEDING TECHNICIANS
    console.log('👨‍🔧 Seeding Technicians...');
    const technicians = [
        { name: 'Nguyễn Văn Thành', email: 'thanh.nv@audiotailoc.com', phone: '0901234567', specialties: 'Lắp đặt dàn Karaoke, Cân chỉnh vang số' },
        { name: 'Lê Hoàng Nam', email: 'nam.lh@audiotailoc.com', phone: '0907654321', specialties: 'Âm thanh hội trường, Sửa chữa thiết bị' },
        { name: 'Trần Minh Quân', email: 'quan.tm@audiotailoc.com', phone: '0909998887', specialties: 'Thiết kế hệ thống âm thanh thông minh' },
    ];

    for (const tech of technicians) {
        await prisma.technicians.create({
            data: {
                id: uuidv4(),
                ...tech,
            }
        });
    }

    // 11. SEEDING PROMOTIONS
    console.log('🎟️ Seeding Promotions...');
    const promotions = [
        { code: 'ATLKHAITRUONG', name: 'Mừng Khai Trương - Giảm 10%', description: 'Giảm giá 10% cho tất cả đơn hàng nhân dịp khai trương showroom mới.', type: 'PERCENTAGE', value: 10, isActive: true, updatedAt: new Date() },
        { code: 'QUOCTEPHUNU', name: 'Chào mừng 8/3', description: 'Tặng Voucher 500k cho đơn hàng từ 10 triệu đồng.', type: 'FIXED', value: 500000, isActive: true, updatedAt: new Date() },
    ];

    for (const promo of promotions) {
        await prisma.promotions.create({
            data: {
                id: uuidv4(),
                ...promo,
            }
        });
    }

    // 12. SEEDING SOFTWARE
    console.log('💾 Seeding Software...');
    const software = [
        { name: 'Phần mềm căn chỉnh vang số JBL KX180A', slug: 'software-jbl-kx180a', category: 'Cân chỉnh', platform: 'Windows', version: 'v1.2.1', description: 'Phần mềm chuyên dụng để setup vang số JBL KX180A.', isActive: true, updatedAt: new Date() },
        { name: 'Driver Focusrite Scarlett Series', slug: 'driver-focusrite-scarlett', category: 'Driver', platform: 'macOS/Windows', version: 'v3.15.0', description: 'Driver âm thanh cho các dòng soundcard Focusrite Scarlett.', isActive: true, updatedAt: new Date() },
    ];

    for (const sw of software) {
        await prisma.software.create({
            data: {
                id: uuidv4(),
                ...sw,
            }
        });
    }

    // 13. SEEDING LOYALTY REWARDS
    console.log('💎 Seeding Loyalty Rewards...');
    const rewards = [
        { name: 'Voucher giảm giá 100.000 VNĐ', description: 'Đổi 1000 điểm lấy voucher 100k.', pointsCost: 1000, value: 100000, type: 'DISCOUNT', isActive: true },
        { name: 'Tặng bộ dây loa chất lượng cao', description: 'Đổi 5000 điểm lấy 1 cặp dây loa 2m.', pointsCost: 5000, value: 500000, type: 'GIFT', isActive: true },
    ];

    for (const r of rewards) {
        await prisma.loyalty_rewards.create({
            data: {
                id: uuidv4(),
                ...r,
            }
        });
    }

    // 14. SEEDING EMAIL TEMPLATES & CAMPAIGNS
    console.log('📧 Seeding Email Templates & Campaigns...');
    const template = await prisma.email_templates.create({
        data: {
            id: uuidv4(),
            name: 'Mẫu chào mừng khách hàng mới',
            subject: 'Chào mừng bạn đến với Audio Tài Lộc',
            content: '<h1>Chào mừng!</h1><p>Cảm ơn bạn đã đăng ký tài khoản tại Audio Tài Lộc.</p>',
            category: 'WELCOME',
            isActive: true,
            updatedAt: new Date(),
        }
    });

    await prisma.campaigns.create({
        data: {
            id: uuidv4(),
            name: 'Chiến dịch tri ân khách hàng 2024',
            description: 'Gửi mã giảm giá tri ân cho khách cũ.',
            type: 'PROMOTIONAL',
            status: 'DRAFT',
            subject: 'Quà tặng tri ân đặc biệt từ Audio Tài Lộc',
            content: 'Chúng tôi có món quà dành cho bạn...',
            templateId: template.id,
            updatedAt: new Date(),
        }
    });

    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
