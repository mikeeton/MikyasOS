import { Injectable } from '@nestjs/common';

@Injectable()
export class AiEmbeddingService {
  getArchitecture() {
    return {
      provider: 'OpenRouter-compatible embeddings',
      enabled: false,
      vectorStore: 'pgvector',
      chunkingPrepared: true,
      dimensions: 'provider-defined',
      isolation: 'organisationId required on every retrieval',
    };
  }
}
