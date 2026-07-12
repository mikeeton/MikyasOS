import { Injectable } from '@nestjs/common';

import { OpenRouterService } from '../infra/ai/openrouter.service';

@Injectable()
export class AiSettingsService {
  constructor(private readonly openRouter: OpenRouterService) {}

  getSettings() {
    return {
      provider: {
        name: 'OpenRouter',
        configured: this.openRouter.isConfigured,
      },
      guardrails: {
        requireConfirmationForActions: true,
        tenantIsolation: true,
        permissionFiltering: true,
        auditLogging: true,
        hallucinationPolicy: 'grounded-business-data-only',
      },
      features: {
        streamingPrepared: true,
        actionExecutionEnabled: false,
        memoryEnabled: true,
        embeddingsEnabled: false,
        vectorSearchEnabled: false,
      },
    };
  }
}
