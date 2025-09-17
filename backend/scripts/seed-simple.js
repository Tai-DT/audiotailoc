const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function seedAllData() {
  console.log('🚀 Bắt đầu seeding dữ liệu mẫu cho Audio Tài Lộc...');

  // Kết nối database
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Kết nối database thành công');

    // 1. Seed Categories
    console.log('📂 Seeding Categories...');
    const categories = [
      { name: 'Âm thanh chuyên nghiệp', slug: 'am-thanh-chuyen-nghiep', is_active: true },
      { name: 'Thiết bị ghi âm', slug: 'thiet-bi-ghi-am', is_active: true },
      { name: 'Loa & Amplifier', slug: 'loa-amplifier', is_active: true },
      { name: 'Microphone', slug: 'microphone', is_active: true },
      { name: 'Mixer & Console', slug: 'mixer-console', is_active: true },
      { name: 'Phụ kiện âm thanh', slug: 'phu-kien-am-thanh', is_active: true },
      { name: 'Thiết bị DJ', slug: 'thiet-bi-dj', is_active: true },
      { name: 'Hệ thống âm thanh hội trường', slug: 'he-thong-am-thanh-hoi-truong', is_active: true },
      { name: 'Thiết bị sân khấu', slug: 'thiet-bi-san-khau', is_active: true },
      { name: 'Âm thanh karaoke', slug: 'am-thanh-karaoke', is_active: true },
    ];

    for (const category of categories) {
      await client.query(`
        INSERT INTO categories (id, name, slug, is_active, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW())
        ON CONFLICT (slug) DO NOTHING
      `, [category.name, category.slug, category.is_active]);
    }
    console.log('✅ Đã seed categories');

    // 2. Seed Service Types
    console.log('🔧 Seeding Service Types...');
    const serviceTypes = [
      { name: 'Lắp đặt hệ thống', slug: 'lap-dat-he-thong', description: 'Lắp đặt và cấu hình hệ thống âm thanh chuyên nghiệp', is_active: true, sort_order: 1 },
      { name: 'Bảo trì - Sửa chữa', slug: 'bao-tri-sua-chua', description: 'Bảo trì định kỳ và sửa chữa thiết bị âm thanh', is_active: true, sort_order: 2 },
      { name: 'Tư vấn kỹ thuật', slug: 'tu-van-ky-thuat', description: 'Tư vấn thiết kế và lựa chọn giải pháp âm thanh', is_active: true, sort_order: 3 },
      { name: 'Đào tạo - Huấn luyện', slug: 'dao-tao-huan-luyen', description: 'Đào tạo sử dụng thiết bị và kỹ thuật âm thanh', is_active: true, sort_order: 4 },
      { name: 'Thuê thiết bị', slug: 'thue-thiet-bi', description: 'Cho thuê thiết bị âm thanh sự kiện', is_active: true, sort_order: 5 },
      { name: 'Thi công âm thanh', slug: 'thi-cong-am-thanh', description: 'Thi công hệ thống âm thanh chuyên nghiệp', is_active: true, sort_order: 6 },
      { name: 'Tư vấn giải pháp', slug: 'tu-van-giai-phap', description: 'Tư vấn giải pháp âm thanh toàn diện', is_active: true, sort_order: 7 },
      { name: 'Hỗ trợ kỹ thuật', slug: 'ho-tro-ky-thuat', description: 'Hỗ trợ kỹ thuật 24/7', is_active: true, sort_order: 8 },
    ];

    for (const serviceType of serviceTypes) {
      await client.query(`
        INSERT INTO service_types (id, name, slug, description, is_active, sort_order, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW())
        ON CONFLICT (slug) DO NOTHING
      `, [serviceType.name, serviceType.slug, serviceType.description, serviceType.is_active, serviceType.sort_order]);
    }
    console.log('✅ Đã seed service types');

    // 3. Seed Users
    console.log('👥 Seeding Users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      {
        email: 'admin@audiotailoc.com',
        password: hashedPassword,
        name: 'Admin Audio Tài Lộc',
        phone: '0123456789',
        role: 'ADMIN'
      },
      {
        email: 'nguyenvana@gmail.com',
        password: hashedPassword,
        name: 'Nguyễn Văn A',
        phone: '0987654321',
        role: 'USER'
      },
      {
        email: 'tranthib@gmail.com',
        password: hashedPassword,
        name: 'Trần Thị B',
        phone: '0912345678',
        role: 'USER'
      },
    ];

    const createdUsers = [];
    for (const user of users) {
      const result = await client.query(`
        INSERT INTO users (id, email, password, name, phone, role, is_active, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true, NOW(), NOW())
        ON CONFLICT (email) DO NOTHING
        RETURNING id, email, role
      `, [user.email, user.password, user.name, user.phone, user.role]);

      if (result.rows.length > 0) {
        createdUsers.push(result.rows[0]);
      }
    }
    console.log('✅ Đã seed users');

    // 4. Seed System Config
    console.log('⚙️ Seeding System Config...');
    const systemConfigs = [
      { key: 'site_name', value: 'Audio Tài Lộc', type: 'STRING' },
      { key: 'site_description', value: 'Thiết bị âm thanh chuyên nghiệp chất lượng cao', type: 'STRING' },
      { key: 'contact_email', value: 'info@audiotailoc.com', type: 'STRING' },
      { key: 'contact_phone', value: '0123 456 789', type: 'STRING' },
      { key: 'contact_address', value: '123 Đường ABC, Quận 1, TP.HCM', type: 'STRING' },
      { key: 'business_hours', value: '8:00 - 17:30', type: 'STRING' },
      { key: 'shipping_fee', value: '50000', type: 'NUMBER' },
      { key: 'free_shipping_threshold', value: '1000000', type: 'NUMBER' },
      { key: 'tax_rate', value: '10', type: 'NUMBER' },
      { key: 'maintenance_mode', value: 'false', type: 'BOOLEAN' },
      { key: 'analytics_enabled', value: 'true', type: 'BOOLEAN' },
      { key: 'email_notifications', value: 'true', type: 'BOOLEAN' },
    ];

    for (const config of systemConfigs) {
      await client.query(`
        INSERT INTO system_configs (id, key, value, type, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW())
        ON CONFLICT (key) DO NOTHING
      `, [config.key, config.value, config.type]);
    }
    console.log('✅ Đã seed system config');

    console.log('🎉 Hoàn thành seeding dữ liệu mẫu!');
    console.log('📊 Tóm tắt dữ liệu đã tạo:');
    console.log('- Categories: 10 danh mục sản phẩm');
    console.log('- Service Types: 8 loại dịch vụ');
    console.log('- Users: 3 người dùng (1 admin, 2 khách hàng)');
    console.log('- System Config: 12 cài đặt hệ thống');

  } catch (error) {
    console.error('❌ Lỗi khi seeding:', error);
  } finally {
    await client.end();
  }
}

// Chạy seeding
seedAllData()
  .then(() => {
    console.log('✅ Seeding hoàn thành thành công!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding thất bại:', error);
    process.exit(1);
  });