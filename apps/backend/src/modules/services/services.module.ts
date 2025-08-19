import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { MailService } from '../notifications/mail.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [ServicesController],
  providers: [ServicesService, MailService],
  exports: [ServicesService],
})
export class ServicesModule {}

