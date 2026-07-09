import type { ProjectPromptTemplate } from './project-ai.types';

export const projectPromptTemplates: ProjectPromptTemplate[] = [
  {
    key: 'project-summary',
    name: 'Project Summary',
    purpose: 'Summarise project health, status, recent movement, risks, and next actions.',
    systemInstruction:
      'Use only supplied project context to create an executive-ready project summary.',
    userContextFields: ['project', 'tasks', 'milestones', 'activity', 'comments', 'files'],
    guardrails: [
      'Do not invent dates, owners, dependencies, or budget data',
      'Preserve tenant boundaries',
      'Show uncertainty when data is incomplete',
    ],
  },
  {
    key: 'sprint-review',
    name: 'Sprint Review',
    purpose: 'Prepare sprint progress, completed work, blocked work, and carry-over items.',
    systemInstruction:
      'Review sprint-scoped work from supplied project and task records without external claims.',
    userContextFields: ['project', 'tasks', 'milestones', 'timeEntries', 'activity'],
    guardrails: ['Do not assign blame', 'Separate facts from recommendations', 'Keep tone neutral'],
  },
  {
    key: 'project-risk-analysis',
    name: 'Project Risk Analysis',
    purpose: 'Identify delivery, deadline, dependency, capacity, and blocker risk signals.',
    systemInstruction:
      'Evaluate project risk from supplied operational signals and return explainable factors.',
    userContextFields: ['project', 'tasks', 'dependencies', 'workload', 'milestones'],
    guardrails: [
      'Do not overstate confidence',
      'Prefer concrete source fields',
      'No cross-tenant comparisons',
    ],
  },
  {
    key: 'workload-analysis',
    name: 'Workload Analysis',
    purpose: 'Assess capacity, burnout indicators, task distribution, and unused availability.',
    systemInstruction:
      'Analyse team workload using supplied assignments, estimates, and capacity fields.',
    userContextFields: ['workload', 'tasks', 'timeEntries', 'users'],
    guardrails: [
      'Do not infer sensitive health information',
      'Frame burnout indicators as workload risk only',
      'Recommend human review',
    ],
  },
  {
    key: 'deadline-prediction',
    name: 'Deadline Prediction',
    purpose: 'Prepare architecture for estimated completion and delivery confidence.',
    systemInstruction:
      'Estimate delivery confidence using only supplied progress, deadline, task, and capacity data.',
    userContextFields: ['project', 'tasks', 'milestones', 'workload', 'timeEntries'],
    guardrails: ['Explain confidence', 'Do not guarantee delivery dates', 'Flag missing data'],
  },
  {
    key: 'meeting-summary',
    name: 'Meeting Summary',
    purpose: 'Prepare future summaries from meeting notes, comments, and activity records.',
    systemInstruction: 'Summarise supplied meeting and project notes into decisions and actions.',
    userContextFields: ['comments', 'activity', 'tasks', 'milestones'],
    guardrails: [
      'Do not attribute statements without source data',
      'Separate decisions from notes',
    ],
  },
  {
    key: 'status-report',
    name: 'Status Report',
    purpose: 'Generate project status reports for stakeholders when prompt execution is enabled.',
    systemInstruction:
      'Produce a concise status report from supplied project records and operational activity.',
    userContextFields: ['project', 'tasks', 'milestones', 'activity', 'risks'],
    guardrails: ['No unsupported claims', 'List blockers explicitly', 'Include next actions'],
  },
  {
    key: 'executive-brief',
    name: 'Executive Brief',
    purpose: 'Prepare leadership-ready project portfolio and single-project briefs.',
    systemInstruction:
      'Create a leadership brief using only supplied project, workload, risk, and timeline context.',
    userContextFields: ['project', 'portfolio', 'workload', 'risk', 'timeline'],
    guardrails: ['Keep it concise', 'Surface tradeoffs', 'Do not expose restricted fields'],
  },
];
