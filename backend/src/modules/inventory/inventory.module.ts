import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryMovementService } from './inventory-movement.service';
import { InventoryMovementController } from './inventory-movement.controller';
import { InventoryAlertService } from './inventory-alert.service';
import { InventoryAlertController } from './inventory-alert.controller';
import { GuardsModule } from '../auth/guards.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [GuardsModule, UsersModule],
  providers: [InventoryService, InventoryMovementService, InventoryAlertService],
  controllers: [InventoryController, InventoryMovementController, InventoryAlertController],
  exports: [InventoryService, InventoryMovementService, InventoryAlertService],
})
export class InventoryModule {}

