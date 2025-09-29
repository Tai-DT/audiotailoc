"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TestDatabaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestDatabaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
let TestDatabaseService = TestDatabaseService_1 = class TestDatabaseService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(TestDatabaseService_1.name);
        this.prisma = new client_1.PrismaClient({
            log: ['query', 'info', 'warn', 'error'],
        });
    }
    async createTestUser(overrides = {}) {
        const userData = {
            email: `test${Date.now()}@example.com`,
            password: 'hashedpassword123',
            name: 'Test User',
            phone: '0123456789',
            isActive: true,
            role: 'USER',
            emailVerified: true,
            ...overrides,
        };
        const user = await this.prisma.user.create({
            data: userData,
        });
        this.logger.log(`Created test user: ${user.id}`);
        return user;
    }
    async createTestProduct(overrides = {}) {
        const productData = {
            name: `Test Product ${Date.now()}`,
            description: 'This is a test product',
            price: 100000,
            originalPrice: 120000,
            stock: 10,
            categoryId: overrides.categoryId || 'test-category',
            images: 'https://example.com/image1.jpg',
            isActive: true,
            isFeatured: false,
            seoTitle: `Test Product ${Date.now()}`,
            seoDescription: 'Test product description',
            slug: `test-product-${Date.now()}`,
            priceCents: 10000000,
            ...overrides,
        };
        const product = await this.prisma.product.create({
            data: productData,
        });
        this.logger.log(`Created test product: ${product.id}`);
        return product;
    }
    async createTestCategory(overrides = {}) {
        const categoryData = {
            name: `Test Category ${Date.now()}`,
            slug: `test-category-${Date.now()}`,
            description: 'This is a test category',
            image: 'https://example.com/category.jpg',
            isActive: true,
            sortOrder: 0,
            seoTitle: `Test Category ${Date.now()}`,
            seoDescription: 'Test category description',
            ...overrides,
        };
        const category = await this.prisma.category.create({
            data: categoryData,
        });
        this.logger.log(`Created test category: ${category.id}`);
        return category;
    }
    async createTestOrder(userId, productIds = [], overrides = {}) {
        const orderItems = productIds.map(productId => ({
            productId,
            quantity: 1,
            price: 100000,
            total: 100000,
        }));
        const total = orderItems.reduce((sum, item) => sum + item.total, 0);
        const orderData = {
            userId,
            total,
            status: 'PENDING',
            paymentMethod: 'VNPAY',
            shippingAddress: '123 Test Street, Test City',
            shippingPhone: '0123456789',
            shippingName: 'Test User',
            orderNo: `ORDER-${Date.now()}`,
            totalCents: total * 100,
            ...overrides,
        };
        const order = await this.prisma.order.create({
            data: orderData,
        });
        this.logger.log(`Created test order: ${order.id}`);
        return order;
    }
    async createTestService(overrides = {}) {
        const serviceName = `Test Service ${Date.now()}`;
        const serviceData = {
            name: serviceName,
            slug: serviceName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
            description: 'This is a test service',
            price: 50000,
            basePriceCents: 50000 * 100,
            duration: 60,
            categoryId: overrides.categoryId || 'test-category',
            images: 'https://example.com/service.jpg',
            isActive: true,
            isFeatured: false,
            seoTitle: serviceName,
            seoDescription: 'Test service description',
            category: 'KARAOKE',
            type: 'SERVICE',
            ...overrides,
        };
        const service = await this.prisma.service.create({
            data: serviceData,
        });
        this.logger.log(`Created test service: ${service.id}`);
        return service;
    }
    async cleanupTestData() {
        try {
            await this.prisma.orderItem.deleteMany({
                where: {
                    OR: [
                        { order: { user: { email: { contains: '@example.com' } } } },
                        { product: { name: { contains: 'Test Product' } } },
                    ]
                }
            });
            await this.prisma.order.deleteMany({
                where: { user: { email: { contains: '@example.com' } } }
            });
            await this.prisma.product.deleteMany({
                where: { name: { contains: 'Test Product' } }
            });
            await this.prisma.service.deleteMany({
                where: { name: { contains: 'Test Service' } }
            });
            await this.prisma.category.deleteMany({
                where: { name: { contains: 'Test Category' } }
            });
            await this.prisma.user.deleteMany({
                where: { email: { contains: '@example.com' } }
            });
            this.logger.log('Test data cleanup completed');
        }
        catch (error) {
            this.logger.error('Error during test data cleanup', error);
            throw error;
        }
    }
    async getTestDataCounts() {
        const [users, products, categories, orders, services] = await Promise.all([
            this.prisma.user.count({ where: { email: { contains: '@example.com' } } }),
            this.prisma.product.count({ where: { name: { contains: 'Test Product' } } }),
            this.prisma.category.count({ where: { name: { contains: 'Test Category' } } }),
            this.prisma.order.count({ where: { user: { email: { contains: '@example.com' } } } }),
            this.prisma.service.count({ where: { name: { contains: 'Test Service' } } }),
        ]);
        return {
            users,
            products,
            categories,
            orders,
            services,
        };
    }
    async createTestDataset(options = {}) {
        const { users = 3, categories = 2, products = 5, services = 3, orders = 2, } = options;
        this.logger.log(`Creating test dataset: ${users} users, ${categories} categories, ${products} products, ${services} services, ${orders} orders`);
        const categoryIds = [];
        for (let i = 0; i < categories; i++) {
            const category = await this.createTestCategory({
                name: `Test Category ${i + 1}`,
                slug: `test-category-${i + 1}`,
            });
            categoryIds.push(category.id);
        }
        const userIds = [];
        for (let i = 0; i < users; i++) {
            const user = await this.createTestUser({
                email: `testuser${i + 1}@example.com`,
                name: `Test User ${i + 1}`,
                phone: `012345678${i}`,
            });
            userIds.push(user.id);
        }
        const productIds = [];
        for (let i = 0; i < products; i++) {
            const product = await this.createTestProduct({
                name: `Test Product ${i + 1}`,
                price: (i + 1) * 50000,
                categoryId: categoryIds[i % categoryIds.length],
            });
            productIds.push(product.id);
        }
        const serviceIds = [];
        for (let i = 0; i < services; i++) {
            const service = await this.createTestService({
                name: `Test Service ${i + 1}`,
                price: (i + 1) * 30000,
                duration: 30 + (i * 30),
                categoryId: categoryIds[i % categoryIds.length],
            });
            serviceIds.push(service.id);
        }
        for (let i = 0; i < orders; i++) {
            const userId = userIds[i % userIds.length];
            const orderProducts = productIds.slice(0, Math.min(3, productIds.length));
            await this.createTestOrder(userId, orderProducts, {
                total: orderProducts.length * 100000,
                status: i % 2 === 0 ? 'PENDING' : 'COMPLETED',
            });
        }
        this.logger.log('Test dataset creation completed');
        return {
            userIds,
            categoryIds,
            productIds,
            serviceIds,
        };
    }
    async checkDatabaseHealth() {
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            return true;
        }
        catch (error) {
            this.logger.error('Database health check failed', error);
            return false;
        }
    }
    async resetDatabase() {
        try {
            await this.cleanupTestData();
            await this.prisma.$executeRaw `SELECT setval('user_id_seq', 1, false)`;
            await this.prisma.$executeRaw `SELECT setval('product_id_seq', 1, false)`;
            await this.prisma.$executeRaw `SELECT setval('category_id_seq', 1, false)`;
            await this.prisma.$executeRaw `SELECT setval('order_id_seq', 1, false)`;
            await this.prisma.$executeRaw `SELECT setval('service_id_seq', 1, false)`;
            this.logger.log('Database reset completed');
        }
        catch (error) {
            this.logger.error('Error during database reset', error);
            throw error;
        }
    }
    getPrismaClient() {
        return this.prisma;
    }
    async closeConnection() {
        await this.prisma.$disconnect();
    }
};
exports.TestDatabaseService = TestDatabaseService;
exports.TestDatabaseService = TestDatabaseService = TestDatabaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TestDatabaseService);
//# sourceMappingURL=test-database.service.js.map