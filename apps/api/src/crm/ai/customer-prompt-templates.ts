import type { CustomerPromptTemplate } from './customer-ai.types';

export const customerPromptTemplates: CustomerPromptTemplate[] = [
  {
    key: 'customer-summary',
    title: 'Customer Summary',
    objective: 'Prepare a concise executive summary for a customer record.',
    systemInstruction:
      'Summarise only the supplied CRM facts. Never invent missing fields or expose hidden data.',
    userContextFields: ['company', 'contacts', 'activities', 'notes', 'files', 'tags'],
    guardrails: [
      'Respect tenant boundaries',
      'Avoid sensitive personal inference',
      'Cite CRM facts',
    ],
  },
  {
    key: 'lead-analysis',
    title: 'Lead Analysis',
    objective: 'Assess lead quality, source strength, and qualification gaps.',
    systemInstruction: 'Evaluate the lead from supplied CRM fields without making external claims.',
    userContextFields: ['lead', 'company', 'assignee', 'activityTimeline'],
    guardrails: ['Do not score absent data', 'Return actionable next fields', 'Keep tone neutral'],
  },
  {
    key: 'opportunity-review',
    title: 'Opportunity Review',
    objective: 'Review deal stage, probability, close date, value, and risks.',
    systemInstruction: 'Use CRM opportunity data to identify deal health and missing context.',
    userContextFields: ['opportunity', 'company', 'contacts', 'activities', 'notes'],
    guardrails: [
      'Do not forecast beyond provided data',
      'Flag uncertainty',
      'Avoid revenue guarantees',
    ],
  },
  {
    key: 'relationship-risk',
    title: 'Relationship Risk',
    objective: 'Identify engagement gaps and customer relationship risk signals.',
    systemInstruction: 'Detect risk using supplied interaction history and customer metadata only.',
    userContextFields: ['lastActivityAt', 'openOpportunities', 'notes', 'contacts', 'status'],
    guardrails: [
      'No sensitive inference',
      'No cross-tenant comparisons',
      'Explain confidence level',
    ],
  },
  {
    key: 'follow-up-suggestions',
    title: 'Follow-up Suggestions',
    objective: 'Suggest next communication actions based on CRM history.',
    systemInstruction: 'Recommend practical follow-ups grounded in recorded customer context.',
    userContextFields: ['activities', 'notes', 'leadStatus', 'opportunityStage', 'owner'],
    guardrails: [
      'No automated sending',
      'Make suggestions reviewable',
      'Do not fabricate commitments',
    ],
  },
  {
    key: 'sales-recommendations',
    title: 'Sales Recommendations',
    objective: 'Recommend sales actions that improve conversion and relationship quality.',
    systemInstruction: 'Use supplied CRM records to produce explainable recommendations.',
    userContextFields: ['pipeline', 'leadQuality', 'customerHealth', 'recentActivity'],
    guardrails: ['No manipulative tactics', 'Preserve user control', 'Include reasoning'],
  },
];
