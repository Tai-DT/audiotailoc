import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CatalogController],
  providers: [CatalogService],
  imports: [AuthModule],
})
export class CatalogModule {}
