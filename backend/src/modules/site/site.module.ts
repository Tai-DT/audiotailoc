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

@Module({
  imports: [PrismaModule],
  controllers: [
    BannersController,
    AdminBannersController,
    SettingsController,
    AdminSettingsController,
    SimpleSettingsController,
    SiteStatsController,
    TestimonialsController,
  ],
  providers: [BannersService, SettingsService, SiteStatsService, TestimonialsService],
  exports: [BannersService, SettingsService, SiteStatsService, TestimonialsService],
})
export class SiteModule {}
