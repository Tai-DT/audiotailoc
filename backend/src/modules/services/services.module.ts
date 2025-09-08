import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ServiceCategoriesModule } from '../service-categories/service-categories.module';
import { ServiceTypesModule } from '../service-types/service-types.module';

@Module({
  imports: [
    PrismaModule,
    ServiceCategoriesModule,
    ServiceTypesModule,
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
