/// <reference types="multer" />
import { ConfigService } from '@nestjs/config';
import { TestDatabaseService } from './test-database.service';
export declare class TestHelpersService {
    private configService;
    private testDatabaseService;
    private readonly logger;
    constructor(configService: ConfigService, testDatabaseService: TestDatabaseService);
    generateTestToken(userId: string, overrides?: Partial<any>): Promise<string>;
    generateTestRefreshToken(userId: string): Promise<string>;
    hashTestPassword(password: string): Promise<string>;
    verifyTestPassword(password: string, hash: string): Promise<boolean>;
    generateTestFileData(options?: {
        name?: string;
        size?: number;
        type?: string;
        content?: string;
    }): Express.Multer.File;
    generateTestImageData(_width?: number, _height?: number): Express.Multer.File;
    generateTestPaymentData(overrides?: Partial<any>): {
        amount: number;
        orderId: string;
        paymentMethod: string;
        description: string;
        returnUrl: string;
    };
    generateTestWebhookPayload(event: string, data?: any): {
        id: string;
        event: string;
        data: any;
        timestamp: string;
        signature: string;
    };
    generateTestSignature(data: any): string;
    generateTestEmailData(overrides?: Partial<any>): {
        to: string;
        subject: string;
        template: string;
        data: {
            name: string;
            message: string;
        };
    };
    generateTestSMSData(overrides?: Partial<any>): {
        phone: string;
        message: string;
        type: string;
    };
    generateTestAddressData(overrides?: Partial<any>): {
        fullName: string;
        phone: string;
        address: string;
        ward: string;
        district: string;
        city: string;
        postalCode: string;
    };
    generateTestSearchQuery(overrides?: Partial<any>): {
        q: string;
        category: string;
        minPrice: number;
        maxPrice: number;
        sortBy: string;
        sortOrder: string;
        page: number;
        limit: number;
    };
    generateTestAnalyticsEvent(overrides?: Partial<any>): {
        event: string;
        userId: string;
        productId: string;
        sessionId: string;
        timestamp: string;
        metadata: {
            source: string;
            userAgent: string;
            ip: string;
        };
    };
    generateTestNotificationData(overrides?: Partial<any>): {
        userId: string;
        type: string;
        title: string;
        message: string;
        data: {
            orderId: string;
            status: string;
        };
        channels: string[];
        priority: string;
    };
    generateTestChatMessage(overrides?: Partial<any>): {
        userId: string;
        message: string;
        type: string;
        sessionId: string;
        timestamp: string;
    };
    generateTestBookingData(overrides?: Partial<any>): {
        userId: string;
        serviceId: string;
        startTime: string;
        endTime: string;
        notes: string;
        status: string;
    };
    generateTestReviewData(overrides?: Partial<any>): {
        userId: string;
        productId: string;
        rating: number;
        comment: string;
        images: string[];
        verified: boolean;
    };
    generateTestPromotionData(overrides?: Partial<any>): {
        name: string;
        description: string;
        discountType: string;
        discountValue: number;
        startDate: string;
        endDate: string;
        applicableProducts: string[];
        minOrderValue: number;
        maxDiscount: number;
        isActive: boolean;
    };
    generateTestInventoryData(overrides?: Partial<any>): {
        productId: string;
        quantity: number;
        reserved: number;
        available: number;
        lowStockThreshold: number;
        lastUpdated: string;
        location: string;
    };
    generateTestCartData(overrides?: Partial<any>): {
        userId: string;
        items: {
            productId: string;
            quantity: number;
            price: number;
        }[];
        total: number;
        discount: number;
        finalTotal: number;
    };
    generateTestSubscriptionData(overrides?: Partial<any>): {
        userId: string;
        planId: string;
        startDate: string;
        endDate: string;
        status: string;
        autoRenew: boolean;
        paymentMethod: string;
    };
    sleep(ms: number): Promise<void>;
    generateRandomString(length?: number): string;
    generateRandomNumber(min?: number, max?: number): number;
    generateRandomEmail(): string;
    generateRandomPhone(): string;
    mockExternalServiceResponse(service: string, operation: string, success?: boolean): any;
    generateTestHeaders(overrides?: Record<string, string>): {
        'user-agent': string;
        'content-type': string;
        'x-forwarded-for': string;
        'x-real-ip': string;
    };
    generateTestQueryParams(overrides?: Record<string, any>): {
        page: number;
        limit: number;
        sortBy: string;
        sortOrder: string;
    };
}
