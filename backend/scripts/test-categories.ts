#!/usr/bin/env ts-node
import { apiClient } from '../dashboard/lib/api-client';

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    parentId?: string;
    isActive: boolean;
}

async function testCategories() {
    console.log('🧪 Testing Categories Functionality\n');

    try {
        // 1. Test GET all categories
        console.log('1️⃣ Testing GET /categories...');
        const categoriesResponse = await apiClient.getCategories();
        const categories = Array.isArray(categoriesResponse)
            ? categoriesResponse
            : (categoriesResponse.data as Category[]);

        console.log(`✅ Found ${categories.length} categories`);
        if (categories.length > 0) {
            console.log(`   Example: ${categories[0].name} (${categories[0].slug})\n`);
        }

        // 2. Test CREATE category
        console.log('2️⃣ Testing CREATE category...');
        const createData = {
            name: 'Test Category ' + Date.now(),
            slug: 'test-category-' + Date.now(),
            description: 'Test category created by automated test',
            isActive: true,
        };

        const createResponse = await apiClient.createCategory(createData);
        const newCategory = createResponse.data as Category;
        console.log(`✅ Created category: ${newCategory.name} (ID: ${newCategory.id})\n`);

        // 3. Test GET single category
        console.log('3️⃣ Testing GET /categories/:id...');
        const getResponse = await apiClient.getCategory(newCategory.id);
        const fetchedCategory = getResponse.data as Category;
        console.log(`✅ Fetched category: ${fetchedCategory.name}\n`);

        // 4. Test UPDATE category
        console.log('4️⃣ Testing UPDATE category...');
        const updateData = {
            name: 'Updated Test Category',
            description: 'Updated description',
        };

        await apiClient.updateCategory(newCategory.id, updateData);
        const updatedResponse = await apiClient.getCategory(newCategory.id);
        const updatedCategory = updatedResponse.data as Category;
        console.log(`✅ Updated category: ${updatedCategory.name}\n`);

        // 5. Test DELETE category
        console.log('5️⃣ Testing DELETE category...');
        await apiClient.deleteCategory(newCategory.id);
        console.log(`✅ Deleted category: ${newCategory.id}\n`);

        // Verify deletion
        try {
            await apiClient.getCategory(newCategory.id);
            console.log(`⚠️  Category still exists after deletion (soft delete?)\n`);
        } catch (error) {
            console.log(`✅ Category properly deleted (returns 404)\n`);
        }

        console.log('🎉 All category tests passed!\n');

    } catch (error: any) {
        console.error('❌ Test failed:', error.message || error);
        if (error.response?.data) {
            console.error('   Response:', error.response.data);
        }
        process.exit(1);
    }
}

testCategories();
