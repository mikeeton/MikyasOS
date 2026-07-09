import { Injectable } from '@nestjs/common';

import type { WorkloadAnalysisPlan } from '../project-ai.types';

@Injectable()
export class WorkloadAnalysisService {
  getWorkloadPlans(): WorkloadAnalysisPlan[] {
    return [
      {
        key: 'employee-workload',
        signals: ['openTasks', 'estimatedHours', 'actualHours', 'capacityStatus'],
        outputShape: ['load', 'risk', 'supportNeeded'],
      },
      {
        key: 'project-capacity',
        signals: ['projectAssignments', 'teamCapacity', 'dueDates', 'milestones'],
        outputShape: ['capacityFit', 'constraints', 'recommendedAdjustment'],
      },
      {
        key: 'task-distribution',
        signals: ['assigneeDistribution', 'priorityDistribution', 'blockedDistribution'],
        outputShape: ['imbalanceSignals', 'redistributionCandidates'],
      },
      {
        key: 'burnout-indicators',
        signals: ['sustainedOverload', 'overdueLoad', 'afterHoursFuture', 'contextSwitchingFuture'],
        outputShape: ['workloadRiskSignals', 'humanReviewRecommended'],
      },
      {
        key: 'unused-capacity',
        signals: ['availableMembers', 'unassignedTasks', 'lowLoadUsers'],
        outputShape: ['availableCapacity', 'assignmentOpportunities'],
      },
    ];
  }
}
