import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { DatabaseModule } from '../infra/database/database.module';
import { AiModule } from '../infra/ai/ai.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { AiActionService } from './ai-action.service';
import { AiAuditService } from './ai-audit.service';
import { AiEmbeddingService } from './ai-embedding.service';
import { AiMemoryService } from './ai-memory.service';
import { AiOrchestratorService } from './ai-orchestrator.service';
import { AiSettingsService } from './ai-settings.service';
import { ContextBuilderService } from './context-builder.service';
import { ConversationService } from './conversation.service';
import { KnowledgeRetrievalService } from './knowledge-retrieval.service';
import { PromptManagerService } from './prompt-manager.service';
import { ReasoningService } from './reasoning.service';
import { AiOsController } from './ai-os.controller';

@Module({
  imports: [DatabaseModule, JwtModule.register({}), PermissionsModule, AuditLogsModule, AiModule],
  controllers: [AiOsController],
  providers: [
    JwtAuthGuard,
    OrganisationGuard,
    PermissionsGuard,
    AiActionService,
    AiAuditService,
    AiEmbeddingService,
    AiMemoryService,
    AiOrchestratorService,
    AiSettingsService,
    ContextBuilderService,
    ConversationService,
    KnowledgeRetrievalService,
    PromptManagerService,
    ReasoningService,
  ],
  exports: [AiOrchestratorService, PromptManagerService, KnowledgeRetrievalService],
})
export class AiOsModule {}
