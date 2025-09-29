import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPolicies() {
  console.log('🌱 Seeding policies...');

  // Delete existing policies first
  await prisma.policies.deleteMany();

  const policiesData = [
    {
      title: 'Chính sách giao hàng',
      contentHtml: `
        <h2>Chính sách giao hàng của AudioTaiLoc</h2>

        <h3>1. Phạm vi giao hàng</h3>
        <p>Chúng tôi cung cấp dịch vụ giao hàng trên toàn quốc với các phương thức vận chuyển linh hoạt phù hợp với nhu cầu của quý khách.</p>

        <h3>2. Thời gian giao hàng</h3>
        <ul>
          <li><strong>Nội thành Hà Nội và TP.HCM:</strong> 1-2 ngày làm việc</li>
          <li><strong>Các tỉnh thành khác:</strong> 2-4 ngày làm việc</li>
          <li><strong>Khu vực khó khăn:</strong> 3-7 ngày làm việc</li>
        </ul>

        <h3>3. Phí giao hàng</h3>
        <ul>
          <li><strong>Đơn hàng từ 500.000đ:</strong> Miễn phí giao hàng</li>
          <li><strong>Đơn hàng dưới 500.000đ:</strong> 30.000đ (nội thành), 50.000đ (liên tỉnh)</li>
        </ul>

        <h3>4. Phương thức giao hàng</h3>
        <ul>
          <li>Giao hàng tận nơi bởi đội ngũ giao hàng chuyên nghiệp</li>
          <li>Giao hàng qua các đơn vị vận chuyển uy tín (GHTK, GHN, Viettel Post)</li>
          <li>Giao hàng hỏa tốc cho các đơn hàng khẩn cấp</li>
        </ul>

        <h3>5. Lưu ý khi nhận hàng</h3>
        <ul>
          <li>Quý khách vui lòng kiểm tra kỹ sản phẩm trước khi ký nhận</li>
          <li>Trong trường hợp sản phẩm bị hư hỏng, quý khách có quyền từ chối nhận hàng</li>
          <li>Vui lòng giữ lại hóa đơn và bao bì sản phẩm để thuận tiện cho việc bảo hành</li>
        </ul>
      `,
      summary: 'Chính sách giao hàng toàn quốc với thời gian và phí rõ ràng',
      type: 'SHIPPING',
      slug: 'shipping-policy'
    },
    {
      title: 'Chính sách bảo hành',
      contentHtml: `
        <h2>Chính sách bảo hành sản phẩm</h2>

        <h3>1. Thời hạn bảo hành</h3>
        <ul>
          <li><strong>Tai nghe, loa:</strong> 12 tháng</li>
          <li><strong>Âm thanh chuyên nghiệp:</strong> 24 tháng</li>
          <li><strong>Phụ kiện:</strong> 6 tháng</li>
        </ul>

        <h3>2. Điều kiện bảo hành</h3>
        <ul>
          <li>Sản phẩm còn trong thời hạn bảo hành</li>
          <li>Còn tem bảo hành và hóa đơn mua hàng</li>
          <li>Lỗi do nhà sản xuất (không bao gồm lỗi do sử dụng sai cách)</li>
        </ul>

        <h3>3. Quy trình bảo hành</h3>
        <ol>
          <li>Liên hệ hotline: 1900 XXX XXX hoặc gửi email đến support@audiotailoc.com</li>
          <li>Cung cấp thông tin đơn hàng và mô tả lỗi</li>
          <li>Gửi sản phẩm về trung tâm bảo hành</li>
          <li>Nhận sản phẩm đã được bảo hành trong vòng 7-15 ngày</li>
        </ol>

        <h3>4. Các trường hợp không được bảo hành</h3>
        <ul>
          <li>Sản phẩm bị hư hỏng do va đập, rơi vỡ, ngập nước</li>
          <li>Sản phẩm bị can thiệp, sửa chữa bởi bên thứ ba</li>
          <li>Tem bảo hành bị rách, mờ hoặc không còn nguyên vẹn</li>
          <li>Hết thời hạn bảo hành</li>
        </ul>
      `,
      summary: 'Bảo hành 12-24 tháng với đầy đủ chính sách và quy trình',
      type: 'WARRANTY',
      slug: 'warranty-policy'
    },
    {
      title: 'Hỗ trợ kỹ thuật',
      contentHtml: `
        <h2>Dịch vụ hỗ trợ kỹ thuật AudioTaiLoc</h2>

        <h3>1. Kênh hỗ trợ</h3>
        <ul>
          <li><strong>Hotline:</strong> 1900 XXX XXX (8:00 - 18:00 hàng ngày)</li>
          <li><strong>Email:</strong> support@audiotailoc.com</li>
          <li><strong>Chat trực tuyến:</strong> Website audiotailoc.com</li>
          <li><strong>Fanpage:</strong> fb.com/audiotailoc</li>
        </ul>

        <h3>2. Phạm vi hỗ trợ</h3>
        <ul>
          <li>Hướng dẫn sử dụng sản phẩm</li>
          <li>Giải đáp thắc mắc kỹ thuật</li>
          <li>Hỗ trợ cài đặt và cấu hình</li>
          <li>Tư vấn giải pháp âm thanh</li>
          <li>Hỗ trợ bảo hành và sửa chữa</li>
        </ul>

        <h3>3. Dịch vụ kỹ thuật tại nhà</h3>
        <p>Chúng tôi cung cấp dịch vụ kỹ thuật tận nơi với các gói dịch vụ:</p>
        <ul>
          <li><strong>Gói Cơ bản:</strong> Kiểm tra và vệ sinh thiết bị - 200.000đ</li>
          <li><strong>Gói Nâng cao:</strong> Bảo dưỡng và tối ưu hiệu suất - 500.000đ</li>
          <li><strong>Gói Toàn diện:</strong> Bảo dưỡng định kỳ 6 tháng - 1.200.000đ/năm</li>
        </ul>

        <h3>4. Trung tâm bảo hành</h3>
        <p><strong>Địa chỉ:</strong> 123 Đường ABC, Quận XYZ, TP.HCM</p>
        <p><strong>Giờ làm việc:</strong> 8:00 - 17:00 từ thứ 2 đến thứ 7</p>

        <h3>5. Cam kết chất lượng</h3>
        <ul>
          <li>Phản hồi trong vòng 24h</li>
          <li>Giải quyết vấn đề trong thời gian ngắn nhất</li>
          <li>Đội ngũ kỹ thuật chuyên nghiệp, được đào tạo bài bản</li>
          <li>Sử dụng linh kiện chính hãng</li>
        </ul>
      `,
      summary: 'Hỗ trợ kỹ thuật chuyên nghiệp qua nhiều kênh với đội ngũ giàu kinh nghiệm',
      type: 'SUPPORT',
      slug: 'support-policy'
    }
  ];

  for (const policy of policiesData) {
    try {
      await prisma.policies.create({
        data: {
          id: crypto.randomUUID(),
          slug: policy.slug,
          title: policy.title,
          contentHtml: policy.contentHtml,
          summary: policy.summary,
          type: policy.type,
          isPublished: true,
          updatedAt: new Date(),
        }
      });
      console.log(`✅ Created policy: ${policy.title}`);
    } catch (error) {
      console.error(`❌ Error creating policy ${policy.title}:`, error);
    }
  }

  console.log('🎉 Policies seeding completed!');
}

async function main() {
  try {
    await seedPolicies();
  } catch (error) {
    console.error('Error seeding policies:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
