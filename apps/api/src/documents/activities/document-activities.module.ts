import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../infra/database/database.module';
import { DocumentAuthModule } from '../common/document-auth.module';
import { DocumentActivitiesController } from './document-activities.controller';
import { DocumentActivitiesService } from './document-activities.service';

@Module({
  imports: [DatabaseModule, DocumentAuthModule],
  controllers: [DocumentActivitiesController],
  providers: [DocumentActivitiesService],
  exports: [DocumentActivitiesService],
})
export class DocumentActivitiesModule {}
