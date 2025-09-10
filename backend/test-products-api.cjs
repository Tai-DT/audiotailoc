// Test script for products dashboard improvements
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3010/api/v1';
const TEST_TOKEN = 'your-admin-token-here'; // Replace with actual token

async function testProductsAPI() {
  try {
    console.log('Testing Products API...');

    // Test get products
    const productsResponse = await axios.get(`${API_BASE_URL}/catalog/products`);
    console.log('✅ Products API working:', productsResponse.data.data.items.length, 'products');

    // Test get categories
    const categoriesResponse = await axios.get(`${API_BASE_URL}/catalog/categories`);
    console.log('✅ Categories API working:', categoriesResponse.data.data.length, 'categories');

    // Test delete product (if you have a test product ID)
    // const deleteResponse = await axios.delete(`${API_BASE_URL}/catalog/products/${testProductId}`, {
    //   headers: { Authorization: `Bearer ${TEST_TOKEN}` }
    // });
    // console.log('✅ Delete API working');

  } catch (error) {
    console.error('❌ API Test failed:', error.message);
  }
}

testProductsAPI();
