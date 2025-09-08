import { Module } from '@nestjs/common';
import { CompleteProductController } from './controllers/complete-product.controller';
import { CompleteProductService } from './services/complete-product.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [CompleteProductController],
  providers: [CompleteProductService, PrismaService],
  exports: [CompleteProductService],
})
export class CompleteProductModule {}
