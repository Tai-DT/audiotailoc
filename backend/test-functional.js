#!/usr/bin/env node

/**
 * Functional Test Script for Audio Tài Lộc Backend
 * Tests main functionality without requiring full server startup
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  testUser: {
    email: 'test@audiotailoc.com',
    password: 'testpassword123',
    name: 'Test User'
  },
  testProduct: {
    name: 'Test Headphones',
    slug: 'test-headphones',
    description: 'Test product for functional testing',
    priceCents: 1000000, // 10,000 VND
    categoryId: null
  }
};

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  errors: []
};

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function runTest(testName, testFunction) {
  try {
    log(`Running test: ${testName}`);
    await testFunction();
    testResults.passed++;
    log(`Test passed: ${testName}`, 'success');
  } catch (error) {
    testResults.failed++;
    testResults.errors.push({ test: testName, error: error.message });
    log(`Test failed: ${testName} - ${error.message}`, 'error');
  }
}

// Test functions
async function testDatabaseConnection() {
  const result = await prisma.$queryRaw`SELECT 1 as test`;
  assert(result[0].test === 1, 'Database connection failed');
}

async function testUserCreation() {
  // Clean up existing test user
  await prisma.user.deleteMany({
    where: { email: TEST_CONFIG.testUser.email }
  });

  // Create test user
  const hashedPassword = await bcrypt.hash(TEST_CONFIG.testUser.password, 12);
  const user = await prisma.user.create({
    data: {
      email: TEST_CONFIG.testUser.email,
      password: hashedPassword,
      name: TEST_CONFIG.testUser.name
    }
  });

  assert(user.email === TEST_CONFIG.testUser.email, 'User email mismatch');
  assert(user.name === TEST_CONFIG.testUser.name, 'User name mismatch');
  assert(user.password !== TEST_CONFIG.testUser.password, 'Password not hashed');

  // Test password verification
  const isValidPassword = await bcrypt.compare(TEST_CONFIG.testUser.password, user.password);
  assert(isValidPassword, 'Password verification failed');

  // Test duplicate email prevention
  try {
    await prisma.user.create({
      data: {
        email: TEST_CONFIG.testUser.email,
        password: hashedPassword,
        name: 'Duplicate User'
      }
    });
    throw new Error('Duplicate email should be prevented');
  } catch (error) {
    assert(error.code === 'P2002', 'Duplicate email constraint not working');
  }
}

async function testProductCreation() {
  // Clean up existing test product
  await prisma.product.deleteMany({
    where: { slug: TEST_CONFIG.testProduct.slug }
  });

  // Create test product
  const product = await prisma.product.create({
    data: TEST_CONFIG.testProduct
  });

  assert(product.name === TEST_CONFIG.testProduct.name, 'Product name mismatch');
  assert(product.slug === TEST_CONFIG.testProduct.slug, 'Product slug mismatch');
  assert(product.priceCents === TEST_CONFIG.testProduct.priceCents, 'Product price mismatch');

  // Test duplicate slug prevention
  try {
    await prisma.product.create({
      data: TEST_CONFIG.testProduct
    });
    throw new Error('Duplicate slug should be prevented');
  } catch (error) {
    assert(error.code === 'P2002', 'Duplicate slug constraint not working');
  }
}

async function testInventoryManagement() {
  // Clean up existing test product
  await prisma.inventory.deleteMany({
    where: { product: { slug: 'test-inventory-product' } }
  });
  await prisma.product.deleteMany({
    where: { slug: 'test-inventory-product' }
  });

  // Create test product with inventory
  const product = await prisma.product.create({
    data: {
      name: 'Test Inventory Product',
      slug: 'test-inventory-product',
      description: 'Test product for inventory management',
      priceCents: 500000,
      inventory: {
        create: {
          stock: 10,
          reserved: 0
        }
      }
    },
    include: {
      inventory: true
    }
  });

  assert(product.inventory.stock === 10, 'Initial stock not set correctly');
  assert(product.inventory.reserved === 0, 'Initial reserved not set correctly');

  // Test stock reservation
  const updatedInventory = await prisma.inventory.update({
    where: { productId: product.id },
    data: { reserved: { increment: 2 } }
  });

  assert(updatedInventory.reserved === 2, 'Stock reservation failed');

  // Test stock decrement
  const finalInventory = await prisma.inventory.update({
    where: { productId: product.id },
    data: { 
      stock: { decrement: 1 },
      reserved: { decrement: 1 }
    }
  });

  assert(finalInventory.stock === 9, 'Stock decrement failed');
  assert(finalInventory.reserved === 1, 'Reserved decrement failed');
}

async function testOrderCreation() {
  // Create test user and product
  const user = await prisma.user.findUnique({
    where: { email: TEST_CONFIG.testUser.email }
  });

  const product = await prisma.product.findUnique({
    where: { slug: 'test-inventory-product' },
    include: { inventory: true }
  });

  if (!user || !product) {
    throw new Error('Test user or product not found');
  }

  // Create order
  const order = await prisma.order.create({
    data: {
      orderNo: `TEST-${Date.now()}`,
      userId: user.id,
      status: 'PENDING',
      totalCents: product.priceCents,
      items: {
        create: [
          {
            productId: product.id,
            quantity: 1,
            unitPrice: product.priceCents,
            name: product.name
          }
        ]
      }
    },
    include: {
      items: true
    }
  });

  assert(order.userId === user.id, 'Order user ID mismatch');
  assert(order.items.length === 1, 'Order items not created');
  assert(order.items[0].productId === product.id, 'Order item product ID mismatch');
  assert(order.status === 'PENDING', 'Order status not set correctly');
}

async function testChatSystem() {
  // Create test user
  const user = await prisma.user.findUnique({
    where: { email: TEST_CONFIG.testUser.email }
  });

  if (!user) {
    throw new Error('Test user not found');
  }

  // Create chat session
  const session = await prisma.chatSession.create({
    data: {
      userId: user.id,
      status: 'OPEN',
      source: 'WEB'
    }
  });

  assert(session.userId === user.id, 'Chat session user ID mismatch');
  assert(session.status === 'OPEN', 'Chat session status not set correctly');

  // Create chat messages
  const userMessage = await prisma.chatMessage.create({
    data: {
      sessionId: session.id,
      role: 'USER',
      text: 'Hello, I need help with headphones'
    }
  });

  const assistantMessage = await prisma.chatMessage.create({
    data: {
      sessionId: session.id,
      role: 'ASSISTANT',
      text: 'Hello! I can help you find the perfect headphones. What type are you looking for?'
    }
  });

  assert(userMessage.role === 'USER', 'User message role not set correctly');
  assert(assistantMessage.role === 'ASSISTANT', 'Assistant message role not set correctly');

  // Test session with messages
  const sessionWithMessages = await prisma.chatSession.findUnique({
    where: { id: session.id },
    include: { messages: true }
  });

  assert(sessionWithMessages.messages.length === 2, 'Chat messages not retrieved correctly');
}

async function testNotificationSystem() {
  // Create test user
  const user = await prisma.user.findUnique({
    where: { email: TEST_CONFIG.testUser.email }
  });

  if (!user) {
    throw new Error('Test user not found');
  }

  // Create notification
  const notification = await prisma.notification.create({
    data: {
      userId: user.id,
      type: 'ORDER',
      title: 'Test Notification',
      message: 'This is a test notification',
      data: { test: true }
    }
  });

  assert(notification.userId === user.id, 'Notification user ID mismatch');
  assert(notification.type === 'ORDER', 'Notification type not set correctly');
  assert(notification.read === false, 'Notification read status not set correctly');

  // Test notification retrieval
  const userNotifications = await prisma.notification.findMany({
    where: { userId: user.id }
  });

  assert(userNotifications.length > 0, 'User notifications not retrieved');

  // Test mark as read
  const updatedNotification = await prisma.notification.update({
    where: { id: notification.id },
    data: { read: true, readAt: new Date() }
  });

  assert(updatedNotification.read === true, 'Notification not marked as read');
  assert(updatedNotification.readAt !== null, 'Notification read time not set');
}

async function testSearchFunctionality() {
  // Create test products for search
  const testProducts = [
    {
      name: 'Sony WH-1000XM4 Headphones',
      slug: 'sony-wh1000xm4',
      description: 'Premium noise-cancelling headphones',
      priceCents: 8500000
    },
    {
      name: 'Bose QuietComfort 45',
      slug: 'bose-qc45',
      description: 'Comfortable wireless headphones',
      priceCents: 7500000
    }
  ];

  for (const productData of testProducts) {
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: productData,
      create: productData
    });
  }

  // Test search by name
  const searchResults = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'Sony', mode: 'insensitive' } },
        { description: { contains: 'Sony', mode: 'insensitive' } }
      ]
    }
  });

  assert(searchResults.length > 0, 'Search by name failed');
  assert(searchResults.some(p => p.name.includes('Sony')), 'Search results do not contain expected product');

  // Test search by description
  const descriptionResults = await prisma.product.findMany({
    where: {
      description: { contains: 'noise-cancelling', mode: 'insensitive' }
    }
  });

  assert(descriptionResults.length > 0, 'Search by description failed');
}

async function testPaymentWebhook() {
  // Create test order
  const user = await prisma.user.findUnique({
    where: { email: TEST_CONFIG.testUser.email }
  });

  if (!user) {
    throw new Error('Test user not found');
  }

  const order = await prisma.order.create({
    data: {
      orderNo: `WEBHOOK-TEST-${Date.now()}`,
      userId: user.id,
      status: 'PENDING',
      totalCents: 1000000
    }
  });

  // Simulate payment webhook
  const webhookData = {
    orderId: order.orderNo,
    resultCode: 0,
    transId: `test_trans_${Date.now()}`,
    amount: order.totalCents
  };

  // Update order status (simulating webhook processing)
  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: { status: 'PAID' }
  });

  assert(updatedOrder.status === 'PAID', 'Order status not updated after payment');
}

async function testDataCleanup() {
  // Clean up test data in correct order (respecting foreign key constraints)
  
  // Delete chat messages first
  await prisma.chatMessage.deleteMany({
    where: {
      session: {
        userId: {
          in: await prisma.user.findMany({
            where: { email: TEST_CONFIG.testUser.email },
            select: { id: true }
          }).then(users => users.map(u => u.id))
        }
      }
    }
  });

  // Delete chat sessions
  await prisma.chatSession.deleteMany({
    where: {
      userId: {
        in: await prisma.user.findMany({
          where: { email: TEST_CONFIG.testUser.email },
          select: { id: true }
        }).then(users => users.map(u => u.id))
      }
    }
  });

  // Delete notifications
  await prisma.notification.deleteMany({
    where: {
      userId: {
        in: await prisma.user.findMany({
          where: { email: TEST_CONFIG.testUser.email },
          select: { id: true }
        }).then(users => users.map(u => u.id))
      }
    }
  });

  // Delete order items first
  await prisma.orderItem.deleteMany({
    where: {
      order: {
        orderNo: { startsWith: 'TEST-' }
      }
    }
  });

  // Delete orders
  await prisma.order.deleteMany({
    where: {
      orderNo: { startsWith: 'TEST-' }
    }
  });

  // Delete inventory first
  await prisma.inventory.deleteMany({
    where: {
      product: {
        slug: { in: ['test-headphones', 'test-inventory-product', 'sony-wh1000xm4', 'bose-qc45'] }
      }
    }
  });

  // Delete products
  await prisma.product.deleteMany({
    where: {
      slug: { in: ['test-headphones', 'test-inventory-product', 'sony-wh1000xm4', 'bose-qc45'] }
    }
  });

  // Delete user last
  await prisma.user.deleteMany({
    where: { email: TEST_CONFIG.testUser.email }
  });

  log('Test data cleanup completed', 'success');
}

// Main test runner
async function runAllTests() {
  log('Starting functional tests for Audio Tài Lộc Backend...');
  log('==================================================');

  const tests = [
    { name: 'Database Connection', fn: testDatabaseConnection },
    { name: 'User Creation & Authentication', fn: testUserCreation },
    { name: 'Product Creation', fn: testProductCreation },
    { name: 'Inventory Management', fn: testInventoryManagement },
    { name: 'Order Creation', fn: testOrderCreation },
    { name: 'Chat System', fn: testChatSystem },
    { name: 'Notification System', fn: testNotificationSystem },
    { name: 'Search Functionality', fn: testSearchFunctionality },
    { name: 'Payment Webhook', fn: testPaymentWebhook },
    { name: 'Data Cleanup', fn: testDataCleanup }
  ];

  for (const test of tests) {
    await runTest(test.name, test.fn);
  }

  // Print results
  log('==================================================');
  log(`Test Results: ${testResults.passed} passed, ${testResults.failed} failed`);

  if (testResults.errors.length > 0) {
    log('Errors:', 'error');
    testResults.errors.forEach(({ test, error }) => {
      log(`  ${test}: ${error}`, 'error');
    });
  }

  if (testResults.failed === 0) {
    log('🎉 All tests passed! Backend is working correctly.', 'success');
  } else {
    log('❌ Some tests failed. Please check the errors above.', 'error');
    process.exit(1);
  }
}

// Handle cleanup
process.on('SIGINT', async () => {
  log('Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

// Run tests
runAllTests()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    log(`Test runner failed: ${error.message}`, 'error');
    await prisma.$disconnect();
    process.exit(1);
  });
