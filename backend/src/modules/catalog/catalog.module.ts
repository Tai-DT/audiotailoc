import { InventoryModule } from '../inventory/inventory.module';
import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { AuthModule } from '../auth/auth.module';

import { LoggingModule } from '../logging/logging.module';

@Module({
  controllers: [CatalogController],
  providers: [CatalogService],
  imports: [AuthModule, InventoryModule, LoggingModule],
})
export class CatalogModule {}
