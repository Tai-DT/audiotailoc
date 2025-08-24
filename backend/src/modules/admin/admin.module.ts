import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { GuardsModule } from '../auth/guards.module';

@Module({
  imports: [ConfigModule, PrismaModule, GuardsModule],
  controllers: [AdminController],
  exports: [],
})
export class AdminModule {}
