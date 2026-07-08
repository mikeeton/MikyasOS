import { Module } from '@nestjs/common';

import { WorkAuthModule } from '../common/work-auth.module';
import { ProjectActivitiesModule } from '../project-activities/project-activities.module';
import { MilestonesController } from './milestones.controller';
import { MilestonesService } from './milestones.service';

@Module({
  imports: [WorkAuthModule, ProjectActivitiesModule],
  controllers: [MilestonesController],
  providers: [MilestonesService],
  exports: [MilestonesService],
})
export class MilestonesModule {}
