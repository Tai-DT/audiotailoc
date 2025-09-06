const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3010/api/v1';

// Sample data for seeding
const sampleData = {
  users: [
    {
      email: 'admin@audiotailoc.com',
      password: 'Admin123!',
      name: 'Admin Audio Tài Lộc',
      phone: '0901234567',
      role: 'ADMIN'
    },
    {
      email: 'nguyenvana@example.com',
      password: 'password123',
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      role: 'USER'
    },
    {
      email: 'tranthib@example.com',
      password: 'password123',
      name: 'Trần Thị B',
      phone: '0902345678',
      role: 'USER'
    },
    {
      email: 'levanc@example.com',
      password: 'password123',
      name: 'Lê Văn C',
      phone: '0903456789',
      role: 'USER'
    },
    {
      email: 'phamthid@example.com',
      password: 'password123',
      name: 'Phạm Thị D',
      phone: '0904567890',
      role: 'USER'
    }
  ],

  categories: [
    {
      name: 'Âm thanh Karaoke',
      slug: 'karaoke-audio',
      isActive: true
    },
    {
      name: 'Microphone',
      slug: 'microphones',
      isActive: true
    },
    {
      name: 'Loa & Amplifier',
      slug: 'speakers-amplifiers',
      isActive: true
    },
    {
      name: 'Mixer & Console',
      slug: 'mixers-consoles',
      isActive: true
    },
    {
      name: 'Cáp & Kết nối',
      slug: 'cables-connectors',
      isActive: true
    },
    {
      name: 'Phụ kiện âm thanh',
      slug: 'audio-accessories',
      isActive: true
    }
  ],

  products: [
    {
      name: 'Microphone Karaoke Professional',
      slug: 'micro-karaoke-pro',
      description: 'Microphone chuyên nghiệp cho hệ thống karaoke với chất lượng âm thanh cao',
      priceCents: 2500000,
      categorySlug: 'microphones',
      featured: true,
      isActive: true,
      images: '["https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/micro-1.jpg"]'
    },
    {
      name: 'Loa Karaoke 1000W',
      slug: 'loa-karaoke-1000w',
      description: 'Loa karaoke công suất 1000W, âm thanh sống động',
      priceCents: 8500000,
      categorySlug: 'speakers-amplifiers',
      featured: true,
      isActive: true,
      images: '["https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/speaker-1.jpg"]'
    },
    {
      name: 'Mixer Console 16 kênh',
      slug: 'mixer-16-channel',
      description: 'Bàn mixer 16 kênh chuyên nghiệp cho studio và sân khấu',
      priceCents: 12500000,
      categorySlug: 'mixers-consoles',
      featured: false,
      isActive: true,
      images: '["https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/mixer-1.jpg"]'
    },
    {
      name: 'Cáp XLR 5m',
      slug: 'cable-xlr-5m',
      description: 'Cáp kết nối XLR chất lượng cao, độ dài 5m',
      priceCents: 150000,
      categorySlug: 'cables-connectors',
      featured: false,
      isActive: true,
      images: '["https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/cable-1.jpg"]'
    },
    {
      name: 'Stand Microphone Professional',
      slug: 'stand-micro-pro',
      description: 'Chân micro chuyên nghiệp, điều chỉnh độ cao linh hoạt',
      priceCents: 450000,
      categorySlug: 'audio-accessories',
      featured: false,
      isActive: true,
      images: '["https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/stand-1.jpg"]'
    }
  ],

  services: [
    {
      name: 'Lắp đặt hệ thống Karaoke',
      slug: 'lap-dat-karaoke',
      description: 'Dịch vụ lắp đặt và cấu hình hệ thống karaoke chuyên nghiệp',
      basePriceCents: 1500000,
      price: 1500000,
      duration: 120,
      category: 'Installation',
      type: 'INSTALLATION',
      isActive: true,
      isFeatured: true
    },
    {
      name: 'Bảo trì âm thanh',
      slug: 'bao-tri-am-thanh',
      description: 'Dịch vụ bảo trì và sửa chữa thiết bị âm thanh',
      basePriceCents: 800000,
      price: 800000,
      duration: 60,
      category: 'Maintenance',
      type: 'MAINTENANCE',
      isActive: true,
      isFeatured: false
    },
    {
      name: 'Tư vấn hệ thống âm thanh',
      slug: 'tu-van-am-thanh',
      description: 'Tư vấn thiết kế và lựa chọn hệ thống âm thanh phù hợp',
      basePriceCents: 500000,
      price: 500000,
      duration: 90,
      category: 'Consulting',
      type: 'CONSULTING',
      isActive: true,
      isFeatured: true
    }
  ]
};

