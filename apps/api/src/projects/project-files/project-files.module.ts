import { Module } from '@nestjs/common';

import { StorageModule } from '../../infra/storage/storage.module';
import { WorkAuthModule } from '../common/work-auth.module';
import { ProjectActivitiesModule } from '../project-activities/project-activities.module';
import { ProjectFilesController } from './project-files.controller';
import { ProjectFilesService } from './project-files.service';

@Module({
  imports: [WorkAuthModule, ProjectActivitiesModule, StorageModule],
  controllers: [ProjectFilesController],
  providers: [ProjectFilesService],
  exports: [ProjectFilesService],
})
export class ProjectFilesModule {}
