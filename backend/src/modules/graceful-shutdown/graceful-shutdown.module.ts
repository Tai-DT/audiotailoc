import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GracefulShutdownService } from './graceful-shutdown.service';
import { GracefulShutdownController } from './graceful-shutdown.controller';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [GracefulShutdownController],
  providers: [GracefulShutdownService],
  exports: [GracefulShutdownService],
})
export class GracefulShutdownModule {}
