export const AI_PROMPT_TEMPLATES = [
  {
    key: 'executive-briefing',
    title: 'Executive briefing',
    objective: 'Summarise organisation health from customers, projects, tasks, and knowledge.',
    guardrails: [
      'Use only provided organisation context.',
      'Call out missing data instead of guessing.',
      'Separate facts, risks, and recommendations.',
    ],
  },
  {
    key: 'customer-summary',
    title: 'Customer summary',
    objective: 'Explain customer status, relationships, open work, and next best actions.',
    guardrails: [
      'Respect CRM permissions.',
      'Cite linked records.',
      'Avoid hidden financial claims.',
    ],
  },
  {
    key: 'project-summary',
    title: 'Project summary',
    objective: 'Summarise delivery health, blockers, workload, and upcoming milestones.',
    guardrails: ['Use project and task context only.', 'Flag stale or incomplete data.'],
  },
  {
    key: 'task-planning',
    title: 'Task planning',
    objective: 'Break a goal into tasks, owners, dependencies, and confirmation-ready actions.',
    guardrails: ['Never create tasks directly.', 'Return proposed actions for confirmation.'],
  },
  {
    key: 'document-summary',
    title: 'Document summary',
    objective: 'Summarise a document, linked records, versions, permissions, and AI readiness.',
    guardrails: ['Respect document visibility.', 'Show preview limitations clearly.'],
  },
  {
    key: 'sales-recommendation',
    title: 'Sales recommendation',
    objective: 'Recommend next sales actions using companies, leads, opportunities, and activity.',
    guardrails: ['Distinguish evidence from recommendation.', 'Do not invent deal values.'],
  },
  {
    key: 'meeting-summary',
    title: 'Meeting summary',
    objective: 'Prepare future meeting notes, decisions, follow-ups, and linked work.',
    guardrails: ['Meeting ingestion is future-ready.', 'Mark unavailable transcript data.'],
  },
  {
    key: 'invoice-explanation',
    title: 'Invoice explanation',
    objective: 'Prepare finance explanations for future invoice data.',
    guardrails: ['Finance data is not implemented yet.', 'Return unavailable status where needed.'],
  },
] as const;
