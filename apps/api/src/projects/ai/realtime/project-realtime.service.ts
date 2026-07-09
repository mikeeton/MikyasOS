import { Injectable } from '@nestjs/common';

import type { ProjectRealtimePlan } from '../project-ai.types';

@Injectable()
export class ProjectRealtimeService {
  getRealtimePlan(): ProjectRealtimePlan {
    return {
      transport: 'websocket',
      executionEnabled: false,
      futureEvents: [
        'task.moved',
        'comment.added',
        'user.joined',
        'status.updated',
        'progress.updated',
        'notification.received',
        'project.completed',
      ],
    };
  }
}
