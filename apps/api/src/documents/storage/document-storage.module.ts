import { Module } from '@nestjs/common';

import { StorageModule } from '../../infra/storage/storage.module';
import { DocumentStorageService } from './document-storage.service';
import { FileMetadataService } from './file-metadata.service';
import { FileValidationService } from './file-validation.service';

@Module({
  imports: [StorageModule],
  providers: [DocumentStorageService, FileMetadataService, FileValidationService],
  exports: [DocumentStorageService, FileMetadataService, FileValidationService],
})
export class DocumentStorageModule {}
