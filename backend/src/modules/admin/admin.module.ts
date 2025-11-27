import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { GuardsModule } from '../auth/guards.module';
import { ActivityLogService } from '../logging/activity-log.service';
import { MonitoringModule } from '../monitoring/monitoring.module';

@Module({
  imports: [ConfigModule, PrismaModule, GuardsModule, MonitoringModule],
  controllers: [AdminController],
  providers: [ActivityLogService],
  exports: [],
})
export class AdminModule {}
