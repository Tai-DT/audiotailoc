
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Start seeding policies...');

    const policies = [
        {
            id: 'policy-warranty',
            slug: 'warranty',
            title: 'Chính sách Bảo hành & Đổi trả',
            type: 'WARRANTY',
            summary: 'Cam kết bảo hành chính hãng và quy định đổi trả sản phẩm tại Audio Tài Lộc.',
            contentHtml: `
        <div class="prose max-w-none">
          <h3>1. Quy định Bảo hành</h3>
          <p>Tất cả sản phẩm được bán ra tại Audio Tài Lộc đều được bảo hành chính hãng theo tiêu chuẩn của nhà sản xuất. Thời gian bảo hành tuỳ thuộc vào từng loại thiết bị, thường từ 12 đến 24 tháng.</p>
          <ul>
            <li><strong>Điều kiện bảo hành:</strong> Sản phẩm còn nguyên tem bảo hành, không bị rách nát, tẩy xóa. Hư hỏng được xác định do lỗi kỹ thuật từ nhà sản xuất.</li>
            <li><strong>Từ chối bảo hành:</strong> Sản phẩm bị hư hỏng do tác động vật lý (rơi vỡ, va đập), do thiên tai, hỏa hoạn, nước vào, hoặc do sử dụng sai quy cách.</li>
          </ul>

          <h3>2. Chính sách Đổi trả</h3>
          <p>Khách hàng có quyền đổi trả sản phẩm trong vòng <strong>07 ngày</strong> kể từ ngày mua nếu phát hiện lỗi kỹ thuật từ nhà sản xuất.</p>
          <ul>
            <li>Sản phẩm đổi trả phải còn nguyên vẹn, đầy đủ phụ kiện, hộp xốp và quà tặng kèm theo (nếu có).</li>
            <li>Không áp dụng đổi trả cho các sản phẩm hư hỏng do lỗi người sử dụng.</li>
          </ul>

          <h3>3. Địa điểm Bảo hành</h3>
          <p>Quý khách vui lòng mang sản phẩm đến trực tiếp showroom của Audio Tài Lộc hoặc gửi chuyển phát nhanh đến địa chỉ trung tâm bảo hành của chúng tôi.</p>
          <p><strong>Hotline hỗ trợ kỹ thuật:</strong> 0909.79.79.68</p>
        </div>
      `,
        },
        {
            id: 'policy-shipping',
            slug: 'shipping',
            title: 'Chính sách Vận chuyển & Giao hàng',
            type: 'SHIPPING',
            summary: 'Thông tin về quy trình đóng gói, vận chuyển và lắp đặt thiết bị âm thanh.',
            contentHtml: `
        <div class="prose max-w-none">
          <h3>1. Phạm vi Giao hàng</h3>
          <p>Audio Tài Lộc hỗ trợ giao hàng trên toàn quốc. Đối với các đơn hàng tại TP.HCM, chúng tôi cung cấp dịch vụ giao hàng hỏa tốc trong ngày.</p>

          <h3>2. Phí Vận chuyển</h3>
          <ul>
            <li><strong>Miễn phí vận chuyển:</strong> Áp dụng cho đơn hàng từ 5.000.000 VNĐ trở lên trong nội thành TP.HCM.</li>
            <li>Các khu vực khác: Phí vận chuyển được tính theo biểu phí của đơn vị vận chuyển (Viettel Post, GHTK, VNPost...).</li>
          </ul>

          <h3>3. Thời gian Giao hàng</h3>
          <ul>
            <li>Nội thành TP.HCM: 2 - 4 giờ làm việc.</li>
            <li>Các tỉnh thành khác: 2 - 5 ngày tùy khu vực.</li>
          </ul>

          <h3>4. Lắp đặt tận nơi</h3>
          <p>Đối với các bộ dàn âm thanh, karaoke gia đình, sân khấu, chúng tôi có đội ngũ kỹ thuật viên hỗ trợ lắp đặt, cân chỉnh âm thanh tận nơi (có tính phí di chuyển đối với tỉnh xa).</p>
        </div>
      `,
        },
        {
            id: 'policy-privacy',
            slug: 'privacy',
            title: 'Chính sách Bảo mật thông tin',
            type: 'GENERAL',
            summary: 'Cam kết bảo mật thông tin khách hàng tuyệt đối tại Audio Tài Lộc.',
            contentHtml: `
        <div class="prose max-w-none">
          <h3>1. Mục đích thu thập thông tin</h3>
          <p>Chúng tôi thu thập thông tin cá nhân của khách hàng (Tên, Số điện thoại, Địa chỉ, Email) nhằm mục đích:</p>
          <ul>
            <li>Xử lý đơn hàng và giao hàng.</li>
            <li>Hỗ trợ bảo hành, bảo trì sản phẩm.</li>
            <li>Gửi thông báo về các chương trình khuyến mãi (nếu khách hàng đăng ký).</li>
          </ul>

          <h3>2. Cam kết bảo mật</h3>
          <p>Audio Tài Lộc cam kết <strong>không chia sẻ, bán hoặc trao đổi</strong> thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào, trừ trường hợp có yêu cầu từ cơ quan pháp luật.</p>

          <h3>3. Thời gian lưu trữ</h3>
          <p>Thông tin khách hàng được lưu trữ trong hệ thống nội bộ của chúng tôi để phục vụ cho việc chăm sóc khách hàng và lịch sử bảo hành.</p>
        </div>
      `,
        },
        {
            id: 'policy-support',
            slug: 'support',
            title: 'Hỗ trợ Kỹ thuật & Tư vấn',
            type: 'SUPPORT',
            summary: 'Trung tâm hỗ trợ kỹ thuật và tư vấn giải pháp âm thanh chuyên nghiệp.',
            contentHtml: `
        <div class="prose max-w-none">
          <h3>1. Kênh Hỗ trợ</h3>
          <p>Khách hàng cần hỗ trợ kỹ thuật hoặc tư vấn sản phẩm có thể liên hệ qua:</p>
          <ul>
            <li><strong>Hotline/Zalo:</strong> 0909.79.79.68</li>
            <li><strong>Email:</strong> support@audiotailoc.com</li>
            <li><strong>Fanpage:</strong> Audio Tài Lộc</li>
          </ul>

          <h3>2. Dịch vụ Tư vấn</h3>
          <p>Chúng tôi cung cấp dịch vụ tư vấn giải pháp âm thanh miễn phí cho:</p>
          <ul>
            <li>Dàn karaoke gia đình.</li>
            <li>Hệ thống âm thanh sân khấu, hội trường, sự kiện.</li>
            <li>Âm thanh quán Cafe, Bar, Pub, Nhà hàng.</li>
          </ul>
        </div>
      `,
        },
    ];

    for (const policy of policies) {
        await prisma.policies.upsert({
            where: { slug: policy.slug },
            update: {
                title: policy.title,
                contentHtml: policy.contentHtml,
                summary: policy.summary,
                type: policy.type,
                updatedAt: new Date(),
            },
            create: {
                id: policy.id,
                slug: policy.slug,
                title: policy.title,
                contentHtml: policy.contentHtml,
                summary: policy.summary,
                type: policy.type,
                updatedAt: new Date(),
            },
        });
        console.log(`Upserted policy: ${policy.slug}`);
    }

    console.log('Seeding policies completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
