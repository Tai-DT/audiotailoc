const axios = require('axios');

const API_BASE = 'http://localhost:3010/api/v1';

// Helper function to make API calls
async function apiCall(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${API_BASE}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`❌ Error calling ${method.toUpperCase()} ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
}

async function demoServiceManagement() {
  console.log('🎯 Demo: Service Management System');
  console.log('=====================================');

  try {
    // 1. Get all services
    console.log('\n📋 1. Lấy danh sách dịch vụ:');
    const services = await apiCall('GET', '/services');
    console.log(`✅ Tìm thấy ${services.services.length} dịch vụ`);
    services.services.forEach(service => {
      console.log(`   - ${service.name} (${service.category})`);
    });

    // 2. Get service categories
    console.log('\n📋 2. Lấy danh sách loại dịch vụ:');
    const categories = await apiCall('GET', '/services/categories');
    console.log('✅ Các loại dịch vụ:');
    categories.forEach(cat => {
      console.log(`   - ${cat.value}: ${cat.label}`);
    });

    // 3. Get technicians
    console.log('\n👷 3. Lấy danh sách kỹ thuật viên:');
    const technicians = await apiCall('GET', '/technicians');
    console.log(`✅ Tìm thấy ${technicians.technicians.length} kỹ thuật viên`);
    technicians.technicians.forEach(tech => {
      console.log(`   - ${tech.name} (${tech.phone}) - Chuyên môn: ${tech.specialties.join(', ')}`);
    });

    // 4. Create a booking
    console.log('\n📅 4. Tạo booking mới:');
    const newBooking = await apiCall('POST', '/bookings', {
      serviceId: services.services[0].id, // First service
      customerName: 'Nguyễn Văn Test',
      customerPhone: '0912345678',
      customerEmail: 'test@example.com',
      customerAddress: '123 Đường Test, Quận 1, TP.HCM',
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      scheduledTime: '14:00',
      notes: 'Khách hàng muốn lắp đặt vào buổi chiều',
      items: [
        {
          itemId: services.services[0].items[0].id,
          quantity: 1
        }
      ]
    });
    console.log(`✅ Tạo booking thành công: ${newBooking.bookingNo}`);

    // 5. Get available technicians for the booking
    console.log('\n🔍 5. Tìm kỹ thuật viên có sẵn:');
    const availableTechs = await apiCall('GET', `/technicians/available?date=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}&time=14:00&specialty=${services.services[0].category}`);
    console.log(`✅ Tìm thấy ${availableTechs.length} kỹ thuật viên có sẵn`);
    
    if (availableTechs.length > 0) {
      // 6. Assign technician to booking
      console.log('\n👤 6. Phân công kỹ thuật viên:');
      const assignedBooking = await apiCall('PUT', `/bookings/${newBooking.id}/assign`, {
        technicianId: availableTechs[0].id,
        note: `Phân công cho ${availableTechs[0].name}`
      });
      console.log(`✅ Đã phân công ${availableTechs[0].name} cho booking ${newBooking.bookingNo}`);

      // 7. Update booking status
      console.log('\n📈 7. Cập nhật trạng thái booking:');
      const updatedBooking = await apiCall('PUT', `/bookings/${newBooking.id}/status`, {
        status: 'CONFIRMED',
        note: 'Khách hàng xác nhận booking'
      });
      console.log(`✅ Cập nhật trạng thái booking thành: ${updatedBooking.status}`);
    }

    // 8. Get booking details
    console.log('\n📋 8. Chi tiết booking:');
    const bookingDetails = await apiCall('GET', `/bookings/${newBooking.id}`);
    console.log('✅ Thông tin booking:');
    console.log(`   - Mã booking: ${bookingDetails.bookingNo}`);
    console.log(`   - Khách hàng: ${bookingDetails.customerName}`);
    console.log(`   - Dịch vụ: ${bookingDetails.service.name}`);
    console.log(`   - Trạng thái: ${bookingDetails.status}`);
    console.log(`   - Kỹ thuật viên: ${bookingDetails.technician?.name || 'Chưa phân công'}`);
    console.log(`   - Chi phí ước tính: ${(bookingDetails.estimatedCosts / 100).toLocaleString('vi-VN')} VNĐ`);

    // 9. Get service statistics
    console.log('\n📊 9. Thống kê dịch vụ:');
    const serviceStats = await apiCall('GET', '/services/stats');
    console.log('✅ Thống kê dịch vụ:');
    console.log(`   - Tổng số dịch vụ: ${serviceStats.totalServices}`);
    console.log(`   - Dịch vụ hoạt động: ${serviceStats.activeServices}`);
    console.log(`   - Tổng booking: ${serviceStats.totalBookings}`);
    console.log(`   - Booking hoàn thành: ${serviceStats.completedBookings}`);

    // 10. Get booking statistics
    console.log('\n📊 10. Thống kê booking:');
    const bookingStats = await apiCall('GET', '/bookings/stats');
    console.log('✅ Thống kê booking:');
    console.log(`   - Tổng booking: ${bookingStats.totalBookings}`);
    console.log(`   - Đang chờ: ${bookingStats.pendingBookings}`);
    console.log(`   - Đã xác nhận: ${bookingStats.confirmedBookings}`);
    console.log(`   - Hoàn thành: ${bookingStats.completedBookings}`);
    console.log(`   - Đã hủy: ${bookingStats.cancelledBookings}`);

    console.log('\n🎉 Demo hoàn thành thành công!');
    console.log('=====================================');

  } catch (error) {
    console.error('❌ Demo failed:', error.message);
  }
}

// Check if server is running
async function checkServer() {
  try {
    await apiCall('GET', '/health');
    console.log('✅ Server is running');
    return true;
  } catch (error) {
    console.log('❌ Server is not running. Please start the server with: npm run start:dev');
    return false;
  }
}

async function main() {
  console.log('🚀 Service Management System Demo');
  console.log('=====================================');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    return;
  }

  await demoServiceManagement();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { demoServiceManagement, checkServer };
