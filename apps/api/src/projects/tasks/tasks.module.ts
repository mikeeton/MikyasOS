import { Module } from '@nestjs/common';

import { WorkAuthModule } from '../common/work-auth.module';
import { ProjectActivitiesModule } from '../project-activities/project-activities.module';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

@Module({
  imports: [WorkAuthModule, ProjectActivitiesModule],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository],
  exports: [TasksService, TasksRepository],
})
export class TasksModule {}
