import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BackupController } from './backup.controller';
import { BackupService } from './backup.service';
import { BackupSchedulerService } from './backup-scheduler.service';
import { LoggingModule } from '../logging/logging.module';

@Global()
@Module({
  imports: [ConfigModule, LoggingModule],
  controllers: [BackupController],
  providers: [
    BackupService,
    BackupSchedulerService,
  ],
  exports: [
    BackupService,
    BackupSchedulerService,
  ],
})
export class BackupModule {}