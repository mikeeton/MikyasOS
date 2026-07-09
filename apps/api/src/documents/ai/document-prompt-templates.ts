import type { KnowledgePromptTemplate } from './document-ai.types';

export const DOCUMENT_PROMPT_TEMPLATES: KnowledgePromptTemplate[] = [
  {
    key: 'summarise-document',
    title: 'Summarise this document',
    objective:
      'Prepare a concise executive, policy, contract, proposal, meeting, or technical summary.',
    outputSections: ['Overview', 'Key points', 'Risks', 'Follow-ups'],
    guardrails: [
      'Use only indexed document context.',
      'Do not invent missing facts.',
      'Show uncertainty clearly.',
    ],
  },
  {
    key: 'explain-policy',
    title: 'Explain this policy',
    objective: 'Translate policy language into practical operational guidance.',
    outputSections: ['Plain-English explanation', 'Who it affects', 'Required actions'],
    guardrails: ['No legal advice.', 'Preserve source references for future citation.'],
  },
  {
    key: 'review-contract',
    title: 'Review this contract',
    objective: 'Identify deadlines, obligations, renewal terms, and business risk signals.',
    outputSections: ['Important dates', 'Obligations', 'Risk flags', 'Questions for review'],
    guardrails: [
      'Do not replace legal review.',
      'Mark all extracted fields as unverified until source-backed.',
    ],
  },
  {
    key: 'compare-documents',
    title: 'Compare two documents',
    objective:
      'Prepare future side-by-side comparison for versions, contracts, proposals, and policies.',
    outputSections: ['Differences', 'Potential conflicts', 'Recommended review points'],
    guardrails: ['Compare only explicitly selected documents.', 'Avoid broad semantic guesses.'],
  },
  {
    key: 'executive-briefing',
    title: 'Generate executive briefing',
    objective: 'Prepare a leadership-ready briefing from selected knowledge records.',
    outputSections: ['Decision context', 'Business impact', 'Actions', 'Open questions'],
    guardrails: ['Respect RBAC and tenant isolation.', 'Never access storage directly.'],
  },
];
