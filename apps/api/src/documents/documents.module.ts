import { Module } from '@nestjs/common';

import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { DatabaseModule } from '../infra/database/database.module';
import { DocumentAiModule } from './ai/document-ai.module';
import { DocumentActivitiesModule } from './activities/document-activities.module';
import { DocumentAuthModule } from './common/document-auth.module';
import { DocumentsController } from './documents.controller';
import { DocumentsRepository } from './documents.repository';
import { DocumentsService } from './documents.service';
import { FoldersModule } from './folders/folders.module';
import { DocumentJobsModule } from './jobs/document-jobs.module';
import { DocumentStorageModule } from './storage/document-storage.module';

@Module({
  imports: [
    DatabaseModule,
    DocumentAuthModule,
    AuditLogsModule,
    DocumentActivitiesModule,
    FoldersModule,
    DocumentStorageModule,
    DocumentJobsModule,
    DocumentAiModule,
  ],
  controllers: [DocumentsController],
  providers: [DocumentsRepository, DocumentsService],
  exports: [DocumentsService, DocumentsRepository],
})
export class DocumentsModule {}
