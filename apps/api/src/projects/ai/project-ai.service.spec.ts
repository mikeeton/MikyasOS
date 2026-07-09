import type { ProjectAiJobsService } from './jobs/project-ai-jobs.service';
import { ProjectAiService } from './project-ai.service';
import { ProjectRealtimeService } from './realtime/project-realtime.service';
import { DependencyAnalysisService } from './services/dependency-analysis.service';
import { ProjectKnowledgeService } from './services/project-knowledge.service';
import { ProjectRiskService } from './services/project-risk.service';
import { ProjectSummaryService } from './services/project-summary.service';
import { TaskRecommendationService } from './services/task-recommendation.service';
import { WorkloadAnalysisService } from './services/workload-analysis.service';

describe('ProjectAiService', () => {
  const service = new ProjectAiService(
    { isConfigured: false } as never,
    new ProjectSummaryService(),
    new TaskRecommendationService(),
    new ProjectRiskService(),
    new WorkloadAnalysisService(),
    new DependencyAnalysisService(),
    new ProjectKnowledgeService(),
    {
      getQueuePlan: jest.fn().mockReturnValue({
        executionEnabled: false,
        queues: [{ name: 'project-ai-indexing', purpose: 'Indexing', jobs: ['index-project'] }],
      }),
    } as unknown as ProjectAiJobsService,
    new ProjectRealtimeService(),
  );

  it('exposes project AI architecture without prompt execution or embeddings', () => {
    const result = service.getCapabilities();

    expect(result.promptExecutionEnabled).toBe(false);
    expect(result.embeddingsEnabled).toBe(false);
    expect(result.conversationalAiEnabled).toBe(false);
    expect(result.provider).toMatchObject({ abstraction: 'AiModule', providerAgnostic: true });
    expect(result.capabilities.map((capability) => capability.key)).toContain('project-summary');
    expect(result.knowledgePlan.vectorSearch).toMatchObject({
      pgvectorReady: false,
      embeddingsEnabled: false,
      semanticSearchEnabled: false,
      ragEnabled: false,
    });
    expect(result.realtimePlan.futureEvents).toContain('task.moved');
  });

  it('returns reusable prompt templates while keeping execution disabled', () => {
    const result = service.getPromptTemplates();

    expect(result.promptExecutionEnabled).toBe(false);
    expect(result.templates.map((template) => template.key)).toEqual(
      expect.arrayContaining(['project-summary', 'workload-analysis', 'executive-brief']),
    );
    expect(
      result.templates.find((template) => template.key === 'project-summary')?.guardrails,
    ).toContain('Preserve tenant boundaries');
  });
});
