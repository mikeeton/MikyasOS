export type CustomerInsightKind =
  | 'customer-summary'
  | 'lead-analysis'
  | 'opportunity-review'
  | 'relationship-risk'
  | 'follow-up-suggestions'
  | 'sales-recommendations';

export type CustomerRecordKind = 'executive' | 'company' | 'contact' | 'lead' | 'opportunity';

export type CustomerInsightStatus = 'architecture_ready' | 'not_generated';

export type CustomerAiCapability = {
  key: CustomerInsightKind;
  name: string;
  description: string;
  requiredPermission: 'crm:read';
  status: CustomerInsightStatus;
};

export type CustomerPromptTemplate = {
  key: CustomerInsightKind;
  title: string;
  objective: string;
  systemInstruction: string;
  userContextFields: string[];
  guardrails: string[];
};

export type CustomerSummaryPlan = {
  scope: CustomerRecordKind;
  title: string;
  sourceEntities: string[];
  outputSections: string[];
  status: CustomerInsightStatus;
};

export type CustomerEmbeddingPlan = {
  enabled: false;
  provider: 'openrouter';
  vectorStore: 'reserved';
  indexableEntities: string[];
  retrievalUseCases: string[];
  status: CustomerInsightStatus;
};
