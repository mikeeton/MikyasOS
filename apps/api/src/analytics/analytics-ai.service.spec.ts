import {
  BusinessHealthService,
  ExecutiveBriefingService,
  ForecastService,
  RecommendationService,
  RiskAnalysisService,
  TrendDetectionService,
} from './analytics-ai.service';

describe('Analytics AI preparation services', () => {
  it('keeps executive intelligence architecture prepared without generation', () => {
    const services = [
      new ExecutiveBriefingService(),
      new BusinessHealthService(),
      new ForecastService(),
      new RiskAnalysisService(),
      new RecommendationService(),
      new TrendDetectionService(),
    ];

    expect(services.map((service) => service.getArchitecture())).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ llmGenerationEnabled: false }),
        expect.objectContaining({ predictiveModelEnabled: false }),
        expect.objectContaining({ service: 'ForecastService' }),
      ]),
    );
  });
});
