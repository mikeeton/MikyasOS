# CRM Core

Milestone 4 Part 1 adds the backend CRM architecture. It intentionally does not add
frontend CRM pages, dashboard widgets, Projects, Tasks, Finance, or AI UI.

## Scope

The CRM backend provides organisation-aware management for:

- companies
- contacts
- leads
- opportunities
- customer notes
- customer file metadata
- customer tags
- customer activities
- CRM search

Every CRM record belongs to exactly one organisation.

## Database

The Prisma schema adds:

- `Company`
- `Contact`
- `Lead`
- `Opportunity`
- `CustomerNote`
- `CustomerFile`
- `CustomerActivity`
- `CustomerTag`
- `CompanyTag`

The schema also adds enums for company status, lead status, opportunity stage,
opportunity status, and customer activity type.

All user-managed CRM records use UUIDs, `createdAt`, `updatedAt`, and `deletedAt` where
soft deletion is required. Indexes include organisation-scoped lookup, status, dates,
search-oriented fields, and relationship columns.

## Tenant Isolation

CRM controllers require:

- JWT authentication
- active organisation guard
- permission guard

CRM repositories require `organisationId` on every public data-access method. Queries
include `organisationId` and exclude soft-deleted records by default.

Services validate related records before writes. For example, contacts, leads,
opportunities, notes, files, and tags cannot be attached to companies outside the active
organisation.

## Repository Pattern

Controllers only receive requests, validate DTOs, and call services.

Services own business logic, audit logging, activity creation, and relationship checks.

Repositories own Prisma access and tenant filtering.

## Permissions

Default identity permissions now include:

- `crm:read`
- `crm:write`
- `crm:delete`

New organisations receive these permissions through the default owner role. Existing
organisations may need a one-time permission backfill before CRM endpoints are visible to
their current roles.

## API Endpoints

Companies:

- `GET /api/v1/companies`
- `GET /api/v1/companies/:id`
- `POST /api/v1/companies`
- `PATCH /api/v1/companies/:id`
- `DELETE /api/v1/companies/:id`
- `POST /api/v1/companies/bulk-delete`

Contacts:

- `GET /api/v1/contacts`
- `GET /api/v1/contacts/:id`
- `POST /api/v1/contacts`
- `PATCH /api/v1/contacts/:id`
- `DELETE /api/v1/contacts/:id`

Leads:

- `GET /api/v1/leads`
- `GET /api/v1/leads/:id`
- `POST /api/v1/leads`
- `PATCH /api/v1/leads/:id`
- `DELETE /api/v1/leads/:id`

Opportunities:

- `GET /api/v1/opportunities`
- `GET /api/v1/opportunities/:id`
- `POST /api/v1/opportunities`
- `PATCH /api/v1/opportunities/:id`
- `DELETE /api/v1/opportunities/:id`

Notes:

- `GET /api/v1/customer-notes`
- `POST /api/v1/customer-notes`
- `DELETE /api/v1/customer-notes/:id`

Files:

- `GET /api/v1/customer-files`
- `POST /api/v1/customer-files`
- `DELETE /api/v1/customer-files/:id`

Tags:

- `GET /api/v1/customer-tags`
- `POST /api/v1/customer-tags`
- `DELETE /api/v1/customer-tags/:id`
- `POST /api/v1/customer-tags/assign`
- `POST /api/v1/customer-tags/unassign`

Search:

- `GET /api/v1/crm/search?q=...`

AI architecture:

- `GET /api/v1/crm/ai/capabilities`
- `GET /api/v1/crm/ai/prompt-templates`

## Search

CRM search currently uses indexed relational queries across companies, contacts, leads,
opportunities, and tags. The service response exposes readiness flags for future
PostgreSQL full-text search and vector search.

## Files

Milestone 4 stores file metadata only:

- original filename
- storage key
- MIME type
- file size
- uploader
- customer relationship

