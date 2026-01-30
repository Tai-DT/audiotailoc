import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ProjectsUploadController } from './projects-upload.controller';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [AuthModule, FilesModule],
  providers: [ProjectsService],
  controllers: [ProjectsController, ProjectsUploadController],
  exports: [ProjectsService],
})
export class ProjectsModule {}
