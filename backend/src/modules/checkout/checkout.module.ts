import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { CartModule } from '../cart/cart.module';
import { PromotionsModule } from '../promotions/promotions.module';
import { MailService } from '../notifications/mail.service';

@Module({
  imports: [CartModule, PromotionsModule],
  providers: [CheckoutService, MailService],
  controllers: [CheckoutController],
})
export class CheckoutModule {}
