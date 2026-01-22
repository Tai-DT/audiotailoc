import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { CartModule } from '../cart/cart.module';
import { PromotionsModule } from '../promotions/promotions.module';
import { MailService } from '../notifications/mail.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [CartModule, PromotionsModule, PrismaModule, InventoryModule],
  providers: [CheckoutService, MailService],
  controllers: [CheckoutController],
})
export class CheckoutModule {}
