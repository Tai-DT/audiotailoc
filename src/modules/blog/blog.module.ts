import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { SharedModule } from '../shared/shared.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [SharedModule, PrismaModule],
  providers: [BlogService],
  controllers: [BlogController],
  exports: [BlogService],
})
export class BlogModule {}