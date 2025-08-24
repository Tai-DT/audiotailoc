import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { CacheModule } from '../cache/cache.module';
import { AiModule } from '../ai/ai.module';
import { GuardsModule } from '../auth/guards.module';

@Module({
  imports: [CacheModule, AiModule, GuardsModule],
  providers: [SearchService],
  controllers: [SearchController],
  exports: [SearchService],
})
export class SearchModule {}

