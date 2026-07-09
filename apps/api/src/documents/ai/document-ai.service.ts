import { Injectable } from '@nestjs/common';

import { OpenRouterService } from '../../infra/ai/openrouter.service';
import { DOCUMENT_PROCESSING_JOBS } from '../jobs/document-jobs.constants';
import { DOCUMENT_PROMPT_TEMPLATES } from './document-prompt-templates';
import type { KnowledgeAiCapability } from './document-ai.types';
import { DocumentEmbeddingService } from './services/document-embedding.service';
import { DocumentOcrService } from './services/document-ocr.service';
import { DocumentSummaryService } from './services/document-summary.service';
import { KnowledgeGraphService } from './services/knowledge-graph.service';
import { KnowledgeIndexService } from './services/knowledge-index.service';

@Injectable()
export class DocumentAiService {
  constructor(
    private readonly openRouter: OpenRouterService,
    private readonly index: KnowledgeIndexService,
    private readonly summaries: DocumentSummaryService,
    private readonly embeddings: DocumentEmbeddingService,
    private readonly graph: KnowledgeGraphService,
    private readonly ocr: DocumentOcrService,
  ) {}

  getCapabilities() {
    const capabilities: KnowledgeAiCapability[] = [
      {
        key: 'knowledge-indexing',
        name: 'Knowledge indexing',
        description: 'Queues document indexing and tracks future readiness state.',
        status: 'architecture_ready',
        queueBacked: true,
      },
      {
        key: 'document-summaries',
        name: 'Document summaries',
        description:
          'Prepared for executive, policy, contract, proposal, meeting, and technical summaries.',
        status: 'architecture_ready',
        queueBacked: true,
      },
      {
        key: 'embeddings-and-rag',
        name: 'Embeddings and RAG',
        description:
          'Prepared for chunking, embeddings, vector search, semantic retrieval, and RAG.',
        status: 'architecture_ready',
        queueBacked: true,
      },
      {
        key: 'knowledge-graph',
        name: 'Knowledge graph',
        description: 'Prepared for traversing document relationships across business records.',
        status: 'architecture_ready',
        queueBacked: true,
      },
      {
        key: 'ocr',
        name: 'OCR preparation',
        description: 'Prepared for image, PDF, scanned document, and future handwriting OCR.',
        status: 'architecture_ready',
        queueBacked: true,
      },
    ];

    return {
      capabilities,
      promptExecutionEnabled: false,
      embeddingsEnabled: false,
      vectorSearchEnabled: false,
      ocrEnabled: false,
      realtimeEnabled: false,
      provider: {
        abstraction: 'OpenRouter',
        configured: this.openRouter.isConfigured,
        directStorageAccess: false,
        providerAgnostic: true,
      },
      queues: DOCUMENT_PROCESSING_JOBS,
      architecture: {
        index: this.index.getIndexStatus('architecture-preview'),
        summaries: this.summaries.getSummaryArchitecture(),
        embeddings: this.embeddings.getEmbeddingArchitecture(),
        graph: this.graph.getGraphArchitecture(),
        ocr: this.ocr.getOcrArchitecture(),
      },
    };
  }

  getPromptTemplates() {
    return {
      templates: DOCUMENT_PROMPT_TEMPLATES,
      promptExecutionEnabled: false,
    };
  }

  getDocumentReadiness(documentId: string) {
    return this.index.getIndexStatus(documentId);
  }
}
