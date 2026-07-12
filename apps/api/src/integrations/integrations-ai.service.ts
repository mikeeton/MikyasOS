import { Injectable } from '@nestjs/common';

function architecture(service: string, purpose: string) {
  return {
    service,
    purpose,
    llmGenerationEnabled: false,
    productionConnectorExecution: false,
  };
}

@Injectable()
export class IntegrationRecommendationService {
  getArchitecture() {
    return architecture(
      'IntegrationRecommendationService',
      'Recommend useful connectors from organisation modules and usage patterns.',
    );
  }
}

@Injectable()
export class SyncOptimisationService {
  getArchitecture() {
    return architecture(
      'SyncOptimisationService',
      'Prepare sync frequency, incremental checkpointing, and retry optimisation.',
    );
  }
}

@Injectable()
export class ConnectorHealthService {
  getArchitecture() {
    return architecture(
      'ConnectorHealthService',
      'Evaluate connector availability, latency, credential expiry, and error patterns.',
    );
  }
}

@Injectable()
export class CredentialAnalysisService {
  getArchitecture() {
    return architecture(
      'CredentialAnalysisService',
      'Detect secret expiry, weak scope choices, and rotation recommendations.',
    );
  }
}

@Injectable()
export class AutomationSuggestionService {
  getArchitecture() {
    return architecture(
      'AutomationSuggestionService',
      'Prepare workflow suggestions from connected services without auto-creating automations.',
    );
  }
}
