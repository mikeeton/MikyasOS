# Projects & Work Management

Milestone 5 Part 1 adds the backend architecture for Projects & Work Management. It does
not add frontend pages, Kanban UI, Timeline UI, Calendar views, or AI execution.

## Scope

The work-management backend provides organisation-aware APIs for projects, tasks and
nested subtasks, boards, milestones, comments, labels, file metadata, activities, time
tracking, workload overview, and project search.

Every project/work record is tenant-scoped through `organisationId` directly or through
its parent project.

## Database

The Prisma schema adds:

- `Project`
- `Task`
- `ProjectMilestone`
- `ProjectLabel`
- `TaskLabel`
- `ProjectComment`
- `ProjectFile`
- `TimeEntry`
- `ProjectBoard`
- `ProjectBoardColumn`
- `ProjectActivity`

It also adds enums for project status, project priority, task status, task priority,
milestone status, and project activity type.

## Modules

The aggregate `ProjectsModule` imports project records, tasks, boards, milestones,
comments, labels, time tracking, activities, files, workload, and search modules.
Controllers stay thin, services own business rules and activity logging, and repositories
own Prisma access where the module has enough complexity to justify a separate repository.

## API Endpoints

Projects:

- `GET /api/v1/projects`
- `GET /api/v1/projects/:id`
- `POST /api/v1/projects`
- `PATCH /api/v1/projects/:id`
- `DELETE /api/v1/projects/:id`
- `POST /api/v1/projects/:id/archive`
- `POST /api/v1/projects/:id/restore`

Tasks:

- `GET /api/v1/tasks`
- `GET /api/v1/tasks/:id`
- `POST /api/v1/tasks`
- `PATCH /api/v1/tasks/:id`
- `DELETE /api/v1/tasks/:id`
- `POST /api/v1/tasks/:id/move`
- `POST /api/v1/tasks/:id/assign`
- `POST /api/v1/tasks/:id/complete`

Supporting APIs:

- `GET|POST|DELETE /api/v1/boards`
- `POST /api/v1/boards/columns`
- `GET|POST|PATCH|DELETE /api/v1/milestones`
- `GET|POST|PATCH|DELETE /api/v1/comments`
- `GET|POST|PATCH|DELETE /api/v1/labels`
- `POST /api/v1/labels/assign`
- `POST /api/v1/labels/unassign`
- `GET|POST|DELETE /api/v1/project-files`
- `GET /api/v1/project-files/:id/download`
- `GET /api/v1/project-activities`
- `GET|POST|DELETE /api/v1/time-tracking`
- `GET /api/v1/workload`
- `GET /api/v1/project-search?q=...`

Projects AI architecture:

- `GET /api/v1/projects/ai/capabilities`
- `GET /api/v1/projects/ai/prompt-templates`

## Permissions

New default owner roles receive:

- `Project.Create`
- `Project.Read`
- `Project.Update`
- `Project.Delete`
- `Task.Create`
- `Task.Update`
- `Task.Assign`
- `Task.Delete`
- `Comments.Create`
- `Comments.Delete`
- `Files.Upload`
- `Files.Delete`
- `Milestones.Manage`
- `TimeTracking.Manage`

Existing organisations may need a permission backfill before existing roles can use the
new endpoints.

## Security

Every endpoint uses JWT authentication, active organisation checks, permission guards,
class-validator DTO validation, and tenant-filtered queries. Services validate related
records before writes so tasks, files, comments, milestones, and labels cannot cross
organisation boundaries.

## Search And AI Readiness

Project search currently uses relational queries across projects, tasks, labels,
assignees, statuses, priorities, and comments. The response advertises full-text,
semantic-search, and future RAG readiness without executing AI or creating embeddings.

## Projects Frontend

The frontend Projects module now includes:

- `/app/projects` operational command centre.
- `/app/projects/list` portfolio list with grid, table, and compact views.
- `/app/projects/new` project creation.
- `/app/projects/:id` project workspace with tasks, files, activity, and AI placeholders.
- `/app/projects/:id/board` drag/drop task board.
- `/app/projects/:id/list` task list.
- `/app/projects/:id/timeline` timeline architecture.
- `/app/projects/:id/calendar` interactive project calendar.
- `/app/projects/:id/workload` workload view.
- `/app/tasks/:id` task workspace.
- `/app/projects/archive` archived project list.

The UI uses the workspace shell, TanStack Query, the shared project API client, premium
motion primitives, and reusable AI placeholder cards.

## Project AI Architecture

The Projects AI layer is architecture-only. It does not execute prompts, does not create
embeddings, and does not provide conversational AI.

Backend services:

- `ProjectSummaryService` prepares executive, sprint, team, daily, and weekly summary
  plans.
- `TaskRecommendationService` prepares prioritisation, assignee, completion, dependency,
  and future planning plans.
- `ProjectRiskService` prepares risk scoring, deadline prediction, resource shortage,
  blocker detection, delivery confidence, and health calculation plans.
- `WorkloadAnalysisService` prepares employee workload, capacity, task distribution,
  burnout-signal, and unused-capacity plans.
- `DependencyAnalysisService` prepares critical path, dependency graph, circular
  dependency, missing dependency, and risk propagation plans.
- `ProjectKnowledgeService` defines future indexing sources across projects, tasks,
  comments, files, documents, milestones, and activity.

Provider boundary:

- The module imports the existing `AiModule`.
- Provider readiness is exposed through the AI abstraction.
- Business services do not call Gemini, OpenRouter, or any model directly.
- `promptExecutionEnabled`, `embeddingsEnabled`, and `conversationalAiEnabled` remain
  `false`.

Prompt templates:

- Project Summary
- Sprint Review
- Project Risk Analysis
- Workload Analysis
- Deadline Prediction
- Meeting Summary
- Status Report
- Executive Brief

Vector search plan:

- pgvector support is planned but disabled.
- Semantic search, embedding generation, context retrieval, knowledge graph, and RAG are
  planned but disabled.
- Future indexes are named in the capability response so migrations can be added later
  without changing the service contract.

Background jobs:

- BullMQ queues are registered for project AI indexing, report generation, notification
  fan-out, and large imports.
- No processors execute AI work yet.
- Future long-running imports, indexing, reports, notifications, and AI processing should
  use these queues instead of request paths.

Realtime plan:

- A `ProjectRealtimeService` defines future websocket events for task movement, comments,
  user presence, status/progress changes, notifications, and project completion.
- WebSocket execution is disabled until the realtime transport milestone.

Performance boundaries:

- Project list and search remain server-paginated.
- AI architecture endpoints return static plans and do not call external providers.
- Task movement and creation stay on existing fast write paths.
