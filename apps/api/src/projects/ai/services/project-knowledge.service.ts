import { Injectable } from '@nestjs/common';

import type { ProjectKnowledgePlan } from '../project-ai.types';

@Injectable()
export class ProjectKnowledgeService {
  getKnowledgePlan(): ProjectKnowledgePlan {
    return {
      sources: ['projects', 'tasks', 'comments', 'files', 'documents', 'milestones', 'activity'],
      indexingStatus: 'architecture_only',
      vectorSearch: {
        pgvectorReady: false,
        embeddingsEnabled: false,
        semanticSearchEnabled: false,
        ragEnabled: false,
        futureIndexes: [
          'project_knowledge_chunks',
          'project_task_embeddings',
          'project_comment_embeddings',
          'project_file_embeddings',
          'project_activity_embeddings',
        ],
      },
    };
  }
}
