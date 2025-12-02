#!/usr/bin/env node

/**
 * Seed data through API endpoints
 * This script uses the backend API to create sample data
 */

const axios = require('axios');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3010/api/v1';

let adminToken = null;

// Helper function to generate slug
function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Login or register admin user
async function setupAdminUser() {
  console.log('👤 Setting up admin user...');
  
  try {
    // Try to login first
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@audiotailoc.vn',
      password: 'Admin@123456',
    });
    
    adminToken = loginResponse.data.data.accessToken;
    console.log('✅ Admin logged in successfully\n');
    return loginResponse.data.data.user;
  } catch (error) {
    // If login fails, try to register
    console.log('📝 Admin not found, registering...');
    
    try {
      const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
        email: 'admin@audiotailoc.vn',
        password: 'Admin@123456',
        name: 'Admin Audio Tài Lộc',
        phone: '0901234567',
      });
      
      adminToken = registerResponse.data.data.accessToken;
      console.log('✅ Admin registered successfully\n');
      return registerResponse.data.data.user;
    } catch (registerError) {
      console.error('❌ Failed to setup admin:', registerError.response?.data || registerError.message);
      throw registerError;
    }
  }
}

// Seed categories
async function seedCategories() {
  console.log('🏷️  Seeding Categories...');
  
  const categories = [
    {
      name: 'Âm thanh chuyên nghiệp',
      slug: 'am-thanh-chuyen-nghiep',
      description: 'Thiết bị âm thanh cao cấp cho sân khấu, hội trường',
      isActive: true,
    },
    {
      name: 'Loa & Amplifier',
      slug: 'loa-amplifier',
      description: 'Hệ thống loa và amply chất lượng cao',
      isActive: true,
    },
    {
      name: 'Microphone',
      slug: 'microphone',
      description: 'Micro không dây, có dây chuyên nghiệp',
      isActive: true,
    },
    {
      name: 'Mixer & Console',
      slug: 'mixer-console',
      description: 'Bàn mixer âm thanh analog và digital',
      isActive: true,
    },
    {
      name: 'Thiết bị ghi âm',
      slug: 'thiet-bi-ghi-am',
      description: 'Thiết bị ghi âm studio và di động',
      isActive: true,
    },
    {
      name: 'Phụ kiện âm thanh',
      slug: 'phu-kien-am-thanh',
      description: 'Cáp, giắc, chân đế và phụ kiện khác',
      isActive: true,
    },
  ];

  const createdCategories = [];
  
  for (const category of categories) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/categories`,
        category,
        {
          headers: { Authorization: `Bearer ${adminToken}` }
        }
      );
      createdCategories.push(response.data.data);
      console.log(`✅ Created category: ${category.name}`);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log(`ℹ️  Category already exists: ${category.name}`);
        // Try to get the category
        try {
          const getResponse = await axios.get(`${API_BASE_URL}/categories/${category.slug}`);
          createdCategories.push(getResponse.data.data);
        } catch (e) {
          console.log(`⚠️  Could not fetch existing category: ${category.name}`);
        }
      } else {
        console.error(`❌ Error creating category ${category.name}:`, error.response?.data || error.message);
      }
    }
  }
  
  console.log(`✅ Processed ${createdCategories.length} categories\n`);
  return createdCategories;
}

// Seed products
async function seedProducts(categories) {
  console.log('📦 Seeding Products...');
  
  const categoryMap = {};
  categories.forEach(cat => {
    categoryMap[cat.slug] = cat.id;
  });
  
  const products = [
    {
      name: 'Loa JBL PRX815W',
      slug: 'loa-jbl-prx815w',
      shortDescription: 'Loa sân khấu chuyên nghiệp 15 inch với Wi-Fi',
      description: 'Loa JBL PRX815W là dòng loa sân khấu chuyên nghiệp với công suất mạnh mẽ, âm thanh trong trẻo. Tích hợp Wi-Fi để điều khiển từ xa qua app di động.',
      price: 45000000,
      originalPrice: 50000000,
      categoryId: categoryMap['loa-amplifier'],
      brand: 'JBL',
      model: 'PRX815W',
      sku: 'JBL-PRX815W-001',
      specifications: {
        power: '1500W',
        driver: 'Loa bass 15 inch',
        connectivity: 'Wi-Fi control, Bluetooth streaming'
      },
      warranty: '24 tháng',
      stock: 20,
      featured: true,
      isActive: true,
    },
    {
      name: 'Mixer Yamaha MG16XU',
      slug: 'mixer-yamaha-mg16xu',
      shortDescription: 'Bàn mixer 16 kênh với hiệu ứng built-in',
      description: 'Yamaha MG16XU là bàn mixer analog 16 kênh chất lượng cao với hiệu ứng SPX tích hợp sẵn, USB audio interface.',
      price: 18500000,
      originalPrice: 20000000,
      categoryId: categoryMap['mixer-console'],
      brand: 'Yamaha',
      model: 'MG16XU',
      sku: 'YAMAHA-MG16XU-001',
      specifications: {
        channels: '16 input channels',
        interface: '24-bit/192kHz USB',
        effects: 'SPX effects',
        eq: '3 band'
      },
      warranty: '12 tháng',
      stock: 15,
      featured: true,
      isActive: true,
    },
    {
      name: 'Micro Shure SM58',
      slug: 'micro-shure-sm58',
      shortDescription: 'Micro vocal huyền thoại của Shure',
      description: 'Shure SM58 là chiếc micro biểu tượng của ngành âm thanh chuyên nghiệp, được tin dùng bởi hàng triệu nghệ sĩ trên toàn thế giới.',
      price: 3200000,
      originalPrice: 3500000,
      categoryId: categoryMap['microphone'],
      brand: 'Shure',
      model: 'SM58',
      sku: 'SHURE-SM58-001',
      specifications: {
        type: 'Cardioid pickup',
        frequency: '50-15kHz',
        features: 'Built-in pop filter'
      },
      warranty: '24 tháng',
      stock: 50,
      featured: true,
      isActive: true,
    },
  ];

  for (const product of products) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/products`,
        product,
        {
          headers: { Authorization: `Bearer ${adminToken}` }
        }
      );
      console.log(`✅ Created product: ${product.name}`);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log(`ℹ️  Product already exists: ${product.name}`);
      } else {
        console.error(`❌ Error creating product ${product.name}:`, error.response?.data || error.message);
      }
    }
  }
  
  console.log(`✅ Processed ${products.length} products\n`);
}

// Main seeding function
async function seedData() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║    🌱 Audio Tài Lộc - API-Based Data Seeding 🌱        ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  try {
    // 1. Setup admin user
    const adminUser = await setupAdminUser();
    
    // 2. Seed categories
    const categories = await seedCategories();
    
    // 3. Seed products
    await seedProducts(categories);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ API-BASED DATA SEEDING COMPLETED SUCCESSFULLY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('🔑 Admin Credentials:');
    console.log('   Email: admin@audiotailoc.vn');
    console.log('   Password: Admin@123456\n');
    
  } catch (error) {
    console.error('\n❌ Error during seeding:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Check if backend is running
async function checkBackend() {
  try {
    await axios.get(`${API_BASE_URL}/health`);
    return true;
  } catch (error) {
    return false;
  }
}

// Run the script
(async () => {
  const isBackendRunning = await checkBackend();
  
  if (!isBackendRunning) {
    console.error('❌ Backend is not running at', API_BASE_URL);
    console.error('Please start the backend server first with: npm run start:dev');
    process.exit(1);
  }
  
  await seedData();
})();
