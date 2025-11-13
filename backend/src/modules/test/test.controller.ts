import { Controller, Get } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  testEndpoint() {
    return this.testService.testEndpoint();
  }

  @Get('payment')
  testPayment() {
    return this.testService.testPayment();
  }
}
