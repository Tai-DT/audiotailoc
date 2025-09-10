const axios = require('axios');

async function testCreateServiceType() {
  try {
    console.log('🔍 Testing create service type with duplicate slug fix...');

    // First login to get token
    console.log('📝 Logging in...');
    const loginResponse = await axios.post('http://localhost:3010/api/v1/auth/login', {
      email: 'admin@audiotailoc.com',
      password: 'admin123'
    });

    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login successful, got token');

    // Try to create a service type with a name that would generate duplicate slug
    console.log('📋 Creating service type with duplicate name...');
    const createResponse = await axios.post('http://localhost:3010/api/v1/services/types', {
      name: 'Cho thuê', // This should generate slug 'cho-thue' but there's already one
      description: 'Test duplicate slug handling',
      isActive: true
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Service type created successfully:');
    console.log('ID:', createResponse.data.data.id);
    console.log('Name:', createResponse.data.data.name);
    console.log('Slug:', createResponse.data.data.slug);
    console.log('Description:', createResponse.data.data.description);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testCreateServiceType();