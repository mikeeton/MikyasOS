import { Module } from '@nestjs/common';

import { BoardsModule } from './boards/boards.module';
import { CommentsModule } from './comments/comments.module';
import { LabelsModule } from './labels/labels.module';
import { MilestonesModule } from './milestones/milestones.module';
import { ProjectActivitiesModule } from './project-activities/project-activities.module';
import { ProjectFilesModule } from './project-files/project-files.module';
import { ProjectRecordsModule } from './project-records/project-records.module';
import { ProjectSearchModule } from './search/project-search.module';
import { TasksModule } from './tasks/tasks.module';
import { TimeTrackingModule } from './time-tracking/time-tracking.module';
import { WorkloadModule } from './workload/workload.module';

@Module({
  imports: [
    ProjectRecordsModule,
    TasksModule,
    BoardsModule,
    MilestonesModule,
    CommentsModule,
    LabelsModule,
    TimeTrackingModule,
    ProjectActivitiesModule,
    ProjectFilesModule,
    WorkloadModule,
    ProjectSearchModule,
  ],
})
export class ProjectsModule {}
