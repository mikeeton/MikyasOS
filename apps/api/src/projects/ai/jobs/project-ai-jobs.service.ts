import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';

import type { ProjectAiQueuePlan } from '../project-ai.types';
import { PROJECT_AI_QUEUES } from './project-ai-queue.constants';

@Injectable()
export class ProjectAiJobsService {
  constructor(
    @InjectQueue(PROJECT_AI_QUEUES.indexing) private readonly indexingQueue: Queue,
    @InjectQueue(PROJECT_AI_QUEUES.reports) private readonly reportsQueue: Queue,
    @InjectQueue(PROJECT_AI_QUEUES.notifications) private readonly notificationsQueue: Queue,
    @InjectQueue(PROJECT_AI_QUEUES.imports) private readonly importsQueue: Queue,
  ) {}

  getQueuePlan(): ProjectAiQueuePlan {
    return {
      executionEnabled: false,
      queues: [
        {
          name: this.indexingQueue.name,
          purpose: 'Future background indexing and AI knowledge preparation.',
          jobs: [
            'index-project',
            'index-task',
            'index-comment',
            'index-file',
            'refresh-project-context',
          ],
        },
        {
          name: this.reportsQueue.name,
          purpose: 'Future long-running status reports, executive briefs, and sprint reports.',
          jobs: ['generate-status-report', 'generate-executive-brief', 'generate-sprint-review'],
        },
        {
          name: this.notificationsQueue.name,
          purpose: 'Future async notification fan-out from project and realtime events.',
          jobs: ['notify-task-moved', 'notify-comment-added', 'notify-project-completed'],
        },
        {
          name: this.importsQueue.name,
          purpose: 'Future large imports that should never block request paths.',
          jobs: ['import-projects', 'import-tasks', 'import-files'],
        },
      ],
    };
  }
}
