import { Module, forwardRef } from '@nestjs/common';

import { DatabaseModule } from '../../infra/database/database.module';
import { DocumentActivitiesModule } from '../activities/document-activities.module';
import { DocumentAuthModule } from '../common/document-auth.module';
import { DocumentsModule } from '../documents.module';
import { FileMetadataService } from '../storage/file-metadata.service';
import { FileValidationService } from '../storage/file-validation.service';
import { DocumentVersionsController } from './document-versions.controller';
import { DocumentVersionsService } from './document-versions.service';

@Module({
  imports: [
    DatabaseModule,
    DocumentAuthModule,
    DocumentActivitiesModule,
    forwardRef(() => DocumentsModule),
  ],
  controllers: [DocumentVersionsController],
  providers: [DocumentVersionsService, FileValidationService, FileMetadataService],
})
export class DocumentVersionsModule {}
