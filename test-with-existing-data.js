const axios = require('axios');

const API_BASE = 'http://localhost:3010/api/v1';

async function testWithExistingData() {
  console.log('🧪 Testing with existing data...\n');

  try {
    // 1. Get existing product
    console.log('📦 Getting existing product...');
    
    const productsResponse = await axios.get(`${API_BASE}/catalog/products`);
    const existingProduct = productsResponse.data.data.items[0];
    
    if (!existingProduct) {
      console.log('❌ No products found');
      return;
    }

    console.log(`✅ Using product: ${existingProduct.name} (ID: ${existingProduct.id})`);

    // 2. Test Cart with existing product
    console.log('\n🛒 Testing Cart with existing product...');
    
    try {
      // Create guest cart
      const guestCartResponse = await axios.post(`${API_BASE}/cart/guest`);
      const guestId = guestCartResponse.data.guestId;
      console.log(`✅ Created guest cart: ${guestId}`);

      // Add existing product to cart
      const addToCartResponse = await axios.post(`${API_BASE}/cart/items?guestId=${guestId}`, {
        productId: existingProduct.id,
        quantity: 2
      });
      console.log(`✅ Add to cart: ${addToCartResponse.status}`);

      // Get cart
      const getCartResponse = await axios.get(`${API_BASE}/cart?guestId=${guestId}`);
      console.log(`✅ Get cart: ${getCartResponse.status}`);
      console.log(`   Cart items: ${getCartResponse.data.items?.length || 0}`);
      console.log(`   Cart total: ${getCartResponse.data.total || 0}`);

    } catch (error) {
      console.log(`❌ Cart test failed: ${error.response?.status || 'ERROR'}`);
      console.log(`   Error: ${error.response?.data?.message || error.message}`);
    }

    // 3. Test Order creation with existing product
    console.log('\n📦 Testing Order Creation with existing product...');
    
    try {
      const orderData = {
        userId: null, // Guest order
        items: [
          {
            productId: existingProduct.id,
            name: existingProduct.name,
            quantity: 1,
            unitPrice: existingProduct.priceCents || 100000
          }
        ],
        shippingAddress: {
          name: 'Test Customer',
          phone: '0123456789',
          address: '123 Test Street, Test City'
        }
      };

      const orderResponse = await axios.post(`${API_BASE}/orders`, orderData);
      console.log(`✅ Create order: ${orderResponse.status}`);
      console.log(`   Order ID: ${orderResponse.data.id}`);
      console.log(`   Order No: ${orderResponse.data.orderNo}`);
      console.log(`   Total: ${orderResponse.data.totalCents} cents`);
      console.log(`   Items: ${orderResponse.data.items?.length || 0}`);

    } catch (error) {
      console.log(`❌ Order creation failed: ${error.response?.status || 'ERROR'}`);
      console.log(`   Error: ${error.response?.data?.message || error.message}`);
    }

    // 4. Test all endpoints again
    console.log('\n🔍 Testing All Endpoints...');
    
    const endpointTests = [
      { name: 'Health Check', path: '/health' },
      { name: 'Payment Intents', path: '/payments/intents' },
      { name: 'Payment Methods', path: '/payments/methods' },
      { name: 'Payment Status', path: '/payments/status' },
      { name: 'Products List', path: '/catalog/products' },
      { name: 'Categories List', path: '/catalog/categories' },
      { name: 'Services List', path: '/services' },
      { name: 'Search Products', path: '/search/products?q=test' },
      { name: 'Bookings List', path: '/bookings' },
      { name: 'Notifications', path: '/notifications' },
      { name: 'Auth Status', path: '/auth/status' },
      { name: 'Sitemap XML', path: '/seo/sitemap.xml' },
      { name: 'Robots.txt', path: '/seo/robots.txt' },
      { name: 'Home SEO', path: '/seo/home' },
      { name: 'Languages', path: '/i18n/languages' },
      { name: 'VI Translations', path: '/i18n/translations/common?lang=vi' },
      { name: 'EN Translations', path: '/i18n/translations/common?lang=en' }
    ];

    let successCount = 0;
    let totalCount = endpointTests.length;

    for (const test of endpointTests) {
      try {
        const response = await axios.get(`${API_BASE}${test.path}`);
        console.log(`✅ ${test.name}: ${response.status}`);
        successCount++;
      } catch (error) {
        console.log(`❌ ${test.name}: ${error.response?.status || 'ERROR'}`);
      }
    }

    // 5. Summary
    console.log('\n📊 Test Summary:');
    console.log(`✅ Successful endpoints: ${successCount}/${totalCount}`);
    console.log(`📈 Success rate: ${((successCount/totalCount)*100).toFixed(1)}%`);
    
    if (successCount >= totalCount * 0.9) {
      console.log('🎉 Backend is working excellently!');
    } else if (successCount >= totalCount * 0.8) {
      console.log('✅ Backend is working well!');
    } else if (successCount >= totalCount * 0.7) {
      console.log('⚠️ Backend needs some improvements');
    } else {
      console.log('❌ Backend needs significant fixes');
    }

    console.log('\n🎉 Test with existing data completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testWithExistingData();
