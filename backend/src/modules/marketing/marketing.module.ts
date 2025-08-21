import { Module } from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { MarketingController } from './marketing.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [NotificationsModule, UsersModule, AuthModule],
  providers: [MarketingService],
  controllers: [MarketingController],
  exports: [MarketingService],
})
export class MarketingModule {}
