import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { SoftwareController } from './software.controller';
import { SoftwareService } from './software.service';

@Module({
  imports: [PrismaModule],
  controllers: [SoftwareController],
  providers: [SoftwareService],
  exports: [SoftwareService],
})
export class SoftwareModule {}
