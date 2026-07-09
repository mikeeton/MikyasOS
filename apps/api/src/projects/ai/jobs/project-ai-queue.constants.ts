export const PROJECT_AI_QUEUES = {
  indexing: 'project-ai-indexing',
  reports: 'project-ai-reports',
  notifications: 'project-notifications',
  imports: 'project-imports',
} as const;

export const PROJECT_AI_QUEUE_NAMES = Object.values(PROJECT_AI_QUEUES);
