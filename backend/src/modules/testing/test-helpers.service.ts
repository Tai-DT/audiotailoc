import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { TestDatabaseService } from './test-database.service';

@Injectable()
export class TestHelpersService {
  private readonly logger = new Logger(TestHelpersService.name);

  constructor(
    private configService: ConfigService,
    private testDatabaseService: TestDatabaseService,
  ) {}

  // Generate test JWT tokens
  async generateTestToken(userId: string, overrides: Partial<any> = {}): Promise<string> {
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

  async generateTestRefreshToken(userId: string): Promise<string> {
    const payload = {
      sub: userId,
      type: 'refresh',
    };

    const secret = this.configService.get('JWT_REFRESH_SECRET', 'test-refresh-secret');
    const expiresIn = this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d');

    return jwt.sign(payload, secret, { expiresIn });
  }

  // Hash passwords for testing
  async hashTestPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  // Verify test password
  async verifyTestPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Generate test file data
  generateTestFileData(options: {
    name?: string;
    size?: number;
    type?: string;
    content?: string;
  } = {}): Express.Multer.File {
    const {
      name = `test-file-${Date.now()}.jpg`,
      size = 1024,
      type = 'image/jpeg',
      content = 'test file content',
    } = options;

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
      stream: null as any,
    };
  }

  // Generate test image data
  generateTestImageData(width: number = 100, height: number = 100): Express.Multer.File {
    // Create a simple test image (1x1 pixel PNG)
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

  // Generate test payment data
  generateTestPaymentData(overrides: Partial<any> = {}) {
    return {
      amount: 100000,
      orderId: `order_${Date.now()}`,
      paymentMethod: 'VNPAY',
      description: 'Test payment',
      returnUrl: 'http://localhost:3000/payment/callback',
      ...overrides,
    };
  }

  // Generate test webhook payload
  generateTestWebhookPayload(event: string, data: any = {}) {
    return {
      id: `wh_${Date.now()}`,
      event: event,
      data: data,
      timestamp: new Date().toISOString(),
      signature: this.generateTestSignature(data),
    };
  }

  // Generate test signature for webhooks
  generateTestSignature(data: any): string {
    const secret = this.configService.get('WEBHOOK_SECRET', 'test-webhook-secret');
    const crypto = require('crypto');
    return crypto.createHmac('sha256', secret).update(JSON.stringify(data)).digest('hex');
  }

  // Generate test email data
  generateTestEmailData(overrides: Partial<any> = {}) {
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

  // Generate test SMS data
  generateTestSMSData(overrides: Partial<any> = {}) {
    return {
      phone: `0123456789`,
      message: 'This is a test SMS message',
      type: 'OTP',
      ...overrides,
    };
  }

  // Generate test address data
  generateTestAddressData(overrides: Partial<any> = {}) {
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

  // Generate test search query
  generateTestSearchQuery(overrides: Partial<any> = {}) {
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

  // Generate test analytics event
  generateTestAnalyticsEvent(overrides: Partial<any> = {}) {
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

  // Generate test notification data
  generateTestNotificationData(overrides: Partial<any> = {}) {
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

  // Generate test AI prompt data
  generateTestAIPromptData(overrides: Partial<any> = {}) {
    return {
      prompt: 'Generate a product description for a smartphone',
      model: 'gemini-1.5-flash',
      temperature: 0.7,
      maxTokens: 500,
      context: {
        productId: `product_${Date.now()}`,
        category: 'electronics',
      },
      ...overrides,
    };
  }

  // Generate test chat message
  generateTestChatMessage(overrides: Partial<any> = {}) {
    return {
      userId: `user_${Date.now()}`,
      message: 'Hello, I need help with my order',
      type: 'text',
      sessionId: `session_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...overrides,
    };
  }

  // Generate test booking data
  generateTestBookingData(overrides: Partial<any> = {}) {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later

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

  // Generate test review data
  generateTestReviewData(overrides: Partial<any> = {}) {
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

  // Generate test promotion data
  generateTestPromotionData(overrides: Partial<any> = {}) {
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days later

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

  // Generate test inventory data
  generateTestInventoryData(overrides: Partial<any> = {}) {
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

  // Generate test cart data
  generateTestCartData(overrides: Partial<any> = {}) {
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

  // Generate test subscription data
  generateTestSubscriptionData(overrides: Partial<any> = {}) {
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days later

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

  // Utility functions for tests
  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  generateRandomString(length: number = 10): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  generateRandomNumber(min: number = 0, max: number = 100): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateRandomEmail(): string {
    return `test${Date.now()}${Math.random().toString(36).substring(7)}@example.com`;
  }

  generateRandomPhone(): string {
    return `0${Math.floor(Math.random() * 900000000 + 100000000)}`;
  }

  // Mock external service responses
  mockExternalServiceResponse(service: string, operation: string, success: boolean = true) {
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

    return (responses as any)[service]?.[operation] || { success: false, error: 'Unknown service or operation' };
  }

  // Create test HTTP headers
  generateTestHeaders(overrides: Record<string, string> = {}) {
    return {
      'user-agent': 'Test/1.0',
      'content-type': 'application/json',
      'x-forwarded-for': '127.0.0.1',
      'x-real-ip': '127.0.0.1',
      ...overrides,
    };
  }

  // Generate test query parameters
  generateTestQueryParams(overrides: Record<string, any> = {}) {
    return {
      page: 1,
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      ...overrides,
    };
  }
}
