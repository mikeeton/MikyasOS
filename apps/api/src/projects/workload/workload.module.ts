import { Module } from '@nestjs/common';

import { WorkAuthModule } from '../common/work-auth.module';
import { WorkloadController } from './workload.controller';
import { WorkloadService } from './workload.service';

@Module({
  imports: [WorkAuthModule],
  controllers: [WorkloadController],
  providers: [WorkloadService],
})
export class WorkloadModule {}
