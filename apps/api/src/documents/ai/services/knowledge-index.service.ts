import { Injectable } from '@nestjs/common';

import { DocumentJobsService } from '../../jobs/document-jobs.service';
import type { KnowledgeIndexStatus } from '../document-ai.types';

@Injectable()
export class KnowledgeIndexService {
  constructor(private readonly jobs: DocumentJobsService) {}

  getIndexStatus(documentId: string) {
    return {
      documentId,
      status: 'queued' satisfies KnowledgeIndexStatus,
      indexedAt: null,
      textExtracted: false,
      metadataExtracted: true,
      thumbnailGenerated: false,
      ocrPrepared: true,
      embeddingsPrepared: true,
      graphPrepared: true,
    };
  }

  queueIndexing(documentId: string, organisationId: string) {
    return this.jobs.enqueueIndexing(documentId, organisationId);
  }
}
