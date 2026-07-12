export const AUTOMATION_QUEUE = 'automation-workflows';

export const AUTOMATION_JOBS = {
  executeWorkflow: 'workflow.execute',
  scheduledWorkflow: 'workflow.schedule',
  retryWorkflow: 'workflow.retry',
  notification: 'workflow.notification',
  aiTask: 'workflow.ai-task',
  import: 'workflow.import',
  export: 'workflow.export',
} as const;

export const WORKFLOW_TEMPLATES = [
  {
    name: 'Customer onboarding',
    category: 'CRM',
    description: 'Create onboarding project, tasks, welcome notification, and follow-up meeting.',
  },
  {
    name: 'Employee onboarding',
    category: 'HR',
    description: 'Prepare tasks, documents, approvals, and team announcements.',
  },
  {
    name: 'Lead follow-up',
    category: 'Sales',
    description: 'Notify owner, create follow-up task, and schedule reminder.',
  },
  {
    name: 'Project kickoff',
    category: 'Projects',
    description: 'Create kickoff meeting, documents, tasks, and communication channel.',
  },
  {
    name: 'Contract approval',
    category: 'Operations',
    description: 'Route document approval before notifying the team.',
  },
  {
    name: 'Invoice reminder',
    category: 'Finance',
    description: 'Future finance reminder workflow.',
  },
  {
    name: 'Meeting follow-up',
    category: 'Operations',
    description: 'Create action items after meeting notes are saved.',
  },
  {
    name: 'Task escalation',
    category: 'Support',
    description: 'Escalate overdue tasks and notify managers.',
  },
] as const;
