import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { SearchModule } from '../search/search.module';
import { AuthModule } from '../auth/auth.module';
import { CacheService } from '../common/cache.service';

@Module({
  controllers: [CatalogController],
  providers: [CacheService, CatalogService],
  imports: [SearchModule, AuthModule],
})
export class CatalogModule {}
