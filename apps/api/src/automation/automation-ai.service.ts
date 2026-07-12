import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkflowRecommendationService {
  getArchitecture() {
    return { enabled: false, sources: ['CRM', 'Projects', 'Documents', 'Meetings', 'Tasks'] };
  }
}

@Injectable()
export class WorkflowGenerationService {
  getArchitecture() {
    return { enabled: false, requiresHumanReview: true, promptDrivenGenerationPrepared: true };
  }
}

@Injectable()
export class WorkflowOptimisationService {
  getArchitecture() {
    return { enabled: false, futureSignals: ['duration', 'failure-rate', 'manual-rework'] };
  }
}

@Injectable()
export class WorkflowExplanationService {
  getArchitecture() {
    return { enabled: false, explainTriggersConditionsActions: true };
  }
}

@Injectable()
export class AutomationRiskService {
  getArchitecture() {
    return {
      enabled: true,
      destructiveActionsRequireApproval: true,
      actionValidationPrepared: true,
      rollbackPrepared: true,
    };
  }
}
