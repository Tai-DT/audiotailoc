import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { SearchModule } from '../search/search.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CatalogController],
  providers: [CatalogService],
  imports: [SearchModule, AuthModule],
})
export class CatalogModule {}
