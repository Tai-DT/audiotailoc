import { ConfigService } from '@nestjs/config';
export declare class MockServicesService {
    private configService;
    private readonly logger;
    private mocksEnabled;
    private mockResponses;
    constructor(configService: ConfigService);
    mockPaymentGateway(operation: string, data?: any): Promise<any>;
    private getMockPaymentResponse;
    mockEmailService(operation: string, data?: any): Promise<any>;
    private getMockEmailResponse;
    mockSMSService(operation: string, data?: any): Promise<any>;
    private getMockSMSResponse;
    mockFileStorageService(operation: string, data?: any): Promise<any>;
    private getMockFileStorageResponse;
    mockGeolocationService(operation: string, data?: any): Promise<any>;
    private getMockGeolocationResponse;
    mockNotificationService(operation: string, data?: any): Promise<any>;
    private getMockNotificationResponse;
    mockAnalyticsService(operation: string, data?: any): Promise<any>;
    private getMockAnalyticsResponse;
    setMockResponse(service: string, operation: string, response: any): void;
    getCustomMockResponse(service: string, operation: string): any;
    clearMockResponses(): void;
    setMockEnabled(enabled: boolean): void;
    getMockStatus(): {
        enabled: boolean;
        customResponses: number;
        services: string[];
    };
    simulateDelay(minMs?: number, maxMs?: number): Promise<void>;
    simulateFailure(failureRate?: number): Promise<boolean>;
    generateRandomData(type: string, _options?: any): string | number;
}
