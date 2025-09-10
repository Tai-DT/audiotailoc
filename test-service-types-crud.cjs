const axios = require('axios');

const BASE_URL = 'http://localhost:3010/api/v1';
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWZidnhoM3YwMDAwdmNmbXY2ZHYyb205IiwiZW1haWwiOiJhZG1pbkBhdWRpb3RhaWxvYy5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NTc0NDk0NjIsImV4cCI6MTc1NzQ1MDM2Mn0.zUIO2ls-TEfZgoH4t71ae85KCuzTpCr7DC8L0k7VRa8';

const headers = {
  'Authorization': AUTH_TOKEN,
  'Content-Type': 'application/json'
};

async function testServiceTypesCRUD() {
  console.log('🚀 Testing Service Types CRUD Operations...\n');

  try {
    // 1. GET all service types
    console.log('📋 1. Getting all service types...');
    const getResponse = await axios.get(`${BASE_URL}/services/types`, { headers });
    console.log('Response data type:', typeof getResponse.data);
    console.log('Response data:', JSON.stringify(getResponse.data, null, 2));

    let serviceTypes = [];
    if (Array.isArray(getResponse.data)) {
      serviceTypes = getResponse.data;
    } else if (getResponse.data && Array.isArray(getResponse.data.data)) {
      serviceTypes = getResponse.data.data;
    } else {
      console.log('❌ Unexpected response structure');
      return;
    }

    console.log(`✅ Found ${serviceTypes.length} service types`);
    console.log('Service types:', serviceTypes.map(st => ({ name: st.name, slug: st.slug })));
    console.log('');

    // 2. CREATE new service type
    console.log('➕ 2. Creating new service type...');
    const timestamp = Date.now();
    const newServiceType = {
      name: `Test Service Type ${timestamp}`,
      description: 'This is a test service type',
      isActive: true,
      sortOrder: 99
    };

    const createResponse = await axios.post(`${BASE_URL}/services/types`, newServiceType, { headers });
    console.log('✅ Created service type:', createResponse.data);
    const createdId = createResponse.data.data.id;
    console.log('');

    // 3. UPDATE the created service type
    console.log('✏️  3. Updating service type...');
    const updateData = {
      name: 'Updated Test Service Type',
      description: 'This is an updated test service type',
      isActive: false,
      sortOrder: 100
    };

    const updateResponse = await axios.put(`${BASE_URL}/services/types/${createdId}`, updateData, { headers });
    console.log('✅ Updated service type:', updateResponse.data);
    console.log('');

    // 4. GET the updated service type
    console.log('📖 4. Getting updated service type...');
    const getOneResponse = await axios.get(`${BASE_URL}/services/types/${createdId}`, { headers });
    console.log('✅ Retrieved service type:', getOneResponse.data);
    console.log('');

    // 5. DELETE the service type
    console.log('🗑️  5. Deleting service type...');
    await axios.delete(`${BASE_URL}/services/types/${createdId}`, { headers });
    console.log('✅ Deleted service type');
    console.log('');

    // 6. Verify deletion
    console.log('🔍 6. Verifying deletion...');
    try {
      await axios.get(`${BASE_URL}/services/types/${createdId}`, { headers });
      console.log('❌ Service type still exists!');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Service type successfully deleted');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 All CRUD operations completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testServiceTypesCRUD();