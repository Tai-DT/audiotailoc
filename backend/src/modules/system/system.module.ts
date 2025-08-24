import { Module } from '@nestjs/common';
import { SystemController } from './system.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { GuardsModule } from '../auth/guards.module';

@Module({
  imports: [ConfigModule, PrismaModule, GuardsModule],
  controllers: [SystemController],
  exports: [],
})
export class SystemModule {}
