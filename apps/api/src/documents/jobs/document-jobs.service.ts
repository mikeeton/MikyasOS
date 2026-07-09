import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';

import { DOCUMENT_PROCESSING_JOBS, DOCUMENT_PROCESSING_QUEUE } from './document-jobs.constants';

@Injectable()
export class DocumentJobsService {
  constructor(@InjectQueue(DOCUMENT_PROCESSING_QUEUE) private readonly queue: Queue) {}

  enqueueIndexing(documentId: string, organisationId: string) {
    return this.queue.add(DOCUMENT_PROCESSING_JOBS.indexDocument, { documentId, organisationId });
  }
}
