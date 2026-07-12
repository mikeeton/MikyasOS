import { Injectable } from '@nestjs/common';

@Injectable()
export class MeetingSummaryService {
  getArchitecture() {
    return { enabled: false, preparedInputs: ['agenda', 'notes', 'participants', 'recordings'] };
  }
}

@Injectable()
export class MeetingActionExtractionService {
  getArchitecture() {
    return { enabled: false, actionItemSchemaPrepared: true };
  }
}

@Injectable()
export class ConversationSummaryService {
  getArchitecture() {
    return { enabled: false, markdownAware: true, threadAware: true };
  }
}

@Injectable()
export class ConversationSearchService {
  getArchitecture() {
    return { keywordSearchReady: true, semanticSearchPrepared: true };
  }
}

@Injectable()
export class MeetingEmbeddingService {
  getArchitecture() {
    return { enabled: false, vectorStore: 'pgvector', tenantScoped: true };
  }
}

@Injectable()
export class KnowledgeLinkService {
  getArchitecture() {
    return {
      links: ['CRM Company', 'CRM Contact', 'Project', 'Task', 'Document', 'Future Calendar'],
      knowledgeGraphPrepared: true,
    };
  }
}
