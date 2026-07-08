import { CrmEmbeddingService } from './crm-embedding.service';
import { CustomerInsightService } from './customer-insight.service';
import { CustomerSummaryService } from './customer-summary.service';

describe('CustomerInsightService', () => {
  it('exposes AI-ready CRM capabilities without enabling prompt execution', () => {
    const openRouter = { isConfigured: false };
    const service = new CustomerInsightService(
      new CustomerSummaryService(),
      new CrmEmbeddingService(openRouter as never),
    );

    const result = service.getCapabilities();

    expect(result.promptExecutionEnabled).toBe(false);
    expect(result.provider).toEqual({
      provider: 'openrouter',
      configured: false,
      directModelCoupling: false,
    });
    expect(result.capabilities.map((capability) => capability.key)).toEqual([
      'customer-summary',
      'lead-analysis',
      'opportunity-review',
      'relationship-risk',
      'follow-up-suggestions',
      'sales-recommendations',
    ]);
  });

  it('returns reusable prompt templates by key', () => {
    const service = new CustomerInsightService(
      new CustomerSummaryService(),
      new CrmEmbeddingService({ isConfigured: true } as never),
    );

    const template = service.getPromptTemplate('relationship-risk');

    expect(template?.title).toBe('Relationship Risk');
    expect(template?.guardrails).toContain('No cross-tenant comparisons');
  });
});
