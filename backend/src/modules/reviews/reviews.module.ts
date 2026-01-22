import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { CacheService } from '../caching/cache.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [NotificationsModule, ConfigModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, PrismaService, CacheService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
