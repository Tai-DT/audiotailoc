import { prisma } from './seed-client';
import { v4 as uuidv4 } from 'uuid';

async function seedMissingPolicies() {
    console.log('📜 Seeding missing policies...');

    const missingPolicies = [
        {
            id: uuidv4(),
            title: 'Chính sách đổi trả',
            slug: 'return-policy',
            type: 'RETURN',
            isPublished: true,
            viewCount: 0,
            contentHtml: `
<div class="space-y-8">
  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">1. Điều kiện đổi trả</h3>
    <p><strong>Audio Tài Lộc</strong> hỗ trợ đổi trả sản phẩm trong các trường hợp sau:</p>
    <ul class="list-disc pl-6 mt-2 space-y-1">
      <li>Sản phẩm bị lỗi kỹ thuật từ nhà sản xuất.</li>
      <li>Sản phẩm không đúng chủng loại hoặc mẫu mã như đã đặt hàng.</li>
      <li>Sản phẩm bị hư hỏng trong quá trình vận chuyển (có xác nhận của đơn vị vận chuyển).</li>
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
      <li>Liên hệ Hotline: <strong>0768 426 262</strong> hoặc email: <strong>hotro@audiotailoc.com</strong></li>
      <li>Mô tả chi tiết lý do đổi trả kèm hình ảnh/video sản phẩm lỗi.</li>
      <li>Gửi sản phẩm về showroom hoặc chờ nhân viên đến thu hồi.</li>
      <li>Nhận sản phẩm thay thế hoặc hoàn tiền trong 3-5 ngày làm việc.</li>
    </ol>
  </section>

  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">4. Các trường hợp không đổi trả</h3>
    <ul class="list-disc pl-6 space-y-2">
      <li>Sản phẩm đã qua sử dụng, có dấu hiệu hư hỏng do vận hành sai cách.</li>
      <li>Sản phẩm không còn đầy đủ phụ kiện, hộp đựng, giấy tờ đi kèm.</li>
      <li>Sản phẩm thuộc chương trình khuyến mãi thanh lý, giảm giá đặc biệt (ghi rõ "không đổi trả").</li>
      <li>Yêu cầu đổi trả sau thời hạn quy định.</li>
    </ul>
  </section>

  <div class="p-6 bg-primary/5 border border-primary/20 rounded-2xl italic">
    <strong>Cam kết:</strong> Audio Tài Lộc luôn đặt quyền lợi khách hàng lên hàng đầu. Mọi yêu cầu đổi trả hợp lệ sẽ được xử lý nhanh chóng và công bằng.
  </div>
</div>
            `,
            summary: 'Chính sách đổi trả sản phẩm trong 7 ngày đối với sản phẩm lỗi hoặc không đúng mẫu mã.',
            updatedAt: new Date(),
        },
        {
            id: uuidv4(),
            title: 'Chính sách bảo mật thông tin',
            slug: 'privacy',
            type: 'PRIVACY',
            isPublished: true,
            viewCount: 0,
            contentHtml: `
<div class="space-y-8">
  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">1. Thông tin chúng tôi thu thập</h3>
    <p><strong>Audio Tài Lộc</strong> cam kết bảo vệ thông tin cá nhân của khách hàng. Chúng tôi chỉ thu thập các thông tin cần thiết cho việc cung cấp dịch vụ:</p>
    <ul class="list-disc pl-6 mt-2 space-y-1">
      <li>Họ tên, số điện thoại, địa chỉ email</li>
      <li>Địa chỉ giao hàng</li>
      <li>Lịch sử mua hàng và giao dịch</li>
      <li>Thông tin tương tác với website</li>
    </ul>
  </section>

  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">2. Mục đích sử dụng thông tin</h3>
    <ul class="list-disc pl-6 space-y-2">
      <li>Xử lý đơn hàng và giao hàng đúng địa chỉ</li>
      <li>Liên hệ hỗ trợ, tư vấn kỹ thuật</li>
      <li>Gửi thông tin khuyến mãi (nếu khách hàng đồng ý)</li>
      <li>Cải thiện chất lượng dịch vụ</li>
    </ul>
  </section>

  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">3. Bảo vệ thông tin</h3>
    <p>Chúng tôi áp dụng các biện pháp bảo mật tiên tiến:</p>
    <ul class="list-disc pl-6 mt-2 space-y-2">
      <li>Mã hóa SSL/TLS cho mọi giao dịch trực tuyến</li>
      <li>Hệ thống firewall và giám sát an ninh 24/7</li>
      <li>Nhân viên tuân thủ quy định bảo mật nghiêm ngặt</li>
      <li>Không chia sẻ thông tin cho bên thứ ba không liên quan</li>
    </ul>
  </section>

  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">4. Quyền của khách hàng</h3>
    <ul class="list-disc pl-6 space-y-2">
      <li>Yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân</li>
      <li>Hủy đăng ký nhận thông tin quảng cáo bất cứ lúc nào</li>
      <li>Khiếu nại nếu phát hiện lạm dụng thông tin</li>
    </ul>
  </section>

  <div class="p-6 bg-primary/5 border border-primary/20 rounded-2xl italic">
    <strong>Liên hệ:</strong> Mọi thắc mắc về bảo mật, vui lòng email: <strong>privacy@audiotailoc.com</strong> hoặc gọi <strong>0768 426 262</strong>
  </div>
</div>
            `,
            summary: 'Cam kết bảo mật thông tin cá nhân khách hàng theo chuẩn quốc tế.',
            updatedAt: new Date(),
        },
        {
            id: uuidv4(),
            title: 'Điều khoản sử dụng',
            slug: 'terms',
            type: 'TERMS',
            isPublished: true,
            viewCount: 0,
            contentHtml: `
<div class="space-y-8">
  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">1. Điều khoản chung</h3>
    <p>Khi truy cập và sử dụng website <strong>audiotailoc.com</strong>, quý khách đồng ý tuân thủ các điều khoản sau:</p>
    <ul class="list-disc pl-6 mt-2 space-y-1">
      <li>Cung cấp thông tin chính xác khi đăng ký tài khoản hoặc đặt hàng</li>
      <li>Không sử dụng website cho mục đích bất hợp pháp</li>
      <li>Tôn trọng quyền sở hữu trí tuệ của Audio Tài Lộc</li>
    </ul>
  </section>

  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">2. Quy định về đặt hàng</h3>
    <ul class="list-disc pl-6 space-y-2">
      <li>Đơn hàng chỉ được xác nhận sau khi khách hàng nhận được email/SMS xác nhận từ hệ thống</li>
      <li>Giá sản phẩm có thể thay đổi mà không cần thông báo trước</li>
      <li>Audio Tài Lộc có quyền từ chối đơn hàng nếu phát hiện gian lận</li>
    </ul>
  </section>

  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">3. Quyền sở hữu trí tuệ</h3>
    <p>Tất cả nội dung trên website bao gồm hình ảnh, logo, văn bản, thiết kế đều thuộc sở hữu của <strong>Audio Tài Lộc</strong>. Nghiêm cấm sao chép, phân phối mà không có sự đồng ý bằng văn bản.</p>
  </section>

  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">4. Giới hạn trách nhiệm</h3>
    <ul class="list-disc pl-6 space-y-2">
      <li>Audio Tài Lộc không chịu trách nhiệm về thiệt hại gián tiếp phát sinh từ việc sử dụng sản phẩm sai cách</li>
      <li>Thông tin sản phẩm được cập nhật từ nhà sản xuất, có thể thay đổi mà không thông báo</li>
      <li>Website có thể gián đoạn do bảo trì hoặc sự cố kỹ thuật</li>
    </ul>
  </section>

  <section>
    <h3 class="text-2xl font-black text-primary uppercase mb-4 italic">5. Điều khoản sửa đổi</h3>
    <p>Audio Tài Lộc có quyền cập nhật, sửa đổi các điều khoản này bất cứ lúc nào. Việc tiếp tục sử dụng website đồng nghĩa với việc chấp nhận các thay đổi.</p>
  </section>

  <div class="p-6 bg-primary/5 border border-primary/20 rounded-2xl italic">
    <strong>Hiệu lực:</strong> Các điều khoản này có hiệu lực từ ngày 01/01/2024 và áp dụng cho tất cả giao dịch tại audiotailoc.com
  </div>
</div>
            `,
            summary: 'Điều khoản và điều kiện sử dụng dịch vụ tại Audio Tài Lộc.',
            updatedAt: new Date(),
        },
    ];

    for (const policy of missingPolicies) {
        // Check if policy already exists
        const existingPolicy = await prisma.policies.findUnique({
            where: { slug: policy.slug }
        });

        if (existingPolicy) {
            console.log(`  ⏭️ Policy "${policy.slug}" already exists, skipping...`);
            continue;
        }

        await prisma.policies.create({
            data: policy as { id: string; slug: string; title: string; contentHtml: string; summary: string; type: string; isPublished: boolean; viewCount: number; updatedAt: Date },
        });
        console.log(`  ✅ Created policy: ${policy.title}`);
    }

    console.log('✅ Done seeding missing policies!');
}

seedMissingPolicies()
    .catch((e) => {
        console.error('❌ Error seeding policies:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
