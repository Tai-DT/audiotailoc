import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { PrismaModule } from '../../prisma/prisma.module';

/**
 * Search Module
 * Provides full-text search functionality with filtering, sorting, and facets
 * Supports products, services, blog articles, and knowledge base
 */
@Module({
  imports: [PrismaModule],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
