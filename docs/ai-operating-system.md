# mikyasOS AI Operating System

Milestone 7 adds the backend AI operating layer and the first AI Workspace surfaces. It extends the existing identity, organisation, CRM, projects, and documents architecture without replacing previous modules.

## Architecture

All AI requests go through `AiOrchestratorService`.

The orchestrator coordinates:

- `PromptManagerService` for reusable prompt templates
- `AiMemoryService` for conversation and business memory overview
- `ContextBuilderService` for scoped organisation, user, role, page, activity, project, and document context
- `KnowledgeRetrievalService` for CRM, project, task, and document retrieval
- `AiEmbeddingService` for the pgvector-ready embedding contract
- `ConversationService` for thread and streaming preparation
- `ReasoningService` for intent, confidence, and destructive-action detection
- `AiActionService` for confirmation-required future actions
- `AiAuditService` for request audit logging
- `AiSettingsService` for provider and guardrail settings

## Security

AI endpoints are protected with:

- `JwtAuthGuard`
- `OrganisationGuard`
- `PermissionsGuard`
- `AI.Read` and `AI.Use` permissions

Every retrieval query is scoped by `organisationId`. The AI layer does not expose inaccessible data and does not execute actions automatically.

## Prompt Library

Prompt templates live in `apps/api/src/ai-os/prompts/prompt-library.ts`.

Current templates:

- Executive briefing
- Customer summary
- Project summary
- Task planning
- Document summary
- Sales recommendation
- Meeting summary
- Invoice explanation

Prompts are reusable and loaded through `PromptManagerService`; they are not hardcoded inside orchestrator logic.

## Memory

The memory service prepares:

- Conversation memory
- Business memory
- Preferences
- Important facts
- Recent actions
- Pinned memories
- Future episodic memory

Current memory is architecture-backed and returns organisation-scoped counts plus recent audit events.

## Retrieval And RAG

`KnowledgeRetrievalService` currently searches:

- Companies
- Projects
- Tasks
- Documents

The retrieval contract is ready for pgvector, embeddings, semantic search, policies, knowledge notes, finance, meetings, and calendar sources.

## Actions

AI actions are prepared but disabled for execution. Every action requires confirmation.

Prepared future actions:

- Create task
- Create project
- Create company
- Create contact
- Generate report
- Draft email
- Summarise document
- Plan sprint
- Schedule meeting

## API Endpoints

- `GET /api/v1/ai/capabilities`
- `GET /api/v1/ai/prompts`
- `GET /api/v1/ai/memory`
- `GET /api/v1/ai/settings`
- `GET /api/v1/ai/retrieval/status`
- `GET /api/v1/ai/actions`
- `GET /api/v1/ai/conversations`
- `POST /api/v1/ai/conversations`
- `POST /api/v1/ai/orchestrate`

## Frontend Routes

- `/app/ai`
- `/app/ai/history`
- `/app/ai/settings`
- `/app/ai/memory`
- `/app/ai/prompts`

## Current Limits

Milestone 7 intentionally does not enable live model calls, autonomous action execution, vector search, voice mode, or real automation execution. Those should be introduced after confirmation UX and production guardrails are finished.

## Milestone 8 Readiness

Recommended next step: AI Execution & Confirmation UX.

Build real streaming, user-confirmed actions, agent selection, citation rendering, and the first production-safe OpenRouter prompt execution path.
