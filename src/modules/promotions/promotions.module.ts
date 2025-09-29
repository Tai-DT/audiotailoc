import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionsController } from './promotions.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PromotionsController],
  providers: [PromotionService],
  exports: [PromotionService],
})
export class PromotionsModule {}
