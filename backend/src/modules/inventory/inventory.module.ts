import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { GuardsModule } from '../auth/guards.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [GuardsModule, UsersModule],
  providers: [InventoryService],
  controllers: [InventoryController],
  exports: [InventoryService],
})
export class InventoryModule {}

