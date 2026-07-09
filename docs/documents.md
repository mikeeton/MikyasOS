# Documents & Knowledge Hub

Milestone 6 adds the backend foundation for the mikyasOS Documents & Knowledge Hub. The scope is intentionally backend-first: database models, tenant-safe APIs, storage abstractions, permissions, activity history, versioning, search filters, and background-job architecture.

Frontend UI, OCR, public sharing, vector search, AI summaries, and RAG are prepared for but not implemented in this part.

## Architecture

The feature is built around four core concepts:

- `Document`: the organisation-owned business file record and current metadata.
- `Folder`: nested organisation-owned containers for navigation and breadcrumbs.
- `DocumentVersion`: immutable file version metadata with incrementing version numbers.
- `DocumentPermission`: user, role, folder, and future team-level access grants.

Supporting models include `DocumentActivity`, `DocumentTag`, `DocumentTagAssignment`, `DocumentLink`, and `DocumentShare`.

Every query is scoped by `organisationId`. Soft deletion is used for documents, folders, and tags.

## Storage

Controllers do not call storage providers directly. The document services use:

- `FileValidationService` for MIME, extension, and size checks.
- `FileMetadataService` for safe names, storage keys, and document type inference.
- `DocumentStorageService` as the document-specific wrapper around the existing `StorageService`.

Cloudflare R2 remains behind the existing storage abstraction. Signed upload/download architecture exists, but public sharing and real external delivery are not enabled yet.

## Permissions

Default RBAC permissions added:

- `Document.Create`
- `Document.Read`
- `Document.Update`
- `Document.Delete`
- `Document.Download`
- `Document.UploadVersion`
- `Document.ManagePermissions`
- `Document.Share`
- `Folder.Create`
- `Folder.Update`
- `Folder.Delete`
- `Folder.ManagePermissions`
- `DocumentTag.Manage`

Existing system roles are backfilled by the permissions service when needed.

## API Endpoints

- `GET /api/v1/documents`
- `POST /api/v1/documents`
- `GET /api/v1/documents/:id`
- `PATCH /api/v1/documents/:id`
- `DELETE /api/v1/documents/:id`
- `POST /api/v1/documents/:id/restore`
- `POST /api/v1/documents/:id/download`
- `GET /api/v1/documents/:id/versions`
- `POST /api/v1/documents/:id/versions`
- `POST /api/v1/documents/:id/restore-version/:versionId`
- `GET /api/v1/documents/:id/activity`
- `POST /api/v1/documents/:id/links`
- `DELETE /api/v1/documents/:id/links/:linkId`
- `POST /api/v1/documents/:id/tags`
- `DELETE /api/v1/documents/:id/tags/:tagId`
- `GET /api/v1/folders`
- `POST /api/v1/folders`
- `PATCH /api/v1/folders/:id`
- `DELETE /api/v1/folders/:id`
- `GET /api/v1/document-tags`
- `POST /api/v1/document-tags`
- `DELETE /api/v1/document-tags/:id`
- `GET /api/v1/documents-search`

## Search And Filtering

Document list/search supports title, file name, description, tags, owner, folder, MIME type, linked entity, created/updated dates, visibility, status, type, and sorting by title, created date, updated date, file size, and MIME type.

## Background Jobs

The `document-processing` BullMQ queue prepares jobs for indexing, text extraction, thumbnail generation, virus scanning, AI summaries, and embeddings. Only enqueue architecture is included in this milestone.

## AI Knowledge Architecture

AI features are architecture-only in this milestone. The backend exposes readiness and capability metadata without generating summaries, embeddings, OCR, vector search, or assistant responses.

- `KnowledgeIndexService` prepares indexing status and queue handoff.
- `DocumentSummaryService` prepares executive, policy, contract, proposal, meeting, and technical summary architecture.
- `DocumentEmbeddingService` prepares paragraph, heading-aware, table, code-block, and page chunking plus future `pgvector` retrieval.
- `KnowledgeGraphService` prepares future relationships across documents, folders, CRM, projects, tasks, employees, meetings, invoices, policies, and AI memory.
- `DocumentOcrService` prepares image, PDF, scanned document, and future handwriting OCR interfaces.

AI never accesses storage directly. Future execution must go through the existing OpenRouter abstraction.

AI architecture endpoints:

- `GET /api/v1/documents/ai/capabilities`
- `GET /api/v1/documents/ai/prompt-templates`
- `GET /api/v1/documents/:id/ai/readiness`
