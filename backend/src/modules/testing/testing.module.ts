import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestDatabaseService } from './test-database.service';
import { TestHelpersService } from './test-helpers.service';
import { MockServicesService } from './mock-services.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    TestDatabaseService,
    TestHelpersService,
    MockServicesService,
  ],
  exports: [
    TestDatabaseService,
    TestHelpersService,
    MockServicesService,
  ],
})
export class TestingModule {}