// Helper function to make API requests
async function makeRequest(endpoint, method = 'GET', body = null, token = null) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ API Error [${response.status}]:`, data);
      return null;
    }

    return data;
  } catch (error) {
    console.error('❌ Network Error:', error);
    return null;
  }
}

// Main seeding function
async function seedData() {
  console.log('🚀 Bắt đầu tạo dữ liệu mẫu qua API...\n');

  let adminToken = '';

  try {
    // 1. Đăng nhập admin để lấy token
    console.log('🔐 Đăng nhập admin...');
    const loginResponse = await makeRequest('/auth/login', 'POST', {
      email: 'admin@audiotailoc.com',
      password: 'Admin123!'
    });

    if (loginResponse && loginResponse.data && loginResponse.data.accessToken) {
      adminToken = loginResponse.data.accessToken;
      console.log('✅ Đăng nhập thành công!\n');
    } else {
      console.log('⚠️  Không thể đăng nhập admin, thử tạo tài khoản admin...');

      // Tạo tài khoản admin
      const createAdminResponse = await makeRequest('/users', 'POST', sampleData.users[0]);
      if (createAdminResponse) {
        console.log('✅ Tạo admin thành công!');

        // Đăng nhập lại
        const loginAgain = await makeRequest('/auth/login', 'POST', {
          email: 'admin@audiotailoc.com',
          password: 'Admin123!'
        });

        if (loginAgain && loginAgain.data && loginAgain.data.accessToken) {
          adminToken = loginAgain.data.accessToken;
          console.log('✅ Đăng nhập admin thành công!\n');
        }
      }
    }

    // 2. Tạo users
    console.log('👥 Tạo users...');
    for (const user of sampleData.users.slice(1)) { // Bỏ admin
      const response = await makeRequest('/users', 'POST', user, adminToken);
      if (response) {
        console.log(`✅ Tạo user: ${user.name}`);
      }
    }
    console.log('');

    // 3. Tạo categories
    console.log('📂 Tạo categories...');
    const categoryIds = [];
    for (const category of sampleData.categories) {
      const response = await makeRequest('/catalog/categories', 'POST', category, adminToken);
      if (response && response.data && response.data.id) {
        categoryIds.push(response.data.id);
        console.log(`✅ Tạo category: ${category.name}`);
      }
    }
    console.log('');

    // 4. Tạo products
    console.log('📦 Tạo products...');
    for (const product of sampleData.products) {
      const response = await makeRequest('/catalog/products', 'POST', product, adminToken);
      if (response) {
        console.log(`✅ Tạo product: ${product.name}`);
      }
    }
    console.log('');

    // 5. Tạo services
    console.log('🔧 Tạo services...');
    for (const service of sampleData.services) {
      const response = await makeRequest('/services', 'POST', service, adminToken);
      if (response) {
        console.log(`✅ Tạo service: ${service.name}`);
      }
    }
    console.log('');

    console.log('🎉 Hoàn thành tạo dữ liệu mẫu!');
    console.log('\n📊 Tóm tắt:');
    console.log(`   - Users: ${sampleData.users.length}`);
    console.log(`   - Categories: ${sampleData.categories.length}`);
    console.log(`   - Products: ${sampleData.products.length}`);
    console.log(`   - Services: ${sampleData.services.length}`);

  } catch (error) {
    console.error('❌ Lỗi khi tạo dữ liệu:', error);
  }
}

// Run the seeding
seedData();
