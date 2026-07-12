import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';

import { AUTOMATION_JOBS, AUTOMATION_QUEUE } from './automation.constants';

@Injectable()
export class AutomationQueueService {
  constructor(@InjectQueue(AUTOMATION_QUEUE) private readonly queue: Queue) {}

  enqueueExecution(workflowId: string, executionId: string, organisationId: string) {
    return this.queue.add(
      AUTOMATION_JOBS.executeWorkflow,
      {
        workflowId,
        executionId,
        organisationId,
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: 100,
        removeOnFail: 500,
      },
    );
  }

  getQueueArchitecture() {
    return {
      queue: this.queue.name,
      jobs: AUTOMATION_JOBS,
      backgroundExecution: true,
      retryReady: true,
      scheduledJobsReady: true,
      notificationsPrepared: true,
      aiTasksPrepared: true,
      importsExportsPrepared: true,
    };
  }
}
