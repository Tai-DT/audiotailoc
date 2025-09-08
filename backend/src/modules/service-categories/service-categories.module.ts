import { Module } from '@nestjs/common';
import { ServiceCategoriesService } from './service-categories.service';
import { ServiceCategoriesController } from './service-categories.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ServiceCategoriesController],
  providers: [ServiceCategoriesService, PrismaService],
  exports: [ServiceCategoriesService],
})
export class ServiceCategoriesModule {}
