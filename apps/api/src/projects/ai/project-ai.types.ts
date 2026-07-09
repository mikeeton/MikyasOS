export type ProjectAiStatus = 'architecture_ready' | 'planned';

export type ProjectAiCapability = {
  key: string;
  name: string;
  description: string;
  requiredPermission: string;
  status: ProjectAiStatus;
};

export type ProjectPromptTemplate = {
  key: string;
  name: string;
  purpose: string;
  systemInstruction: string;
  userContextFields: string[];
  guardrails: string[];
};

export type ProjectSummaryPlan = {
  key: 'executive' | 'sprint' | 'team' | 'daily' | 'weekly';
  name: string;
  sourceRecords: string[];
  outputShape: string[];
};

export type TaskRecommendationPlan = {
  key: string;
  signals: string[];
  outputShape: string[];
};

export type ProjectRiskPlan = {
  key: string;
  signals: string[];
  outputShape: string[];
};

export type WorkloadAnalysisPlan = {
  key: string;
  signals: string[];
  outputShape: string[];
};

export type DependencyAnalysisPlan = {
  key: string;
  signals: string[];
  outputShape: string[];
};

export type ProjectKnowledgeSource =
  'projects' | 'tasks' | 'comments' | 'files' | 'documents' | 'milestones' | 'activity';

export type ProjectKnowledgePlan = {
  sources: ProjectKnowledgeSource[];
  indexingStatus: 'architecture_only';
  vectorSearch: {
    pgvectorReady: false;
    embeddingsEnabled: false;
    semanticSearchEnabled: false;
    ragEnabled: false;
    futureIndexes: string[];
  };
};

export type ProjectAiQueuePlan = {
  queues: Array<{
    name: string;
    purpose: string;
    jobs: string[];
  }>;
  executionEnabled: false;
};

export type ProjectRealtimePlan = {
  transport: 'websocket';
  executionEnabled: false;
  futureEvents: string[];
};
