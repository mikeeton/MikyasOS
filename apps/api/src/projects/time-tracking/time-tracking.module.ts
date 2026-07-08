import { Module } from '@nestjs/common';

import { WorkAuthModule } from '../common/work-auth.module';
import { ProjectActivitiesModule } from '../project-activities/project-activities.module';
import { TimeTrackingController } from './time-tracking.controller';
import { TimeTrackingService } from './time-tracking.service';

@Module({
  imports: [WorkAuthModule, ProjectActivitiesModule],
  controllers: [TimeTrackingController],
  providers: [TimeTrackingService],
  exports: [TimeTrackingService],
})
export class TimeTrackingModule {}
