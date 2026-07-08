import { Module } from '@nestjs/common';

import { DatabaseModule } from '../infra/database/database.module';
import { CustomerActivitiesService } from './customer-activities.service';

@Module({
  imports: [DatabaseModule],
  providers: [CustomerActivitiesService],
  exports: [CustomerActivitiesService],
})
export class CustomerActivitiesModule {}
