import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { DOCUMENT_PROCESSING_QUEUE } from './document-jobs.constants';
import { DocumentJobsService } from './document-jobs.service';

@Module({
  imports: [BullModule.registerQueue({ name: DOCUMENT_PROCESSING_QUEUE })],
  providers: [DocumentJobsService],
  exports: [DocumentJobsService],
})
export class DocumentJobsModule {}
