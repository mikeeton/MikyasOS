# Automation Engine

Milestone 9 adds the mikyasOS workflow engine. Automation is event-driven, organisation-scoped, permission-aware, and designed to connect CRM, projects, tasks, documents, meetings, communication, AI, notifications, integrations, and future finance.

## Architecture

The API exposes `AutomationModule` with the following internal service boundaries:

- `WorkflowsService` manages workflow definitions, versions, triggers, conditions, actions, soft deletion, and audit entries.
- `ExecutionService` validates triggers, builds execution context, evaluates conditions, validates actions, logs each step, and records completion.
- `AutomationQueueService` prepares BullMQ background execution, retries, scheduled jobs, notification jobs, AI tasks, imports, and exports.
- `TemplateService` exposes reusable workflow templates, with built-in fallback templates for a fresh database.
- `SchedulerService` stores once, hourly, daily, weekly, monthly, and cron schedules with timezone support.
- `VariableService` stores workflow variables and secret placeholders.
- `ApprovalService` prepares human approval flows for sensitive actions.
- `ExecutionHistoryService` reads workflow logs.
- AI preparation services describe recommendation, generation, optimisation, explanation, and risk architecture without running LLM generation.

Every API route uses JWT authentication, organisation isolation, and permission guards.

## Database Model

Automation adds these Prisma models:

- `Workflow`
- `WorkflowVersion`
- `WorkflowExecution`
- `WorkflowTrigger`
- `WorkflowCondition`
- `WorkflowAction`
- `WorkflowVariable`
- `WorkflowTemplate`
- `WorkflowSchedule`
- `WorkflowApproval`
- `WorkflowLog`
- `WorkflowAudit`
- `WorkflowError`

Each model has UUID primary keys, `organisationId`, audit timestamps, soft-delete fields, indexes, and relationships to organisations, users, workflows, executions, and logs where appropriate.

## Execution Pipeline

Workflow execution follows this sequence:

1. Validate the workflow and trigger payload.
2. Create a queued `WorkflowExecution`.
3. Enqueue a BullMQ `workflow.execute` job with retry options.
4. Build safe execution context.
5. Evaluate workflow conditions in order.
6. Validate each action.
7. Log every step to `WorkflowLog`.
8. Mark the execution as succeeded, cancelled, or failed.
9. Record audit events.

Current actions are validated and logged safely. External effects such as email, webhooks, AI generation, and destructive record updates are prepared for future confirmation flows.

## Supported Triggers

- Customer created
- Lead won
- Project created
- Task completed
- Document uploaded
- Meeting ended
- Invoice paid placeholder
- Calendar event
- Webhook received
- Manual trigger
- Scheduled trigger

## Supported Actions

- Create task
- Assign task
- Create project
- Create company
- Create contact
- Send notification
- Send email placeholder
- Generate AI summary placeholder
- Create meeting
- Create calendar event
- Move CRM stage
- Update record
- Create document
- Run webhook
- Wait
- Approval

## Queue Architecture

The automation queue is named `automation-workflows`. Workflow execution jobs use:

- `attempts: 3`
- exponential backoff
- completed job retention
- failed job retention

The queue is ready for execution jobs, scheduled jobs, retries, notifications, AI tasks, imports, and exports.

## Templates

Built-in template categories include Sales, CRM, Projects, HR, Operations, Finance, Support, and Marketing.

Initial templates include:

- Customer onboarding
- Employee onboarding
- Lead follow-up
- Project kickoff
- Contract approval
- Invoice reminder
- Meeting follow-up
- Task escalation

## API Endpoints

All endpoints are under `/api/v1/automation` and require an organisation header.

- `GET /capabilities`
- `GET /workflows`
- `GET /workflows/:id`
- `POST /workflows`
- `PATCH /workflows/:id`
- `DELETE /workflows/:id`
- `POST /workflows/:id/execute`
- `GET /executions`
- `GET /history`
- `GET /logs`
- `GET /templates`
- `GET /schedules`
- `POST /schedules`
- `GET /variables`
- `POST /variables`
- `GET /approvals`
- `POST /approvals`
- `PATCH /approvals/:id`

## Frontend

Routes added:

- `/app/automation`
- `/app/automation/workflows`
- `/app/automation/templates`
- `/app/automation/history`
- `/app/automation/logs`
- `/app/automation/settings`

The frontend adds:

- automation API client methods
- TanStack Query hooks
- dashboard metrics
- visual workflow builder preview
- workflow list and manual run actions
- template gallery
- execution history
- log viewer
- settings and queue readiness overview

## Developer Notes

Use these commands locally:

```bash
npm run prisma:generate -w @mikyasos/api
npm run typecheck
npm run lint
npm test
npm run build
docker compose up -d
```

Manual smoke flow:

1. Register or log in.
2. Create or switch to an organisation.
3. Open `/app/automation`.
4. Create the demo workflow.
5. Run the workflow.
6. Open `/app/automation/history` and `/app/automation/logs`.

## Future Work

Milestone 10 can build deeper integrations:

- real event bus trigger dispatch
- production workflow worker processor
- drag-and-drop node editing persistence
- confirmation UI for sensitive actions
- webhook receiver hardening
- AI workflow generation UI
- advanced scheduler runner
- action adapters for CRM, projects, documents, meetings, and notifications
