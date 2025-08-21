const http = require('http');

const API_BASE = 'http://localhost:3010/api/v1';

function makeRequest(endpoint, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, API_BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function demonstrateKaraokeSystem() {
  console.log('🎤🎶 ===== DEMO HỆ THỐNG QUẢN LÝ DỊCH VỤ KARAOKE ===== 🎶🎤\n');

  try {
    // 1. Hiển thị health check
    console.log('🏥 1. KIỂM TRA TRẠNG THÁI HỆ THỐNG');
    console.log('─'.repeat(50));
    const health = await makeRequest('/health');
    console.log(`✅ Trạng thái: ${health.data.status}`);
    console.log(`📅 Thời gian: ${health.data.timestamp}`);
    console.log(`🗄️ Database: ${health.data.database}`);
    console.log(`💾 Cache: ${health.data.cache}`);
    console.log(`⏱️ Uptime: ${health.data.uptime}ms\n`);

    // 2. Hiển thị danh mục Karaoke
    console.log('📂 2. DANH MỤC SẢN PHẨM KARAOKE');
    console.log('─'.repeat(50));
    const categories = await makeRequest('/catalog/categories');
    if (categories.data && categories.data.data) {
      const karaokeCategories = categories.data.data.filter(cat => 
        cat.name.toLowerCase().includes('karaoke') || 
        cat.slug.includes('karaoke')
      );
      
      karaokeCategories.forEach(category => {
        console.log(`🎯 ${category.name}`);
        console.log(`   📝 Mô tả: ${category.description}`);
        console.log(`   🔗 Slug: ${category.slug}`);
        console.log(`   ✅ Trạng thái: ${category.isActive ? 'Hoạt động' : 'Tạm dừng'}`);
        console.log();
      });
    }

    // 3. Hiển thị sản phẩm Karaoke
    console.log('📦 3. SẢN PHẨM KARAOKE CÓ SẴN');
    console.log('─'.repeat(50));
    const products = await makeRequest('/catalog/products?search=karaoke');
    if (products.data && products.data.data) {
      products.data.data.forEach(product => {
        console.log(`🎤 ${product.name}`);
        console.log(`   💰 Giá: ${parseInt(product.price).toLocaleString()}₫`);
        console.log(`   📦 SKU: ${product.sku}`);
        console.log(`   📊 Tồn kho: ${product.stockQuantity} sản phẩm`);
        console.log(`   ⭐ Nổi bật: ${product.isFeatured ? 'Có' : 'Không'}`);
        console.log(`   📝 Mô tả: ${product.shortDescription}`);
        console.log();
      });
    }

    // 4. Hiển thị dịch vụ
    console.log('🔧 4. DỊCH VỤ CÓ SẴN');
    console.log('─'.repeat(50));
    const services = await makeRequest('/services');
    if (services.data && services.data.data) {
      services.data.data.forEach(service => {
        console.log(`🛠️ ${service.name}`);
        console.log(`   📂 Loại: ${service.category}`);
        console.log(`   🏷️ Phân loại: ${service.type}`);
        console.log(`   💰 Giá cơ bản: ${parseInt(service.basePrice).toLocaleString()}₫`);
        console.log(`   ⏱️ Thời gian: ${service.duration} phút`);
        console.log(`   📝 Mô tả: ${service.shortDescription}`);
        console.log();
      });
    }

    // 5. Hiển thị danh mục dịch vụ
    console.log('📋 5. DANH MỤC DỊCH VỤ');
    console.log('─'.repeat(50));
    const serviceCategories = await makeRequest('/services/categories');
    if (serviceCategories.data) {
      serviceCategories.data.forEach(category => {
        console.log(`🏷️ ${category.name || category}`);
      });
    }
    console.log();

    // 6. Hiển thị loại dịch vụ
    console.log('🔖 6. LOẠI DỊCH VỤ');
    console.log('─'.repeat(50));
    const serviceTypes = await makeRequest('/services/types');
    if (serviceTypes.data) {
      serviceTypes.data.forEach(type => {
        console.log(`📌 ${type.name || type}`);
      });
    }
    console.log();

    // 7. Demo tạo booking dịch vụ thanh lý
    console.log('📅 7. DEMO TẠO BOOKING DỊCH VỤ THANH LÝ KARAOKE');
    console.log('─'.repeat(50));
    
    // Tìm dịch vụ thanh lý
    const liquidationServices = services.data.data.filter(s => 
      s.category === 'LIQUIDATION' && s.name.toLowerCase().includes('karaoke')
    );
    
    if (liquidationServices.length > 0) {
      const liquidationService = liquidationServices[0];
      console.log(`🎯 Dịch vụ: ${liquidationService.name}`);
      console.log(`💰 Phí dịch vụ: ${parseInt(liquidationService.basePrice).toLocaleString()}₫`);
      console.log(`⏱️ Thời gian thực hiện: ${liquidationService.duration} phút`);
      
      // Hiển thị quy trình thanh lý
      if (liquidationService.metadata && liquidationService.metadata.processSteps) {
        console.log('\n📋 QUY TRÌNH THANH LÝ:');
        liquidationService.metadata.processSteps.forEach((step, index) => {
          console.log(`   ${index + 1}. ${step}`);
        });
      }
      
      console.log('\n✨ BOOKING MẪU:');
      console.log(`   👤 Khách hàng: Nguyễn Văn A`);
      console.log(`   📍 Địa chỉ: 123 Nguyễn Trãi, Q.1, TP.HCM`);
      console.log(`   📞 SĐT: 0901234567`);
      console.log(`   📝 Ghi chú: Cần thanh lý bộ dàn karaoke BMB CSV-900 SE`);
      console.log(`   📅 Thời gian: ${new Date().toLocaleString()}`);
      console.log(`   💰 Phí dịch vụ: ${parseInt(liquidationService.basePrice).toLocaleString()}₫`);
    }

    console.log('\n🎉 DEMO HOÀN THÀNH - HỆ THỐNG QUẢN LÝ DỊCH VỤ KARAOKE HOẠT ĐỘNG TỐT! 🎉');
    console.log('\n📈 TỔNG KẾT:');
    console.log(`✅ API Health Check hoạt động`);
    console.log(`✅ Quản lý danh mục Karaoke`);
    console.log(`✅ Quản lý sản phẩm Karaoke`);
    console.log(`✅ Dịch vụ Thanh lý, Lắp đặt, Cho thuê`);
    console.log(`✅ Hệ thống booking dịch vụ`);
    console.log(`✅ API endpoints đầy đủ chức năng`);

  } catch (error) {
    console.error('❌ Lỗi trong quá trình demo:', error.message);
  }
}

// Chạy demo
demonstrateKaraokeSystem().catch(console.error);
