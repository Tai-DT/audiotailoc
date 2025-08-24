const axios = require('axios');

const API_BASE = 'http://localhost:3010/api/v1';

async function createTestData() {
  console.log('🔧 Creating test data for backend...\n');

  try {
    // 1. Create a test product
    console.log('📦 Creating test product...');
    
    const productData = {
      name: 'Test Product for Cart',
      slug: 'test-product-cart',
      description: 'This is a test product for cart functionality',
      priceCents: 100000, // 1000 VND
      categoryId: 'cmemazsjw0001pyj00qqpeeao', // Loa & Loa Sub category
      imageUrl: '/images/test-product.jpg',
      isActive: true,
      stockQuantity: 10
    };

    try {
      const productResponse = await axios.post(`${API_BASE}/catalog/products`, productData);
      console.log(`✅ Created test product: ${productResponse.data.id}`);
      return productResponse.data.id;
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('⚠️ Test product already exists, using existing...');
        // Try to get existing product
        const productsResponse = await axios.get(`${API_BASE}/catalog/products?q=test-product-cart`);
        if (productsResponse.data.items && productsResponse.data.items.length > 0) {
          return productsResponse.data.items[0].id;
        }
      }
      throw error;
    }

  } catch (error) {
    console.error('❌ Failed to create test data:', error.response?.data || error.message);
    return null;
  }
}

async function testWithRealData() {
  console.log('🧪 Testing with real data...\n');

  try {
    // Create test product
    const productId = await createTestData();
    
    if (!productId) {
      console.log('❌ Cannot proceed without test product');
      return;
    }

    // 2. Test Cart with real product
    console.log('\n🛒 Testing Cart with real product...');
    
    try {
      // Create guest cart
      const guestCartResponse = await axios.post(`${API_BASE}/cart/guest`);
      const guestId = guestCartResponse.data.guestId;
      console.log(`✅ Created guest cart: ${guestId}`);

      // Add real product to cart
      const addToCartResponse = await axios.post(`${API_BASE}/cart/items?guestId=${guestId}`, {
        productId: productId,
        quantity: 2
      });
      console.log(`✅ Add to cart: ${addToCartResponse.status}`);

      // Get cart
      const getCartResponse = await axios.get(`${API_BASE}/cart?guestId=${guestId}`);
      console.log(`✅ Get cart: ${getCartResponse.status}`);
      console.log(`   Cart items: ${getCartResponse.data.items?.length || 0}`);

    } catch (error) {
      console.log(`❌ Cart test failed: ${error.response?.status || 'ERROR'}`);
      console.log(`   Error: ${error.response?.data?.message || error.message}`);
    }

    // 3. Test Order creation with real product
    console.log('\n📦 Testing Order Creation with real product...');
    
    try {
      const orderData = {
        userId: null, // Guest order
        items: [
          {
            productId: productId,
            name: 'Test Product for Cart',
            quantity: 1,
            unitPrice: 100000 // 1000 VND in cents
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

    } catch (error) {
      console.log(`❌ Order creation failed: ${error.response?.status || 'ERROR'}`);
      console.log(`   Error: ${error.response?.data?.message || error.message}`);
    }

    console.log('\n🎉 Test with real data completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testWithRealData();
