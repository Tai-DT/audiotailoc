import { Module } from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { MarketingController } from './marketing.controller';
import { PublicMarketingController } from './public-marketing.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [MarketingService],
  controllers: [MarketingController, PublicMarketingController],
  exports: [MarketingService],
})
export class MarketingModule {}
