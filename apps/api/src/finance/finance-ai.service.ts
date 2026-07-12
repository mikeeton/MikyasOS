import { Injectable } from '@nestjs/common';

@Injectable()
export class FinancialInsightService {
  getArchitecture() {
    return {
      service: 'FinancialInsightService',
      purpose:
        'Explain revenue, margin, overdue risk, customer revenue, and project profitability.',
      llmGenerationEnabled: false,
      permissionsRequired: ['Finance.Read'],
    };
  }
}

@Injectable()
export class CashFlowPredictionService {
  getArchitecture() {
    return {
      service: 'CashFlowPredictionService',
      purpose: 'Prepare future cash-flow forecasts from invoices, expenses, payments, and budgets.',
      llmGenerationEnabled: false,
    };
  }
}

@Injectable()
export class InvoiceRiskService {
  getArchitecture() {
    return {
      service: 'InvoiceRiskService',
      purpose: 'Detect overdue invoice risk and payment delays without hallucinating finance data.',
      llmGenerationEnabled: false,
    };
  }
}

@Injectable()
export class BudgetRecommendationService {
  getArchitecture() {
    return {
      service: 'BudgetRecommendationService',
      purpose: 'Prepare budget utilisation and department/project spend recommendations.',
      llmGenerationEnabled: false,
    };
  }
}

@Injectable()
export class RevenueForecastService {
  getArchitecture() {
    return {
      service: 'RevenueForecastService',
      purpose:
        'Prepare revenue forecasts from quotes, subscriptions, recurring invoices, and pipeline.',
      llmGenerationEnabled: false,
    };
  }
}
