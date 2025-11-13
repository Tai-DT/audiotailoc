import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
  testEndpoint() {
    return { message: 'Test endpoint is working', timestamp: new Date().toISOString() };
  }

  testPayment() {
    // TODO: Implement payment testing logic
    return { message: 'Payment test endpoint - to be implemented' };
  }
}
