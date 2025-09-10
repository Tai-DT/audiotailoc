// Test script to simulate dashboard product creation
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3010/api/v1';

async function testDashboardProductCreation() {
  try {
    console.log('Testing dashboard product creation simulation...');

    // Login to get token
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@audiotailoc.com',
      password: 'admin123'
    });

    const token = loginResponse.data.data.accessToken;
    console.log('Token received');

    // Simulate dashboard product data (from user's error log)
    const productData = {
      "name": "Name ádasd",
      "priceCents": 1000000000,
      "stockQuantity": 10,
      "minOrderQuantity": 1,
      "categoryId": "cmfbxj38w0003chmyongxz8xd",
      "images": [
        "https://res.cloudinary.com/dib7tbv7w/image/upload/v1757436641/products/lcgymsxp9rhxexu46fx3.png"
      ],
      "brand": "DemoBrand",
      "model": "DM-1000",
      "sku": "LOG-G435-BLK",
      "specifications": {},
      "dimensions": "163 x 71 x 182mm",
      "metaTitle": "name - AudioTailoc",
      "canonicalUrl": "/products/name",
      "featured": false,
      "isActive": true,
      // Add slug (this was missing before the fix)
      "slug": "name-adasd"
    };

    console.log('Submitting product data:', JSON.stringify(productData, null, 2));

    const createResponse = await axios.post(`${API_BASE_URL}/catalog/products`, productData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Product created successfully:', createResponse.data);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testDashboardProductCreation();