Binary upload and Cloudflare R2 transfer are reserved for a later milestone. MIME types
are validated before metadata records are created.

## Activity Timeline

Services create `CustomerActivity` records for important CRM events such as company
creation, contact addition, lead changes, opportunity status changes, notes, files, and
tag changes.

## Part 2 Boundary

Part 2 adds the CRM user experience inside the existing workspace shell without changing
the backend boundaries.

Frontend routes now include:

- `/app/crm`
- `/app/crm/companies`
- `/app/crm/companies/new`
- `/app/crm/companies/:id`
- `/app/crm/companies/:id/edit`
- `/app/crm/contacts`
- `/app/crm/contacts/new`
- `/app/crm/contacts/:id`
- `/app/crm/contacts/:id/edit`
- `/app/crm/leads`
- `/app/crm/pipeline`
- `/app/crm/opportunities`
- `/app/crm/search`

The frontend uses the shared workspace shell, TanStack Query for CRM data, React Hook Form
and Zod for create/edit forms, route-level lazy loading, and reusable CRM states for
loading, empty, and friendly errors.

The pipeline uses native browser drag and drop for local quick-edit movement. Persisted
stage updates can be connected when the backend exposes a dedicated stage transition
endpoint.

## Premium CRM Experience

The CRM UI now applies the mikyasOS premium interaction language:

- Page transitions fade, slide, and scale subtly.
- KPI cards animate into place and numeric values count upward.
- CRM cards lift with soft elevation and depth on hover.
- Tables use animated row highlighting.
- Forms use animated focus rings and validation feedback.

## AI-Ready CRM Architecture

This milestone prepares CRM records for future AI features without implementing an
assistant or executing prompts.

Backend services:

- `CustomerInsightService` exposes the capability registry for future summaries, trends,
  relationship health, risk detection, next best action, and sales coaching.
- `CustomerSummaryService` defines executive, company, contact, lead, and opportunity
  summary plans.
- `CrmEmbeddingService` defines the future embedding and retrieval plan for semantic
  search, RAG context, customer memory, and recommendations.

The CRM AI layer depends on the existing OpenRouter abstraction through `AiModule`. It
does not call Gemini directly, does not execute prompts, and does not generate content.

Prompt templates live in `apps/api/src/crm/ai/customer-prompt-templates.ts` and are
reusable typed templates for:

- customer summary
- lead analysis
- opportunity review
- relationship risk
- follow-up suggestions
- sales recommendations

Frontend placeholders live in `apps/web/src/features/crm/components/ai-placeholder.tsx`.
They communicate upcoming AI capabilities on CRM dashboard, company, contact, lead,
opportunity, and pipeline surfaces while preserving the existing mikyasOS design language.

## Performance And Scale Notes

CRM pages use server-side pagination through shared list DTOs, TanStack Query caching,
route-level code splitting, lazy route loading, and indexed organisation-scoped database
queries. Search is relational today but marked full-text and vector-ready in the response
contract. Future large tables should add virtualisation before expanding row counts beyond
the current paginated views.

The architecture keeps AI work out of request paths. Future generation, embeddings, file
processing, analytics, and memory indexing should run through background queues so page
loads and search remain fast under horizontal scale.

## Security And Accessibility Notes

CRM AI capability endpoints are protected by JWT authentication, active organisation
membership checks, and `crm:read` permissions. Prompt templates are static architecture
metadata and do not expose customer records, secrets, model keys, refresh tokens, or
password data.

Every AI placeholder is semantic, keyboard-safe, labelled for assistive technology, and
uses the shared reduced-motion-safe premium animation utilities.

- Skeleton loading uses shimmer transitions.
- AI placeholders use a restrained breathing pulse.
- Command palette, notifications, sidebar, and top navigation use glass surfaces and spring
  motion.

All motion respects `prefers-reduced-motion` and remains GPU-friendly through transform
and opacity transitions.
