import { Injectable } from '@nestjs/common';

import { CrmEmbeddingService } from './crm-embedding.service';
import { customerPromptTemplates } from './customer-prompt-templates';
import { CustomerSummaryService } from './customer-summary.service';
import type { CustomerAiCapability, CustomerInsightKind } from './customer-ai.types';

@Injectable()
export class CustomerInsightService {
  constructor(
    private readonly summaries: CustomerSummaryService,
    private readonly embeddings: CrmEmbeddingService,
  ) {}

  getCapabilities() {
    return {
      capabilities: this.getCapabilityList(),
      summaryPlans: this.summaries.getSummaryPlans(),
      embeddingPlan: this.embeddings.getEmbeddingPlan(),
      provider: this.embeddings.getProviderReadiness(),
      promptExecutionEnabled: false,
    };
  }

  getPromptTemplate(key: CustomerInsightKind) {
    return customerPromptTemplates.find((template) => template.key === key);
  }

  private getCapabilityList(): CustomerAiCapability[] {
    return [
      {
        key: 'customer-summary',
        name: 'AI Customer Summary',
        description:
          'Architecture for executive, company, contact, lead, and opportunity summaries.',
        requiredPermission: 'crm:read',
        status: 'architecture_ready',
      },
      {
        key: 'lead-analysis',
        name: 'AI Lead Insights',
        description: 'Architecture for lead quality, qualification gaps, and source analysis.',
        requiredPermission: 'crm:read',
        status: 'architecture_ready',
      },
      {
        key: 'opportunity-review',
        name: 'AI Opportunity Suggestions',
        description: 'Architecture for opportunity review, risk, and next action suggestions.',
        requiredPermission: 'crm:read',
        status: 'architecture_ready',
      },
      {
        key: 'relationship-risk',
        name: 'AI Risk Detection',
        description: 'Architecture for relationship health and risk detection.',
        requiredPermission: 'crm:read',
        status: 'architecture_ready',
      },
      {
        key: 'follow-up-suggestions',
        name: 'AI Next Best Action',
        description: 'Architecture for timely customer follow-up recommendations.',
        requiredPermission: 'crm:read',
        status: 'architecture_ready',
      },
      {
        key: 'sales-recommendations',
        name: 'AI Sales Coach',
        description: 'Architecture for future sales coaching and recommendation workflows.',
        requiredPermission: 'crm:read',
        status: 'architecture_ready',
      },
    ];
  }
}
