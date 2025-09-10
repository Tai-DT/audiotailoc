const axios = require('axios');

const BASE_URL = 'http://localhost:3010/api/v1';
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWZidnhoM3YwMDAwdmNmbXY2ZHYyb205IiwiZW1haWwiOiJhZG1pbkBhdWRpb3RhaWxvYy5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NTc0NTMxOTIsImV4cCI6MTc1NzQ1NDA5Mn0.4ffzykhjWo3DQEWUmEJvV948nkD39Ai4zCqt5Jp_nSw';

const headers = {
  'Authorization': AUTH_TOKEN,
  'Content-Type': 'application/json'
};

async function testServiceTypesCRUD() {
  console.log('🚀 Testing Service Types CRUD operations...\n');

  try {
    // 1. Test GET all service types
    console.log('1. Testing GET /service-types');
    const getResponse = await axios.get(`${BASE_URL}/service-types`);
    console.log('✅ GET successful:', getResponse.data.length, 'service types found\n');

    // 2. Test CREATE service type
    console.log('2. Testing POST /service-types');
    const createData = {
      name: 'Test Service Type',
      description: 'This is a test service type',
      icon: 'wrench',
      color: '#3b82f6',
      isActive: true,
      sortOrder: 1
    };

    const createResponse = await axios.post(`${BASE_URL}/service-types`, createData, { headers });
    console.log('✅ CREATE successful:', createResponse.data);
    const createdId = createResponse.data.id;
    console.log('');

    // 3. Test GET single service type
    console.log('3. Testing GET /service-types/:id');
    const getSingleResponse = await axios.get(`${BASE_URL}/service-types/${createdId}`);
    console.log('✅ GET single successful:', getSingleResponse.data.name);
    console.log('');

    // 4. Test UPDATE service type
    console.log('4. Testing PATCH /service-types/:id');
    const updateData = {
      name: 'Updated Test Service Type',
      description: 'Updated description',
      icon: 'settings',
      color: '#ef4444'
    };

    const updateResponse = await axios.patch(`${BASE_URL}/service-types/${createdId}`, updateData, { headers });
    console.log('✅ UPDATE successful:', updateResponse.data.name);
    console.log('');

    // 5. Test DELETE service type
    console.log('5. Testing DELETE /service-types/:id');
    const deleteResponse = await axios.delete(`${BASE_URL}/service-types/${createdId}`, { headers });
    console.log('✅ DELETE successful');
    console.log('');

    console.log('🎉 All CRUD operations completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testServiceTypesCRUD();