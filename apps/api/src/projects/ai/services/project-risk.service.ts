import { Injectable } from '@nestjs/common';

import type { ProjectRiskPlan } from '../project-ai.types';

@Injectable()
export class ProjectRiskService {
  getRiskPlans(): ProjectRiskPlan[] {
    return [
      {
        key: 'risk-scoring',
        signals: ['overdueTasks', 'blockedTasks', 'progress', 'dueDate', 'milestoneStatus'],
        outputShape: ['riskScore', 'riskLevel', 'primaryDrivers'],
      },
      {
        key: 'deadline-prediction',
        signals: ['remainingTasks', 'estimatedHours', 'capacity', 'milestones', 'activityVelocity'],
        outputShape: ['deliveryConfidence', 'predictionWindow', 'missingInputs'],
      },
      {
        key: 'resource-shortage',
        signals: ['workload', 'assigneeCapacity', 'unassignedTasks', 'blockedTasks'],
        outputShape: ['shortageSignals', 'affectedProjects', 'recommendedReview'],
      },
      {
        key: 'health-calculation',
        signals: ['taskHealth', 'milestoneHealth', 'budget', 'timeTracking', 'activity'],
        outputShape: ['health', 'confidence', 'supportingSignals'],
      },
    ];
  }
}
