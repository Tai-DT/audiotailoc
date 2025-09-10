// Script to create admin user and test product creation
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3010/api/v1';

async function createAdminAndTest() {
  try {
    console.log('Creating admin user...');

    // Register admin user
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
      email: 'admin@audiotailoc.com',
      password: 'admin123',
      name: 'Admin User'
    });
    console.log('✅ Admin user registered:', registerResponse.data);

    // Login to get token
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@audiotailoc.com',
      password: 'admin123'
    });
    console.log('✅ Admin login successful');

    const token = loginResponse.data.accessToken;
    console.log('Token:', token);

    // Test create product
    const newProduct = {
      name: 'Test Product from API',
      priceCents: 150000,
      description: 'Test product created via API',
      stockQuantity: 5,
      isActive: true,
      featured: false
    };

    const createResponse = await axios.post(`${API_BASE_URL}/catalog/products`, newProduct, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Product created successfully:', createResponse.data);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

createAdminAndTest();
