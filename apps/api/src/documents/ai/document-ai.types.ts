export type KnowledgeIndexStatus = 'not_indexed' | 'queued' | 'processing' | 'ready' | 'failed';

export type KnowledgeAiCapability = {
  key: string;
  name: string;
  description: string;
  status: 'architecture_ready' | 'not_generated';
  queueBacked: boolean;
};

export type KnowledgePromptTemplate = {
  key: string;
  title: string;
  objective: string;
  outputSections: string[];
  guardrails: string[];
};
