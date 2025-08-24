const axios = require('axios');

const API_BASE = 'http://localhost:3010/api/v1';

function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

async function seedData() {
  console.log('🌱 Seeding sample data...\n');

  try {
    // Create sample services
    console.log('📝 Creating sample services...');
    
    const services = [
      {
        name: 'Cho thuê thiết bị âm thanh cơ bản',
        description: 'Dịch vụ cho thuê thiết bị âm thanh cho sự kiện nhỏ',
        category: 'RENTAL',
        type: 'AUDIO_EQUIPMENT',
        basePriceCents: 500000,
        estimatedDuration: 4,
        isActive: true,
        slug: 'cho-thue-thiet-bi-am-thanh-co-ban'
      },
      {
        name: 'Lắp đặt hệ thống âm thanh',
        description: 'Dịch vụ lắp đặt hệ thống âm thanh chuyên nghiệp',
        category: 'INSTALLATION',
        type: 'PROFESSIONAL_SOUND',
        basePriceCents: 2000000,
        estimatedDuration: 8,
        isActive: true,
        slug: 'lap-dat-he-thong-am-thanh'
      },
      {
        name: 'Cho thuê microphone karaoke',
        description: 'Cho thuê microphone và thiết bị karaoke',
        category: 'RENTAL',
        type: 'AUDIO_EQUIPMENT',
        basePriceCents: 300000,
        estimatedDuration: 6,
        isActive: true,
        slug: 'cho-thue-microphone-karaoke'
      }
    ];

    for (const service of services) {
      try {
        const response = await axios.post(`${API_BASE}/services`, service);
        console.log(`✅ Created service: ${service.name}`);
      } catch (error) {
        console.log(`❌ Failed to create service: ${service.name} - ${error.response?.data?.message || error.message}`);
      }
    }

    // Get existing services for booking test
    console.log('\n📋 Getting existing services...');
    try {
      const servicesResponse = await axios.get(`${API_BASE}/services`);
      const existingServices = servicesResponse.data.data.services;
      if (existingServices.length > 0) {
        console.log(`✅ Found ${existingServices.length} services`);
        
        // Test booking with first service
        const firstService = existingServices[0];
        console.log(`\n📅 Testing booking with service: ${firstService.name}`);
        
        const bookingData = {
          serviceId: firstService.id,
          customerName: 'Nguyễn Văn Test',
          customerPhone: '0123456789',
          customerEmail: 'test@example.com',
          customerAddress: '123 Đường Test, Quận 1, TP.HCM',
          scheduledDate: '2025-08-23',
          scheduledTime: '14:00',
          notes: 'Test booking for API testing'
        };
        
        try {
          const bookingResponse = await axios.post(`${API_BASE}/bookings`, bookingData);
          console.log(`✅ Created booking: ${bookingResponse.data.data?.bookingNo || 'Success'}`);
        } catch (error) {
          console.log(`❌ Failed to create booking: ${error.response?.data?.message || error.message}`);
        }
      }
    } catch (error) {
      console.log(`❌ Failed to get services: ${error.message}`);
    }

    // Test other endpoints
    console.log('\n🧪 Testing other endpoints...');
    
    // Test auth status
    try {
      const authResponse = await axios.get(`${API_BASE}/auth/status`);
      console.log(`✅ Auth status: ${authResponse.status}`);
    } catch (error) {
      console.log(`❌ Auth status: ${error.response?.status || 'ERROR'}`);
    }
    
    // Test payment methods
    try {
      const paymentResponse = await axios.get(`${API_BASE}/payments/methods`);
      console.log(`✅ Payment methods: ${paymentResponse.status}`);
    } catch (error) {
      console.log(`❌ Payment methods: ${error.response?.status || 'ERROR'}`);
    }
    
    // Test notifications
    try {
      const notificationResponse = await axios.get(`${API_BASE}/notifications`);
      console.log(`✅ Notifications: ${notificationResponse.status}`);
    } catch (error) {
      console.log(`❌ Notifications: ${error.response?.status || 'ERROR'}`);
    }
    
    // Test search services
    try {
      const searchResponse = await axios.get(`${API_BASE}/search/services?q=audio`);
      console.log(`✅ Search services: ${searchResponse.status}`);
    } catch (error) {
      console.log(`❌ Search services: ${error.response?.status || 'ERROR'}`);
    }

    console.log('\n🎉 Seeding and testing completed!');
    
    // Show summary
    console.log('\n📊 Data Summary:');
    try {
      const servicesResponse = await axios.get(`${API_BASE}/services`);
      console.log(`- Services: ${servicesResponse.data.data.total}`);
    } catch (error) {
      console.log('- Services: Error fetching');
    }

    try {
      const productsResponse = await axios.get(`${API_BASE}/catalog/products`);
      console.log(`- Products: ${productsResponse.data.data.total}`);
    } catch (error) {
      console.log('- Products: Error fetching');
    }

    try {
      const categoriesResponse = await axios.get(`${API_BASE}/catalog/categories`);
      console.log(`- Categories: ${categoriesResponse.data.data.total}`);
    } catch (error) {
      console.log('- Categories: Error fetching');
    }

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  }
}

seedData();
