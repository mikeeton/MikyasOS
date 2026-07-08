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

## Part 2 Boundary

Part 2 should add frontend project pages using the existing workspace shell and design
language. Kanban, timeline, calendar, and AI views should remain separate later parts
unless the next milestone explicitly requests them.
