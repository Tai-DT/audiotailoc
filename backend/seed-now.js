const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function seedAllData() {
  console.log('🚀 Bắt đầu seeding dữ liệu mẫu cho Audio Tài Lộc...');

  // Kết nối database
  const client = new Client({
    connectionString: process.env.DATABASE_URL || process.env.DIRECT_DATABASE_URL,
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
    ];

    for (const category of categories) {
      await client.query(`
        INSERT INTO categories (id, name, slug, is_active, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW())
        ON CONFLICT (slug) DO NOTHING
      `, [category.name, category.slug, category.is_active]);
    }
    console.log('✅ Đã seed categories');

    // 2. Seed Users
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
    ];

    for (const user of users) {
      await client.query(`
        INSERT INTO users (id, email, password, name, phone, role, is_active, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true, NOW(), NOW())
        ON CONFLICT (email) DO NOTHING
      `, [user.email, user.password, user.name, user.phone, user.role]);
    }
    console.log('✅ Đã seed users');

    console.log('🎉 Hoàn thành seeding dữ liệu mẫu!');
    console.log('📊 Tóm tắt dữ liệu đã tạo:');
    console.log('- Categories: 3 danh mục sản phẩm');
    console.log('- Users: 2 người dùng (1 admin, 1 khách hàng)');

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