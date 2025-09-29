import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SeoService } from './seo.service';
import { SeoController } from './seo.controller';

@Module({
  imports: [ConfigModule],
  providers: [SeoService],
  controllers: [SeoController],
  exports: [SeoService],
})
export class SeoModule {}

