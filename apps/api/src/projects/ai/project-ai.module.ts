import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { AiModule } from '../../infra/ai/ai.module';
import { WorkAuthModule } from '../common/work-auth.module';
import { PROJECT_AI_QUEUE_NAMES } from './jobs/project-ai-queue.constants';
import { ProjectAiJobsService } from './jobs/project-ai-jobs.service';
import { ProjectAiController } from './project-ai.controller';
import { ProjectAiService } from './project-ai.service';
import { ProjectRealtimeService } from './realtime/project-realtime.service';
import { DependencyAnalysisService } from './services/dependency-analysis.service';
import { ProjectKnowledgeService } from './services/project-knowledge.service';
import { ProjectRiskService } from './services/project-risk.service';
import { ProjectSummaryService } from './services/project-summary.service';
import { TaskRecommendationService } from './services/task-recommendation.service';
import { WorkloadAnalysisService } from './services/workload-analysis.service';

@Module({
  imports: [
    WorkAuthModule,
    AiModule,
    BullModule.registerQueue(...PROJECT_AI_QUEUE_NAMES.map((name) => ({ name }))),
  ],
  controllers: [ProjectAiController],
  providers: [
    ProjectAiService,
    ProjectAiJobsService,
    ProjectRealtimeService,
    ProjectSummaryService,
    TaskRecommendationService,
    ProjectRiskService,
    WorkloadAnalysisService,
    DependencyAnalysisService,
    ProjectKnowledgeService,
  ],
  exports: [
    ProjectAiService,
    ProjectSummaryService,
    TaskRecommendationService,
    ProjectRiskService,
    WorkloadAnalysisService,
    DependencyAnalysisService,
    ProjectKnowledgeService,
  ],
})
export class ProjectAiModule {}
