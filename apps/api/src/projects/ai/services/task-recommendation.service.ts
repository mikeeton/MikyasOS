import { Injectable } from '@nestjs/common';

import type { TaskRecommendationPlan } from '../project-ai.types';

@Injectable()
export class TaskRecommendationService {
  getRecommendationPlans(): TaskRecommendationPlan[] {
    return [
      {
        key: 'task-prioritisation',
        signals: ['priority', 'dueDate', 'status', 'blockers', 'dependencies', 'projectHealth'],
        outputShape: ['recommendedOrder', 'reasoning', 'confidence'],
      },
      {
        key: 'suggested-assignees',
        signals: ['currentAssignments', 'capacity', 'skillsFuture', 'availability'],
        outputShape: ['candidateUserIds', 'loadImpact', 'confidence'],
      },
      {
        key: 'estimated-completion',
        signals: ['estimatedHours', 'actualHours', 'status', 'assigneeLoad', 'dueDate'],
        outputShape: ['estimatedCompletionWindow', 'riskFactors', 'confidence'],
      },
      {
        key: 'dependency-recommendations',
        signals: ['taskSequence', 'parentTask', 'comments', 'milestones'],
        outputShape: ['suggestedDependencies', 'missingDependencies', 'riskPropagation'],
      },
    ];
  }
}
