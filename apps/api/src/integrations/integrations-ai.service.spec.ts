import {
  AutomationSuggestionService,
  ConnectorHealthService,
  CredentialAnalysisService,
  IntegrationRecommendationService,
  SyncOptimisationService,
} from './integrations-ai.service';

describe('Integration AI preparation services', () => {
  it('exposes architecture without production connector execution', () => {
    const services = [
      new IntegrationRecommendationService(),
      new SyncOptimisationService(),
      new ConnectorHealthService(),
      new CredentialAnalysisService(),
      new AutomationSuggestionService(),
    ];

    expect(services.map((service) => service.getArchitecture())).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          llmGenerationEnabled: false,
          productionConnectorExecution: false,
        }),
      ]),
    );
  });
});
