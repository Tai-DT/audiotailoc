import { Module } from '@nestjs/common';
import { ServiceTypesService } from './service-types.service';
import { ServiceTypesController } from './service-types.controller';
import { ServiceCategoriesModule } from '../service-categories/service-categories.module';

@Module({
  imports: [ServiceCategoriesModule],
  controllers: [ServiceTypesController],
  providers: [ServiceTypesService],
  exports: [ServiceTypesService],
})
export class ServiceTypesModule {}
