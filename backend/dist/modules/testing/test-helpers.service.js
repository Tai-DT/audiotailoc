"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TestHelpersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestHelpersService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const test_database_service_1 = require("./test-database.service");
let TestHelpersService = TestHelpersService_1 = class TestHelpersService {
    constructor(configService, testDatabaseService) {
        this.configService = configService;
        this.testDatabaseService = testDatabaseService;
        this.logger = new common_1.Logger(TestHelpersService_1.name);
    }
    async generateTestToken(userId, overrides = {}) {
        const payload = {
            sub: userId,
            email: `test${Date.now()}@example.com`,
            role: 'USER',
            ...overrides,
        };
        const secret = this.configService.get('JWT_ACCESS_SECRET', 'test-secret');
        const expiresIn = this.configService.get('JWT_ACCESS_EXPIRES_IN', '1h');
        return jwt.sign(payload, secret, { expiresIn });
    }
    async generateTestRefreshToken(userId) {
        const payload = {
            sub: userId,
            type: 'refresh',
        };
        const secret = this.configService.get('JWT_REFRESH_SECRET', 'test-refresh-secret');
        const expiresIn = this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d');
        return jwt.sign(payload, secret, { expiresIn });
    }
    async hashTestPassword(password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
    async verifyTestPassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
    generateTestFileData(options = {}) {
        const { name = `test-file-${Date.now()}.jpg`, size = 1024, type = 'image/jpeg', content = 'test file content', } = options;
        const buffer = Buffer.from(content);
        return {
            fieldname: 'file',
            originalname: name,
            encoding: '7bit',
            mimetype: type,
            buffer: buffer,
            size: size,
            destination: '/tmp',
            filename: `uploaded-${Date.now()}-${name}`,
            path: `/tmp/uploaded-${Date.now()}-${name}`,
            stream: null,
        };
    }
    generateTestImageData(_width = 100, _height = 100) {
        const pngSignature = Buffer.from([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
            0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
            0xDE, 0x00, 0x00, 0x00, 0x09, 0x70, 0x48, 0x59,
            0x73, 0x00, 0x00, 0x0B, 0x13, 0x00, 0x00, 0x0B,
            0x13, 0x01, 0x00, 0x9A, 0x9C, 0x18, 0x00, 0x00,
            0x00, 0x0C, 0x49, 0x44, 0x41, 0x54, 0x18, 0x57,
            0x63, 0x60, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01,
            0xE2, 0x21, 0xBC, 0x33, 0x00, 0x00, 0x00, 0x00,
            0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
        ]);
        return this.generateTestFileData({
            name: `test-image-${Date.now()}.png`,
            type: 'image/png',
            size: pngSignature.length,
            content: pngSignature.toString(),
        });
    }
    generateTestPaymentData(overrides = {}) {
        return {
            amount: 100000,
            orderId: `order_${Date.now()}`,
            paymentMethod: 'VNPAY',
            description: 'Test payment',
            returnUrl: 'http://localhost:3000/payment/callback',
            ...overrides,
        };
    }
    generateTestWebhookPayload(event, data = {}) {
        return {
            id: `wh_${Date.now()}`,
            event: event,
            data: data,
            timestamp: new Date().toISOString(),
            signature: this.generateTestSignature(data),
        };
    }
    generateTestSignature(data) {
        const secret = this.configService.get('WEBHOOK_SECRET', 'test-webhook-secret');
        const crypto = require('crypto');
        return crypto.createHmac('sha256', secret).update(JSON.stringify(data)).digest('hex');
    }
    generateTestEmailData(overrides = {}) {
        return {
            to: `test${Date.now()}@example.com`,
            subject: 'Test Email Subject',
            template: 'test-template',
            data: {
                name: 'Test User',
                message: 'This is a test message',
            },
            ...overrides,
        };
    }
    generateTestSMSData(overrides = {}) {
        return {
            phone: `0123456789`,
            message: 'This is a test SMS message',
            type: 'OTP',
            ...overrides,
        };
    }
    generateTestAddressData(overrides = {}) {
        return {
            fullName: 'Test User',
            phone: '0123456789',
            address: '123 Test Street',
            ward: 'Test Ward',
            district: 'Test District',
            city: 'Test City',
            postalCode: '70000',
            ...overrides,
        };
    }
    generateTestSearchQuery(overrides = {}) {
        return {
            q: 'test search query',
            category: 'electronics',
            minPrice: 100000,
            maxPrice: 500000,
            sortBy: 'price',
            sortOrder: 'asc',
            page: 1,
            limit: 20,
            ...overrides,
        };
    }
    generateTestAnalyticsEvent(overrides = {}) {
        return {
            event: 'product_view',
            userId: `user_${Date.now()}`,
            productId: `product_${Date.now()}`,
            sessionId: `session_${Date.now()}`,
            timestamp: new Date().toISOString(),
            metadata: {
                source: 'test',
                userAgent: 'Test/1.0',
                ip: '127.0.0.1',
            },
            ...overrides,
        };
    }
    generateTestNotificationData(overrides = {}) {
        return {
            userId: `user_${Date.now()}`,
            type: 'ORDER_STATUS_UPDATE',
            title: 'Order Status Update',
            message: 'Your order has been updated',
            data: {
                orderId: `order_${Date.now()}`,
                status: 'SHIPPED',
            },
            channels: ['push', 'email'],
            priority: 'normal',
            ...overrides,
        };
    }
    generateTestChatMessage(overrides = {}) {
        return {
            userId: `user_${Date.now()}`,
            message: 'Hello, I need help with my order',
            type: 'text',
            sessionId: `session_${Date.now()}`,
            timestamp: new Date().toISOString(),
            ...overrides,
        };
    }
    generateTestBookingData(overrides = {}) {
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
        return {
            userId: `user_${Date.now()}`,
            serviceId: `service_${Date.now()}`,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            notes: 'Test booking notes',
            status: 'PENDING',
            ...overrides,
        };
    }
    generateTestReviewData(overrides = {}) {
        return {
            userId: `user_${Date.now()}`,
            productId: `product_${Date.now()}`,
            rating: 5,
            comment: 'This is an excellent product!',
            images: ['https://example.com/review1.jpg'],
            verified: true,
            ...overrides,
        };
    }
    generateTestPromotionData(overrides = {}) {
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        return {
            name: `Test Promotion ${Date.now()}`,
            description: 'Test promotion description',
            discountType: 'PERCENTAGE',
            discountValue: 20,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            applicableProducts: [`product_${Date.now()}`],
            minOrderValue: 100000,
            maxDiscount: 50000,
            isActive: true,
            ...overrides,
        };
    }
    generateTestInventoryData(overrides = {}) {
        return {
            productId: `product_${Date.now()}`,
            quantity: 100,
            reserved: 10,
            available: 90,
            lowStockThreshold: 20,
            lastUpdated: new Date().toISOString(),
            location: 'Warehouse A',
            ...overrides,
        };
    }
    generateTestCartData(overrides = {}) {
        return {
            userId: `user_${Date.now()}`,
            items: [
                {
                    productId: `product_${Date.now()}`,
                    quantity: 2,
                    price: 100000,
                }
            ],
            total: 200000,
            discount: 0,
            finalTotal: 200000,
            ...overrides,
        };
    }
    generateTestSubscriptionData(overrides = {}) {
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        return {
            userId: `user_${Date.now()}`,
            planId: `plan_${Date.now()}`,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            status: 'ACTIVE',
            autoRenew: true,
            paymentMethod: 'VNPAY',
            ...overrides,
        };
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    generateRandomString(length = 10) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
    generateRandomNumber(min = 0, max = 100) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    generateRandomEmail() {
        return `test${Date.now()}${Math.random().toString(36).substring(7)}@example.com`;
    }
    generateRandomPhone() {
        return `0${Math.floor(Math.random() * 900000000 + 100000000)}`;
    }
    mockExternalServiceResponse(service, operation, success = true) {
        const responses = {
            payment_gateway: {
                create_payment: success ? {
                    success: true,
                    paymentUrl: 'https://payment.example.com/pay/123',
                    transactionId: 'txn_123',
                } : {
                    success: false,
                    error: 'Payment gateway error',
                },
                verify_payment: success ? {
                    success: true,
                    status: 'completed',
                    transactionId: 'txn_123',
                } : {
                    success: false,
                    error: 'Payment verification failed',
                },
            },
            email_service: {
                send_email: success ? {
                    success: true,
                    messageId: 'msg_123',
                } : {
                    success: false,
                    error: 'Email service error',
                },
            },
            sms_service: {
                send_sms: success ? {
                    success: true,
                    messageId: 'sms_123',
                } : {
                    success: false,
                    error: 'SMS service error',
                },
            },
            ai_service: {
                generate_text: success ? {
                    success: true,
                    text: 'This is a generated response from AI',
                    tokens: 10,
                } : {
                    success: false,
                    error: 'AI service error',
                },
            },
            map_service: {
                geocode: success ? {
                    success: true,
                    lat: 10.762622,
                    lng: 106.660172,
                    address: '123 Test Street, Test City',
                } : {
                    success: false,
                    error: 'Geocoding failed',
                },
            },
        };
        return responses[service]?.[operation] || { success: false, error: 'Unknown service or operation' };
    }
    generateTestHeaders(overrides = {}) {
        return {
            'user-agent': 'Test/1.0',
            'content-type': 'application/json',
            'x-forwarded-for': '127.0.0.1',
            'x-real-ip': '127.0.0.1',
            ...overrides,
        };
    }
    generateTestQueryParams(overrides = {}) {
        return {
            page: 1,
            limit: 20,
            sortBy: 'createdAt',
            sortOrder: 'desc',
            ...overrides,
        };
    }
};
exports.TestHelpersService = TestHelpersService;
exports.TestHelpersService = TestHelpersService = TestHelpersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        test_database_service_1.TestDatabaseService])
], TestHelpersService);
//# sourceMappingURL=test-helpers.service.js.map