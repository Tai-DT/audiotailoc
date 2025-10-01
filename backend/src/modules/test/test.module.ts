import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [PaymentsModule],
  controllers: [TestController],
})
export class TestModule {}