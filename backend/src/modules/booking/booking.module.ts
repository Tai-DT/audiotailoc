import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ServiceTypesModule } from '../service-types/service-types.module';

@Module({
  imports: [PrismaModule, ServiceTypesModule],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
