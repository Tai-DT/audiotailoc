import { Module } from '@nestjs/common';
import { CompleteProductController } from './controllers/complete-product.controller';
import { CompleteProductService } from './services/complete-product.service';

@Module({
  controllers: [CompleteProductController],
  providers: [CompleteProductService],
  exports: [CompleteProductService],
})
export class CompleteProductModule {}
