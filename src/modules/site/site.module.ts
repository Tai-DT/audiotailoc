import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { FilesModule } from '../files/files.module';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { AdminBannersController } from './admin-banners.controller';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { AdminSettingsController } from './admin-settings.controller';
import { TestimonialsService } from './testimonials.service';
import { TestimonialsController } from './testimonials.controller';
import { SiteStatsService } from './homepage-stats.service';
import { HomePageStatsController } from './homepage-stats.controller';

@Module({
  imports: [PrismaModule, FilesModule],
  controllers: [
    BannersController,
    AdminBannersController,
    SettingsController,
    AdminSettingsController,
    TestimonialsController,
    HomePageStatsController,
  ],
  providers: [BannersService, SettingsService, TestimonialsService, SiteStatsService],
  exports: [BannersService, SettingsService, TestimonialsService, SiteStatsService],
})
export class SiteModule {}
