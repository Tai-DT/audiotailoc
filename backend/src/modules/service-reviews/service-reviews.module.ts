import { Module } from '@nestjs/common';
import { ServiceReviewsController } from './service-reviews.controller';
import { ServiceReviewsService } from './service-reviews.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, NotificationsModule, AuthModule],
  controllers: [ServiceReviewsController],
  providers: [ServiceReviewsService],
  exports: [ServiceReviewsService],
})
export class ServiceReviewsModule {}
