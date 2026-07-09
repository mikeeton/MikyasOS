import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../infra/database/database.module';
import { DocumentActivitiesModule } from '../activities/document-activities.module';
import { DocumentAuthModule } from '../common/document-auth.module';
import { DocumentLinksController } from './document-links.controller';
import { DocumentLinksService } from './document-links.service';

@Module({
  imports: [DatabaseModule, DocumentAuthModule, DocumentActivitiesModule],
  controllers: [DocumentLinksController],
  providers: [DocumentLinksService],
})
export class DocumentLinksModule {}
