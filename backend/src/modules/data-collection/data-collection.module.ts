import { Module } from '@nestjs/common';
import { DataCollectionController } from './data-collection.controller';
import { DataCollectionService } from './data-collection.service';
import { PrismaService } from '../../prisma/prisma.service';
import { GuardsModule } from '../auth/guards.module';

@Module({
  imports: [GuardsModule],
  controllers: [DataCollectionController],
  providers: [DataCollectionService, PrismaService],
  exports: [DataCollectionService],
})
export class DataCollectionModule {}
