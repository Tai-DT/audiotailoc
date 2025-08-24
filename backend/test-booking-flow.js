const axios = require('axios');

const API_BASE_URL = 'http://localhost:3010/api/v1';

async function testBookingFlow() {
  console.log('🎯 Test Booking Flow - Audio Tài Lộc');
  console.log('=====================================');

  try {
    // 1. Tạo dịch vụ mới
    console.log('\n📋 1. Tạo dịch vụ mới:');
    const serviceData = {
      name: 'Bảo trì hệ thống âm thanh',
      slug: 'bao-tri-he-thong-am-thanh',
      description: 'Dịch vụ bảo trì định kỳ hệ thống âm thanh',
      category: 'MAINTENANCE',
      type: 'MAINTENANCE',
      basePriceCents: 1000000,
      estimatedDuration: 60,
      requirements: 'Hệ thống đã được lắp đặt',
      features: 'Kiểm tra, vệ sinh, thay thế linh kiện',
      imageUrl: 'https://example.com/maintenance.jpg'
    };

    const serviceResponse = await axios.post(`${API_BASE_URL}/services`, serviceData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer admin-token'
      }
    });

    const service = serviceResponse.data.data;
    console.log(`✅ Tạo dịch vụ thành công: ${service.name} (ID: ${service.id})`);

    // 2. Thêm hạng mục dịch vụ
    console.log('\n🔧 2. Thêm hạng mục dịch vụ:');
    const itemData = {
      name: 'Vệ sinh loa',
      description: 'Vệ sinh và bảo dưỡng loa',
      priceCents: 200000,
      isRequired: true
    };

    const itemResponse = await axios.post(`${API_BASE_URL}/services/${service.id}/items`, itemData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer admin-token'
      }
    });

    const item = itemResponse.data.data;
    console.log(`✅ Thêm hạng mục thành công: ${item.name} (ID: ${item.id})`);

    // 3. Tạo booking với hạng mục
    console.log('\n📅 3. Tạo booking với hạng mục:');
    const bookingData = {
      serviceId: service.id,
      customerName: 'Trần Thị B',
      customerPhone: '0987654321',
      customerEmail: 'tranthib@example.com',
      customerAddress: '456 Đường XYZ, Quận 2, TP.HCM',
      scheduledDate: '2024-02-20T00:00:00.000Z',
      scheduledTime: '15:00',
      notes: 'Khách hàng yêu cầu bảo trì vào buổi chiều',
      items: [
        {
          itemId: item.id,
          quantity: 1
        }
      ]
    };

    const bookingResponse = await axios.post(`${API_BASE_URL}/bookings`, bookingData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const booking = bookingResponse.data.data;
    console.log(`✅ Tạo booking thành công: ${booking.bookingNo}`);
    console.log(`   - Khách hàng: ${booking.customerName}`);
    console.log(`   - Dịch vụ: ${booking.service.name}`);
    console.log(`   - Chi phí ước tính: ${booking.estimatedCosts.toLocaleString()} VND`);
    console.log(`   - Trạng thái: ${booking.status}`);

    // 4. Kiểm tra danh sách booking
    console.log('\n📋 4. Kiểm tra danh sách booking:');
    const bookingsResponse = await axios.get(`${API_BASE_URL}/bookings`);
    const bookings = bookingsResponse.data.data.bookings;
    console.log(`✅ Tìm thấy ${bookings.length} booking`);

    bookings.forEach((b, index) => {
      console.log(`   ${index + 1}. ${b.bookingNo} - ${b.customerName} - ${b.service.name}`);
    });

    // 5. Cập nhật trạng thái booking (Admin)
    console.log('\n🔄 5. Cập nhật trạng thái booking:');
    const updateStatusData = {
      status: 'CONFIRMED',
      note: 'Đã xác nhận booking',
      changedBy: 'admin_123'
    };

    const statusResponse = await axios.put(`${API_BASE_URL}/bookings/${booking.id}/status`, updateStatusData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer admin-token'
      }
    });

    console.log(`✅ Cập nhật trạng thái thành công: ${statusResponse.data.data.status}`);

    // 6. Thống kê booking
    console.log('\n📊 6. Thống kê booking:');
    const statsResponse = await axios.get(`${API_BASE_URL}/bookings/stats`, {
      headers: {
        'Authorization': 'Bearer admin-token'
      }
    });

    const stats = statsResponse.data.data;
    console.log(`✅ Thống kê booking:`);
    console.log(`   - Tổng booking: ${stats.totalBookings}`);
    console.log(`   - Đang chờ: ${stats.pendingBookings}`);
    console.log(`   - Đã xác nhận: ${stats.confirmedBookings}`);
    console.log(`   - Hoàn thành: ${stats.completedBookings}`);
    console.log(`   - Tổng doanh thu: ${stats.totalRevenue?.toLocaleString()} VND`);

    // 7. Thống kê dịch vụ
    console.log('\n📈 7. Thống kê dịch vụ:');
    const serviceStatsResponse = await axios.get(`${API_BASE_URL}/services/stats`, {
      headers: {
        'Authorization': 'Bearer admin-token'
      }
    });

    const serviceStats = serviceStatsResponse.data.data;
    console.log(`✅ Thống kê dịch vụ:`);
    console.log(`   - Tổng dịch vụ: ${serviceStats.totalServices}`);
    console.log(`   - Dịch vụ hoạt động: ${serviceStats.activeServices}`);
    console.log(`   - Tổng booking: ${serviceStats.totalBookings}`);
    console.log(`   - Doanh thu tháng này: ${serviceStats.revenueThisMonth?.toLocaleString()} VND`);

    console.log('\n🎉 Test booking flow hoàn thành thành công!');
    console.log('=====================================');

  } catch (error) {
    console.error('❌ Lỗi trong quá trình test:', error.response?.data || error.message);
  }
}

// Chạy test
testBookingFlow();


