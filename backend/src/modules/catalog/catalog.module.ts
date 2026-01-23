import { InventoryModule } from '../inventory/inventory.module';
import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogCategoriesController } from './catalog.controller';
import { AuthModule } from '../auth/auth.module';

import { LoggingModule } from '../logging/logging.module';

@Module({
  controllers: [CatalogCategoriesController],
  providers: [CatalogService],
  imports: [AuthModule, InventoryModule, LoggingModule],
})
export class CatalogModule { }
