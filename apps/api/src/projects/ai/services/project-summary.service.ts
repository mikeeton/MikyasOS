import { Injectable } from '@nestjs/common';

import type { ProjectSummaryPlan } from '../project-ai.types';

@Injectable()
export class ProjectSummaryService {
  getSummaryPlans(): ProjectSummaryPlan[] {
    return [
      {
        key: 'executive',
        name: 'Executive Project Summary',
        sourceRecords: ['project', 'tasks', 'milestones', 'activity', 'risk'],
        outputShape: ['status', 'health', 'progress', 'risks', 'nextActions'],
      },
      {
        key: 'sprint',
        name: 'Sprint Summary',
        sourceRecords: ['tasks', 'milestones', 'timeEntries', 'activity'],
        outputShape: ['completed', 'carriedOver', 'blocked', 'velocitySignals'],
      },
      {
        key: 'team',
        name: 'Team Summary',
        sourceRecords: ['tasks', 'workload', 'timeEntries', 'members'],
        outputShape: ['capacity', 'ownership', 'blockers', 'supportNeeded'],
      },
      {
        key: 'daily',
        name: 'Daily Summary',
        sourceRecords: ['tasks', 'comments', 'activity'],
        outputShape: ['today', 'blocked', 'dueSoon', 'changes'],
      },
      {
        key: 'weekly',
        name: 'Weekly Summary',
        sourceRecords: ['project', 'tasks', 'milestones', 'activity', 'workload'],
        outputShape: ['progress', 'milestones', 'risks', 'focus'],
      },
    ];
  }
}
