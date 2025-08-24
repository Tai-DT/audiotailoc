import { Module } from '@nestjs/common';
import { MapsService } from './maps.service';
import { MapsController } from './maps.controller';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [CacheModule],
  providers: [MapsService],
  controllers: [MapsController],
  exports: [MapsService],
})
export class MapsModule {}


