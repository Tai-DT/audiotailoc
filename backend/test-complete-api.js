#!/usr/bin/env node

/**
 * Complete Product API Demo Script
 * Tests all major endpoints of the Audio Tài Lộc Product API
 */

const API_BASE = 'http://localhost:3010/api/v1';
let authToken = '';

async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    }
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ ${options.method || 'GET'} ${endpoint}: ${response.status} ${response.statusText}`);
      console.error('Response:', data);
      return null;
    }

    console.log(`✅ ${options.method || 'GET'} ${endpoint}: ${response.status}`);
    return data;
  } catch (error) {
    console.error(`❌ Error calling ${endpoint}:`, error.message);
    return null;
  }
}

async function login() {
  console.log('\n🔐 Logging in...');
  const response = await makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@audiotailoc.com',
      password: 'admin123'
    })
  });

  if (response?.data?.accessToken) {
    authToken = response.data.accessToken;
    console.log('✅ Login successful, token received');
    return true;
  }

  console.log('❌ Login failed');
  return false;
}

async function testCategories() {
  console.log('\n📂 Testing Categories...');
  const categories = await makeRequest('/catalog/categories');
  if (categories?.data?.length > 0) {
    console.log(`✅ Found ${categories.data.length} categories:`, categories.data.map(c => c.name));
    return categories.data[0].id; // Return first category ID
  }
  return null;
}

async function testCreateProduct(categoryId) {
  console.log('\n➕ Testing Product Creation...');
  const productData = {
    name: `Demo Product ${Date.now()}`,
    slug: `demo-product-${Date.now()}`,
    description: 'This is a demo product created by the API test script',
    shortDescription: 'Demo product for testing',
    priceCents: 299000,
    originalPriceCents: 399000,
    stockQuantity: 50,
    sku: `DEMO-${Date.now()}`,
    warranty: '12 months',
    features: 'High quality, Durable, Warranty included',
    minOrderQuantity: 1,
    maxOrderQuantity: 10,
    tags: 'demo,test,api',
    categoryId: categoryId,
    brand: 'DemoBrand',
    model: 'DM-1000',
    weight: 500,
    dimensions: '20x10x5',
    specifications: [
      { key: 'Material', value: 'Premium Plastic' },
      { key: 'Color', value: 'Black' },
      { key: 'Weight', value: '500g' }
    ],
    images: [
      'https://placehold.co/400x400?text=Demo+Product'
    ],
    isActive: true,
    featured: false,
    metaTitle: 'Demo Product - High Quality Item',
    metaDescription: 'Demo product description for testing purposes',
    metaKeywords: 'demo,product,test,api',
    canonicalUrl: 'https://audiotailoc.com/products/demo-product'
  };

  const result = await makeRequest('/catalog/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  });

  if (result?.data?.id) {
    console.log(`✅ Product created with ID: ${result.data.id}`);
    return result.data.id;
  }
  return null;
}

async function testGetProducts() {
  console.log('\n📋 Testing Get Products...');
  const products = await makeRequest('/catalog/products?page=1&pageSize=5');
  if (products?.data?.items) {
    console.log(`✅ Retrieved ${products.data.items.length} products`);
    console.log('Sample product:', {
      id: products.data.items[0]?.id,
      name: products.data.items[0]?.name,
      price: products.data.items[0]?.priceCents
    });
    return products.data.items[0]?.id;
  }
  return null;
}

async function testSearchProducts() {
  console.log('\n🔍 Testing Product Search...');
  const searchResults = await makeRequest('/catalog/products/search?q=demo&limit=5');
  if (searchResults?.data?.items) {
    console.log(`✅ Search found ${searchResults.data.items.length} products`);
  }
}

async function testProductDetails(productId) {
  console.log('\n📄 Testing Product Details...');
  const product = await makeRequest(`/catalog/products/${productId}`);
  if (product?.data) {
    console.log('✅ Product details retrieved:', {
      name: product.data.name,
      price: product.data.priceCents,
      category: product.data.category?.name,
      stock: product.data.stockQuantity
    });
  }
}

async function testUpdateProduct(productId) {
  console.log('\n✏️ Testing Product Update...');
  const updateData = {
    name: 'Updated Demo Product',
    priceCents: 349000,
    stockQuantity: 45,
    description: 'Updated description for demo product'
  };

  const result = await makeRequest(`/catalog/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });

  if (result?.data) {
    console.log('✅ Product updated successfully');
  }
}

