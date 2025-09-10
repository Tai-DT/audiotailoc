const BASE_URL = 'http://localhost:3010/api/v1';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWZidnhoM3YwMDAwdmNmbXY2ZHYyb205IiwiZW1haWwiOiJhZG1pbkBhdWRpb3RhaWxvYy5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NTc0NDgxMDcsImV4cCI6MTc1NzQ0OTAwN30.0ZpMZb-4kwqYrcZ0MOX6Uz7SCakKrtNYjCep8k4TLjU';

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

async function makeRequest(method, url, data = null) {
  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}, message: ${await response.text()}`);
  }

  return response.json();
}

async function testServiceTypesCRUD() {
  console.log('🚀 Testing Service Types CRUD operations...\n');

  try {
    // 1. Get all service types
    console.log('1. Getting all service types...');
    const getResponse = await makeRequest('GET', `${BASE_URL}/services/types`);
    console.log('✅ GET /services/types:', getResponse);
    console.log('');

    // 2. Create a new service type
    console.log('2. Creating new service type...');
    const timestamp = Date.now();
    const createData = {
      name: `Test Service Type ${timestamp}`,
      description: 'This is a test service type',
      isActive: true
    };
    const createResponse = await makeRequest('POST', `${BASE_URL}/services/types`, createData);
    console.log('✅ POST /services/types:', createResponse);
    const createdId = createResponse.data.id;
    console.log('Created ID:', createdId);
    console.log('');

    // 3. Get the created service type
    console.log('3. Getting created service type...');
    const getOneResponse = await makeRequest('GET', `${BASE_URL}/services/types/${createdId}`);
    console.log('✅ GET /services/types/:id:', getOneResponse);
    console.log('');

    // 4. Update the service type
    console.log('4. Updating service type...');
    const updateData = {
      name: 'Updated Test Service Type',
      description: 'This is an updated test service type',
      isActive: false
    };
    const updateResponse = await makeRequest('PUT', `${BASE_URL}/services/types/${createdId}`, updateData);
    console.log('✅ PUT /services/types/:id:', updateResponse);
    console.log('');

    // 5. Delete the service type
    console.log('5. Deleting service type...');
    const deleteResponse = await makeRequest('DELETE', `${BASE_URL}/services/types/${createdId}`);
    console.log('✅ DELETE /services/types/:id:', deleteResponse);
    console.log('');

    // 6. Verify deletion
    console.log('6. Verifying deletion...');
    try {
      await makeRequest('GET', `${BASE_URL}/services/types/${createdId}`);
      console.log('❌ Service type still exists after deletion');
    } catch (error) {
      if (error.message.includes('404')) {
        console.log('✅ Service type successfully deleted (404 expected)');
      } else {
        throw error;
      }
    }
    console.log('');

    console.log('🎉 All Service Types CRUD tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testServiceTypesCRUD();