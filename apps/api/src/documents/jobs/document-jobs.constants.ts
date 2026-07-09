export const DOCUMENT_PROCESSING_QUEUE = 'document-processing';

export const DOCUMENT_PROCESSING_JOBS = {
  indexDocument: 'document.index',
  extractText: 'document.extract-text',
  generateThumbnail: 'document.generate-thumbnail',
  scanForViruses: 'document.scan-for-viruses',
  summarise: 'document.summarise',
  generateEmbedding: 'document.generate-embedding',
  extractMetadata: 'document.extract-metadata',
  runOcr: 'document.ocr',
  updateKnowledgeGraph: 'document.knowledge-graph.update',
} as const;