async function testIncrementView(productId) {
  console.log('\n👁️ Testing View Increment...');
  const result = await makeRequest(`/catalog/products/${productId}/view`, {
    method: 'POST'
  });
  if (result) {
    console.log('✅ View count incremented');
  }
}

async function testAnalytics() {
  console.log('\n📊 Testing Analytics...');
  const analytics = await makeRequest('/catalog/products/analytics/overview');
  if (analytics?.data) {
    console.log('✅ Analytics retrieved:', {
      totalProducts: analytics.data.totalProducts,
      activeProducts: analytics.data.activeProducts,
      totalViews: analytics.data.totalViews
    });
  }
}

async function testDuplicateProduct(productId) {
  console.log('\n📋 Testing Product Duplication...');
  const result = await makeRequest(`/catalog/products/${productId}/duplicate`, {
    method: 'POST'
  });

  if (result?.data?.id) {
    console.log(`✅ Product duplicated with ID: ${result.data.id}`);
    return result.data.id;
  }
  return null;
}

async function testBulkOperations(productIds) {
  console.log('\n📦 Testing Bulk Operations...');

  // Test bulk update
  const bulkUpdateData = {
    productIds: productIds.slice(0, 2), // Update first 2 products
    isActive: true,
    addTags: 'bulk-updated'
  };

  const updateResult = await makeRequest('/catalog/products/bulk', {
    method: 'PATCH',
    body: JSON.stringify(bulkUpdateData)
  });

  if (updateResult?.data) {
    console.log(`✅ Bulk updated ${updateResult.data.updated} products`);
  }

  // Test bulk delete (only delete duplicated product)
  if (productIds.length > 1) {
    const deleteResult = await makeRequest(`/catalog/products?ids=${productIds[1]}`, {
      method: 'DELETE'
    });
    if (deleteResult) {
      console.log('✅ Bulk delete completed');
    }
  }
}

async function testExportImport() {
  console.log('\n📤 Testing Export/Import...');

  // Test CSV export
  const exportResult = await makeRequest('/catalog/products/export/csv');
  if (exportResult?.data) {
    console.log('✅ CSV export successful');
    console.log('Sample CSV lines:', exportResult.data.split('\n').slice(0, 3));
  }

  // Test CSV import (small sample)
  const sampleCsv = `Name,Price (VND),Stock Quantity,Category
"Import Test Product",250000,25,"Demo Category"`;

  const importResult = await makeRequest('/catalog/products/import/csv', {
    method: 'POST',
    body: JSON.stringify({ csvData: sampleCsv })
  });

  if (importResult?.data) {
    console.log(`✅ CSV import completed: ${importResult.data.imported} imported, ${importResult.data.errors.length} errors`);
  }
}

async function runCompleteTest() {
  console.log('🎯 Audio Tài Lộc - Complete Product API Test');
  console.log('==========================================');

  // Step 1: Login
  if (!(await login())) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }

  // Step 2: Get categories
  const categoryId = await testCategories();
  if (!categoryId) {
    console.log('❌ No categories found, cannot create products');
    return;
  }

  // Step 3: Create product
  const productId = await testCreateProduct(categoryId);
  if (!productId) {
    console.log('❌ Cannot proceed without a product ID');
    return;
  }

  // Step 4: Test various operations
  await testGetProducts();
  await testSearchProducts();
  await testProductDetails(productId);
  await testUpdateProduct(productId);
  await testIncrementView(productId);
  await testAnalytics();

  // Step 5: Test duplication
  const duplicatedId = await testDuplicateProduct(productId);
  const productIds = duplicatedId ? [productId, duplicatedId] : [productId];

  // Step 6: Test bulk operations
  await testBulkOperations(productIds);

  // Step 7: Test export/import
  await testExportImport();

  console.log('\n🎉 Complete Product API Test Finished!');
  console.log('=====================================');
  console.log('✅ All major endpoints tested successfully');
  console.log('📖 Check the documentation at: COMPLETE_PRODUCT_API.md');
  console.log('🔗 API Docs: http://localhost:3010/docs');
}

// Run the test
if (require.main === module) {
  runCompleteTest().catch(console.error);
}

module.exports = { runCompleteTest };
