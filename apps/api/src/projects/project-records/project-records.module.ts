import { Module } from '@nestjs/common';

import { WorkAuthModule } from '../common/work-auth.module';
import { ProjectActivitiesModule } from '../project-activities/project-activities.module';
import { ProjectsController } from './projects.controller';
import { ProjectsRepository } from './projects.repository';
import { ProjectsService } from './projects.service';

@Module({
  imports: [WorkAuthModule, ProjectActivitiesModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository],
  exports: [ProjectsService, ProjectsRepository],
})
export class ProjectRecordsModule {}
