import {
  BudgetRecommendationService,
  CashFlowPredictionService,
  FinancialInsightService,
  InvoiceRiskService,
  RevenueForecastService,
} from './finance-ai.service';

describe('Finance AI preparation services', () => {
  it('describes finance intelligence architecture without enabling LLM generation', () => {
    const services = [
      new FinancialInsightService(),
      new CashFlowPredictionService(),
      new InvoiceRiskService(),
      new BudgetRecommendationService(),
      new RevenueForecastService(),
    ];

    expect(services.map((service) => service.getArchitecture())).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ llmGenerationEnabled: false }),
        expect.objectContaining({ service: 'InvoiceRiskService' }),
        expect.objectContaining({ service: 'RevenueForecastService' }),
      ]),
    );
  });
});
