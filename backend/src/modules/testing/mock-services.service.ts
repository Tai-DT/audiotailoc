import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MockServicesService {
  private readonly logger = new Logger(MockServicesService.name);
  private mocksEnabled: boolean;
  private mockResponses: Map<string, any> = new Map();

  constructor(private configService: ConfigService) {
    this.mocksEnabled = this.configService.get('TESTING_MOCK_SERVICES', 'false') === 'true';
  }

  // Mock external payment gateway
  async mockPaymentGateway(operation: string, data: any = {}) {
    if (!this.mocksEnabled) {
      throw new Error('Mock services are disabled in production');
    }

    const mockResponse = this.getMockPaymentResponse(operation, data);
    this.logger.log(`Mock Payment Gateway - ${operation}:`, mockResponse);

    return mockResponse;
  }

  private getMockPaymentResponse(operation: string, data: any) {
    const responses = {
      create_payment_url: {
        success: true,
        paymentUrl: `https://mock-payment.com/pay/${data.orderId || 'test'}`,
        transactionId: `mock_txn_${Date.now()}`,
        amount: data.amount || 100000,
        orderId: data.orderId || 'test_order',
      },
      verify_payment: {
        success: Math.random() > 0.1, // 90% success rate
        transactionId: data.transactionId || 'mock_txn_123',
        status: Math.random() > 0.1 ? 'completed' : 'failed',
        amount: data.amount || 100000,
        orderId: data.orderId || 'test_order',
      },
      refund_payment: {
        success: Math.random() > 0.2, // 80% success rate
        transactionId: data.transactionId || 'mock_txn_123',
        refundAmount: data.amount || 100000,
        status: 'refunded',
      },
    };

    return responses[operation] || {
      success: false,
      error: `Unknown payment operation: ${operation}`,
    };
  }

  // Mock AI service
  async mockAIService(operation: string, data: any = {}) {
    if (!this.mocksEnabled) {
      throw new Error('Mock services are disabled in production');
    }

    const mockResponse = this.getMockAIResponse(operation, data);
    this.logger.log(`Mock AI Service - ${operation}:`, mockResponse);

    return mockResponse;
  }

  private getMockAIResponse(operation: string, data: any) {
    const responses = {
      generate_text: {
        success: true,
        text: `Mock AI response for prompt: "${data.prompt || 'test prompt'}"`,
        tokens: Math.floor(Math.random() * 100) + 50,
        model: data.model || 'mock-gemini',
        finishReason: 'stop',
      },
      analyze_image: {
        success: true,
        description: 'Mock image analysis result',
        tags: ['test', 'mock', 'image'],
        confidence: 0.95,
      },
      chat_completion: {
        success: true,
        message: {
          role: 'assistant',
          content: `Mock chat response to: "${data.message || 'test message'}"`,
        },
        tokens: Math.floor(Math.random() * 200) + 100,
        finishReason: 'stop',
      },
      embed_text: {
        success: true,
        embedding: Array.from({ length: 768 }, () => Math.random() * 2 - 1),
        tokens: data.text ? data.text.split(' ').length : 10,
      },
    };

    return responses[operation] || {
      success: false,
      error: `Unknown AI operation: ${operation}`,
    };
  }

  // Mock email service
  async mockEmailService(operation: string, data: any = {}) {
    if (!this.mocksEnabled) {
      throw new Error('Mock services are disabled in production');
    }

    const mockResponse = this.getMockEmailResponse(operation, data);
    this.logger.log(`Mock Email Service - ${operation}:`, mockResponse);

    return mockResponse;
  }

  private getMockEmailResponse(operation: string, data: any) {
    const responses = {
      send_email: {
        success: Math.random() > 0.05, // 95% success rate
        messageId: `mock_msg_${Date.now()}`,
        to: data.to || 'test@example.com',
        subject: data.subject || 'Test Email',
        status: 'sent',
      },
      send_template_email: {
        success: Math.random() > 0.1, // 90% success rate
        messageId: `mock_template_msg_${Date.now()}`,
        template: data.template || 'test-template',
        to: data.to || 'test@example.com',
        data: data.data || {},
      },
      verify_email: {
        success: true,
        email: data.email || 'test@example.com',
        verified: Math.random() > 0.2, // 80% verified
        verificationDate: new Date().toISOString(),
      },
    };

    return responses[operation] || {
      success: false,
      error: `Unknown email operation: ${operation}`,
    };
  }

  // Mock SMS service
  async mockSMSService(operation: string, data: any = {}) {
    if (!this.mocksEnabled) {
      throw new Error('Mock services are disabled in production');
    }

    const mockResponse = this.getMockSMSResponse(operation, data);
    this.logger.log(`Mock SMS Service - ${operation}:`, mockResponse);

    return mockResponse;
  }

  private getMockSMSResponse(operation: string, data: any) {
    const responses = {
      send_sms: {
        success: Math.random() > 0.1, // 90% success rate
        messageId: `mock_sms_${Date.now()}`,
        to: data.phone || '0123456789',
        message: data.message || 'Test SMS',
        status: 'sent',
      },
      send_otp: {
        success: true,
        otp: Math.floor(100000 + Math.random() * 900000).toString(),
        expiresIn: 300, // 5 minutes
        messageId: `mock_otp_${Date.now()}`,
      },
      verify_otp: {
        success: Math.random() > 0.2, // 80% success rate
        verified: true,
        phone: data.phone || '0123456789',
      },
    };

    return responses[operation] || {
      success: false,
      error: `Unknown SMS operation: ${operation}`,
    };
  }

  // Mock file storage service
  async mockFileStorageService(operation: string, data: any = {}) {
    if (!this.mocksEnabled) {
      throw new Error('Mock services are disabled in production');
    }

    const mockResponse = this.getMockFileStorageResponse(operation, data);
    this.logger.log(`Mock File Storage - ${operation}:`, mockResponse);

    return mockResponse;
  }

  private getMockFileStorageResponse(operation: string, data: any) {
    const responses = {
      upload_file: {
        success: true,
        fileId: `mock_file_${Date.now()}`,
        url: `https://mock-storage.com/files/${Date.now()}`,
        filename: data.filename || 'test.jpg',
        size: data.size || 1024,
        type: data.type || 'image/jpeg',
      },
      delete_file: {
        success: Math.random() > 0.1, // 90% success rate
        fileId: data.fileId || 'mock_file_123',
        deleted: true,
      },
      get_file_info: {
        success: true,
        fileId: data.fileId || 'mock_file_123',
        url: `https://mock-storage.com/files/${data.fileId || '123'}`,
        size: 1024,
        type: 'image/jpeg',
        uploadedAt: new Date().toISOString(),
      },
    };

    return responses[operation] || {
      success: false,
      error: `Unknown file storage operation: ${operation}`,
    };
  }

  // Mock geolocation service
  async mockGeolocationService(operation: string, data: any = {}) {
    if (!this.mocksEnabled) {
      throw new Error('Mock services are disabled in production');
    }

    const mockResponse = this.getMockGeolocationResponse(operation, data);
    this.logger.log(`Mock Geolocation Service - ${operation}:`, mockResponse);

    return mockResponse;
  }

  private getMockGeolocationResponse(operation: string, data: any) {
    const responses = {
      geocode_address: {
        success: Math.random() > 0.1, // 90% success rate
        address: data.address || '123 Test Street',
        latitude: 10.762622 + (Math.random() - 0.5) * 0.01,
        longitude: 106.660172 + (Math.random() - 0.5) * 0.01,
        formattedAddress: `${data.address || '123 Test Street'}, Test City`,
      },
      reverse_geocode: {
        success: true,
        latitude: data.lat || 10.762622,
        longitude: data.lng || 106.660172,
        address: '123 Test Street, Test District, Test City',
        components: {
          street: 'Test Street',
          ward: 'Test Ward',
          district: 'Test District',
          city: 'Test City',
        },
      },
      calculate_distance: {
        success: true,
        origin: data.origin || '10.762622,106.660172',
        destination: data.destination || '10.762622,106.660172',
        distance: Math.floor(Math.random() * 10) + 1, // 1-10 km
        duration: Math.floor(Math.random() * 30) + 5, // 5-35 minutes
        distanceText: '5.2 km',
        durationText: '12 mins',
      },
    };

    return responses[operation] || {
      success: false,
      error: `Unknown geolocation operation: ${operation}`,
    };
  }

  // Mock notification service
  async mockNotificationService(operation: string, data: any = {}) {
    if (!this.mocksEnabled) {
      throw new Error('Mock services are disabled in production');
    }

    const mockResponse = this.getMockNotificationResponse(operation, data);
    this.logger.log(`Mock Notification Service - ${operation}:`, mockResponse);

    return mockResponse;
  }

  private getMockNotificationResponse(operation: string, data: any) {
    const responses = {
      send_push_notification: {
        success: Math.random() > 0.1, // 90% success rate
        notificationId: `mock_push_${Date.now()}`,
        userId: data.userId || 'user_123',
        title: data.title || 'Test Notification',
        message: data.message || 'Test message',
        status: 'sent',
      },
      send_email_notification: {
        success: Math.random() > 0.05, // 95% success rate
        notificationId: `mock_email_${Date.now()}`,
        userId: data.userId || 'user_123',
        email: data.email || 'test@example.com',
        template: data.template || 'notification',
        status: 'sent',
      },
      create_notification: {
        success: true,
        notificationId: `mock_notif_${Date.now()}`,
        userId: data.userId || 'user_123',
        type: data.type || 'GENERAL',
        title: data.title || 'Test Notification',
        message: data.message || 'Test message',
        data: data.data || {},
        read: false,
        createdAt: new Date().toISOString(),
      },
    };

    return responses[operation] || {
      success: false,
      error: `Unknown notification operation: ${operation}`,
    };
  }

  // Mock analytics service
  async mockAnalyticsService(operation: string, data: any = {}) {
    if (!this.mocksEnabled) {
      throw new Error('Mock services are disabled in production');
    }

    const mockResponse = this.getMockAnalyticsResponse(operation, data);
    this.logger.log(`Mock Analytics Service - ${operation}:`, mockResponse);

    return mockResponse;
  }

  private getMockAnalyticsResponse(operation: string, data: any) {
    const responses = {
      track_event: {
        success: true,
        eventId: `mock_event_${Date.now()}`,
        event: data.event || 'test_event',
        userId: data.userId || 'user_123',
        data: data.data || {},
        timestamp: new Date().toISOString(),
      },
      get_user_analytics: {
        success: true,
        userId: data.userId || 'user_123',
        period: data.period || '30d',
        metrics: {
          totalOrders: Math.floor(Math.random() * 50) + 10,
          totalSpent: Math.floor(Math.random() * 10000000) + 1000000,
          averageOrderValue: Math.floor(Math.random() * 500000) + 100000,
          lastActive: new Date().toISOString(),
        },
      },
      get_product_analytics: {
        success: true,
        productId: data.productId || 'product_123',
        period: data.period || '30d',
        metrics: {
          views: Math.floor(Math.random() * 1000) + 100,
          purchases: Math.floor(Math.random() * 100) + 10,
          conversionRate: Math.round((Math.random() * 5 + 1) * 100) / 100,
          averageRating: Math.round((Math.random() * 2 + 3) * 10) / 10,
        },
      },
    };

    return responses[operation] || {
      success: false,
      error: `Unknown analytics operation: ${operation}`,
    };
  }

  // Custom mock response setter
  setMockResponse(service: string, operation: string, response: any) {
    const key = `${service}:${operation}`;
    this.mockResponses.set(key, response);
    this.logger.log(`Custom mock response set for ${key}`);
  }

  // Get custom mock response
  getCustomMockResponse(service: string, operation: string): any {
    const key = `${service}:${operation}`;
    return this.mockResponses.get(key);
  }

  // Clear custom mock responses
  clearMockResponses() {
    this.mockResponses.clear();
    this.logger.log('All custom mock responses cleared');
  }

  // Enable/disable mocks
  setMockEnabled(enabled: boolean) {
    this.mocksEnabled = enabled;
    this.logger.log(`Mock services ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Get mock status
  getMockStatus() {
    return {
      enabled: this.mocksEnabled,
      customResponses: this.mockResponses.size,
      services: [
        'payment_gateway',
        'ai_service',
        'email_service',
        'sms_service',
        'file_storage',
        'geolocation',
        'notification',
        'analytics',
      ],
    };
  }

  // Simulate network delay
  async simulateDelay(minMs: number = 10, maxMs: number = 100): Promise<void> {
    if (!this.mocksEnabled) return;

    const delay = Math.random() * (maxMs - minMs) + minMs;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  // Simulate service failure
  async simulateFailure(failureRate: number = 0.1): Promise<boolean> {
    if (!this.mocksEnabled) return false;

    return Math.random() < failureRate;
  }

  // Generate random test data
  generateRandomData(type: string, options: any = {}) {
    switch (type) {
      case 'email':
        return `test${Date.now()}${Math.random().toString(36).substring(7)}@example.com`;
      case 'phone':
        return `0${Math.floor(Math.random() * 900000000 + 100000000)}`;
      case 'name':
        const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana'];
        const lastNames = ['Smith', 'Johnson', 'Brown', 'Williams', 'Jones', 'Garcia'];
        return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
      case 'address':
        const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Elm St', 'Maple Dr'];
        return `${Math.floor(Math.random() * 999) + 1} ${streets[Math.floor(Math.random() * streets.length)]}`;
      case 'price':
        return Math.floor(Math.random() * 1000000) + 10000;
      case 'rating':
        return Math.round((Math.random() * 2 + 3) * 10) / 10; // 3.0 - 5.0
      default:
        return `random_${type}_${Date.now()}`;
    }
  }
}
