import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheService } from '../common/cache.service';
import { MapsService } from './maps.service';
import { MapsController } from './maps.controller';

@Module({
  imports: [ConfigModule],
  providers: [MapsService, CacheService],
  controllers: [MapsController],
  exports: [MapsService],
})
export class MapsModule {}


