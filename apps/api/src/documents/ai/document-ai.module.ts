import { Module } from '@nestjs/common';

import { AiModule } from '../../infra/ai/ai.module';
import { DocumentAuthModule } from '../common/document-auth.module';
import { DocumentJobsModule } from '../jobs/document-jobs.module';
import { DocumentAiController } from './document-ai.controller';
import { DocumentAiService } from './document-ai.service';
import { DocumentEmbeddingService } from './services/document-embedding.service';
import { DocumentOcrService } from './services/document-ocr.service';
import { DocumentSummaryService } from './services/document-summary.service';
import { KnowledgeGraphService } from './services/knowledge-graph.service';
import { KnowledgeIndexService } from './services/knowledge-index.service';

@Module({
  imports: [AiModule, DocumentAuthModule, DocumentJobsModule],
  controllers: [DocumentAiController],
  providers: [
    DocumentAiService,
    KnowledgeIndexService,
    DocumentSummaryService,
    DocumentEmbeddingService,
    KnowledgeGraphService,
    DocumentOcrService,
  ],
})
export class DocumentAiModule {}
