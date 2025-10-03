// Test Services API from Frontend perspective
const axios = require('axios');

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';

async function testServicesAPI() {
  console.log('🧪 Testing Services API...');
  console.log('API URL:', API_URL);
  console.log('');

  try {
    const response = await axios.get(`${API_URL}/services`, {
      params: {
        isFeatured: true,
        isActive: true,
        page: 1,
        pageSize: 4,
      },
      timeout: 5000,
    });

    console.log('✅ API Response Status:', response.status);
    console.log('📊 Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.data) {
      const { total, services } = response.data.data;
      console.log('');
      console.log(`📈 Total Services: ${total}`);
      console.log(`🔢 Services Returned: ${services?.length || 0}`);
      
      if (services && services.length > 0) {
        console.log('');
        console.log('📋 Services List:');
        services.forEach((service, index) => {
          console.log(`  ${index + 1}. ${service.name} (Featured: ${service.isFeatured ? '✅' : '❌'})`);
        });
      }
    }

    console.log('');
    console.log('✅ Test PASSED - API is working correctly!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Test FAILED - API Error:');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received from API');
      console.error('Request:', error.request);
    }
    process.exit(1);
  }
}

testServicesAPI();
