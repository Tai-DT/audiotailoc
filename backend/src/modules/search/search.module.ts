import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { CacheModule } from '../caching/cache.module';
import { GuardsModule } from '../auth/guards.module';

@Module({
  imports: [CacheModule, GuardsModule],
  providers: [SearchService],
  controllers: [SearchController],
  exports: [SearchService],
})
export class SearchModule {}

