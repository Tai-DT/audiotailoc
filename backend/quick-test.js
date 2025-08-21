const axios = require('axios');

const baseURL = 'http://localhost:3010/api/v1';

async function quickTest() {
  try {
    console.log('🚀 Quick Service Management Test');
    console.log('================================');
    
    // Test health
    const health = await axios.get(`${baseURL}/health`);
    console.log('✅ Health check:', health.data);
    
    // Test services list
    const services = await axios.get(`${baseURL}/services`);
    console.log('✅ Services count:', services.data.data.length);
    
    // Test technicians list  
    const technicians = await axios.get(`${baseURL}/technicians`);
    console.log('✅ Technicians count:', technicians.data.data.length);
    
    // Test bookings list
    const bookings = await axios.get(`${baseURL}/bookings`);
    console.log('✅ Bookings count:', bookings.data.data.length);
    
    console.log('\n🎉 All service management features working!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

quickTest();
