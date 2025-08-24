const axios = require('axios');

const API_BASE = 'http://localhost:3010/api/v1';

async function createServices() {
  console.log('🌱 Creating sample services...\n');

  const services = [
    {
      name: 'Cho thuê thiết bị âm thanh cơ bản',
      description: 'Dịch vụ cho thuê thiết bị âm thanh cho sự kiện nhỏ',
      category: 'RENTAL',
      type: 'AUDIO_EQUIPMENT',
      basePriceCents: 500000,
      estimatedDuration: 4,
      isActive: true,
      slug: 'cho-thue-thiet-bi-am-thanh-co-ban-v1'
    },
    {
      name: 'Lắp đặt hệ thống âm thanh',
      description: 'Dịch vụ lắp đặt hệ thống âm thanh chuyên nghiệp',
      category: 'INSTALLATION',
      type: 'PROFESSIONAL_SOUND',
      basePriceCents: 2000000,
      estimatedDuration: 8,
      isActive: true,
      slug: 'lap-dat-he-thong-am-thanh-v1'
    },
    {
      name: 'Cho thuê microphone karaoke',
      description: 'Cho thuê microphone và thiết bị karaoke',
      category: 'RENTAL',
      type: 'AUDIO_EQUIPMENT',
      basePriceCents: 300000,
      estimatedDuration: 6,
      isActive: true,
      slug: 'cho-thue-microphone-karaoke-v1'
    }
  ];

  for (const service of services) {
    try {
      const response = await axios.post(`${API_BASE}/services`, service);
      console.log(`✅ Created service: ${service.name} (ID: ${response.data.data.id})`);
    } catch (error) {
      console.log(`❌ Failed to create service: ${service.name} - ${error.response?.data?.message || error.message}`);
    }
  }

  // Test booking with created service
  console.log('\n📅 Testing booking creation...');
  try {
    const servicesResponse = await axios.get(`${API_BASE}/services`);
    const existingServices = servicesResponse.data.data.services;
    
    if (existingServices.length > 0) {
      const firstService = existingServices[0];
      console.log(`Using service: ${firstService.name} (ID: ${firstService.id})`);
      
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
      
      const bookingResponse = await axios.post(`${API_BASE}/bookings`, bookingData);
      console.log(`✅ Created booking: ${bookingResponse.data.data?.bookingNo || 'Success'}`);
    } else {
      console.log('❌ No services available for booking test');
    }
  } catch (error) {
    console.log(`❌ Booking test failed: ${error.response?.data?.message || error.message}`);
  }
}

createServices();
