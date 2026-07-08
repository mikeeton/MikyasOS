# mikyasOS Architecture

## Repository Structure

- `apps/web` contains the React application shell. It owns browser runtime concerns:
  routing, query caching, local UI state, theme behavior, and user-facing layout.
- `apps/api` contains the NestJS backend. It owns API contracts, configuration,
  health checks, infrastructure adapters, validation, logging, and security middleware.
- `packages/shared` contains runtime TypeScript contracts shared by apps.
- `packages/config` centralizes reusable engineering configuration.
- `shared` is reserved for non-runtime shared assets such as design tokens, schemas,
  and cross-functional documents.
- `docker` contains image definitions for local services.
- `docs` records architecture and operating decisions.
- `scripts` contains repeatable developer automation.
- `.github` contains CI workflows.

## Monorepo Decisions

The repository uses npm workspaces because npm is available with Node 22 in the local
environment and gives the project a zero-extra-tool bootstrap. Applications remain
independently buildable while shared packages can be consumed through normal package
boundaries.

TypeScript strictness is enabled at the root so future feature work inherits safe defaults.
ESLint and Prettier are centralized to keep style and correctness rules consistent across
apps and packages.

## Frontend Foundation

The frontend is intentionally an application shell, not a feature surface. It includes:

- React, TypeScript, Vite, and Tailwind CSS.
- shadcn/ui-compatible configuration and a first `Button` primitive.
- React Router for application-level navigation.
- TanStack Query for server-state caching.
- Zustand for small local state, currently theme selection.
- Framer Motion for transition primitives.
- Responsive layout and dark mode variables.

## Backend Foundation

The backend uses NestJS with global validation, structured logging, security middleware,
error handling, response envelopes, configuration validation, PostgreSQL via Prisma, Redis
via ioredis, and BullMQ configuration.

No domain tables or feature modules are created yet. Infrastructure boundaries exist for
Cloudflare R2 and OpenRouter so later features can attach real adapters without leaking
vendor details through business modules.

## Identity Platform

Milestone 2 identity details live in [`docs/identity.md`](identity.md). The identity layer
adds users, organisations, memberships, roles, permissions, invitations, sessions,
refresh-token rotation, and audit logging without introducing business-feature tables.

## Workspace Shell

Milestone 3 workspace details live in [`docs/workspace.md`](workspace.md). The workspace
layer adds the permanent authenticated layout, config-driven navigation, command palette,
global search UI, organisation switcher, notification centre, user menu, theme preferences,
and workspace context without introducing CRM, Projects, AI chat, Finance, or other
business modules.

## CRM Core

Milestone 4 CRM backend details live in [`docs/crm.md`](crm.md). The CRM layer adds
organisation-owned companies, contacts, leads, opportunities, notes, file metadata, tags,
activity timelines, and CRM search through repository-backed NestJS modules. Frontend CRM
pages are intentionally reserved for Milestone 4 Part 2.

## Projects & Work Management

Milestone 5 backend details live in [`docs/projects.md`](projects.md). The projects layer
adds organisation-owned projects, tasks, nested subtasks, boards, milestones, comments,
labels, file metadata, activity timelines, time tracking, workload overview, and project
search without adding frontend project pages yet.

## Local Development

Run the full development environment with:

```bash
docker compose up --build
```

The web app starts on `http://localhost:5173`.
The API health endpoint is `http://localhost:3000/api/v1/health`.

Docker Compose uses `.env.example` for safe local defaults. Create a local `.env` when
you need machine-specific overrides or real integration secrets.
