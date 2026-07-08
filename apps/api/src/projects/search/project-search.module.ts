import { Module } from '@nestjs/common';

import { WorkAuthModule } from '../common/work-auth.module';
import { ProjectSearchController } from './project-search.controller';
import { ProjectSearchService } from './project-search.service';

@Module({
  imports: [WorkAuthModule],
  controllers: [ProjectSearchController],
  providers: [ProjectSearchService],
})
export class ProjectSearchModule {}
