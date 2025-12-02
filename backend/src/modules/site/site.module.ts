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

@Module({
  imports: [PrismaModule],
  controllers: [
    BannersController,
    AdminBannersController,
    SettingsController,
    AdminSettingsController,
    SimpleSettingsController,
    SiteStatsController,
  ],
  providers: [BannersService, SettingsService, SiteStatsService],
  exports: [BannersService, SettingsService, SiteStatsService],
})
export class SiteModule {}
