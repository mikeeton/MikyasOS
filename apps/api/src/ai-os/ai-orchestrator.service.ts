import { Injectable } from '@nestjs/common';

import type { AuthenticatedUser } from '../auth/types/authenticated-request';
import { AiActionService } from './ai-action.service';
import { AiAuditService } from './ai-audit.service';
import { ContextBuilderService } from './context-builder.service';
import { KnowledgeRetrievalService } from './knowledge-retrieval.service';
import { PromptManagerService } from './prompt-manager.service';
import { ReasoningService } from './reasoning.service';
import type { AiStructuredResponse } from './ai-os.types';

@Injectable()
export class AiOrchestratorService {
  constructor(
    private readonly contextBuilder: ContextBuilderService,
    private readonly retrieval: KnowledgeRetrievalService,
    private readonly prompts: PromptManagerService,
    private readonly reasoning: ReasoningService,
    private readonly actions: AiActionService,
    private readonly audit: AiAuditService,
  ) {}

  async handle(input: {
    organisationId: string;
    user: AuthenticatedUser;
    message: string;
    currentPage?: string;
    selectedEntity?: { type: string; id: string };
  }) {
    const [context, knowledge] = await Promise.all([
      this.contextBuilder.build(input),
      this.retrieval.retrieve(input.organisationId, input.message),
    ]);
    const reasoning = this.reasoning.evaluate(input.message, knowledge);
    const suggestedActions = this.actions.suggestActions(reasoning.intent).map((action) => ({
      key: action.key,
      label: action.key.replaceAll('-', ' '),
      requiresConfirmation: true as const,
      status: 'prepared' as const,
    }));
    const template = this.prompts.getTemplate(
      `${reasoning.intent === 'operations' ? 'project' : reasoning.intent === 'knowledge' ? 'document' : 'executive'}-summary`,
    );

    await this.audit.recordRequest({
      organisationId: input.organisationId,
      userId: input.user.id,
      action: 'ai.orchestrate',
      metadata: {
        intent: reasoning.intent,
        sourceCount: reasoning.sourceCount,
        currentPage: input.currentPage,
      },
    });

    const response: AiStructuredResponse = {
      answer:
        reasoning.sourceCount > 0
          ? 'AI Operating System architecture is ready and has retrieved organisation-scoped business context for this request. Live model execution is prepared but remains disabled until provider execution is enabled.'
          : 'I could not find matching company data for that request yet. The AI will ask for clarification instead of inventing business facts.',
      confidence: reasoning.confidence as AiStructuredResponse['confidence'],
      citations: [
        ...knowledge.sources.companies.map((item) => ({
          type: 'company',
          id: item.id,
          title: item.name,
        })),
        ...knowledge.sources.projects.map((item) => ({
          type: 'project',
          id: item.id,
          title: item.name,
        })),
        ...knowledge.sources.tasks.map((item) => ({
          type: 'task',
          id: item.id,
          title: item.title,
        })),
        ...knowledge.sources.documents.map((item) => ({
          type: 'document',
          id: item.id,
          title: item.title,
        })),
      ],
      suggestedActions,
      safety: {
        destructiveActionBlocked: reasoning.destructiveActionRequested,
        groundedInBusinessData: reasoning.sourceCount > 0,
        permissionsApplied: true,
      },
    };

    return {
      response,
      context,
      retrieval: knowledge,
      reasoning,
      promptTemplate: template,
      streamingPrepared: true,
      modelExecutionEnabled: false,
    };
  }
}
