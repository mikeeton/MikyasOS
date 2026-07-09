import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentEmbeddingService {
  getEmbeddingArchitecture() {
    return {
      embeddingGenerationEnabled: false,
      chunkingStrategies: ['paragraph', 'heading-aware', 'table', 'code-block', 'page'],
      vectorStoresPrepared: ['pgvector'],
      retrievalModesPrepared: [
        'semantic-search',
        'hybrid-search',
        'similarity-search',
        'rag-context',
      ],
      metadataPreservation: true,
    };
  }
}
