import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
// import { GuardsModule } from '../auth/guards.module'; // Temporarily disabled

@Module({
  imports: [ConfigModule, PrismaModule], // GuardsModule disabled for testing
  controllers: [AdminController],
  exports: [],
})
export class AdminModule {}
