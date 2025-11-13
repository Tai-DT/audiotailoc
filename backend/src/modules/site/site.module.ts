import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { AdminBannersController } from './admin-banners.controller';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { AdminSettingsController } from './admin-settings.controller';
import { SimpleSettingsController } from './simple-settings.controller';

@Module({
  imports: [PrismaModule],
  controllers: [
    BannersController,
    AdminBannersController,
    SettingsController,
    AdminSettingsController,
    SimpleSettingsController,
  ],
  providers: [BannersService, SettingsService],
  exports: [BannersService, SettingsService],
})
export class SiteModule {}
