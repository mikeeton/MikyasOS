import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { CurrentOrganisation } from '../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-request';
import { AiActionService } from './ai-action.service';
import { AiEmbeddingService } from './ai-embedding.service';
import { AiMemoryService } from './ai-memory.service';
import { AiOrchestrateDto } from './dto/ai-orchestrate.dto';
import { AiOrchestratorService } from './ai-orchestrator.service';
import { AiSettingsService } from './ai-settings.service';
import { ConversationService } from './conversation.service';
import { KnowledgeRetrievalService } from './knowledge-retrieval.service';
import { PromptManagerService } from './prompt-manager.service';

@Controller({ path: 'ai', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class AiOsController {
  constructor(
    private readonly orchestrator: AiOrchestratorService,
    private readonly prompts: PromptManagerService,
    private readonly memory: AiMemoryService,
    private readonly retrieval: KnowledgeRetrievalService,
    private readonly embeddings: AiEmbeddingService,
    private readonly actions: AiActionService,
    private readonly settings: AiSettingsService,
    private readonly conversations: ConversationService,
  ) {}

  @Get('capabilities')
  @RequirePermissions('AI.Read')
  capabilities() {
    return {
      architecture: 'AI Operating System',
      orchestrator: 'enabled',
      services: [
        'AI Orchestrator',
        'Prompt Manager',
        'Memory Service',
        'Context Builder',
        'Knowledge Retrieval Service',
        'Embedding Service',
        'Conversation Service',
        'Reasoning Service',
        'AI Action Service',
        'AI Audit Service',
        'AI Settings Service',
      ],
      agents: [
        'Executive',
        'Sales',
        'Operations',
        'Finance',
        'HR',
        'Support',
        'Developer',
        'Marketing',
      ],
      execution: {
        modelCallsEnabled: false,
        actionExecutionEnabled: false,
        confirmationRequired: true,
      },
      security: { organisationIsolation: true, rbac: true, auditLogging: true },
    };
  }

  @Get('prompts')
  @RequirePermissions('AI.Read')
  promptsList() {
    return this.prompts.listTemplates();
  }

  @Get('memory')
  @RequirePermissions('AI.Read')
  memoryOverview(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.memory.getMemoryOverview(organisationId, user.id);
  }

  @Get('settings')
  @RequirePermissions('AI.Read')
  settingsOverview() {
    return this.settings.getSettings();
  }

  @Get('retrieval/status')
  @RequirePermissions('AI.Read')
  retrievalStatus() {
    return {
      ...this.retrieval.getStatus(),
      embeddings: this.embeddings.getArchitecture(),
    };
  }

  @Get('actions')
  @RequirePermissions('AI.Read')
  availableActions() {
    return { actions: this.actions.listActions() };
  }

  @Get('conversations')
  @RequirePermissions('AI.Read')
  conversationsList(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.conversations.listConversations(organisationId, user.id);
  }

  @Post('conversations')
  @RequirePermissions('AI.Use')
  createConversation(@Body() dto: AiOrchestrateDto) {
    return this.conversations.startConversation(dto.message);
  }

  @Post('orchestrate')
  @RequirePermissions('AI.Use')
  orchestrate(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AiOrchestrateDto,
  ) {
    return this.orchestrator.handle({
      organisationId,
      user,
      message: dto.message,
      currentPage: dto.currentPage,
      selectedEntity: dto.selectedEntity,
    });
  }
}
