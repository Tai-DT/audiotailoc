import { Module } from '@nestjs/common';
import { ServiceTypesService } from './service-types.service';
import { ServiceTypesController } from './service-types.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { ServiceCategoriesModule } from '../service-categories/service-categories.module';

@Module({
  imports: [ServiceCategoriesModule],
  controllers: [ServiceTypesController],
  providers: [ServiceTypesService, PrismaService],
  exports: [ServiceTypesService],
})
export class ServiceTypesModule {}
