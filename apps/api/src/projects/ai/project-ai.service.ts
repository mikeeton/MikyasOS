import { Injectable } from '@nestjs/common';

import { OpenRouterService } from '../../infra/ai/openrouter.service';
import { ProjectAiJobsService } from './jobs/project-ai-jobs.service';
import { projectPromptTemplates } from './project-prompt-templates';
import type { ProjectAiCapability } from './project-ai.types';
import { ProjectRealtimeService } from './realtime/project-realtime.service';
import { DependencyAnalysisService } from './services/dependency-analysis.service';
import { ProjectKnowledgeService } from './services/project-knowledge.service';
import { ProjectRiskService } from './services/project-risk.service';
import { ProjectSummaryService } from './services/project-summary.service';
import { TaskRecommendationService } from './services/task-recommendation.service';
import { WorkloadAnalysisService } from './services/workload-analysis.service';

@Injectable()
export class ProjectAiService {
  constructor(
    private readonly aiProvider: OpenRouterService,
    private readonly summaries: ProjectSummaryService,
    private readonly recommendations: TaskRecommendationService,
    private readonly risks: ProjectRiskService,
    private readonly workload: WorkloadAnalysisService,
    private readonly dependencies: DependencyAnalysisService,
    private readonly knowledge: ProjectKnowledgeService,
    private readonly jobs: ProjectAiJobsService,
    private readonly realtime: ProjectRealtimeService,
  ) {}

  getCapabilities() {
    return {
      capabilities: this.getCapabilityList(),
      summaryPlans: this.summaries.getSummaryPlans(),
      recommendationPlans: this.recommendations.getRecommendationPlans(),
      riskPlans: this.risks.getRiskPlans(),
      workloadPlans: this.workload.getWorkloadPlans(),
      dependencyPlans: this.dependencies.getDependencyPlans(),
      knowledgePlan: this.knowledge.getKnowledgePlan(),
      queuePlan: this.jobs.getQueuePlan(),
      realtimePlan: this.realtime.getRealtimePlan(),
      provider: {
        abstraction: 'AiModule',
        providerAgnostic: true,
        configured: this.aiProvider.isConfigured,
      },
      promptExecutionEnabled: false,
      embeddingsEnabled: false,
      conversationalAiEnabled: false,
    };
  }

  getPromptTemplates() {
    return {
      templates: projectPromptTemplates,
      promptExecutionEnabled: false,
    };
  }

  private getCapabilityList(): ProjectAiCapability[] {
    return [
      {
        key: 'project-summary',
        name: 'AI Project Summary',
        description: 'Architecture for executive, sprint, team, daily, and weekly summaries.',
        requiredPermission: 'Project.Read',
        status: 'architecture_ready',
      },
      {
        key: 'task-recommendations',
        name: 'AI Recommendations',
        description: 'Architecture for prioritisation, assignees, completion, and dependencies.',
        requiredPermission: 'Project.Read',
        status: 'architecture_ready',
      },
      {
        key: 'project-risks',
        name: 'AI Risks',
        description: 'Architecture for risk scoring, deadline prediction, and delivery confidence.',
        requiredPermission: 'Project.Read',
        status: 'architecture_ready',
      },
      {
        key: 'timeline-analysis',
        name: 'AI Timeline',
        description: 'Architecture for critical path, dependency graph, and risk propagation.',
        requiredPermission: 'Project.Read',
        status: 'architecture_ready',
      },
      {
        key: 'sprint-planner',
        name: 'AI Sprint Planner',
        description: 'Architecture for sprint planning and future async report generation.',
        requiredPermission: 'Project.Read',
        status: 'architecture_ready',
      },
      {
        key: 'workload-analysis',
        name: 'AI Workload',
        description: 'Architecture for capacity, burnout indicators, and unused capacity.',
        requiredPermission: 'Project.Read',
        status: 'architecture_ready',
      },
      {
        key: 'team-insights',
        name: 'AI Team Insights',
        description: 'Architecture for team summaries and task distribution insights.',
        requiredPermission: 'Project.Read',
        status: 'architecture_ready',
      },
      {
        key: 'blocker-detection',
        name: 'AI Blockers',
        description: 'Architecture for blocked task detection and delivery impact.',
        requiredPermission: 'Project.Read',
        status: 'architecture_ready',
      },
    ];
  }
}
