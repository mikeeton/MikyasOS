import { Injectable } from '@nestjs/common';

function architecture(service: string, purpose: string) {
  return { service, purpose, llmGenerationEnabled: false, enforcementEnabled: false };
}

@Injectable()
export class SecurityInsightService {
  getArchitecture() {
    return architecture('SecurityInsightService', 'Prepare security posture insights.');
  }
}

@Injectable()
export class ComplianceRecommendationService {
  getArchitecture() {
    return architecture(
      'ComplianceRecommendationService',
      'Prepare compliance gap recommendations.',
    );
  }
}

@Injectable()
export class RiskAssessmentService {
  getArchitecture() {
    return architecture('RiskAssessmentService', 'Prepare enterprise risk scoring.');
  }
}

@Injectable()
export class GovernanceService {
  getArchitecture() {
    return architecture('GovernanceService', 'Prepare governance policy recommendations.');
  }
}

@Injectable()
export class AuditSummaryService {
  getArchitecture() {
    return architecture('AuditSummaryService', 'Prepare audit summaries without LLM generation.');
  }
}
