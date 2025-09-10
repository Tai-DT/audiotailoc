// Script to test product creation with admin user
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3010/api/v1';

async function testProductCreation() {
  try {
    console.log('Testing product creation with admin user...');

    // Login to get token
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@audiotailoc.com',
      password: 'admin123'
    });
    console.log('✅ Admin login response:', JSON.stringify(loginResponse.data, null, 2));

    const token = loginResponse.data.data.accessToken;
    console.log('Token:', token ? 'Received' : 'Not received');

    if (!token) {
      console.error('❌ No token received from login');
      return;
    }

    // Test create product
    const timestamp = Date.now();
    const newProduct = {
      name: 'Test Product from API',
      slug: `test-product-from-api-${timestamp}`,
      priceCents: 150000,
      description: 'Test product created via API',
      stockQuantity: 5,
      isActive: true,
      featured: false
    };

    console.log('Attempting to create product...');
    const createResponse = await axios.post(`${API_BASE_URL}/catalog/products`, newProduct, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Product created successfully:', createResponse.data);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testProductCreation();
