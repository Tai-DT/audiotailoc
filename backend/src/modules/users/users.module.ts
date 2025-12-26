import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { SharedModule } from '../shared/shared.module';
import { SecurityModule } from '../security/security.module';

@Module( {
  imports: [ PrismaModule, NotificationsModule, SharedModule, SecurityModule ],
  providers: [ UsersService ],
  controllers: [ UsersController ],
  exports: [ UsersService ],
} )
export class UsersModule { }
