import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../infra/database/database.module';
import { DocumentActivitiesModule } from '../activities/document-activities.module';
import { DocumentAuthModule } from '../common/document-auth.module';
import {
  DocumentTagAssignmentsController,
  DocumentTagsController,
} from './document-tags.controller';
import { DocumentTagsService } from './document-tags.service';

@Module({
  imports: [DatabaseModule, DocumentAuthModule, DocumentActivitiesModule],
  controllers: [DocumentTagsController, DocumentTagAssignmentsController],
  providers: [DocumentTagsService],
})
export class DocumentTagsModule {}
