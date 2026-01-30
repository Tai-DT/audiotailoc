import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { AdminBannersController } from './admin-banners.controller';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { AdminSettingsController } from './admin-settings.controller';
import { SimpleSettingsController } from './simple-settings.controller';
import { SiteStatsController } from './site-stats.controller';
import { SiteStatsService } from './site-stats.service';
import { TestimonialsController } from './testimonials.controller';
import { TestimonialsService } from './testimonials.service';
import { ContactInfoController } from './contact-info.controller';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [
    BannersController,
    AdminBannersController,
    SettingsController,
    AdminSettingsController,
    SimpleSettingsController,
    SiteStatsController,
    TestimonialsController,
    ContactInfoController,
    NewsletterController,
  ],
  providers: [
    BannersService,
    SettingsService,
    SiteStatsService,
    TestimonialsService,
    NewsletterService,
  ],
  exports: [BannersService, SettingsService, SiteStatsService, TestimonialsService],
})
export class SiteModule {}
