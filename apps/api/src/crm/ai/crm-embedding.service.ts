import { Injectable } from '@nestjs/common';

import { OpenRouterService } from '../../infra/ai/openrouter.service';
import type { CustomerEmbeddingPlan } from './customer-ai.types';

@Injectable()
export class CrmEmbeddingService {
  constructor(private readonly openRouter: OpenRouterService) {}

  getEmbeddingPlan(): CustomerEmbeddingPlan {
    return {
      enabled: false,
      provider: 'openrouter',
      vectorStore: 'reserved',
      indexableEntities: [
        'companies',
        'contacts',
        'leads',
        'opportunities',
        'customerNotes',
        'customerActivities',
        'customerFiles',
      ],
      retrievalUseCases: ['semanticSearch', 'ragContext', 'customerMemory', 'recommendationEngine'],
      status: 'architecture_ready',
    };
  }

  getProviderReadiness() {
    return {
      provider: 'openrouter' as const,
      configured: this.openRouter.isConfigured,
      directModelCoupling: false,
    };
  }
}
