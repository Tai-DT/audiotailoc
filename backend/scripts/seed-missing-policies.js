// Seed missing policies using raw SQL via pg
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

// Get DATABASE_URL from environment
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ DATABASE_URL not set. Please set it before running this script.');
    console.log('Example: DATABASE_URL="postgresql://..." node scripts/seed-missing-policies.js');
    process.exit(1);
}

const pool = new Pool({ connectionString });

const missingPolicies = [
    {
        id: uuidv4(),
        slug: 'return-policy',
        title: 'Chính sách đổi trả',
        type: 'RETURN',
        isPublished: true,
        viewCount: 0,
        contentHtml: `<div class="space-y-8">
  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">1. Điều kiện đổi trả</h3>
    <p><strong>Audio Tài Lộc</strong> hỗ trợ đổi trả sản phẩm trong các trường hợp sau:</p>
    <ul class="list-disc pl-6 mt-2 space-y-1">
      <li>Sản phẩm bị lỗi kỹ thuật từ nhà sản xuất.</li>
      <li>Sản phẩm không đúng chủng loại hoặc mẫu mã như đã đặt hàng.</li>
      <li>Sản phẩm bị hư hỏng trong quá trình vận chuyển.</li>
    </ul>
  </section>
  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">2. Thời hạn đổi trả</h3>
    <ul class="list-disc pl-6 space-y-2">
      <li><strong>Đổi sản phẩm mới:</strong> Trong vòng 07 ngày kể từ ngày nhận hàng.</li>
      <li><strong>Hoàn trả sản phẩm:</strong> Trong vòng 03 ngày nếu sản phẩm bị lỗi từ nhà sản xuất.</li>
    </ul>
  </section>
  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">3. Quy trình đổi trả</h3>
    <ol class="list-decimal pl-6 mt-2 space-y-2">
      <li>Liên hệ Hotline: <strong>0768 426 262</strong></li>
      <li>Mô tả chi tiết lý do đổi trả kèm hình ảnh/video sản phẩm lỗi.</li>
      <li>Gửi sản phẩm về showroom hoặc chờ nhân viên đến thu hồi.</li>
      <li>Nhận sản phẩm thay thế hoặc hoàn tiền trong 3-5 ngày làm việc.</li>
    </ol>
  </section>
  <div class="p-6 bg-primary/5 border border-primary/20 rounded-2xl italic">
    <strong>Cam kết:</strong> Audio Tài Lộc luôn đặt quyền lợi khách hàng lên hàng đầu.
  </div>
</div>`,
        summary: 'Chính sách đổi trả sản phẩm trong 7 ngày đối với sản phẩm lỗi hoặc không đúng mẫu mã.',
    },
    {
        id: uuidv4(),
        slug: 'privacy',
        title: 'Chính sách bảo mật thông tin',
        type: 'PRIVACY',
        isPublished: true,
        viewCount: 0,
        contentHtml: `<div class="space-y-8">
  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">1. Thông tin chúng tôi thu thập</h3>
    <p><strong>Audio Tài Lộc</strong> cam kết bảo vệ thông tin cá nhân của khách hàng. Chúng tôi chỉ thu thập:</p>
    <ul class="list-disc pl-6 mt-2 space-y-1">
      <li>Họ tên, số điện thoại, địa chỉ email</li>
      <li>Địa chỉ giao hàng</li>
      <li>Lịch sử mua hàng và giao dịch</li>
    </ul>
  </section>
  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">2. Mục đích sử dụng thông tin</h3>
    <ul class="list-disc pl-6 space-y-2">
      <li>Xử lý đơn hàng và giao hàng</li>
      <li>Liên hệ hỗ trợ, tư vấn kỹ thuật</li>
      <li>Gửi thông tin khuyến mãi (nếu đồng ý)</li>
    </ul>
  </section>
  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">3. Bảo vệ thông tin</h3>
    <ul class="list-disc pl-6 mt-2 space-y-2">
      <li>Mã hóa SSL/TLS cho mọi giao dịch</li>
      <li>Không chia sẻ thông tin cho bên thứ ba</li>
      <li>Nhân viên tuân thủ quy định bảo mật nghiêm ngặt</li>
    </ul>
  </section>
  <div class="p-6 bg-primary/5 border border-primary/20 rounded-2xl italic">
    <strong>Liên hệ:</strong> Mọi thắc mắc về bảo mật, vui lòng gọi <strong>0768 426 262</strong>
  </div>
</div>`,
        summary: 'Cam kết bảo mật thông tin cá nhân khách hàng theo chuẩn quốc tế.',
    },
    {
        id: uuidv4(),
        slug: 'terms',
        title: 'Điều khoản sử dụng',
        type: 'TERMS',
        isPublished: true,
        viewCount: 0,
        contentHtml: `<div class="space-y-8">
  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">1. Điều khoản chung</h3>
    <p>Khi sử dụng website <strong>audiotailoc.com</strong>, quý khách đồng ý tuân thủ:</p>
    <ul class="list-disc pl-6 mt-2 space-y-1">
      <li>Cung cấp thông tin chính xác khi đăng ký hoặc đặt hàng</li>
      <li>Không sử dụng website cho mục đích bất hợp pháp</li>
      <li>Tôn trọng quyền sở hữu trí tuệ của Audio Tài Lộc</li>
    </ul>
  </section>
  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">2. Quy định về đặt hàng</h3>
    <ul class="list-disc pl-6 space-y-2">
      <li>Đơn hàng được xác nhận sau khi nhận email/SMS từ hệ thống</li>
      <li>Giá sản phẩm có thể thay đổi mà không thông báo trước</li>
      <li>Audio Tài Lộc có quyền từ chối đơn hàng nếu phát hiện gian lận</li>
    </ul>
  </section>
  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">3. Quyền sở hữu trí tuệ</h3>
    <p>Tất cả nội dung trên website thuộc sở hữu của <strong>Audio Tài Lộc</strong>. Nghiêm cấm sao chép, phân phối mà không có sự đồng ý.</p>
  </section>
  <div class="p-6 bg-primary/5 border border-primary/20 rounded-2xl italic">
    <strong>Hiệu lực:</strong> Các điều khoản này có hiệu lực từ ngày 01/01/2024.
  </div>
</div>`,
        summary: 'Điều khoản và điều kiện sử dụng dịch vụ tại Audio Tài Lộc.',
    },
];

async function seedPolicies() {
    console.log('📜 Seeding missing policies...\n');

    const client = await pool.connect();

    try {
        for (const policy of missingPolicies) {
            // Check if policy already exists
            const checkResult = await client.query(
                'SELECT id FROM policies WHERE slug = $1',
                [policy.slug]
            );

            if (checkResult.rows.length > 0) {
                console.log(`  ⏭️ Policy "${policy.slug}" already exists, skipping...`);
                continue;
            }

            // Insert policy
            await client.query(
                `INSERT INTO policies (id, slug, title, "contentHtml", summary, type, "isPublished", "viewCount", "createdAt", "updatedAt")
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
                [
                    policy.id,
                    policy.slug,
                    policy.title,
                    policy.contentHtml,
                    policy.summary,
                    policy.type,
                    policy.isPublished,
                    policy.viewCount
                ]
            );
            console.log(`  ✅ Created policy: ${policy.title}`);
        }

        console.log('\n✅ Done seeding missing policies!');
    } catch (error) {
        console.error('❌ Error seeding policies:', error.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

seedPolicies();
