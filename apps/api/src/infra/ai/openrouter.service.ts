import { Injectable, ServiceUnavailableException } from '@nestjs/common';

import { AppConfigService } from '../../config/app-config.service';

@Injectable()
export class OpenRouterService {
  constructor(private readonly config: AppConfigService) {}

  get isConfigured() {
    return Boolean(this.config.openRouterApiKey);
  }

  assertConfigured() {
    if (!this.isConfigured) {
      throw new ServiceUnavailableException('OpenRouter is not configured for this environment.');
    }
  }
}
