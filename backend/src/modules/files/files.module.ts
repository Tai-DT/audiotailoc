import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryService } from './cloudinary.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService, CloudinaryService],
  imports: [AuthModule, ConfigModule, PrismaModule],
  exports: [FilesService, CloudinaryService],
})
export class FilesModule {}
