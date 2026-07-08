import { Injectable } from '@nestjs/common';

import type { CustomerRecordKind, CustomerSummaryPlan } from './customer-ai.types';

@Injectable()
export class CustomerSummaryService {
  getSummaryPlans(): CustomerSummaryPlan[] {
    return [
      this.createPlan('executive', ['companies', 'contacts', 'leads', 'opportunities']),
      this.createPlan('company', ['company', 'contacts', 'opportunities', 'activities']),
      this.createPlan('contact', ['contact', 'company', 'activities', 'notes']),
      this.createPlan('lead', ['lead', 'company', 'assignee', 'activities']),
      this.createPlan('opportunity', ['opportunity', 'company', 'contacts', 'activities']),
    ];
  }

  getPlan(scope: CustomerRecordKind) {
    return this.getSummaryPlans().find((plan) => plan.scope === scope);
  }

  private createPlan(scope: CustomerRecordKind, sourceEntities: string[]): CustomerSummaryPlan {
    return {
      scope,
      title: `${scope.charAt(0).toUpperCase()}${scope.slice(1)} summary`,
      sourceEntities,
      outputSections: ['overview', 'importantSignals', 'risks', 'recommendedNextActions'],
      status: 'architecture_ready',
    };
  }
}
